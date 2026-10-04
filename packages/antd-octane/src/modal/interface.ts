import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import type { ClosableType } from "../_util/closable";
import type { DialogLayerProps } from "../_util/dialog";
import type { Breakpoint } from "../_util/responsive";
import type { ButtonProps } from "../button";

export type ModalSemanticDOM =
  | "header"
  | "body"
  | "footer"
  | "mask"
  | "wrapper"
  | "content";
export type ModalFooterRender = (
  originNode: OctaneNode,
  extra: { OkBtn: () => OctaneNode; CancelBtn: () => OctaneNode },
) => OctaneNode;
export type ModalFooter = OctaneNode | ModalFooterRender;
export interface ModalProps
  extends Pick<
    DialogLayerProps,
    | "open"
    | "mask"
    | "maskClosable"
    | "keyboard"
    | "focusTriggerAfterClose"
    | "destroyOnHidden"
    | "forceRender"
    | "getContainer"
    | "afterOpenChange"
  > {
  children?: OctaneNode;
  title?: OctaneNode;
  footer?: ModalFooter;
  closable?: ClosableType;
  closeIcon?: OctaneNode;
  onCancel?: (event: MouseEvent | KeyboardEvent) => void;
  onOk?: (event: MouseEvent) => void;
  confirmLoading?: boolean;
  okText?: OctaneNode;
  cancelText?: OctaneNode;
  okType?: ButtonProps["type"] | "danger";
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  width?: number | string | Partial<Record<Breakpoint, number | string>>;
  height?: number | string;
  panelRef?: Ref<HTMLDivElement>;
  bodyProps?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  maskProps?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  wrapStyle?: CSSProperties;
  [key: `data-${string}`]: unknown;
  centered?: boolean;
  zIndex?: number;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  wrapClassName?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  maskStyle?: CSSProperties;
  classNames?: Partial<Record<ModalSemanticDOM, string>>;
  styles?: Partial<Record<ModalSemanticDOM, CSSProperties>>;
  wrapProps?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  destroyOnClose?: boolean;
  afterClose?: () => void;
  loading?: boolean;
  modalRender?: (node: OctaneNode) => OctaneNode;
  mousePosition?: { x: number; y: number } | null;
  visible?: boolean;
  transitionName?: string;
  maskTransitionName?: string;
}
export type ModalConfirmType =
  | "confirm"
  | "info"
  | "success"
  | "error"
  | "warning"
  | "warn";
// biome-ignore lint/suspicious/noExplicitAny: Ant Design passes an optional close callback and arbitrary close payloads through confirmation handlers.
export type ModalAction = (...args: any[]) => any;
export type ModalClose = (...args: unknown[]) => void;
export interface ModalFuncProps
  extends Omit<ModalProps, "onOk" | "onCancel" | "children" | "width"> {
  width?: number | string;
  content?: OctaneNode;
  icon?: OctaneNode;
  type?: ModalConfirmType;
  okCancel?: boolean;
  autoFocusButton?: "ok" | "cancel" | null;
  direction?: "ltr" | "rtl";
  onOk?: ModalAction;
  onCancel?: ModalAction;
}
export interface ModalResult {
  destroy: () => void;
  update: (
    config:
      | Partial<ModalFuncProps>
      | ((previous: ModalFuncProps) => ModalFuncProps),
  ) => void;
}
export interface HookModalResult extends ModalResult, PromiseLike<boolean> {}
export type ModalInstance = Record<
  "confirm" | "info" | "success" | "error" | "warning",
  (config: ModalFuncProps) => HookModalResult
>;
export type ModalStaticFunctions = Record<
  keyof ModalInstance,
  (config: ModalFuncProps) => ModalResult
>;
