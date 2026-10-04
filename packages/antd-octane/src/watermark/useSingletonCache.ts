// Ant Design 5.29.3 useSingletonCache and rc-util 5.44.4 isEqual (MIT).
import { useCallback, useRef } from "octane";

function equalKeys(first: unknown, second: unknown) {
  const visited = new Set<unknown>();
  const compare = (a: unknown, b: unknown): boolean => {
    if (visited.has(a)) return false;
    if (a === b) return true;
    visited.add(a);
    if (Array.isArray(a))
      return (
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((item, i) => compare(item, b[i]))
      );
    if (a && b && typeof a === "object" && typeof b === "object") {
      const keys = Object.keys(a);
      return (
        keys.length === Object.keys(b).length &&
        keys.every((key) =>
          compare(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key],
          ),
        )
      );
    }
    return false;
  };
  return compare(first, second);
}

/** Cache only the latest clip parameters, including structurally equal arrays. */
export default function useSingletonCache<T extends unknown[], R>() {
  const cache = useRef<[unknown[] | null, R | null]>([null, null]);
  return useCallback((keys: T, callback: () => R): R => {
    const filtered = keys.map((item) =>
      item instanceof HTMLElement || Number.isNaN(item) ? "" : item,
    );
    if (!equalKeys(cache.current[0], filtered))
      cache.current = [filtered, callback()];
    return cache.current[1] as R;
  }, []);
}
