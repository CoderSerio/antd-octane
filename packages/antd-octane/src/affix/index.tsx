import type { CSSProperties, HTMLAttributes, Ref } from "octane";
import { useImperativeHandle, useLayoutEffect, useRef, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
export interface AffixRef {
  updatePosition: () => void;
}
export interface AffixProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  offsetTop?: number;
  offsetBottom?: number;
  target?: () => Window | HTMLElement | null;
  onChange?: (affixed: boolean) => void;
  style?: CSSProperties;
  ref?: Ref<AffixRef>;
}
export function Affix({
  offsetTop,
  offsetBottom,
  target,
  onChange,
  style,
  className,
  children,
  ref,
  ...rest
}: AffixProps) {
  const { token: t, component: c } = useComponentTokens("Affix");
  const holder = useRef<HTMLDivElement | null>(null),
    content = useRef<HTMLDivElement | null>(null),
    update = useRef(() => {}),
    active = useRef(false),
    latest = useRef(onChange);
  latest.current = onChange;
  const [fixed, setFixed] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  useImperativeHandle(
    ref,
    () => ({ updatePosition: () => update.current() }),
    [],
  );
  useLayoutEffect(() => {
    const container = target ? target() : window;
    if (!container) return;
    let frame = 0;
    const calculate = () => {
      if (!holder.current || !content.current) return;
      const rect = holder.current.getBoundingClientRect(),
        body = content.current.getBoundingClientRect();
      const viewport =
        container === window
          ? { top: 0, bottom: window.innerHeight }
          : (container as HTMLElement).getBoundingClientRect();
      const top = offsetTop ?? (offsetBottom === undefined ? 0 : undefined);
      const should =
        top !== undefined
          ? rect.top < viewport.top + top
          : rect.bottom > viewport.bottom - (offsetBottom ?? 0);
      const next = should
        ? {
            top:
              top !== undefined
                ? viewport.top + top
                : viewport.bottom - (offsetBottom ?? 0) - body.height,
            left: rect.left,
            width: rect.width,
            height: body.height,
          }
        : null;
      setFixed((previous) =>
        previous &&
        next &&
        Object.keys(next).every(
          (key) =>
            previous[key as keyof typeof previous] ===
            next[key as keyof typeof next],
        )
          ? previous
          : next,
      );
      if (active.current !== should) {
        active.current = should;
        latest.current?.(should);
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(calculate);
    };
    update.current = calculate;
    calculate();
    container.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : null;
    if (holder.current) observer?.observe(holder.current);
    if (content.current) observer?.observe(content.current);
    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      observer?.disconnect();
      update.current = () => {};
    };
  }, [target, offsetTop, offsetBottom]);
  return (
    <div
      {...rest}
      ref={holder}
      className={className}
      style={{ ...style, ...(fixed ? { height: fixed.height } : null) }}
    >
      <div
        ref={content}
        className={fixed ? "ant-affix" : undefined}
        style={
          fixed
            ? {
                position: "fixed",
                top: fixed.top,
                left: fixed.left,
                width: fixed.width,
                zIndex: c?.zIndexPopup ?? t.zIndexBase + 10,
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
