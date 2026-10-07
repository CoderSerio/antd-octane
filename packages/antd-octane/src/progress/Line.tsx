/** @jsxImportSource octane */
// Adapted from Ant Design 5.29.3 progress/Line.tsx (MIT).
import type { OctaneNode } from "octane";
import { devUseWarning } from "../_util/warning";
import type {
  PercentPositionType,
  ProgressGradient,
  ProgressProps,
  StringGradients,
} from "./interface";
import { getSize, getSuccessPercent, validProgress } from "./utils";
export const sortGradient = (gradient: StringGradients) =>
  Object.entries(gradient)
    .map(([key, value]) => ({
      key: Number.parseFloat(key.replace(/%/g, "")),
      value,
    }))
    .filter(({ key }) => !Number.isNaN(key))
    .sort((a, b) => a.key - b.key)
    .map(({ key, value }) => `${value} ${key}%`)
    .join(", ");
export function handleGradient(
  color: ProgressGradient,
  direction?: "ltr" | "rtl",
) {
  const {
    from = "#1677ff",
    to = "#1677ff",
    direction: gradientDirection = direction === "rtl" ? "to left" : "to right",
    ...rest
  } = color;
  const stops = Object.keys(rest).length
    ? sortGradient(rest as StringGradients)
    : `${from}, ${to}`;
  const background = `linear-gradient(${gradientDirection}, ${stops})`;
  return { background, "--ao-progress-stroke-color": background };
}
export function Line(
  props: Omit<ProgressProps, "strokeColor" | "percentPosition"> & {
    prefixCls: string;
    percentPosition: PercentPositionType;
    strokeColor?: string | ProgressGradient;
    info: OctaneNode;
    direction: "ltr" | "rtl";
  },
) {
  const warning = devUseWarning("Progress");
  warning.deprecated(!("strokeWidth" in props), "strokeWidth", "size");
  const {
    prefixCls,
    percent,
    size,
    strokeWidth,
    strokeColor,
    trailColor,
    strokeLinecap = "round",
    percentPosition,
    info,
    direction,
    success,
  } = props;
  const classes = (suffix: string) => [
    ...new Set([`ant-progress${suffix}`, `${prefixCls}${suffix}`]),
  ];
  const { align, type: position } = percentPosition;
  const mergedSize = size ?? [-1, strokeWidth || (size === "small" ? 6 : 8)];
  const [width, height] = getSize(mergedSize, "line", { strokeWidth });
  const background =
    strokeColor && typeof strokeColor !== "string"
      ? handleGradient(strokeColor, direction)
      : { background: strokeColor, "--ao-progress-stroke-color": strokeColor };
  const radius =
    strokeLinecap === "square" || strokeLinecap === "butt" ? 0 : undefined;
  const succeeded = getSuccessPercent(props);
  const inner = (
    <div
      className={classes("-inner")}
      style={{ backgroundColor: trailColor || undefined, borderRadius: radius }}
    >
      <div
        className={[...classes("-bg"), ...classes(`-bg-${position}`)]}
        style={{
          width: `${validProgress(percent)}%`,
          height,
          borderRadius: radius,
          ...background,
          "--ao-progress-percent": validProgress(percent) / 100,
        }}
      >
        {position === "inner" && info}
      </div>
      {succeeded !== undefined && (
        <div
          className={classes("-success-bg")}
          style={{
            width: `${validProgress(succeeded)}%`,
            height,
            borderRadius: radius,
            backgroundColor: success?.strokeColor,
          }}
        />
      )}
    </div>
  );
  return position === "outer" && align === "center" ? (
    <div className={classes("-layout-bottom")}>
      {inner}
      {info}
    </div>
  ) : (
    <div
      className={classes("-outer")}
      style={{ width: Number(width) < 0 ? "100%" : width }}
    >
      {position === "outer" && align === "start" && info}
      {inner}
      {position === "outer" && align === "end" && info}
    </div>
  );
}
