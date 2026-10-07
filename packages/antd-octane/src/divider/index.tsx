/** @jsxImportSource octane */
/** biome-ignore-all lint/a11y/useFocusableInteractive: Static separators are not interactive splitters. */
/** biome-ignore-all lint/a11y/useSemanticElements: A divider title requires children, which hr cannot contain. */
/** biome-ignore-all lint/a11y/useAriaPropsForRole: Static separators do not take a splitter aria-valuenow. */
import type { CSSProperties, HTMLAttributes } from "octane";
import { componentClassName } from "../_util/componentClassName";
import { useConfig } from "../config-provider";
import { resolveComponentAlias } from "../theme/resolve";
export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  rootClassName?: string;
  style?: CSSProperties;
  type?: "horizontal" | "vertical";
  orientation?: "left" | "right" | "center" | "start" | "end";
  orientationMargin?: number | string;
  plain?: boolean;
  dashed?: boolean;
  variant?: "dashed" | "dotted" | "solid";
  size?: "small" | "middle" | "large";
}
export function Divider({
  type = "horizontal",
  orientation = "center",
  orientationMargin,
  plain = false,
  dashed = false,
  variant = "solid",
  size: customSize,
  prefixCls: customPrefixCls,
  rootClassName,
  children,
  className,
  style,
  ...rest
}: DividerProps) {
  const config = useConfig();
  const t = resolveComponentAlias(config.theme, config.token, "Divider");
  const c = config.theme.components?.Divider;
  const prefixCls = config.getPrefixCls("divider", customPrefixCls);
  const size = customSize ?? config.componentSize;
  const hasText = type === "horizontal" && !!children;
  const placement =
    orientation === "left"
      ? config.direction === "rtl"
        ? "end"
        : "start"
      : orientation === "right"
        ? config.direction === "rtl"
          ? "start"
          : "end"
        : orientation;
  const hasMargin = placement !== "center" && orientationMargin != null;
  const margin =
    typeof orientationMargin === "string" && /^\d+$/.test(orientationMargin)
      ? Number(orientationMargin)
      : orientationMargin;
  const edge = hasMargin ? "0%" : `${(c?.orientationMargin ?? 0.05) * 100}%`;
  return (
    <div
      {...rest}
      role="separator"
      aria-orientation={type}
      className={[
        componentClassName("ant-divider", prefixCls),
        componentClassName("ant-divider", prefixCls, `-${type}`),
        hasText && componentClassName("ant-divider", prefixCls, "-with-text"),
        hasText &&
          componentClassName(
            "ant-divider",
            prefixCls,
            `-with-text-${placement}`,
          ),
        hasMargin &&
          componentClassName(
            "ant-divider",
            prefixCls,
            `-no-default-orientation-margin-${placement}`,
          ),
        plain && componentClassName("ant-divider", prefixCls, "-plain"),
        dashed && componentClassName("ant-divider", prefixCls, "-dashed"),
        variant !== "solid" &&
          componentClassName("ant-divider", prefixCls, `-${variant}`),
        config.direction === "rtl" &&
          componentClassName("ant-divider", prefixCls, "-rtl"),
        size &&
          componentClassName(
            "ant-divider",
            prefixCls,
            `-${size === "small" ? "sm" : size === "middle" ? "md" : "lg"}`,
          ),
        config.divider?.className,
        className,
        rootClassName,
      ]}
      style={{
        "--ao-divider-color": t.colorSplit,
        "--ao-divider-text":
          plain || !hasText ? t.colorText : t.colorTextHeading,
        "--ao-divider-font": t.fontFamily,
        "--ao-divider-line-height": t.lineHeight,
        "--ao-divider-font-size": `${plain || !hasText ? t.fontSize : t.fontSizeLG}px`,
        "--ao-divider-weight": plain ? 400 : 500,
        "--ao-divider-width": `${t.lineWidth}px`,
        "--ao-divider-style":
          variant === "dotted" ? "dotted" : dashed ? "dashed" : variant,
        "--ao-divider-margin": `${size === "small" ? t.marginXS : size === "middle" ? t.margin : hasText ? t.margin : t.marginLG}px`,
        "--ao-divider-vertical-margin":
          typeof c?.verticalMarginInline === "string"
            ? c.verticalMarginInline
            : `${c?.verticalMarginInline ?? t.marginXS}px`,
        "--ao-divider-padding": c?.textPaddingInline ?? "1em",
        "--ao-divider-edge": edge,
        ...config.divider?.style,
        ...style,
      }}
    >
      {hasText && (
        <span
          className={componentClassName(
            "ant-divider",
            prefixCls,
            "-inner-text",
          )}
          style={{
            marginInlineStart:
              hasMargin && placement === "start" ? margin : undefined,
            marginInlineEnd:
              hasMargin && placement === "end" ? margin : undefined,
            paddingInlineStart:
              hasMargin && placement === "start" ? 0 : undefined,
            paddingInlineEnd: hasMargin && placement === "end" ? 0 : undefined,
          }}
        >
          {children}
        </span>
      )}
    </div>
  );
}
