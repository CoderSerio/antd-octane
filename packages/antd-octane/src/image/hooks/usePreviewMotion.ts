import { useLayoutEffect, useRef, useState } from "octane";

export type PreviewMotionPhase = "prepare" | "enter" | "leave" | null;

function durationMilliseconds(value: string) {
  return value.split(",").reduce((longest, item) => {
    const duration = parseFloat(item) * (item.trim().endsWith("ms") ? 1 : 1000);
    return Number.isFinite(duration) ? Math.max(longest, duration) : longest;
  }, 0);
}

/** Retain the dialog until its closing motion ends, then restore the image transform. */
export default function usePreviewMotion(
  visible: boolean,
  duration: string,
  onAfterChange: (open: boolean) => void,
  onPrepare?: () => void,
) {
  const [displayOpen, setDisplayOpen] = useState(visible);
  const [phase, setPhase] = useState<PreviewMotionPhase>(
    visible ? "prepare" : null,
  );
  const callback = useRef(onAfterChange);
  const prepare = useRef(onPrepare);
  const finishMotion = useRef<(() => void) | null>(null);
  const lastVisible = useRef<boolean | null>(null);
  callback.current = onAfterChange;
  prepare.current = onPrepare;
  useLayoutEffect(() => {
    const initialClosed = lastVisible.current === null && !visible;
    const unchangedAndFinished =
      lastVisible.current === visible && !finishMotion.current;
    lastVisible.current = visible;
    if (initialClosed || unchangedAndFinished) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame: number | undefined;
    let cancelled = false;
    const finish = () => {
      if (cancelled || finishMotion.current !== finish) return;
      finishMotion.current = null;
      if (timer !== undefined) clearTimeout(timer);
      setPhase(null);
      setDisplayOpen(visible);
      callback.current(visible);
    };
    finishMotion.current = finish;
    const begin = () => {
      if (cancelled) return;
      if (visible) prepare.current?.();
      setPhase(visible ? "enter" : "leave");
      const milliseconds = durationMilliseconds(duration);
      if (!milliseconds) {
        finish();
        return;
      }
      // Native animation/transition events normally finish first. The deadline covers
      // hidden tabs, reduced CSS, and DOM runtimes which do not dispatch motion events.
      timer = setTimeout(finish, milliseconds + 32);
    };
    if (visible) {
      setDisplayOpen(true);
      setPhase("prepare");
      // Measure the unscaled panel after portal mounting, before adding motion classes.
      frame = requestAnimationFrame(begin);
    } else begin();
    return () => {
      cancelled = true;
      if (timer !== undefined) clearTimeout(timer);
      if (frame !== undefined) cancelAnimationFrame(frame);
      // Leave the active marker for a duration change; a subsequent run replaces it.
    };
  }, [visible, duration]);
  const onMotionEnd = (event: AnimationEvent | TransitionEvent) => {
    if (event.target !== event.currentTarget || phase === "prepare") return;
    if (
      event instanceof AnimationEvent &&
      event.animationName.startsWith("ao-image-preview-") &&
      !event.animationName.endsWith(`-${phase}`)
    )
      return;
    finishMotion.current?.();
  };
  return { displayOpen, phase, onMotionEnd };
}
