/** @jsxImportSource octane */
// Native adaptation of rc-tree's MotionTreeNode and antd 5.29.3 _util/motion.
// Upstream MIT license and provenance are retained in THIRD_PARTY_NOTICES.md.
import type { CSSProperties, OctaneNode } from "octane";
import { useLayoutEffect, useRef, useState } from "octane";
import type { TreeMotion, TreeMotionEvent } from "./types";

export function collapseMotion(prefix = "ant"): TreeMotion {
  const collapsed = () => ({ height: 0, opacity: 0 });
  const expanded = (node: HTMLDivElement) => ({
    height: node.scrollHeight,
    opacity: 1,
  });
  const end = (_node: HTMLDivElement, event: TreeMotionEvent) =>
    event.deadline === true || event.propertyName === "height";
  return {
    motionName: `${prefix}-motion-collapse`,
    motionAppear: false,
    motionDeadline: 500,
    onEnterStart: collapsed,
    onEnterActive: expanded,
    onAppearStart: collapsed,
    onAppearActive: expanded,
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: collapsed,
    onEnterEnd: end,
    onAppearEnd: end,
    onLeaveEnd: end,
  };
}

export function MotionTreeNode({
  children,
  motion,
  visible,
  onEnd,
}: {
  children: OctaneNode;
  motion: TreeMotion;
  visible: boolean;
  onEnd: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<"start" | "active">("start");
  const [motionStyle, setMotionStyle] = useState<CSSProperties>({});
  const ended = useRef(false);
  const callbacks = useRef({ motion, onEnd });
  callbacks.current = { motion, onEnd };
  // rc-tree forces appearance for a newly inserted expansion placeholder.
  const status = visible ? "appear" : "leave";
  const finish = (event: TreeMotionEvent) => {
    const node = nodeRef.current;
    if (ended.current || !node) return;
    const current = callbacks.current;
    const handler = visible
      ? (current.motion.onAppearEnd ?? current.motion.onEnterEnd)
      : current.motion.onLeaveEnd;
    if (handler?.(node, event) === false) return;
    ended.current = true;
    current.motion.onVisibleChanged?.(visible);
    current.onEnd();
  };
  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const options = callbacks.current.motion;
    let cancelled = false;
    let frame = 0;
    let secondFrame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const prepare = visible
      ? (options.onAppearPrepare ?? options.onEnterPrepare)
      : options.onLeavePrepare;
    const prepared = prepare?.(node);
    const startMotion = () => {
      if (cancelled) return;
      if (!options.motionName || (!visible && options.motionLeave === false)) {
        finish({ deadline: true });
        return;
      }
      const start = visible
        ? (options.onAppearStart ?? options.onEnterStart)
        : options.onLeaveStart;
      const active = visible
        ? (options.onAppearActive ?? options.onEnterActive)
        : options.onLeaveActive;
      setMotionStyle(start?.(node) ?? {});
      // Two animation frames preserve the collapsed/current height before transition.
      frame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          setPhase("active");
          setMotionStyle(active?.(node) ?? {});
        });
      });
      timer = setTimeout(
        () => finish({ deadline: true }),
        options.motionDeadline ?? 500,
      );
    };
    if (prepared && typeof prepared === "object" && "then" in prepared)
      void prepared.then(startMotion, startMotion);
    else startMotion();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(secondFrame);
      clearTimeout(timer);
    };
  }, []);
  const motionClasses =
    typeof motion.motionName === "string"
      ? `${motion.motionName}-${status} ${motion.motionName}-${status}-${phase}`
      : [
          motion.motionName?.[status],
          phase === "active"
            ? motion.motionName?.[`${status}Active`]
            : undefined,
        ]
          .filter(Boolean)
          .join(" ");
  return (
    <div
      ref={nodeRef}
      className={`ant-tree-treenode-motion ant-tree-treenode-motion-${status} ${motionClasses}`}
      style={{ overflow: "hidden", ...motionStyle }}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget) finish(event);
      }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) finish({ deadline: true });
      }}
    >
      {children}
    </div>
  );
}
