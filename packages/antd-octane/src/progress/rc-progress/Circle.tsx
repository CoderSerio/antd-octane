// rc-progress 4.0.0 es/Circle/index.js (MIT), adapted to Octane.
import type { ProgressGradient, ProgressProps } from "../interface";
import PtgCircle from "./PtgCircle";
import useCircleId from "./useCircleId";
import useTransitionDuration from "./useTransitionDuration";
import { getCircleStyle } from "./util";
export default function RCCircle({
  prefixCls,
  steps,
  percent,
  strokeWidth,
  strokeColor,
  strokeLinecap,
  trailColor,
  gapDegree = 0,
  gapPosition,
}: {
  prefixCls: string;
  steps: ProgressProps["steps"];
  percent: number | number[];
  strokeWidth: number;
  strokeColor:
    | string
    | ProgressGradient
    | null
    | (string | ProgressGradient | null)[];
  strokeLinecap: ProgressProps["strokeLinecap"];
  trailColor: string | null;
  gapDegree?: number;
  gapPosition: ProgressProps["gapPosition"];
}) {
  const id = `${useCircleId()}-gradient`;
  const radius = 50 - strokeWidth / 2;
  const perimeter = Math.PI * 2 * radius;
  const length = perimeter * ((360 - gapDegree) / 360);
  const rotation = gapDegree > 0 ? 90 + gapDegree / 2 : -90;
  const count = typeof steps === "object" ? steps.count : steps;
  const gap = typeof steps === "object" ? steps.gap : 2;
  const percents = Array.isArray(percent) ? percent : [percent];
  const colors = Array.isArray(strokeColor)
    ? strokeColor
    : strokeColor == null
      ? []
      : [strokeColor];
  const gradient = colors.find((color) => color && typeof color === "object");
  const linecap = gradient ? "butt" : strokeLinecap;
  const paths = useTransitionDuration([
    id,
    percent,
    strokeColor,
    strokeWidth,
    steps,
    gapDegree,
    gapPosition,
  ]);
  const getStyle = (
    offset: number,
    amount: number,
    color: unknown,
    cap = linecap,
    space = 0,
  ) =>
    getCircleStyle(
      perimeter,
      length,
      offset,
      amount,
      rotation,
      gapDegree,
      gapPosition,
      color,
      cap,
      strokeWidth,
      space,
    );
  let offset = 0;
  const current = Math.round(((count ?? 0) * percents[0]) / 100);
  const circles = count
    ? new Array(count).fill(null).map((_, index) => {
        const color = index <= current - 1 ? colors[0] : trailColor;
        const style = getStyle(offset, 100 / count, color, "butt", gap);
        offset +=
          ((length - Number(style.strokeDashoffset) + gap) * 100) / length;
        return (
          <circle
            key={index}
            className={["ant-progress-circle-path", `${prefixCls}-circle-path`]}
            r={radius}
            cx={50}
            cy={50}
            stroke={
              color && typeof color === "object" ? `url(#${id})` : undefined
            }
            strokeWidth={strokeWidth}
            opacity={1}
            style={style}
            ref={(element) => {
              paths.current[index] = element;
            }}
          />
        );
      })
    : percents
        .map((amount, index) => {
          const color = colors[index] || colors[colors.length - 1];
          const style = getStyle(offset, amount, color);
          offset += amount;
          return (
            <PtgCircle
              key={index}
              prefixCls={prefixCls}
              color={color}
              gradientId={id}
              radius={radius}
              style={style}
              percent={amount}
              strokeLinecap={linecap}
              strokeWidth={strokeWidth}
              gapDegree={gapDegree}
              ref={(element) => {
                paths.current[index] = element;
              }}
            />
          );
        })
        .reverse();
  return (
    <svg
      className={["ant-progress-circle", `${prefixCls}-circle`]}
      viewBox="0 0 100 100"
      role="presentation"
    >
      {!count && (
        <circle
          className={["ant-progress-circle-trail", `${prefixCls}-circle-trail`]}
          r={radius}
          cx={50}
          cy={50}
          stroke={trailColor ?? undefined}
          strokeLinecap={linecap}
          strokeWidth={strokeWidth}
          style={getStyle(0, 100, trailColor)}
        />
      )}
      {circles}
    </svg>
  );
}
