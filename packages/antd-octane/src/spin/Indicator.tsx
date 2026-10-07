// Ant Design 5.29.3 components/spin/Indicator/index.tsx (MIT).
import { cloneElement, isValidElement, type OctaneNode } from "octane";
import Looper from "./Looper";

export interface IndicatorProps {
  prefixCls: string;
  indicator?: OctaneNode;
  percent?: number;
}
export default function Indicator({
  prefixCls,
  indicator,
  percent,
}: IndicatorProps) {
  if (
    indicator &&
    isValidElement<{ className?: string; percent?: number }>(indicator)
  ) {
    return cloneElement(indicator, {
      className: [indicator.props.className, "ant-spin-dot", `${prefixCls}-dot`]
        .filter(Boolean)
        .join(" "),
      percent,
    });
  }
  return <Looper prefixCls={prefixCls} percent={percent} />;
}
