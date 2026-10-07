import { useLayoutEffect, useState } from "octane";
import type { TargetRect, TourProps, TourStepProps } from "../interface";

export default function useTarget(
  target: TourStepProps["target"],
  open: boolean,
  gap: TourProps["gap"],
  scrollIntoViewOptions: boolean | ScrollIntoViewOptions,
) {
  // Undefined means the function target has not been resolved; null means center.
  const [targetElement, setTargetElement] = useState<HTMLElement | null>();
  const [position, setPosition] = useState<TargetRect | null>(null);
  const offsetX = Array.isArray(gap?.offset)
    ? gap.offset[0]
    : (gap?.offset ?? 6);
  const offsetY = Array.isArray(gap?.offset)
    ? gap.offset[1]
    : (gap?.offset ?? 6);
  const radius =
    typeof gap?.radius === "number" && !Number.isNaN(gap.radius)
      ? gap.radius
      : 2;

  useLayoutEffect(() => {
    const element = typeof target === "function" ? target() : target;
    setTargetElement(element?.isConnected ? element : null);
  });

  useLayoutEffect(() => {
    if (!open) return;
    let frame = 0;
    const read = () => {
      if (!targetElement?.isConnected) {
        setPosition(null);
        return;
      }
      const raw = targetElement.getBoundingClientRect();
      const next = {
        left: raw.left - offsetX,
        top: raw.top - offsetY,
        width: raw.width + offsetX * 2,
        height: raw.height + offsetY * 2,
        radius,
      };
      setPosition((previous) =>
        previous &&
        Object.keys(next).every(
          (key) =>
            previous[key as keyof TargetRect] === next[key as keyof TargetRect],
        )
          ? previous
          : next,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      if (
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom > window.innerHeight ||
        rect.right > window.innerWidth
      )
        // rc-tour forwards boolean false to the DOM API; it does not skip it.
        targetElement.scrollIntoView(scrollIntoViewOptions);
    }
    read();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(schedule);
    if (targetElement) observer?.observe(targetElement);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      observer?.disconnect();
    };
  }, [open, targetElement, offsetX, offsetY, radius, scrollIntoViewOptions]);

  return { targetElement, targetRect: position };
}
