/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useId } from "octane";
import { useComponentTokens } from "../_util/tokens";

export type ProgressGradient = {
  from?: string;
  to?: string;
  direction?: string;
  [stop: string]: string | undefined;
};
export interface ProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "format"> {
  percent?: number;
  type?: "line" | "circle" | "dashboard";
  status?: "normal" | "active" | "exception" | "success";
  showInfo?: boolean;
  format?: (percent: number, successPercent: number) => OctaneNode;
  success?: { percent?: number; strokeColor?: string };
  strokeColor?: string | ProgressGradient;
  trailColor?: string;
  strokeWidth?: number;
  strokeLinecap?: "round" | "butt" | "square";
  size?: "default" | "small" | number | [number, number];
  gapDegree?: number;
  gapPosition?: "top" | "bottom" | "left" | "right";
  steps?: number;
  style?: CSSProperties;
}
const bounded = (value: number | undefined, fallback = 0) =>
  Number.isFinite(value)
    ? Math.min(100, Math.max(0, value as number))
    : fallback;
function stops(gradient: ProgressGradient): [number, string][] {
  const entries = Object.entries(gradient).flatMap(([key, value]) =>
    /^\d+(\.\d+)?%$/.test(key) && value
      ? [[bounded(Number.parseFloat(key)), value] as [number, string]]
      : [],
  );
  if (!entries.length)
    return [
      [0, gradient.from ?? "currentColor"],
      [100, gradient.to ?? gradient.from ?? "currentColor"],
    ];
  return entries.sort((a, b) => a[0] - b[0]);
}
export function Progress({
  percent = 0,
  type = "line",
  status,
  showInfo = true,
  format,
  success,
  strokeColor,
  trailColor,
  strokeWidth,
  strokeLinecap = "round",
  size = "default",
  gapDegree,
  gapPosition = "bottom",
  steps,
  className,
  style,
  ...rest
}: ProgressProps) {
  const { token: t, component: c, base } = useComponentTokens("Progress");
  const id = `ao-progress-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const value = bounded(percent);
  const succeeded = bounded(success?.percent);
  const state =
    status ??
    ((success?.percent === undefined ? value : succeeded) >= 100
      ? "success"
      : "normal");
  const color =
    state === "exception"
      ? t.colorError
      : state === "success"
        ? t.colorSuccess
        : (c?.defaultColor ?? t.colorInfo);
  const gradient =
    typeof strokeColor === "object" ? stops(strokeColor) : undefined;
  const paint = typeof strokeColor === "string" ? strokeColor : color;
  const background = gradient
    ? `linear-gradient(${(strokeColor as ProgressGradient).direction ?? "to right"}, ${gradient.map(([stop, stopColor]) => `${stopColor} ${stop}%`).join(", ")})`
    : paint;
  const width =
    typeof size === "number"
      ? Math.max(1, size)
      : Array.isArray(size)
        ? Math.max(1, size[0])
        : type === "line"
          ? undefined
          : size === "small"
            ? 60
            : 120;
  const thickness = Math.max(
    1,
    strokeWidth ??
      (type !== "line"
        ? 6
        : typeof size === "number"
          ? size
          : Array.isArray(size)
            ? size[1]
            : size === "small"
              ? 6
              : 8),
  );
  const circleStroke = Math.min(50, thickness);
  const radius = 50 - circleStroke / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = Math.min(
    295,
    Math.max(0, gapDegree ?? (type === "dashboard" ? 75 : 0)),
  );
  const length = circumference * (1 - gap / 360);
  const rotation = gap
    ? { bottom: 90, top: -90, left: 180, right: 0 }[gapPosition] + gap / 2
    : -90;
  const count = Number.isFinite(steps)
    ? Math.min(1000, Math.max(0, Math.floor(steps ?? 0)))
    : 0;
  const info = format
    ? format(value, succeeded)
    : state === "success"
      ? "✓"
      : state === "exception"
        ? "×"
        : `${value}%`;
  const circle = (amount: number, stroke: string, name: string) => (
    <circle
      className={name}
      cx="50"
      cy="50"
      r={radius}
      fill="none"
      stroke={stroke}
      strokeWidth={circleStroke}
      strokeLinecap={strokeLinecap}
      strokeDasharray={`${(length * amount) / 100} ${circumference}`}
      transform={`rotate(${rotation} 50 50)`}
      opacity={amount ? 1 : 0}
    />
  );
  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={
        rest["aria-valuetext"] ??
        (state === "exception"
          ? `${value}%, 异常`
          : state === "success"
            ? `${value}%, 成功`
            : `${value}%`)
      }
      className={[
        "ant-progress",
        `ant-progress-${type}`,
        `ant-progress-status-${state}`,
        size === "small" && "ant-progress-small",
        showInfo && "ant-progress-show-info",
        className,
      ]}
      style={{
        ...base,
        "--ao-progress-color": paint,
        "--ao-progress-trail":
          trailColor ?? c?.remainingColor ?? t.colorFillSecondary,
        "--ao-progress-radius": `${strokeLinecap === "butt" || strokeLinecap === "square" ? 0 : (c?.lineBorderRadius ?? 100)}px`,
        "--ao-progress-text": c?.circleTextColor ?? t.colorText,
        "--ao-progress-font": `${type === "line" ? (size === "small" ? t.fontSizeSM : t.fontSize) : (width ?? 120) * 0.15 + 6}px`,
        width: count && type === "line" ? "auto" : width,
        ...style,
      }}
    >
      {type === "line" ? (
        <div
          className="ant-progress-outer"
          style={count ? { flex: "none" } : undefined}
        >
          {count ? (
            <div className="ant-progress-steps-outer">
              {Array.from({ length: count }, (_, index) => (
                <span
                  key={index}
                  className="ant-progress-steps-item"
                  style={{
                    height:
                      strokeWidth ??
                      (typeof size === "number"
                        ? size
                        : Array.isArray(size)
                          ? size[1]
                          : 8),
                    width:
                      typeof size === "number"
                        ? size
                        : Array.isArray(size)
                          ? size[0]
                          : size === "small"
                            ? 2
                            : 14,
                    background:
                      index < Math.round((count * value) / 100)
                        ? paint
                        : undefined,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="ant-progress-inner" style={{ height: thickness }}>
              <div
                className="ant-progress-bg"
                style={{ width: `${value}%`, background, height: thickness }}
              />
              <div
                className="ant-progress-success-bg"
                style={{
                  width: `${succeeded}%`,
                  background: success?.strokeColor ?? t.colorSuccess,
                  height: thickness,
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="ant-progress-inner">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            {gradient && (
              <defs>
                <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                  {gradient.map(([stop, stopColor]) => (
                    <stop
                      key={stop}
                      offset={`${stop}%`}
                      stopColor={stopColor}
                    />
                  ))}
                </linearGradient>
              </defs>
            )}
            {circle(
              100,
              trailColor ?? c?.remainingColor ?? t.colorFillSecondary,
              "ant-progress-circle-trail",
            )}
            {circle(
              value,
              gradient ? `url(#${id})` : paint,
              "ant-progress-circle-path",
            )}
            {succeeded > 0 &&
              circle(
                succeeded,
                success?.strokeColor ?? t.colorSuccess,
                "ant-progress-circle-success",
              )}
          </svg>
        </div>
      )}
      {showInfo && (
        <span
          className="ant-progress-text"
          style={
            type !== "line"
              ? { fontSize: c?.circleTextFontSize ?? "1em" }
              : undefined
          }
        >
          {info}
        </span>
      )}
    </div>
  );
}
