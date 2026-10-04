// Native adaptation of Ant Design 5.29.3 (MIT).
import { useCallback, useEffect, useRef } from "octane";

/** Run immediately, at most once per frame, with the latest callback. */
export default function useRafDebounce(callback: VoidFunction) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const frameRef = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );
  return useCallback(() => {
    if (frameRef.current !== null) return;
    callbackRef.current();
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
    });
  }, []);
}
