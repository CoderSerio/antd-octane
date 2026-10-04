/** @jsxImportSource octane */
// Flattened rendering follows rc-tree 5.13.1 NodeList. Native windowing replaces
// rc-virtual-list; React is deliberately not imported by the published runtime.
import type { OctaneNode, Ref, RefObject } from "octane";
import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { MotionTreeNode } from "./MotionTreeNode";
import type { Key, TreeDataNode, TreeMotion, TreeScrollTarget } from "./types";
import type { Entry } from "./utils";

interface Transition<T extends TreeDataNode> {
  key: Key;
  entries: Entry<T>[];
  keys: Key[];
  index: number;
  visible: boolean;
  height?: number;
}
export interface NodeListRef {
  scrollTo: (target: TreeScrollTarget) => void;
}

function VirtualItem({
  children,
  top,
  minHeight,
  onHeight,
}: {
  children: OctaneNode;
  top: number;
  minHeight: number;
  onHeight: (height: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const callback = useRef(onHeight);
  callback.current = onHeight;
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => callback.current(node.getBoundingClientRect().height);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="ant-tree-list-item"
      style={{
        position: "absolute",
        display: "flow-root",
        insetInline: 0,
        top,
        minHeight,
      }}
    >
      {children}
    </div>
  );
}

export function NodeList<T extends TreeDataNode>({
  data,
  expandedKeys,
  height,
  itemHeight,
  virtual,
  scrollWidth,
  scrollRef,
  motion,
  renderItem,
  ref,
}: {
  data: Entry<T>[];
  expandedKeys: Key[];
  height?: number;
  itemHeight: number;
  virtual: boolean;
  scrollWidth?: number;
  scrollRef: RefObject<HTMLDivElement | null>;
  motion: TreeMotion | null;
  renderItem: (entry: Entry<T>) => OctaneNode;
  ref?: Ref<NodeListRef>;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const previous = useRef({ data, expandedKeys });
  const [transition, setTransition] = useState<Transition<T> | null>(null);
  const measured = useRef(new Map<Key, number>());
  const [, updateHeights] = useState(0);
  const pendingScroll = useRef<TreeScrollTarget | null>(null);
  const dataKeys = data
    .map((entry) => `${typeof entry.key}:${entry.key}`)
    .join("\0");
  const expandedKeyString = expandedKeys
    .map((key) => `${typeof key}:${key}`)
    .join("\0");
  useLayoutEffect(() => {
    const prev = previous.current;
    previous.current = { data, expandedKeys };
    const added = expandedKeys.filter(
      (key) => !prev.expandedKeys.includes(key),
    );
    const removed = prev.expandedKeys.filter(
      (key) => !expandedKeys.includes(key),
    );
    if (!motion || added.length + removed.length !== 1) {
      setTransition(null);
      return;
    }
    const visible = added.length === 1;
    const key = (visible ? added : removed)[0];
    const source = visible ? data : prev.data;
    const parentIndex = source.findIndex((entry) => entry.key === key);
    const parent = source[parentIndex];
    if (!parent) return;
    const range: Entry<T>[] = [];
    for (const entry of source.slice(parentIndex + 1)) {
      if (entry.depth <= parent.depth) break;
      range.push(entry);
    }
    // rc-tree animates only the viewport-sized range when virtual rendering is enabled.
    const entries =
      virtual && height
        ? range.slice(0, Math.ceil(height / itemHeight) + 1)
        : range;
    if (entries.length)
      setTransition({
        key,
        entries,
        keys: range.map((entry) => entry.key),
        index: data.findIndex((entry) => entry.key === key) + 1,
        visible,
      });
  }, [dataKeys, expandedKeyString]);
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const update = () => setScrollTop(element.scrollTop);
    const cancelPending = () => {
      pendingScroll.current = null;
    };
    element.addEventListener("scroll", update, { passive: true });
    element.addEventListener("wheel", cancelPending, { passive: true });
    element.addEventListener("pointerdown", cancelPending, { passive: true });
    setScrollTop(element.scrollTop);
    return () => {
      element.removeEventListener("scroll", update);
      element.removeEventListener("wheel", cancelPending);
      element.removeEventListener("pointerdown", cancelPending);
    };
  }, [scrollRef]);

  const scrollTo = (target: TreeScrollTarget) => {
    const root = scrollRef.current;
    if (!root || height === undefined) return;
    const index =
      target.key !== undefined
        ? data.findIndex((entry) => entry.key === target.key)
        : (target.index ?? -1);
    if (index < 0 || index >= data.length) return;
    let top = 0;
    for (const entry of data.slice(0, index))
      top += measured.current.get(entry.key) ?? itemHeight;
    const bottom = top + (measured.current.get(data[index].key) ?? itemHeight);
    const viewport = root.clientHeight || height;
    const offset = target.offset ?? 0;
    let next = root.scrollTop;
    if (target.align === "top") next = top - offset;
    else if (target.align === "bottom") next = bottom - viewport + offset;
    else if (top < next) next = top - offset;
    else if (bottom > next + viewport) next = bottom - viewport + offset;
    root.scrollTo({
      top: Math.max(0, next),
      left: target.left,
      behavior: "auto",
    });
    setScrollTop(Math.max(0, next));
    pendingScroll.current = target;
  };
  useImperativeHandle(ref, () => ({ scrollTo }), [
    dataKeys,
    height,
    itemHeight,
  ]);
  const setHeight = (key: Key, value: number) => {
    // Like rc-virtual-list's offsetParent guard, hidden rows must not replace
    // the height estimate with a zero-size measurement.
    if (value <= 0) return;
    if (Math.abs((measured.current.get(key) ?? itemHeight) - value) < 0.5)
      return;
    measured.current.set(key, value);
    updateHeights((current) => current + 1);
    if (pendingScroll.current) scrollTo(pendingScroll.current);
  };

  const motionKeys = new Set(transition?.keys);
  const rows: Array<{
    key: Key;
    entry?: Entry<T>;
    motion?: Transition<T>;
    top: number;
    height: number;
  }> = [];
  let totalHeight = 0;
  const addMotion = () => {
    if (!transition) return;
    const motionHeight =
      transition.height ??
      transition.entries.reduce(
        (total, entry) =>
          total + (measured.current.get(entry.key) ?? itemHeight),
        0,
      );
    rows.push({
      key: `motion-${String(transition.key)}`,
      motion: transition,
      top: totalHeight,
      height: motionHeight,
    });
    totalHeight += motionHeight;
  };
  for (let index = 0; index < data.length; index++) {
    if (transition && index === transition.index) addMotion();
    const entry = data[index];
    if (transition?.visible && motionKeys.has(entry.key)) continue;
    const rowHeight = measured.current.get(entry.key) ?? itemHeight;
    rows.push({ key: entry.key, entry, top: totalHeight, height: rowHeight });
    totalHeight += rowHeight;
  }
  if (transition?.index === data.length) addMotion();
  const useVirtual = virtual && height !== undefined && totalHeight > height;
  // rc-virtual-list starts at the first intersecting item and keeps one extra
  // item after the viewport for motion, using measured heights when available.
  let start = 0;
  let end = rows.length - 1;
  if (useVirtual) {
    start = rows.findIndex((row) => row.top + row.height >= scrollTop);
    end = rows.findIndex(
      (row) => row.top + row.height > scrollTop + (height ?? 0),
    );
    if (start < 0) {
      start = 0;
      end = Math.ceil((height ?? 0) / itemHeight);
    }
    if (end < 0) end = rows.length - 1;
    end = Math.min(end + 1, rows.length - 1);
  }
  const visibleRows = useVirtual ? rows.slice(start, end + 1) : rows;
  const motionInView = visibleRows.some((row) => row.motion);
  useEffect(() => {
    if (transition && !motionInView) setTransition(null);
  }, [transition, motionInView]);
  return (
    <div
      className={`ant-tree-list${useVirtual ? " ant-tree-list-virtual" : ""}`}
      style={{
        position: "relative",
        height: useVirtual ? totalHeight : undefined,
        minWidth: scrollWidth,
      }}
    >
      {visibleRows.map((row) => {
        const content = row.motion ? (
          <MotionTreeNode
            key={row.key}
            visible={row.motion.visible}
            motion={motion as TreeMotion}
            onEnd={() => setTransition(null)}
          >
            {row.motion.entries.map(renderItem)}
          </MotionTreeNode>
        ) : (
          renderItem(row.entry as Entry<T>)
        );
        return useVirtual ? (
          <VirtualItem
            key={row.key}
            top={row.top}
            minHeight={row.motion ? 0 : itemHeight}
            onHeight={(value) => {
              if (row.entry) setHeight(row.entry.key, value);
              else
                setTransition((current) =>
                  current &&
                  Math.abs((current.height ?? row.height) - value) >= 0.5
                    ? { ...current, height: value }
                    : current,
                );
            }}
          >
            {content}
          </VirtualItem>
        ) : (
          content
        );
      })}
    </div>
  );
}
