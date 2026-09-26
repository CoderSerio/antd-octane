import type { CSSProperties, HTMLAttributes } from "octane";
import { useEffect, useState } from "octane";
import { useConfig } from "../config-provider";
export interface WatermarkProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  zIndex?: number;
  rotate?: number;
  width?: number;
  height?: number;
  image?: string;
  content?: string | string[];
  font?: {
    color?: string;
    fontSize?: number | string;
    fontWeight?: string | number;
    fontStyle?: string;
    fontFamily?: string;
    textAlign?: CanvasTextAlign;
  };
  gap?: [number, number];
  offset?: [number, number];
  style?: CSSProperties;
}
export function Watermark({
  zIndex = 9,
  rotate = -22,
  width,
  height,
  image,
  content,
  font,
  gap = [100, 100],
  offset,
  children,
  className,
  style,
  ...rest
}: WatermarkProps) {
  const { token } = useConfig();
  const [tile, setTile] = useState<{
    url: string;
    width: number;
    height: number;
  } | null>(null);
  const text = Array.isArray(content) ? content : [content ?? ""];
  const serialized = JSON.stringify(text);
  const gapX = gap[0],
    gapY = gap[1];
  useEffect(() => {
    let active = true;
    let loaded: HTMLImageElement | undefined;
    const draw = (picture?: HTMLImageElement) => {
      if (!active) return;
      const size = Math.max(
        1,
        Number.parseFloat(String(font?.fontSize ?? token.fontSizeLG)) || 16,
      );
      const lines = JSON.parse(serialized) as string[];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setTile(null);
        return;
      }
      const family = font?.fontFamily ?? token.fontFamily;
      const canvasFont = `${font?.fontStyle ?? "normal"} ${font?.fontWeight ?? "normal"} ${size}px ${family}`;
      ctx.font = canvasFont;
      const w =
        width ??
        (picture
          ? 120
          : Math.max(1, ...lines.map((line) => ctx.measureText(line).width)));
      const h =
        height ?? (picture ? 64 : Math.max(1, lines.length) * size * 1.25);
      const radians = (rotate * Math.PI) / 180;
      const rotatedW =
        Math.abs(w * Math.cos(radians)) + Math.abs(h * Math.sin(radians));
      const rotatedH =
        Math.abs(w * Math.sin(radians)) + Math.abs(h * Math.cos(radians));
      const tileWidth = Math.max(1, rotatedW + Math.max(0, gapX));
      const tileHeight = Math.max(1, rotatedH + Math.max(0, gapY));
      const ratio = Math.min(4, Math.max(1, window.devicePixelRatio || 1));
      canvas.width = Math.ceil(tileWidth * ratio);
      canvas.height = Math.ceil(tileHeight * ratio);
      ctx.scale(ratio, ratio);
      ctx.translate(tileWidth / 2, tileHeight / 2);
      ctx.rotate(radians);
      ctx.font = canvasFont;
      ctx.fillStyle = font?.color ?? token.colorTextQuaternary;
      ctx.textBaseline = "middle";
      ctx.textAlign = font?.textAlign ?? "center";
      if (picture) ctx.drawImage(picture, -w / 2, -h / 2, w, h);
      else
        lines.forEach((line, i) => {
          ctx.fillText(
            line,
            ctx.textAlign === "left" || ctx.textAlign === "start"
              ? -w / 2
              : ctx.textAlign === "right" || ctx.textAlign === "end"
                ? w / 2
                : 0,
            (i - (lines.length - 1) / 2) * size * 1.25,
          );
        });
      try {
        setTile({
          url: canvas.toDataURL(),
          width: tileWidth,
          height: tileHeight,
        });
      } catch {
        if (picture) draw();
        else setTile(null);
      }
    };
    if (image) {
      loaded = new Image();
      loaded.crossOrigin = "anonymous";
      loaded.onload = () => draw(loaded);
      loaded.onerror = () => draw();
      loaded.src = image;
    } else draw();
    return () => {
      active = false;
      if (loaded) {
        loaded.onload = null;
        loaded.onerror = null;
      }
    };
  }, [
    image,
    serialized,
    font?.color,
    font?.fontSize,
    font?.fontWeight,
    font?.fontStyle,
    font?.fontFamily,
    font?.textAlign,
    width,
    height,
    rotate,
    gapX,
    gapY,
    token,
  ]);
  return (
    <div
      {...rest}
      className={["ant-watermark", className]}
      style={{ position: "relative", ...style }}
    >
      {children}
      {tile && (
        <div
          className="ant-watermark-layer"
          aria-hidden="true"
          style={{
            zIndex,
            backgroundImage: `url("${tile.url}")`,
            backgroundSize: `${tile.width}px ${tile.height}px`,
            backgroundPosition: `${offset?.[0] ?? 0}px ${offset?.[1] ?? 0}px`,
          }}
        />
      )}
    </div>
  );
}
