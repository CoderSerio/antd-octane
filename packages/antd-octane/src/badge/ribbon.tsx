/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";

const presetColors = [
  "blue",
  "purple",
  "cyan",
  "green",
  "magenta",
  "pink",
  "red",
  "orange",
  "yellow",
  "volcano",
  "geekblue",
  "lime",
  "gold",
] as const;
type PresetColor = (typeof presetColors)[number];
const isPresetColor = (color: string): color is PresetColor =>
  presetColors.includes(color as PresetColor);

export interface BadgeRibbonProps {
  children?: OctaneNode;
  className?: string;
  prefixCls?: string;
  rootClassName?: string;
  text?: OctaneNode;
  color?: string;
  placement?: "start" | "end";
  style?: CSSProperties;
}

export function Ribbon({
  children,
  className,
  prefixCls,
  rootClassName,
  text,
  color,
  placement = "end",
  style,
}: BadgeRibbonProps) {
  const { token: t, base } = useComponentTokens("Badge");
  const paletteColor =
    color && isPresetColor(color)
      ? (t[`${color}6` as keyof typeof t] as string | undefined)
      : undefined;
  const ribbonColor = paletteColor ?? color ?? t.colorPrimary;
  const config = useConfig();
  const prefix = config.getPrefixCls("ribbon", prefixCls);
  return (
    <div
      className={[`${prefix}-wrapper`, "ant-ribbon-wrapper", rootClassName]}
      style={{
        ...base,
        "--ao-ribbon-line": `${t.fontHeight}px`,
        "--ao-ribbon-offset": `${t.marginXS}px`,
        "--ao-ribbon-radius": `${t.borderRadiusSM}px`,
        "--ao-badge-padding": `${t.paddingXS}px`,
        "--ao-badge-text": t.colorTextLightSolid,
      }}
    >
      {children}
      <div
        className={[
          prefix,
          "ant-ribbon",
          `${prefix}-placement-${placement}`,
          `ant-ribbon-placement-${placement}`,
          color &&
            isPresetColor(color) && [
              `${prefix}-color-${color}`,
              `ant-ribbon-color-${color}`,
            ],
          config.direction === "rtl" && `${prefix}-rtl`,
          className,
        ]}
        style={{
          background: ribbonColor,
          color: ribbonColor,
          direction: config.direction,
          ...style,
        }}
      >
        <span className={[`${prefix}-text`, "ant-ribbon-text"]}>{text}</span>
        <div
          className={[`${prefix}-corner`, "ant-ribbon-corner"]}
          style={{ color: ribbonColor }}
        />
      </div>
    </div>
  );
}
