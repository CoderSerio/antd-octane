// Ant Design 5.29.3 components/skeleton/Node.tsx (MIT), adapted to Octane.
import { useConfig } from "../config-provider";
import type { SkeletonNodeProps } from "./interface";
import useSkeletonStyle from "./useSkeletonStyle";
export default function SkeletonNode({
  prefixCls: customPrefix,
  className,
  rootClassName,
  style,
  active,
  children,
}: SkeletonNodeProps) {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls("skeleton", customPrefix);
  const { style: base } = useSkeletonStyle();
  return (
    <div
      className={[
        "ant-skeleton",
        prefixCls,
        "ant-skeleton-element",
        `${prefixCls}-element`,
        active && "ant-skeleton-active",
        active && `${prefixCls}-active`,
        className,
        rootClassName,
      ]}
      style={base}
    >
      <div
        className={["ant-skeleton-image", `${prefixCls}-image`, className]}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
