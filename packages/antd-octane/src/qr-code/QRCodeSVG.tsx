/** @jsxImportSource octane */
import { useQRCode } from "./hooks/useQRCode";
import type { QRPropsSvg } from "./interface";
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_FRONT_COLOR,
  DEFAULT_LEVEL,
  DEFAULT_MINVERSION,
  DEFAULT_NEED_MARGIN,
  DEFAULT_SIZE,
  excavateModules,
  generatePath,
} from "./utils";

export function QRCodeSVG({
  value,
  size = DEFAULT_SIZE,
  level = DEFAULT_LEVEL,
  bgColor = DEFAULT_BACKGROUND_COLOR,
  fgColor = DEFAULT_FRONT_COLOR,
  includeMargin = DEFAULT_NEED_MARGIN,
  minVersion = DEFAULT_MINVERSION,
  title,
  marginSize,
  imageSettings,
  boostLevel,
  ...rest
}: QRPropsSvg) {
  const {
    qrcode,
    cells,
    margin,
    numCells,
    calculatedImageSettings: image,
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
  if (!qrcode)
    return <span role="status">内容为空或过长，无法生成二维码。</span>;
  const cellsToDraw = image?.excavation
    ? excavateModules(cells, image.excavation)
    : cells;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: antd forwards caller-provided role/aria attributes and does not invent an accessible label.
    <svg
      height={size}
      width={size}
      viewBox={`0 0 ${numCells} ${numCells}`}
      role="img"
      {...rest}
    >
      {Boolean(title) && <title>{title}</title>}
      <path
        fill={bgColor}
        d={`M0,0 h${numCells}v${numCells}H0z`}
        shape-rendering="crispEdges"
      />
      <path
        fill={fgColor}
        d={generatePath(cellsToDraw, margin)}
        shape-rendering="crispEdges"
      />
      {imageSettings && image && (
        <image
          href={imageSettings.src}
          height={image.h}
          width={image.w}
          x={image.x + margin}
          y={image.y + margin}
          preserveAspectRatio="none"
          opacity={image.opacity}
          crossOrigin={image.crossOrigin}
        />
      )}
    </svg>
  );
}
