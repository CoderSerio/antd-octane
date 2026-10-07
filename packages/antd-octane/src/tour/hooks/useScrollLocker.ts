import { useLayoutEffect } from "octane";

export default function useScrollLocker(open: boolean) {
  useLayoutEffect(() => {
    if (!open) return;
    // rc-tour's mask and placeholder portals both lock the body, even mask=false.
    // A per-instance style avoids overwriting an unrelated dialog's inline lock.
    const style = document.createElement("style");
    const scrollbar = Math.max(
      0,
      window.innerWidth - document.documentElement.clientWidth,
    );
    const overflowing =
      document.documentElement.clientWidth > 0 &&
      document.body.scrollHeight > window.innerHeight;
    style.textContent = `html body { overflow-y: hidden; ${
      overflowing ? `width: calc(100% - ${scrollbar}px);` : ""
    } }`;
    document.head.append(style);
    return () => style.remove();
  }, [open]);
}
