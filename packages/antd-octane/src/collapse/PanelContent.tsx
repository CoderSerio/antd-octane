/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { useLayoutEffect, useRef, useState } from "octane";
import { collapseClass } from "./util";

interface PanelContentProps {
  active: boolean;
  forceRender?: boolean;
  destroy: boolean;
  motionEnabled: boolean;
  children?: OctaneNode;
  id: string;
  labelledBy: string;
  prefixCls: string;
  role?: string;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
}

/** Native equivalent of rc-collapse PanelContent + antd's initCollapseMotion. */
export default function PanelContent({
  active,
  forceRender,
  destroy,
  motionEnabled,
  children,
  id,
  labelledBy,
  prefixCls,
  role,
  bodyClassName,
  bodyStyle,
}: PanelContentProps) {
  const [rendered, setRendered] = useState(active || Boolean(forceRender));
  const [hidden, setHidden] = useState(!active);
  const [motionStyle, setMotionStyle] = useState<CSSProperties>();
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const previousActive = useRef(active);
  const finishRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    if (previousActive.current === active) {
      if (active || forceRender) setRendered(true);
      // Changing motion configuration must not strand an in-flight transition.
      if (!motionEnabled) {
        setMotionStyle(undefined);
        setHidden(!active);
        if (!active && destroy && !forceRender) setRendered(false);
      }
      return;
    }
    previousActive.current = active;
    let cancelled = false;
    let frame = 0;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      if (deadline) clearTimeout(deadline);
      if (frame) cancelAnimationFrame(frame);
      setMotionStyle(undefined);
      setHidden(!active);
      if (!active && destroy && !forceRender) setRendered(false);
      finishRef.current = undefined;
    };
    finishRef.current = finish;
    if (!motionEnabled || !globalThis.requestAnimationFrame) {
      if (active) setRendered(true);
      finish();
      return;
    }
    if (active) {
      setRendered(true);
      setHidden(false);
      setMotionStyle({ height: 0, opacity: 0, overflow: "hidden" });
    } else {
      setMotionStyle({
        height: nodeRef.current?.offsetHeight ?? 0,
        opacity: 1,
        overflow: "hidden",
      });
    }
    // Two frames let the start height reach layout before the transition's end height.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        setMotionStyle({
          height: active ? (nodeRef.current?.scrollHeight ?? 0) : 0,
          opacity: active ? 1 : 0,
          overflow: "hidden",
        });
        // Upstream uses a 500 ms deadline when no height transitionend arrives.
        deadline = setTimeout(finish, 500);
      });
    });
    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      if (deadline) clearTimeout(deadline);
      finishRef.current = undefined;
    };
  }, [active, forceRender, destroy, motionEnabled]);

  if (!rendered && !active && !forceRender) return null;
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: accordion content receives the tabpanel role; the label links its matching header.
    <div
      ref={nodeRef}
      id={id}
      aria-labelledby={role ? labelledBy : undefined}
      role={role}
      hidden={hidden && !active}
      className={[
        collapseClass(prefixCls, "content"),
        collapseClass(
          prefixCls,
          active ? "content-active" : "content-inactive",
        ),
        hidden && !active && collapseClass(prefixCls, "content-hidden"),
        motionStyle && collapseClass(prefixCls, "content-motion"),
      ]}
      style={motionStyle}
      onTransitionEnd={(event) => {
        if (
          event.target === event.currentTarget &&
          event.propertyName === "height"
        )
          finishRef.current?.();
      }}
    >
      <div
        className={[collapseClass(prefixCls, "content-box"), bodyClassName]}
        style={bodyStyle}
      >
        {children}
      </div>
    </div>
  );
}
