/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count?: OctaneNode;
  showZero?: boolean;
  overflowCount?: number;
  dot?: boolean;
  status?: "success" | "processing" | "default" | "error" | "warning";
  text?: OctaneNode;
  color?: string;
  size?: "default" | "small";
  offset?: [number | string, number | string];
  style?: CSSProperties;
}
export function Badge({
  count,
  showZero = false,
  overflowCount = 99,
  dot = false,
  status,
  text,
  color,
  size = "default",
  offset,
  title,
  children,
  className,
  style,
  ...rest
}: BadgeProps) {
  const { token: t, base } = useComponentTokens("Badge");
  const c = useConfig().theme.components?.Badge;
  const statusColor = status
    ? {
        success: t.colorSuccess,
        processing: t.colorPrimary,
        default: t.colorTextPlaceholder,
        error: t.colorError,
        warning: t.colorWarning,
      }[status]
    : undefined;
  const statusMode = Boolean(status || color) && children === undefined;
  const visible =
    statusMode ||
    dot ||
    (count !== undefined &&
      count !== null &&
      count !== false &&
      ((count !== 0 && count !== "0") || showZero));
  const display =
    typeof count === "number" && count > overflowCount
      ? `${overflowCount}+`
      : count;
  const height =
    size === "small"
      ? (c?.indicatorHeightSM ?? t.fontSize)
      : (c?.indicatorHeight ??
        Math.round(t.fontSize * t.lineHeight) - 2 * t.lineWidth);
  return (
    <span
      {...rest}
      className={[
        "ant-badge",
        children === undefined && "ant-badge-standalone",
        className,
      ]}
      style={{
        ...base,
        "--ao-badge-height": `${dot || statusMode ? (statusMode ? (c?.statusSize ?? t.fontSizeSM / 2) : (c?.dotSize ?? t.fontSizeSM / 2)) : height}px`,
        "--ao-badge-animation": t.motion
          ? "ao-badge-pulse 1.2s ease-in-out infinite"
          : "none",
        "--ao-badge-bg": color ?? statusColor ?? t.colorError,
        "--ao-badge-text": t.colorTextLightSolid,
        "--ao-badge-size": `${size === "small" ? (c?.textFontSizeSM ?? t.fontSizeSM) : (c?.textFontSize ?? t.fontSizeSM)}px`,
        "--ao-badge-padding": `${t.paddingXS}px`,
        "--ao-badge-weight": c?.textFontWeight ?? "normal",
        "--ao-badge-z": c?.indicatorZIndex ?? "auto",
        "--ao-badge-shadow": t.colorBorderBg,
      }}
    >
      {children}
      {visible && (
        <sup
          className={[
            "ant-badge-indicator",
            (typeof display === "string" || typeof display === "number") &&
              String(display).length > 1 &&
              "ant-badge-multiple",
            (dot || statusMode) && "ant-badge-dot",
            statusMode && "ant-badge-status",
            status === "processing" && "ant-badge-processing",
          ]}
          title={
            title ??
            (typeof count === "string" || typeof count === "number"
              ? String(count)
              : undefined)
          }
          style={{
            insetInlineEnd: offset
              ? -Number.parseInt(String(offset[0]), 10)
              : undefined,
            marginTop: offset?.[1],
            ...style,
          }}
        >
          {!(dot || statusMode) && display}
        </sup>
      )}
      {text !== undefined && (
        <span className="ant-badge-status-text">{text}</span>
      )}
    </span>
  );
}
