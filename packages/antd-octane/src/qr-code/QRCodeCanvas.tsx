/** @jsxImportSource octane */
import { useEffect, useRef, useState } from "octane";
import { useQRCode } from "./hooks/useQRCode";
import type { QRPropsCanvas } from "./interface";
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_FRONT_COLOR,
  DEFAULT_LEVEL,
  DEFAULT_MINVERSION,
  DEFAULT_NEED_MARGIN,
  DEFAULT_SIZE,
  excavateModules,
  generatePath,
  supportsPath2D,
} from "./utils";

export function QRCodeCanvas({
  value,
  size = DEFAULT_SIZE,
  level = DEFAULT_LEVEL,
  bgColor = DEFAULT_BACKGROUND_COLOR,
  fgColor = DEFAULT_FRONT_COLOR,
  includeMargin = DEFAULT_NEED_MARGIN,
  minVersion = DEFAULT_MINVERSION,
  marginSize,
  style,
  imageSettings,
  boostLevel,
  ref,
  ...rest
}: QRPropsCanvas) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [, setImageState] = useState(0);
  const src = imageSettings?.src;
  const {
    qrcode,
    cells,
    margin,
    numCells,
    calculatedImageSettings: imageSettingsCalculated,
  } = useQRCode({
    value,
    level,
    minVersion,
    includeMargin,
    marginSize,
    imageSettings,
    size,
    boostLevel,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !qrcode) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const image = imageRef.current;
    const canDrawImage = Boolean(
      imageSettingsCalculated &&
        image?.complete &&
        image.naturalHeight !== 0 &&
        image.naturalWidth !== 0,
    );
    // A failed or pending icon must leave the entire code readable.
    const cellsToDraw =
      canDrawImage && imageSettingsCalculated?.excavation
        ? excavateModules(cells, imageSettingsCalculated.excavation)
        : cells;
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.height = canvas.width = size * pixelRatio;
    const scale = (size / numCells) * pixelRatio;
    ctx.scale(scale, scale);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, numCells, numCells);
    ctx.fillStyle = fgColor;
    if (supportsPath2D())
      ctx.fill(new Path2D(generatePath(cellsToDraw, margin)));
    else {
      for (const [y, row] of cellsToDraw.entries()) {
        for (const [x, cell] of row.entries()) {
          if (cell) ctx.fillRect(x + margin, y + margin, 1, 1);
        }
      }
    }
    if (imageSettingsCalculated)
      ctx.globalAlpha = imageSettingsCalculated.opacity;
    if (canDrawImage && image && imageSettingsCalculated)
      ctx.drawImage(
        image,
        imageSettingsCalculated.x + margin,
        imageSettingsCalculated.y + margin,
        imageSettingsCalculated.w,
        imageSettingsCalculated.h,
      );
  });

  if (!qrcode)
    return <span role="status">内容为空或过长，无法生成二维码。</span>;
  return (
    <>
      <canvas
        width={size}
        height={size}
        role="img"
        {...rest}
        style={{ height: size, width: size, ...style }}
        ref={[canvasRef, ref]}
      />
      {src != null && (
        <img
          alt="QR-Code"
          key={src}
          src={src}
          style={{ display: "none" }}
          crossOrigin={imageSettingsCalculated?.crossOrigin}
          ref={imageRef}
          onLoad={(event) => {
            if (event.currentTarget === imageRef.current)
              setImageState((n) => n + 1);
          }}
          onError={(event) => {
            if (event.currentTarget === imageRef.current)
              setImageState((n) => n + 1);
          }}
        />
      )}
    </>
  );
}
