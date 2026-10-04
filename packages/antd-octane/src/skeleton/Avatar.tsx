// Ant Design 5.29.3 components/skeleton/Avatar.tsx (MIT), adapted to Octane.
import { useConfig } from "../config-provider";
import Element from "./Element";
import type { SkeletonAvatarProps } from "./interface";
import useSkeletonStyle from "./useSkeletonStyle";
export default function SkeletonAvatar(props: SkeletonAvatarProps) {
  const {
    prefixCls: customPrefix,
    className,
    rootClassName,
    active,
    shape = "circle",
    size = "default",
  } = props;
  const { prefixCls: _prefixCls, className: _className, ...otherProps } = props;
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
      <Element
        prefixCls={`${prefixCls}-avatar`}
        nativePrefixCls="ant-skeleton-avatar"
        shape={shape}
        size={size}
        {...otherProps}
      />
    </div>
  );
}
