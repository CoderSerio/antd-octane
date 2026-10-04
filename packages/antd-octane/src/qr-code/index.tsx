/** @jsxImportSource octane */
import { FastColor } from "@ant-design/fast-color";
import { useMemo } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { useLocale } from "../locale";
import type { QRCodeProps } from "./interface";
import { QRCodeCanvas } from "./QRCodeCanvas";
import { QRCodeStatus as QRCodeStatusView } from "./QRCodeStatus";
import { QRCodeSVG } from "./QRCodeSVG";

export type {
  ImageSettings,
  QRCodeCrossOrigin,
  QRCodeImageSettings,
  QRCodeLevel,
  QRCodeLocale,
  QRCodeProps,
  QRCodeStatus,
  QRCodeStatusRenderInfo,
  QRProps,
  QRPropsCanvas,
  QRPropsSvg,
  QRStatus,
  StatusRenderInfo,
} from "./interface";

export function QRCode({
  value,
  type = "canvas",
  size = 160,
  prefixCls,
  icon = "",
  iconSize,
  imageSettings,
  color,
  bgColor = "transparent",
  fgColor,
  errorLevel,
  level,
  boostLevel = true,
  minVersion = 1,
  marginSize,
  includeMargin = false,
  bordered = true,
  status = "active",
  onRefresh,
  className,
  rootClassName,
  statusRender,
  style,
  ...rest
}: QRCodeProps) {
  const { token: t, base } = useComponentTokens("QRCode");
  const prefix = useConfig().getPrefixCls("qrcode", prefixCls);
  const renderSize = Number.isFinite(size) ? Math.max(0, size) : 160;
  const iconWidth =
    typeof iconSize === "number" ? iconSize : (iconSize?.width ?? 40);
  const iconHeight =
    typeof iconSize === "number" ? iconSize : (iconSize?.height ?? 40);
  const image = useMemo(
    () =>
      imageSettings ??
      (icon
        ? {
            src: icon,
            width: iconWidth,
            height: iconHeight,
            excavate: true,
            crossOrigin: "anonymous" as const,
          }
        : undefined),
    [imageSettings, icon, iconWidth, iconHeight],
  );
  // pickAttrs(rest, true) in upstream moves only role/aria attributes to the renderer.
  const a11y = Object.fromEntries(
    Object.entries(rest).filter(
      ([key]) => key === "role" || key.startsWith("aria-"),
    ),
  );
  const rootProps = Object.fromEntries(
    Object.entries(rest).filter(
      ([key]) => key !== "role" && !key.startsWith("aria-"),
    ),
  );
  const qrProps = {
    value,
    size: renderSize,
    level: errorLevel ?? level ?? "M",
    bgColor,
    fgColor: color ?? fgColor ?? t.colorText,
    style: { width: style?.width, height: style?.height },
    imageSettings: image,
    boostLevel,
    minVersion,
    marginSize,
    includeMargin,
    ...a11y,
  };
  const [statusLocale] = useLocale("QRCode");
  const locale = {
    expired: "QR code expired",
    refresh: "Refresh",
    scanned: "Scanned",
    ...statusLocale,
  };
  const part = (name: string) => [
    `${prefix}-${name}`,
    prefix !== "ant-qrcode" && `ant-qrcode-${name}`,
  ];
  if (!value) return null;
  return (
    <div
      {...rootProps}
      className={[
        prefix,
        prefix !== "ant-qrcode" && "ant-qrcode",
        !bordered && part("borderless"),
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        "--ao-qrcode-padding": `${t.paddingSM}px`,
        "--ao-qrcode-radius": `${t.borderRadiusLG}px`,
        "--ao-qrcode-border": t.colorSplit,
        "--ao-qrcode-line-width": `${t.lineWidth}px`,
        "--ao-qrcode-line-type": t.lineType,
        "--ao-qrcode-mask": new FastColor(t.colorBgContainer)
          .setA(0.96)
          .toRgbString(),
        "--ao-qrcode-icon-margin": `${t.marginXS}px`,
        "--ao-qrcode-icon-size": `${t.controlHeight}px`,
        backgroundColor: bgColor,
        ...style,
        width: style?.width ?? renderSize,
        height: style?.height ?? renderSize,
      }}
    >
      {status !== "active" && (
        <div className={part("mask")}>
          <QRCodeStatusView
            prefixCls={prefix}
            locale={locale}
            status={status}
            onRefresh={onRefresh}
            statusRender={statusRender}
          />
        </div>
      )}
      {type === "canvas" ? (
        <QRCodeCanvas {...qrProps} />
      ) : (
        <QRCodeSVG {...qrProps} />
      )}
    </div>
  );
}
