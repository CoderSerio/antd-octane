// Ant Design 5.29.3 components/progress/Circle.tsx (MIT), adapted to Octane.
import type { OctaneNode } from "octane";
import { Tooltip } from "../tooltip";
import type { ProgressGradient, ProgressProps } from "./interface";
import RCCircle from "./rc-progress/Circle";
import { getPercentage, getSize } from "./utils";
export function Circle(
  props: Omit<ProgressProps, "strokeColor"> & {
    prefixCls: string;
    info: OctaneNode;
    strokeColor?: string | ProgressGradient;
  },
) {
  const {
    prefixCls,
    trailColor = null,
    strokeLinecap = "round",
    gapPosition,
    gapDegree,
    width: originWidth = 120,
    type,
    info,
    success,
    size = originWidth,
    steps,
    strokeColor,
  } = props;
  const [width, height] = getSize(size, "circle");
  const strokeWidth =
    props.strokeWidth === undefined
      ? Math.max((3 / Number(width)) * 100, 6)
      : props.strokeWidth;
  const gap =
    gapDegree || gapDegree === 0
      ? gapDegree
      : type === "dashboard"
        ? 75
        : undefined;
  const gapPos = gapPosition || (type === "dashboard" && "bottom") || undefined;
  const percentages = getPercentage(props);
  const colors = [success?.strokeColor || "#52c41a", strokeColor || null];
  const gradient =
    Object.prototype.toString.call(strokeColor) === "[object Object]";
  const small = Number(width) <= 20;
  const node = (
    <div
      className={[
        "ant-progress-inner",
        `${prefixCls}-inner`,
        gradient && [
          "ant-progress-circle-gradient",
          `${prefixCls}-circle-gradient`,
        ],
      ]}
      style={{ width, height, fontSize: Number(width) * 0.15 + 6 }}
    >
      <RCCircle
        prefixCls={prefixCls}
        steps={steps}
        percent={steps ? percentages[1] : percentages}
        strokeWidth={strokeWidth}
        strokeColor={steps ? colors[1] : colors}
        strokeLinecap={strokeLinecap}
        trailColor={trailColor}
        gapDegree={gap}
        gapPosition={gapPos}
      />
      {!small && info}
    </div>
  );
  return small ? <Tooltip title={info}>{node}</Tooltip> : node;
}
