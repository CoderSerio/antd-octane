// Ant Design 5.29.3 components/skeleton/Element.tsx (MIT), adapted to Octane.
import type { SkeletonElementProps } from "./interface";

export default function Element({
  prefixCls,
  nativePrefixCls,
  className,
  style,
  size,
  shape,
}: SkeletonElementProps & { nativePrefixCls?: string }) {
  const prefixes = [...new Set([prefixCls, nativePrefixCls].filter(Boolean))];
  const classes = prefixes.flatMap((prefix) => [
    prefix,
    size === "large" && `${prefix}-lg`,
    size === "small" && `${prefix}-sm`,
    shape === "circle" && `${prefix}-circle`,
    shape === "square" && `${prefix}-square`,
    shape === "round" && `${prefix}-round`,
  ]);
  const sizeStyle =
    typeof size === "number"
      ? { width: size, height: size, lineHeight: `${size}px` }
      : {};
  return (
    <span
      className={[...classes, className]}
      style={{ ...sizeStyle, ...style }}
    />
  );
}
