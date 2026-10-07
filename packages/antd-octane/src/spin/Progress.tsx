// Ant Design 5.29.3 components/spin/Indicator/Progress.tsx (MIT).
import type { CSSProperties } from "octane";
import { useLayoutEffect, useState } from "octane";

export interface ProgressProps {
  prefixCls: string;
  percent: number;
}
const circumference = 80 * Math.PI;
function CustomCircle({
  prefixCls,
  style,
  background,
}: {
  prefixCls: string;
  style?: CSSProperties;
  background?: boolean;
}) {
  return (
    <circle
      className={[
        "ant-spin-dot-circle",
        `${prefixCls}-dot-circle`,
        background && "ant-spin-dot-circle-bg",
        background && `${prefixCls}-dot-circle-bg`,
      ]}
      r={40}
      cx={50}
      cy={50}
      strokeWidth={20}
      style={style}
    />
  );
}
export default function Progress({ prefixCls, percent }: ProgressProps) {
  const [render, setRender] = useState(false);
  useLayoutEffect(() => {
    if (percent !== 0) setRender(true);
  }, [percent !== 0]);
  const safePercent = Math.max(Math.min(percent, 100), 0);
  if (!render) return null;
  return (
    <span
      className={[
        "ant-spin-dot-holder",
        `${prefixCls}-dot-holder`,
        "ant-spin-dot-progress",
        `${prefixCls}-dot-progress`,
        safePercent <= 0 && "ant-spin-dot-holder-hidden",
        safePercent <= 0 && `${prefixCls}-dot-holder-hidden`,
      ]}
    >
      <svg
        viewBox="0 0 100 100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safePercent}
      >
        <CustomCircle prefixCls={prefixCls} background />
        <CustomCircle
          prefixCls={prefixCls}
          style={{
            strokeDashoffset: String(circumference / 4),
            strokeDasharray: `${(circumference * safePercent) / 100} ${(circumference * (100 - safePercent)) / 100}`,
          }}
        />
      </svg>
    </span>
  );
}
