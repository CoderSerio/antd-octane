// Ant Design 5.29.3 progress/progress.tsx (MIT), adapted to Octane.
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
export type StringGradients = Record<string, string>;
export type ProgressGradient = { direction?: string } & (
  | StringGradients
  | { from: string; to: string }
);
export type ProgressType = "line" | "circle" | "dashboard";
export type ProgressSize = "default" | "small";
export type ProgressAriaProps = Pick<
  HTMLAttributes<HTMLDivElement>,
  "aria-label" | "aria-labelledby"
>;
export interface PercentPositionType {
  align?: "start" | "center" | "end";
  type?: "inner" | "outer";
}
export interface SuccessProps {
  percent?: number;
  /** @deprecated Use percent instead. */
  progress?: number;
  strokeColor?: string;
}
export interface ProgressProps extends ProgressAriaProps {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  ref?: Ref<HTMLDivElement>;
  children?: OctaneNode;
  percent?: number;
  type?: ProgressType;
  status?: "normal" | "active" | "exception" | "success";
  showInfo?: boolean;
  format?: (percent?: number, successPercent?: number) => OctaneNode;
  success?: SuccessProps;
  /** @deprecated Use success.percent instead. */
  successPercent?: number;
  strokeColor?: string | string[] | ProgressGradient;
  trailColor?: string;
  strokeWidth?: number;
  strokeLinecap?: "round" | "butt" | "square";
  size?:
    | ProgressSize
    | number
    | [number | string, number]
    | { width?: number; height?: number };
  /** @deprecated Use size instead. */
  width?: number;
  gapDegree?: number;
  gapPosition?: "top" | "bottom" | "left" | "right";
  steps?: number | { count: number; gap: number };
  percentPosition?: PercentPositionType;
  rounding?: (step: number) => number;
  style?: CSSProperties;
}
