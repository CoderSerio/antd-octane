// Ant Design 5.29.3 components/skeleton/Button.tsx (MIT), adapted to Octane.
import { useConfig } from "../config-provider";
import Element from "./Element";
import type { SkeletonButtonProps } from "./interface";
import useSkeletonStyle from "./useSkeletonStyle";
export default function SkeletonButton(props: SkeletonButtonProps) {
  const {
    prefixCls: customPrefix,
    className,
    rootClassName,
    active,
    block = false,
    size = "default",
  } = props;
  const { prefixCls: _prefixCls, ...otherProps } = props;
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
        block && "ant-skeleton-block",
        block && `${prefixCls}-block`,
        className,
        rootClassName,
      ]}
      style={base}
    >
      <Element
        prefixCls={`${prefixCls}-button`}
        nativePrefixCls="ant-skeleton-button"
        size={size}
        className={className}
        {...otherProps}
      />
    </div>
  );
}
