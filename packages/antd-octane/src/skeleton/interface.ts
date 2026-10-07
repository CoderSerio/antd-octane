// Ant Design 5.29.3 components/skeleton interfaces (MIT), adapted to Octane.
import type { CSSProperties, OctaneNode } from "octane";

export interface SkeletonElementProps {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  size?: "small" | "default" | "large" | number;
  shape?: "circle" | "square" | "round" | "default";
  active?: boolean;
}
export interface SkeletonTitleProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  width?: number | string;
}
export interface SkeletonParagraphProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  width?: number | string | (number | string)[];
  rows?: number;
}
export interface SkeletonAvatarProps
  extends Omit<SkeletonElementProps, "shape"> {
  shape?: "circle" | "square";
}
export interface SkeletonButtonProps
  extends Omit<SkeletonElementProps, "size"> {
  size?: "small" | "default" | "large";
  block?: boolean;
}
export interface SkeletonInputProps
  extends Omit<SkeletonElementProps, "size" | "shape"> {
  size?: "small" | "default" | "large";
  block?: boolean;
}
export interface SkeletonImageProps
  extends Omit<SkeletonElementProps, "size" | "shape"> {}
export interface SkeletonNodeProps extends SkeletonImageProps {
  fullSize?: boolean;
  children?: OctaneNode;
}
export interface SkeletonProps {
  active?: boolean;
  loading?: boolean;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  children?: OctaneNode;
  avatar?: boolean | Omit<SkeletonAvatarProps, "active">;
  title?: boolean | SkeletonTitleProps;
  paragraph?: boolean | SkeletonParagraphProps;
  round?: boolean;
}
