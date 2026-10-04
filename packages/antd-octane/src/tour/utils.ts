import type { OctaneNode } from "octane";
import type { Placement } from "../_util/floating";
import type { TourAlign, TourClosable } from "./interface";

type ClosableConfig = Exclude<TourClosable, boolean> | null;

// Adapted from @rc-component/tour 1.15.1 hooks/useClosable (MIT).
// A step with no close configuration inherits the root configuration.
function getClosableConfig(
  closable: TourClosable | undefined,
  closeIcon: OctaneNode,
  preset: boolean,
): ClosableConfig | "empty" {
  const config = typeof closable === "object" ? closable : undefined;
  if (closable === false || (closeIcon === false && !config?.closeIcon))
    return null;
  const mergedIcon = typeof closeIcon === "boolean" ? undefined : closeIcon;
  if (config) return { ...config, closeIcon: config.closeIcon ?? mergedIcon };
  return preset || closable || closeIcon ? { closeIcon: mergedIcon } : "empty";
}

export function resolveClosable(
  stepClosable: TourClosable | undefined,
  stepCloseIcon: OctaneNode,
  closable: TourClosable | undefined,
  closeIcon: OctaneNode,
): ClosableConfig {
  const stepConfig = getClosableConfig(stepClosable, stepCloseIcon, false);
  const rootConfig = getClosableConfig(closable, closeIcon, true);
  return stepConfig === "empty"
    ? rootConfig === "empty"
      ? null
      : rootConfig
    : stepConfig;
}

// Ant Design 5 components/style/roundedArrow.ts (MIT).
export function getArrowToken(
  size: number,
  radiusXS: number,
  radiusOuter: number,
) {
  const half = size / 2;
  const bx = radiusOuter / Math.SQRT2;
  const by = half - radiusOuter * (1 - 1 / Math.SQRT2);
  const cx = half - radiusXS / Math.SQRT2;
  const cy = radiusOuter * (Math.SQRT2 - 1) + radiusXS / Math.SQRT2;
  const polygonOffset = radiusOuter * (Math.SQRT2 - 1);
  return {
    path: `path('M 0 ${half} A ${radiusOuter} ${radiusOuter} 0 0 0 ${bx} ${by} L ${cx} ${cy} A ${radiusXS} ${radiusXS} 0 0 1 ${size - cx} ${cy} L ${size - bx} ${by} A ${radiusOuter} ${radiusOuter} 0 0 0 ${size} ${half} Z')`,
    polygon: `polygon(${polygonOffset}px 100%, 50% ${polygonOffset}px, ${size - polygonOffset}px 100%, ${polygonOffset}px 100%)`,
    shadowWidth: half * Math.SQRT2 + radiusOuter * (Math.SQRT2 - 2),
  };
}

// Ant Design 5 components/_util/placements.ts (MIT).
export function getAlign(
  placement: Placement,
  pointAtCenter: boolean,
  gap: number,
  arrowOffset: number,
  arrowWidth: number,
): TourAlign {
  const points: Record<Placement, [string, string]> = {
    left: ["cr", "cl"],
    right: ["cl", "cr"],
    top: ["bc", "tc"],
    bottom: ["tc", "bc"],
    topLeft: ["bl", pointAtCenter ? "tc" : "tl"],
    leftTop: ["tr", pointAtCenter ? "cl" : "tl"],
    topRight: ["br", pointAtCenter ? "tc" : "tr"],
    rightTop: ["tl", pointAtCenter ? "cr" : "tr"],
    bottomRight: ["tr", pointAtCenter ? "bc" : "br"],
    rightBottom: ["bl", pointAtCenter ? "cr" : "br"],
    bottomLeft: ["tl", pointAtCenter ? "bc" : "bl"],
    leftBottom: ["br", pointAtCenter ? "cl" : "bl"],
  };
  const offset: [number, number] = [
    placement.startsWith("left")
      ? -gap
      : placement.startsWith("right")
        ? gap
        : 0,
    placement.startsWith("top")
      ? -gap
      : placement.startsWith("bottom")
        ? gap
        : 0,
  ];
  if (pointAtCenter) {
    if (placement.endsWith("Left")) offset[0] = -arrowOffset - arrowWidth / 2;
    else if (placement.endsWith("Right"))
      offset[0] = arrowOffset + arrowWidth / 2;
    else if (placement.endsWith("Top"))
      offset[1] = -arrowOffset * 2 + arrowWidth / 2;
    else if (placement.endsWith("Bottom"))
      offset[1] = arrowOffset * 2 - arrowWidth / 2;
  }
  const overflow: TourAlign["overflow"] =
    placement === "top" || placement === "bottom"
      ? { shiftX: arrowOffset * 2 + arrowWidth, shiftY: true, adjustY: true }
      : placement === "left" || placement === "right"
        ? { shiftY: 16 + arrowWidth, shiftX: true, adjustX: true }
        : { adjustX: true, adjustY: true };
  return {
    points: points[placement],
    offset,
    targetOffset: [0, 0],
    overflow,
    dynamicInset: true,
    ...(placement.length > 6 ? { autoArrow: false } : {}),
  };
}
