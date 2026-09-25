import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useEffect, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
export interface SpinProps extends HTMLAttributes<HTMLDivElement> {
  spinning?: boolean;
  delay?: number;
  size?: "small" | "default" | "large";
  tip?: OctaneNode;
  indicator?: OctaneNode;
  wrapperClassName?: string;
  fullscreen?: boolean;
  style?: CSSProperties;
}
export function Spin({
  spinning = true,
  delay = 0,
  size = "default",
  tip,
  indicator,
  wrapperClassName,
  fullscreen = false,
  children,
  className,
  style,
  ...rest
}: SpinProps) {
  const { token: t, component: c, base } = useComponentTokens("Spin");
  const duration = Number.isFinite(delay) ? Math.max(0, delay) : 0;
  const [ready, setReady] = useState(spinning && duration === 0);
  useEffect(() => {
    if (!spinning) {
      setReady(false);
      return;
    }
    if (!duration) {
      setReady(true);
      return;
    }
    const timer = setTimeout(() => setReady(true), duration);
    return () => clearTimeout(timer);
  }, [spinning, duration]);
  const visible = spinning && ready;
  const nested = children !== undefined && !fullscreen;
  const dot =
    size === "small"
      ? (c?.dotSizeSM ?? t.controlHeightLG * 0.35)
      : size === "large"
        ? (c?.dotSizeLG ?? t.controlHeight)
        : (c?.dotSize ?? t.controlHeightLG / 2);
  const vars = {
    ...base,
    "--ao-spin-size": `${dot}px`,
    "--ao-spin-height": `${c?.contentHeight ?? 400}px`,
    "--ao-spin-z": t.zIndexPopupBase,
    ...style,
  };
  const spinner = (
    <div
      {...rest}
      className={[
        "ant-spin",
        visible && "ant-spin-spinning",
        size === "small" && "ant-spin-sm",
        size === "large" && "ant-spin-lg",
        className,
      ]}
      style={vars}
      role="status"
      aria-live="polite"
      aria-label={rest["aria-label"] ?? "正在加载"}
      aria-busy={visible}
      hidden={!visible}
    >
      {indicator ?? (
        <span className="ant-spin-dot" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      )}
      {tip && (nested || fullscreen) && (
        <div className="ant-spin-text">{tip}</div>
      )}
    </div>
  );
  if (nested)
    return (
      <div
        className={["ant-spin-nested-loading", wrapperClassName]}
        style={{ "--ao-spin-height": vars["--ao-spin-height"] }}
        aria-busy={visible}
      >
        {visible && <div className="ant-spin-overlay">{spinner}</div>}
        <div
          className={["ant-spin-container", visible && "ant-spin-blur"]}
          inert={visible || undefined}
        >
          {children}
        </div>
      </div>
    );
  if (fullscreen)
    return (
      <div className="ant-spin-fullscreen" style={vars} hidden={!visible}>
        {spinner}
      </div>
    );
  return spinner;
}
