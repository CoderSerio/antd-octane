// Native adaptation of rc-dropdown 4.2.1 hooks/useAccessibility (MIT).
import type { RefObject } from "octane";
import { useEffect, useRef } from "octane";

export default function useFilterDropdownAccessibility(
  open: boolean,
  autoFocus: boolean,
  trigger: RefObject<HTMLElement | null>,
  overlay: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const close = useRef(onClose);
  close.current = onClose;
  const focused = useRef(false);
  useEffect(() => {
    if (!open) return;
    const focusMenu = () => {
      if (!overlay.current) return false;
      overlay.current.focus();
      focused.current = true;
      return true;
    };
    const closeAndRestore = () => {
      trigger.current?.focus();
      close.current();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndRestore();
      else if (event.key === "Tab") {
        if (!focused.current && focusMenu()) event.preventDefault();
        else closeAndRestore();
      }
    };
    let frame: number | undefined;
    if (autoFocus) {
      const focusAfterMount = (remaining: number) => {
        frame = requestAnimationFrame(() => {
          if (remaining > 1) focusAfterMount(remaining - 1);
          else focusMenu();
        });
      };
      focusAfterMount(3);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (frame !== undefined) cancelAnimationFrame(frame);
      focused.current = false;
    };
  }, [open, autoFocus, trigger, overlay]);
}
