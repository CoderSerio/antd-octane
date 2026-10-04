import { useEffect, useMemo, useRef, useState } from "octane";
import type { TableKey } from "./types";

export interface VirtualRowKey {
  key: TableKey;
}

/**
 * Native row measurement and range calculation for Table virtualization.
 * The visible-range and cached-height behavior follows rc-virtual-list 3.19.2
 * (MIT); row nodes remain ordinary Octane table rows.
 */
export function useVirtualRows<T extends VirtualRowKey>(
  rows: T[],
  estimatedRowHeight: number,
) {
  const rowElements = useRef(new Map<TableKey, HTMLTableRowElement>());
  const rowObservers = useRef(new Map<TableKey, ResizeObserver>());
  const rowHeights = useRef(new Map<TableKey, number>());
  const rowRefCallbacks = useRef(
    new Map<TableKey, (node: HTMLTableRowElement | null) => void>(),
  );
  const [revision, setRevision] = useState(0);

  const metrics = useMemo(() => {
    const offsets = [0];
    for (const row of rows) {
      const height = rowHeights.current.get(row.key) ?? estimatedRowHeight;
      offsets.push(offsets[offsets.length - 1] + height);
    }
    return offsets;
  }, [estimatedRowHeight, revision, rows]);

  const getRowRef = (key: TableKey) => {
    const cached = rowRefCallbacks.current.get(key);
    if (cached) return cached;

    const callback = (node: HTMLTableRowElement | null) => {
      const previous = rowElements.current.get(key);
      if (previous === node) return;
      rowObservers.current.get(key)?.disconnect();
      rowObservers.current.delete(key);

      if (!node) {
        rowElements.current.delete(key);
        return;
      }

      rowElements.current.set(key, node);
      const measure = () => {
        const style = getComputedStyle(node);
        const marginTop = Number.parseFloat(style.marginTop) || 0;
        const marginBottom = Number.parseFloat(style.marginBottom) || 0;
        const height = node.offsetHeight + marginTop + marginBottom;
        if (height <= 0) return;
        const previousHeight = rowHeights.current.get(key);
        if (
          previousHeight !== undefined &&
          Math.abs(previousHeight - height) < 0.25
        )
          return;
        rowHeights.current.set(key, height);
        setRevision((current) => current + 1);
      };

      measure();
      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        rowObservers.current.set(key, observer);
      }
    };

    rowRefCallbacks.current.set(key, callback);
    return callback;
  };

  useEffect(
    () => () => {
      rowObservers.current.forEach((observer) => {
        observer.disconnect();
      });
      rowObservers.current.clear();
      rowElements.current.clear();
      rowRefCallbacks.current.clear();
      rowHeights.current.clear();
    },
    [],
  );

  const offsetAt = (index: number) =>
    metrics[Math.max(0, Math.min(rows.length, index))] ?? 0;

  const rowHeightAt = (index: number) =>
    Math.max(0, offsetAt(index + 1) - offsetAt(index));

  const getRange = (scrollTop: number, viewportHeight: number) => {
    if (!rows.length) return { start: 0, end: 0 };

    const scrollBottom = scrollTop + viewportHeight;
    let start = rows.findIndex((_, index) => offsetAt(index + 1) >= scrollTop);
    if (start < 0) start = 0;

    let end = rows.findIndex((_, index) => offsetAt(index + 1) > scrollBottom);
    if (end < 0) end = rows.length - 1;
    // rc-virtual-list retains one extra row beyond the visible range for motion.
    return { start, end: Math.min(rows.length, end + 2) };
  };

  return {
    getRowRef,
    offsetAt,
    rowHeightAt,
    getRange,
    totalHeight: offsetAt(rows.length),
  };
}
