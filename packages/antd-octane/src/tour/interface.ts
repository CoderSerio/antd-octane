import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import type {
  FloatingAlign,
  FloatingOverflow,
  Placement,
} from "../_util/floating";

export type TourPlacement = Placement | "center";
export type TourMask = boolean | { color?: string; style?: CSSProperties };
export interface TourAlign extends Omit<FloatingAlign, "overflow"> {
  overflow?: FloatingOverflow;
  autoArrow?: boolean;
  dynamicInset?: boolean;
}
export type TourClosable =
  | boolean
  | ({ closeIcon?: OctaneNode } & Pick<
      HTMLAttributes<HTMLButtonElement>,
      Extract<keyof HTMLAttributes<HTMLButtonElement>, `aria-${string}`>
    >);

export interface TourButtonProps {
  children?: OctaneNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export interface TourStepProps {
  target?: HTMLElement | null | (() => HTMLElement | null);
  title?: OctaneNode;
  description?: OctaneNode;
  cover?: OctaneNode;
  placement?: TourPlacement;
  type?: "default" | "primary";
  mask?: TourMask;
  arrow?: boolean | { pointAtCenter?: boolean };
  closable?: TourClosable;
  closeIcon?: OctaneNode;
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  indicatorsRender?: (current: number, total: number) => OctaneNode;
  className?: string;
  style?: CSSProperties;
  nextButtonProps?: TourButtonProps;
  prevButtonProps?: TourButtonProps;
  actionsRender?: (
    originNode: OctaneNode,
    info: { current: number; total: number },
  ) => OctaneNode;
  prefixCls?: string;
  total?: number;
  current?: number;
  onClose?: () => void;
  onFinish?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export interface TourProps {
  steps?: TourStepProps[];
  open?: boolean;
  /** Octane extension; an omitted open prop opens the first step in Ant Design. */
  defaultOpen?: boolean;
  current?: number;
  defaultCurrent?: number;
  onChange?: (current: number) => void;
  onClose?: (current: number) => void;
  onFinish?: () => void;
  placement?: TourPlacement;
  type?: "default" | "primary";
  mask?: TourMask;
  arrow?: boolean | { pointAtCenter?: boolean };
  closable?: TourClosable;
  closeIcon?: OctaneNode;
  gap?: { offset?: number | [number, number]; radius?: number };
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  indicatorsRender?: (current: number, total: number) => OctaneNode;
  actionsRender?: TourStepProps["actionsRender"];
  zIndex?: number;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  disabledInteraction?: boolean;
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  style?: CSSProperties;
  onPopupAlign?: (element: HTMLElement, align: TourAlign) => void;
}

export interface TargetRect {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
}
