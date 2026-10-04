// Ant Design 5.29.3 components/spin/Indicator/Looper.tsx (MIT).
import Progress from "./Progress";

export interface IndicatorProps {
  prefixCls: string;
  percent?: number;
}
export default function Looper({ prefixCls, percent = 0 }: IndicatorProps) {
  return (
    <>
      <span
        className={[
          "ant-spin-dot-holder",
          `${prefixCls}-dot-holder`,
          percent > 0 && "ant-spin-dot-holder-hidden",
          percent > 0 && `${prefixCls}-dot-holder-hidden`,
        ]}
      >
        <span
          className={[
            "ant-spin-dot",
            `${prefixCls}-dot`,
            "ant-spin-dot-spin",
            `${prefixCls}-dot-spin`,
          ]}
        >
          {[1, 2, 3, 4].map((key) => (
            <i
              key={key}
              className={["ant-spin-dot-item", `${prefixCls}-dot-item`]}
            />
          ))}
        </span>
      </span>
      <Progress prefixCls={prefixCls} percent={percent} />
    </>
  );
}
