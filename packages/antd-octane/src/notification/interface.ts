// Ant Design 5.29.3 components/notification/interface.ts (MIT), adapted to Octane.
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import type { ClosableType } from "../_util/closable";

interface DivProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  style?: CSSProperties;
  "data-testid"?: string;
}

export const NotificationPlacements = [
  "top",
  "topLeft",
  "topRight",
  "bottom",
  "bottomLeft",
  "bottomRight",
] as const;
export type NotificationPlacement = (typeof NotificationPlacements)[number];
export type IconType = "success" | "info" | "error" | "warning";

export interface NotificationArgs {
  message: OctaneNode;
  description?: OctaneNode;
  /** @deprecated Please use `actions` instead. */
  btn?: OctaneNode;
  actions?: OctaneNode;
  key?: string | number;
  onClose?: () => void;
  duration?: number | null;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  icon?: OctaneNode;
  placement?: NotificationPlacement;
  style?: CSSProperties;
  className?: string;
  readonly type?: IconType;
  onClick?: () => void;
  closeIcon?: OctaneNode;
  closable?: ClosableType;
  props?: DivProps;
  role?: "alert" | "status";
}
export type NotificationArgsProps = NotificationArgs;
type StaticFn = (args: NotificationArgs) => void;
export interface NotificationInstance {
  success: StaticFn;
  error: StaticFn;
  info: StaticFn;
  warning: StaticFn;
  open: StaticFn;
  destroy: (key?: string | number) => void;
}

export interface NotificationGlobalConfig {
  top?: number;
  bottom?: number;
  duration?: number;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  prefixCls?: string;
  getContainer?: () => HTMLElement | ShadowRoot;
  placement?: NotificationPlacement;
  closeIcon?: OctaneNode;
  closable?: ClosableType;
  rtl?: boolean;
  maxCount?: number;
  props?: DivProps;
}
export interface NotificationConfig {
  top?: number;
  bottom?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement | ShadowRoot;
  placement?: NotificationPlacement;
  maxCount?: number;
  rtl?: boolean;
  stack?: boolean | { threshold?: number };
  duration?: number;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  closeIcon?: OctaneNode;
}
