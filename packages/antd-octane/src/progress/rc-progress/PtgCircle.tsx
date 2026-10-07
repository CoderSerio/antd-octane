// rc-progress 4.0.0 es/Circle/PtgCircle.js (MIT), adapted to Octane.
import type { CSSProperties, Ref } from "octane";
import type { ProgressGradient, ProgressProps } from "../interface";
export default function PtgCircle({
  prefixCls,
  color,
  gradientId,
  radius,
  style,
  percent,
  strokeLinecap,
  strokeWidth,
  gapDegree,
  ref,
}: {
  prefixCls: string;
  color: string | ProgressGradient | null;
  gradientId: string;
  radius: number;
  style: CSSProperties;
  percent: number;
  strokeLinecap: ProgressProps["strokeLinecap"];
  strokeWidth: number;
  gapDegree: number;
  ref?: Ref<SVGCircleElement>;
}) {
  const gradient = color && typeof color === "object";
  const classes = ["ant-progress-circle-path", `${prefixCls}-circle-path`];
  const circle = (
    <circle
      className={classes}
      r={radius}
      cx={50}
      cy={50}
      stroke={gradient ? "#FFF" : undefined}
      strokeLinecap={strokeLinecap}
      strokeWidth={strokeWidth}
      opacity={percent === 0 ? 0 : 1}
      style={style}
      ref={ref}
    />
  );
  if (!gradient) return circle;
  // rc-progress preserves authored key order; unlike line gradients it does not
  // normalize from/to or sort the stops.
  const stops = (scale: number) =>
    Object.keys(color)
      .map(
        (key) =>
          `${(color as Record<string, string>)[key]} ${Math.floor(Number.parseFloat(key) * scale)}%`,
      )
      .join(", ");
  const maskId = `${gradientId}-conic`;
  return (
    <>
      <mask id={maskId}>{circle}</mask>
      <foreignObject
        x={0}
        y={0}
        width={100}
        height={100}
        mask={`url(#${maskId})`}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(to ${gapDegree ? "bottom" : "top"}, ${stops(1)})`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `conic-gradient(from ${gapDegree ? 180 + gapDegree / 2 : 0}deg, ${stops((360 - gapDegree) / 360)})`,
            }}
          />
        </div>
      </foreignObject>
    </>
  );
}
