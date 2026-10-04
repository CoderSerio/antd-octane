// rc-progress 4.0.0 es/Circle/util.js (MIT), adapted to Octane.
import type { CSSProperties } from "octane";
import type { ProgressProps } from "../interface";
export const VIEW_BOX_SIZE = 100;
export function getCircleStyle(
  perimeter: number,
  length: number,
  offset: number,
  percent: number,
  rotate: number,
  gapDegree: number,
  gapPosition: ProgressProps["gapPosition"],
  color: unknown,
  linecap: ProgressProps["strokeLinecap"],
  strokeWidth: number,
  stepSpace = 0,
): CSSProperties {
  const offsetDegree = (offset / 100) * 360 * ((360 - gapDegree) / 360);
  const positionDegree =
    gapDegree === 0
      ? 0
      : (
          { bottom: 0, top: 180, left: 90, right: -90 } as Record<
            string,
            number
          >
        )[gapPosition ?? ""];
  let dashoffset = ((100 - percent) / 100) * length;
  if (linecap === "round" && percent !== 100) {
    dashoffset += strokeWidth / 2;
    if (dashoffset >= length) dashoffset = length - 0.01;
  }
  return {
    stroke: typeof color === "string" ? color : undefined,
    strokeDasharray: `${length}px ${perimeter}`,
    strokeDashoffset: dashoffset + stepSpace,
    transform: `rotate(${rotate + offsetDegree + Number(positionDegree)}deg)`,
    transformOrigin: "50px 50px",
    transition:
      "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s",
    fillOpacity: 0,
  };
}
