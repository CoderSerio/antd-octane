import { createContext, useCallback, useContext, useRef } from "octane";
export const WatermarkContext = createContext<{
  add: (element: HTMLElement) => void;
  remove: (element: HTMLElement) => void;
}>({ add() {}, remove() {} });
export function usePanelRef(selector?: string) {
  const watermark = useContext(WatermarkContext);
  const current = useRef<HTMLElement | null>(null);
  return useCallback(
    (element: HTMLElement | null) => {
      const target = selector
        ? (element?.querySelector<HTMLElement>(selector) ?? null)
        : element;
      if (current.current === target) return;
      if (current.current) watermark.remove(current.current);
      current.current = target;
      if (target) watermark.add(target);
    },
    [watermark, selector],
  );
}
