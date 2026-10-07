// Ant Design 5.29.3 components/skeleton/Title.tsx (MIT), adapted to Octane.
import type { SkeletonTitleProps } from "./interface";

export default function Title({
  prefixCls,
  nativePrefixCls,
  className,
  width,
  style,
}: SkeletonTitleProps & { nativePrefixCls?: string }) {
  return (
    // biome-ignore lint/a11y/useHeadingContent: The upstream skeleton title is an empty placeholder heading.
    <h3
      className={[prefixCls, nativePrefixCls, className]}
      style={{ width, ...style }}
    />
  );
}
