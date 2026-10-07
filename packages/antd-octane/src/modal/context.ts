// Adapted from Ant Design 5.29.3 components/modal/context.ts (MIT).
import type { OctaneNode } from "octane";
import { createContext } from "octane";
import type { ModalAction, ModalClose, ModalProps } from "./interface";
export interface ModalContextProps
  extends Pick<
    ModalProps,
    "confirmLoading" | "okType" | "okButtonProps" | "cancelButtonProps"
  > {
  onOk?: ModalAction;
  onCancel?: ModalAction;
  okTextLocale?: OctaneNode;
  cancelTextLocale?: OctaneNode;
  rootPrefixCls?: string;
  close?: ModalClose;
  isSilent?: () => boolean;
  onConfirm?: (confirmed: boolean) => void;
  autoFocusButton?: false | "ok" | "cancel" | null;
  mergedOkCancel?: boolean;
}
export const ModalContext = createContext<ModalContextProps>({});
