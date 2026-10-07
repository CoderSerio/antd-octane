// Native adaptation of Ant Design 5.29.3 checkbox/useBubbleLock.ts (MIT).
import type { InputHTMLAttributes } from "octane";
import { useEffect, useRef } from "octane";

type ClickHandler = InputHTMLAttributes<HTMLInputElement>["onClick"];
type InputClick = Parameters<NonNullable<ClickHandler>>[0];

/** Let a label click bubble once, without also bubbling its forwarded input click. */
export default function useBubbleLock(onOriginInputClick?: ClickHandler) {
  const lock = useRef<number | null>(null);
  const clearLock = () => {
    if (lock.current !== null) cancelAnimationFrame(lock.current);
    lock.current = null;
  };
  useEffect(() => clearLock, []);
  const onLabelClick = () => {
    clearLock();
    lock.current = requestAnimationFrame(() => {
      lock.current = null;
    });
  };
  const onInputClick = (event: InputClick) => {
    if (lock.current !== null) {
      event.stopPropagation();
      clearLock();
    }
    onOriginInputClick?.(event);
  };
  return [onLabelClick, onInputClick] as const;
}
