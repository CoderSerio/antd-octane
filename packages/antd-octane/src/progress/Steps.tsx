/** @jsxImportSource octane */
// Adapted from Ant Design 5.29.3 progress/Steps.tsx (MIT).
import type { OctaneNode } from "octane";
import type { ProgressProps } from "./interface";
import { getSize } from "./utils";
export function Steps({
  prefixCls,
  steps,
  size,
  strokeWidth = 8,
  strokeColor,
  trailColor,
  percent = 0,
  rounding = Math.round,
  info,
}: ProgressProps & { info: OctaneNode; prefixCls: string; steps: number }) {
  const classes = (suffix: string) => [
    ...new Set([`ant-progress${suffix}`, `${prefixCls}${suffix}`]),
  ];
  const current = rounding((steps * percent) / 100);
  const [width, height] = getSize(
    size ?? [size === "small" ? 2 : 14, strokeWidth],
    "step",
    { steps, strokeWidth },
  );
  const items = Array.from<OctaneNode>({ length: steps });
  for (let i = 0; i < steps; i++) {
    const color = Array.isArray(strokeColor) ? strokeColor[i] : strokeColor;
    const active = i <= current - 1;
    items[i] = (
      <div
        key={i}
        className={[
          ...classes("-steps-item"),
          active && classes("-steps-item-active"),
        ]}
        style={{
          width: Number(width) / steps,
          height,
          backgroundColor: active
            ? typeof color === "string"
              ? color
              : undefined
            : trailColor,
        }}
      />
    );
  }
  return (
    <div className={classes("-steps-outer")}>
      {items}
      {info}
    </div>
  );
}
