/** @jsxImportSource octane */
/** biome-ignore-all lint/a11y/useFocusableInteractive: Static separators are not interactive splitters. */
/** biome-ignore-all lint/a11y/useSemanticElements: A divider title requires children, which hr cannot contain. */
/** biome-ignore-all lint/a11y/useAriaPropsForRole: Static separators do not take a splitter aria-valuenow. */
import type { CSSProperties, HTMLAttributes } from "octane";
import { useConfig } from "../config-provider";
import { resolveComponentAlias } from "../theme/resolve";
export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  style?: CSSProperties;
  type?: "horizontal" | "vertical";
  orientation?: "left" | "right" | "center";
  orientationMargin?: number | string;
  plain?: boolean;
  dashed?: boolean;
}
export function Divider({
  type = "horizontal",
  orientation = "center",
  orientationMargin,
  plain = false,
  dashed = false,
  children,
  className,
  style,
  ...rest
}: DividerProps) {
  const config = useConfig();
  const t = resolveComponentAlias(config.theme, config.token, "Divider");
  const c = config.theme.components?.Divider;
  const hasText =
    type === "horizontal" &&
    children !== undefined &&
    children !== null &&
    children !== false;
  const edge =
    orientationMargin === undefined
      ? `${(c?.orientationMargin ?? 0.05) * 100}%`
      : typeof orientationMargin === "number"
        ? `${orientationMargin}px`
        : orientationMargin;
  return (
    <div
      {...rest}
      role="separator"
      aria-orientation={type}
      className={[
        "ant-divider",
        `ant-divider-${type}`,
        hasText && "ant-divider-with-text",
        hasText && `ant-divider-with-text-${orientation}`,
        plain && "ant-divider-plain",
        className,
      ]}
      style={{
        "--ao-divider-color": t.colorSplit,
        "--ao-divider-text": plain ? t.colorText : t.colorTextHeading,
        "--ao-divider-font": t.fontFamily,
        "--ao-divider-line-height": t.lineHeight,
        "--ao-divider-font-size": `${plain || !hasText ? t.fontSize : t.fontSizeLG}px`,
        "--ao-divider-weight": plain ? 400 : 500,
        "--ao-divider-width": `${t.lineWidth}px`,
        "--ao-divider-style": dashed ? "dashed" : "solid",
        "--ao-divider-margin": `${hasText ? t.margin : t.marginLG}px`,
        "--ao-divider-vertical-margin": `${c?.verticalMarginInline ?? t.marginXS}px`,
        "--ao-divider-padding": c?.textPaddingInline ?? "1em",
        "--ao-divider-edge": edge,
        ...style,
      }}
    >
      {hasText && <span className="ant-divider-inner-text">{children}</span>}
    </div>
  );
}
