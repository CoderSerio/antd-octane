// Adapted from Ant Design 5.29.3 progress/utils.ts (MIT).
import type { ProgressProps } from "./interface";
export const validProgress = (value?: number) =>
  !value || value < 0 ? 0 : Math.min(100, value);
export function getSuccessPercent({ success, successPercent }: ProgressProps) {
  return success && "percent" in success
    ? success.percent
    : success && "progress" in success
      ? success.progress
      : successPercent;
}
export function getPercentage(props: ProgressProps) {
  const success = validProgress(getSuccessPercent(props));
  return [success, validProgress(validProgress(props.percent) - success)];
}
export function getSize(
  size: ProgressProps["size"],
  type: ProgressProps["type"] | "step",
  extra?: { steps?: number; strokeWidth?: number },
): [number | string, number] {
  let width: number | string = -1,
    height = -1;
  if (type === "circle" || type === "dashboard") {
    if (typeof size === "string" || typeof size === "undefined")
      width = height = size === "small" ? 60 : 120;
    else if (typeof size === "number") width = height = size;
    else if (Array.isArray(size)) {
      width = size[0] ?? size[1] ?? 120;
      height = Number(width);
    }
  } else {
    if (typeof size === "number") [width, height] = [size, size];
    else if (typeof size === "object")
      [width = type === "step" ? 14 : -1, height = 8] = Array.isArray(size)
        ? size
        : [size.width, size.height];
    else {
      width = type === "step" ? (size === "small" ? 2 : 14) : -1;
      height =
        type === "step"
          ? (extra?.strokeWidth ?? 8)
          : extra?.strokeWidth || (size === "small" ? 6 : 8);
    }
    if (type === "step")
      width = Number(width) * (extra as { steps: number }).steps;
  }
  return [width, height];
}
