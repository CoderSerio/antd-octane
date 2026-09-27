/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes } from "octane";
import { useEffect, useMemo, useRef } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { Button } from "../button";
import { Spin } from "../spin";
import { qrcodegen } from "./vendor/qrcodegen";
export interface QRCodeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "style"> {
  value: string;
  type?: "canvas" | "svg";
  size?: number;
  color?: string;
  bgColor?: string;
  errorLevel?: "L" | "M" | "Q" | "H";
  bordered?: boolean;
  status?: "active" | "expired" | "loading" | "scanned";
  onRefresh?: () => void;
  style?: CSSProperties;
}
export function QRCode({
  value,
  type = "canvas",
  size = 160,
  color,
  bgColor,
  errorLevel = "M",
  bordered = true,
  status = "active",
  onRefresh,
  className,
  style,
  ...rest
}: QRCodeProps) {
  const { token: t, base } = useComponentTokens("QRCode");
  const fg = color ?? t.colorText,
    bg = bgColor ?? t.colorBgContainer;
  const qr = useMemo(() => {
    try {
      return value
        ? qrcodegen.QrCode.encodeText(
            value,
            {
              L: qrcodegen.QrCode.Ecc.LOW,
              M: qrcodegen.QrCode.Ecc.MEDIUM,
              Q: qrcodegen.QrCode.Ecc.QUARTILE,
              H: qrcodegen.QrCode.Ecc.HIGH,
            }[errorLevel],
          )
        : null;
    } catch {
      return null;
    }
  }, [value, errorLevel]);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const outer = Math.max(64, Number.isFinite(size) ? size : 160);
  const side = Math.max(
    16,
    outer - t.paddingSM * 2 - (bordered ? t.lineWidth * 2 : 0),
  );
  const path = useMemo(() => {
    if (!qr) return "";
    let result = "";
    for (let y = 0; y < qr.size; y++)
      for (let x = 0; x < qr.size; x++)
        if (qr.getModule(x, y)) result += `M${x + 4} ${y + 4}h1v1h-1z`;
    return result;
  }, [qr]);
  useEffect(() => {
    if (type !== "canvas" || !qr || !canvas.current) return;
    const element = canvas.current,
      dpr = window.devicePixelRatio || 1,
      pixels = Math.round(side * dpr),
      count = qr.size + 8;
    element.width = pixels;
    element.height = pixels;
    const ctx = element.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, pixels, pixels);
    ctx.fillStyle = fg;
    for (let y = 0; y < qr.size; y++)
      for (let x = 0; x < qr.size; x++)
        if (qr.getModule(x, y)) {
          const x0 = Math.round(((x + 4) * pixels) / count),
            y0 = Math.round(((y + 4) * pixels) / count);
          ctx.fillRect(
            x0,
            y0,
            Math.round(((x + 5) * pixels) / count) - x0,
            Math.round(((y + 5) * pixels) / count) - y0,
          );
        }
  }, [qr, type, fg, bg, side]);
  return (
    <div
      {...rest}
      className={["ant-qrcode", className]}
      style={{
        ...base,
        display: "inline-flex",
        width: outer,
        position: "relative",
        padding: t.paddingSM,
        border: bordered
          ? `${t.lineWidth}px solid ${t.colorBorderSecondary}`
          : undefined,
        borderRadius: t.borderRadiusLG,
        background: bg,
        maxWidth: "100%",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {qr ? (
        type === "svg" ? (
          <svg
            role="img"
            aria-label="二维码"
            width={side}
            height={side}
            viewBox={`0 0 ${qr.size + 8} ${qr.size + 8}`}
            style={{ maxWidth: "100%", height: "auto" }}
            shape-rendering="crispEdges"
          >
            <title>二维码</title>
            <rect width="100%" height="100%" fill={bg} />
            <path d={path} fill={fg} />
          </svg>
        ) : (
          <canvas
            ref={canvas}
            role="img"
            aria-label="二维码"
            style={{
              width: side,
              height: "auto",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          >
            二维码
          </canvas>
        )
      ) : (
        <span role="status">内容为空或过长，无法生成二维码。</span>
      )}
      {status !== "active" && (
        <div
          className="ant-qrcode-mask"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: t.marginXS,
            borderRadius: "inherit",
            background: t.colorBgMask,
            color: t.colorWhite,
          }}
        >
          {status === "loading" ? (
            <Spin />
          ) : (
            <>
              <span>{status === "expired" ? "二维码已过期" : "已扫描"}</span>
              {status === "expired" && (
                <Button onClick={onRefresh}>刷新</Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
