import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import type { PopoverProps } from "../popover";

export type AvatarRef = HTMLSpanElement;

export type AvatarSize =
  | number
  | "small"
  | "default"
  | "large"
  | Partial<Record<"xs" | "sm" | "md" | "lg" | "xl" | "xxl", number>>;

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onError" | "ref"> {
  ref?: Ref<AvatarRef>;
  prefixCls?: string;
  rootClassName?: string;
  /** Src of image avatar. */
  src?: OctaneNode;
  /** Srcset of image avatar. */
  srcSet?: string;
  alt?: string;
  /** Icon to be used in avatar. */
  icon?: OctaneNode;
  /** Size can be fixed or responsive. */
  size?: AvatarSize;
  /** Shape of avatar, options: `circle` and `square`. */
  shape?: "circle" | "square";
  gap?: number;
  crossOrigin?: "" | "anonymous" | "use-credentials";
  /** Called when the avatar image fails to load. Return false to keep it. */
  // biome-ignore lint/suspicious/noConfusingVoidType: A consumer may return false or use a normal void callback.
  onError?: () => boolean | void;
  draggable?: boolean | "true" | "false";
  style?: CSSProperties;
}

export interface AvatarGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  prefixCls?: string;
  rootClassName?: string;
  children?: OctaneNode;
  /** @deprecated Please use `max={{ count: number }}`. */
  maxCount?: number;
  /** @deprecated Please use `max={{ style: CSSProperties }}`. */
  maxStyle?: CSSProperties;
  /** @deprecated Please use `max={{ popover: PopoverProps }}`. */
  maxPopoverPlacement?: "top" | "bottom";
  /** @deprecated Please use `max={{ popover: PopoverProps }}`. */
  maxPopoverTrigger?: "hover" | "focus" | "click";
  max?: {
    count?: number;
    style?: CSSProperties;
    popover?: PopoverProps;
  };
  size?: AvatarSize;
  shape?: "circle" | "square";
  style?: CSSProperties;
}
