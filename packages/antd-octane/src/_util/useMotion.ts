// Native lifecycle counterpart of rc-motion CSSMotion (MIT).
import type { RefObject } from "octane";
import { useLayoutEffect, useRef, useState } from "octane";

export type MotionPhase = "appear" | "enter" | "leave" | "idle";

function milliseconds(value: string) {
  return value.split(",").map((part) => {
    const duration = parseFloat(part) || 0;
    return part.trim().endsWith("ms") ? duration : duration * 1000;
  });
}

function duration(
  style: CSSStyleDeclaration,
  kind: "animation" | "transition",
) {
  const durations = milliseconds(style[`${kind}Duration`]);
  const delays = milliseconds(style[`${kind}Delay`]);
  return Math.max(
    ...durations.map((time, index) => time + delays[index % delays.length]),
    0,
  );
}

export function useMotion(
  visible: boolean,
  node: RefObject<HTMLElement | null>,
  {
    enabled = true,
    appear = true,
    ready = true,
    deadline,
    onLeaveEnd,
    onVisibleChanged,
  }: {
    enabled?: boolean;
    appear?: boolean;
    ready?: boolean;
    deadline?: number;
    onLeaveEnd?: () => void;
    onVisibleChanged?: (visible: boolean) => void;
  } = {},
) {
  const [phase, setPhase] = useState<MotionPhase>(
    visible && appear ? "appear" : "idle",
  );
  const [active, setActive] = useState(false);
  const previous = useRef(visible);
  const notify = useRef<boolean | undefined>(undefined);
  const callback = useRef(onVisibleChanged);
  callback.current = onVisibleChanged;
  const leaveEnd = useRef(onLeaveEnd);
  leaveEnd.current = onLeaveEnd;

  useLayoutEffect(() => {
    if (previous.current === visible) return;
    previous.current = visible;
    notify.current = undefined;
    setActive(false);
    setPhase(visible ? "enter" : "leave");
  }, [visible]);

  useLayoutEffect(() => {
    const element = node.current;
    if (!ready || !element || phase === "idle") return;
    let finished = false;
    let frame: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (finished) return;
      finished = true;
      // CSSMotion calls onLeaveEnd while the leaving element is still mounted.
      if (phase === "leave" && enabled) leaveEnd.current?.();
      notify.current = phase !== "leave";
      setPhase("idle");
      setActive(false);
    };
    const style = getComputedStyle(element);
    const motionDuration = Math.max(
      duration(style, "animation"),
      duration(style, "transition"),
    );
    if (!enabled || motionDuration === 0) {
      finish();
      return;
    }
    const end = (event: Event) => {
      if (event.target === element) finish();
    };
    element.addEventListener("animationend", end);
    element.addEventListener("transitionend", end);
    if (!active) {
      // Preserve the start style for one frame before applying the target style.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setActive(true));
      });
    } else {
      timer = setTimeout(finish, deadline ?? motionDuration + 50);
    }
    return () => {
      finished = true;
      if (frame !== undefined) cancelAnimationFrame(frame);
      if (timer !== undefined) clearTimeout(timer);
      element.removeEventListener("animationend", end);
      element.removeEventListener("transitionend", end);
    };
  }, [phase, active, enabled, ready, deadline, node]);

  useLayoutEffect(() => {
    if (phase !== "idle" || notify.current === undefined) return;
    const next = notify.current;
    notify.current = undefined;
    callback.current?.(next);
  }, [phase]);

  return {
    phase,
    active,
    present: visible || phase !== "idle" || previous.current,
    className(name: string) {
      return name && phase !== "idle"
        ? `${name}-${phase} ${name}-${phase}-${active ? "active" : "start"}`
        : undefined;
    },
  };
}
