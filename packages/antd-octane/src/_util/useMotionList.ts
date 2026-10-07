// Adapted from rc-motion 2.9.5 util/diff + CSSMotionList (MIT).
import { useLayoutEffect, useState } from "octane";

interface MotionItem<T> {
  key: string;
  item: T;
  visible: boolean;
}

function mergeItems<T>(
  previous: MotionItem<T>[],
  items: T[],
  getKey: (item: T) => string | number,
): MotionItem<T>[] {
  const current = items.map((item) => ({
    key: String(getKey(item)),
    item,
    visible: true,
  }));
  const result: MotionItem<T>[] = [];
  let index = 0;
  for (const entry of previous) {
    const nextIndex = current.findIndex(
      (next, candidate) => candidate >= index && next.key === entry.key,
    );
    if (nextIndex === -1) {
      result.push({ ...entry, visible: false });
    } else {
      result.push(...current.slice(index, nextIndex + 1));
      index = nextIndex + 1;
    }
  }
  result.push(...current.slice(index));
  // Moving or reopening a key must reuse its current instance.
  const active = new Set(current.map((entry) => entry.key));
  return result.filter((entry) => entry.visible || !active.has(entry.key));
}

export default function useMotionList<T>(
  items: T[],
  getKey: (item: T) => string | number,
) {
  const [entries, setEntries] = useState<MotionItem<T>[]>([]);
  const merged = mergeItems(entries, items, getKey);
  useLayoutEffect(() => {
    setEntries((previous) => {
      const next = mergeItems(previous, items, getKey);
      return next.length === previous.length &&
        next.every(
          (entry, index) =>
            entry.key === previous[index].key &&
            entry.item === previous[index].item &&
            entry.visible === previous[index].visible,
        )
        ? previous
        : next;
    });
  }, [items, getKey]);
  const remove = (key: string | number) => {
    setEntries((previous) =>
      previous.filter((entry) => entry.key !== String(key) || entry.visible),
    );
  };
  return [merged, remove] as const;
}
