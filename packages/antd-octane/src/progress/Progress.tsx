/** @jsxImportSource octane */
// Adapted from Ant Design 5.29.3 progress/progress.tsx (MIT).
import { FastColor } from "@ant-design/fast-color";
import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined,
} from "../_util/feedback-icons";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import { Circle } from "./Circle";
import type { ProgressProps } from "./interface";
import { Line } from "./Line";
import { Steps } from "./Steps";
import useProgressStyle from "./useProgressStyle";
import { getSize, getSuccessPercent, validProgress } from "./utils";
export function Progress(props: ProgressProps) {
  const {
    percent = 0,
    type = "line",
    status,
    showInfo = true,
    format,
    size = "default",
    width,
    percentPosition = {},
    prefixCls,
    rootClassName,
    className,
    style,
    steps,
    success,
    successPercent,
    strokeColor,
    trailColor,
    strokeWidth,
    strokeLinecap,
    gapDegree,
    gapPosition,
    rounding,
    ref,
    children,
    ...rest
  } = props;
  const warning = devUseWarning("Progress");
  warning.deprecated(
    !("successPercent" in props),
    "successPercent",
    "success.percent",
  );
  warning.deprecated(!("width" in props), "width", "size");
  if (type === "circle" || type === "dashboard") {
    if (Array.isArray(size)) {
      warning(
        false,
        "usage",
        'Type "circle" and "dashboard" do not accept array as `size`, please use number or preset size instead.',
      );
    } else if (typeof size === "object") {
      warning(
        false,
        "usage",
        'Type "circle" and "dashboard" do not accept object as `size`, please use number or preset size instead.',
      );
    }
  }
  if (success && "progress" in success) {
    warning.deprecated(false, "success.progress", "success.percent");
  }
  const config = useConfig();
  const prefix = config.getPrefixCls("progress", prefixCls);
  const classes = (suffix: string) => [
    ...new Set([`ant-progress${suffix}`, `${prefix}${suffix}`]),
  ];
  const base = useProgressStyle(type === "line" ? size : "default");
  const { align = "end", type: position = "outer" } = percentPosition;
  const successValue = getSuccessPercent(props);
  const number = Number.parseInt(
    String(successValue !== undefined ? (successValue ?? 0) : (percent ?? 0)),
    10,
  );
  const state =
    !["normal", "exception", "active", "success"].includes(status ?? "") &&
    number >= 100
      ? "success"
      : status || "normal";
  const text =
    position === "inner" ||
    format ||
    (state !== "success" && state !== "exception") ? (
      (format ?? ((value) => `${value}%`))(
        validProgress(percent),
        validProgress(getSuccessPercent(props)),
      )
    ) : state === "success" ? (
      type === "line" ? (
        <CheckCircleFilled aria-label="check-circle" />
      ) : (
        <CheckOutlined aria-label="check" />
      )
    ) : type === "line" ? (
      <CloseCircleFilled aria-label="close-circle" />
    ) : (
      <CloseOutlined aria-label="close" />
    );
  const colorValue = Array.isArray(strokeColor)
    ? strokeColor[0]
    : strokeColor && typeof strokeColor === "object"
      ? Object.values(strokeColor)[0]
      : strokeColor;
  const bright = colorValue ? new FastColor(colorValue).isLight() : false;
  const info = showInfo ? (
    <span
      className={[
        ...classes("-text"),
        type === "line" &&
          position === "inner" &&
          bright &&
          classes("-text-bright"),
        type === "line" && !steps && classes(`-text-${align}`),
        type === "line" && !steps && classes(`-text-${position}`),
      ]}
      title={typeof text === "string" ? text : undefined}
    >
      {text}
    </span>
  ) : null;
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={number}
      className={[
        ...classes(""),
        ...classes(`-status-${state}`),
        type !== "line" &&
          classes(`-${type === "dashboard" ? "circle" : type}`),
        type === "circle" &&
          Number(getSize(size, "circle")[0]) <= 20 &&
          classes("-inline-circle"),
        type === "line" && !steps && classes("-line"),
        !!steps && classes("-steps"),
        type === "line" && !steps && classes(`-line-align-${align}`),
        type === "line" && !steps && classes(`-line-position-${position}`),
        showInfo && classes("-show-info"),
        typeof size === "string" && classes(`-${size}`),
        config.direction === "rtl" && classes("-rtl"),
        config.progress?.className,
        className,
        rootClassName,
      ]}
      style={{ ...base, ...config.progress?.style, ...style }}
      {...rest}
    >
      {type === "line" ? (
        steps ? (
          <Steps
            {...props}
            steps={typeof steps === "number" ? steps : steps.count}
            info={info}
            prefixCls={prefix}
            strokeColor={
              typeof strokeColor === "string" || Array.isArray(strokeColor)
                ? strokeColor
                : undefined
            }
          />
        ) : (
          <Line
            {...props}
            info={info}
            prefixCls={prefix}
            strokeColor={
              Array.isArray(strokeColor) ? strokeColor[0] : strokeColor
            }
            direction={config.direction}
            percentPosition={{ align, type: position }}
          />
        )
      ) : type === "circle" || type === "dashboard" ? (
        <Circle
          {...props}
          prefixCls={prefix}
          info={info}
          strokeColor={
            Array.isArray(strokeColor) ? strokeColor[0] : strokeColor
          }
        />
      ) : null}
    </div>
  );
}
