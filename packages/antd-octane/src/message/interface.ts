// Ant Design 5.29.3 components/message/interface.ts (MIT), adapted to Octane.
import type { CSSProperties, MouseEventHandler, OctaneNode } from "octane";
export type MessageNoticeType =
  | "info"
  | "success"
  | "error"
  | "warning"
  | "loading";
export interface MessageConfig {
  top?: string | number;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  maxCount?: number;
  rtl?: boolean;
}
export interface MessageArgs {
  content: OctaneNode;
  duration?: number;
  type?: MessageNoticeType;
  onClose?: () => void;
  icon?: OctaneNode;
  key?: string | number;
  style?: CSSProperties;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}
export interface MessageType extends PromiseLike<boolean> {
  (): void;
}
export type MessageOpen = (
  content: OctaneNode | MessageArgs,
  duration?: number | (() => void),
  onClose?: () => void,
) => MessageType;
export interface MessageInstance {
  info: MessageOpen;
  success: MessageOpen;
  error: MessageOpen;
  warning: MessageOpen;
  loading: MessageOpen;
  open: (args: MessageArgs) => MessageType;
  destroy: (key?: string | number) => void;
}
