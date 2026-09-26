import type { CSSProperties, OctaneNode } from "octane";
import { useId } from "octane";
import { DialogLayer, type DialogLayerProps } from "../_util/dialog";
import { useComponentTokens } from "../_util/tokens";
import { Button, type ButtonProps } from "../button";
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
  footer?: OctaneNode;
  closable?: boolean;
  closeIcon?: OctaneNode;
  onCancel?: (event: MouseEvent | KeyboardEvent) => void;
  onOk?: (event: MouseEvent) => void;
  confirmLoading?: boolean;
  okText?: OctaneNode;
  cancelText?: OctaneNode;
  okType?: ButtonProps["type"];
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  width?: number | string;
  centered?: boolean;
  zIndex?: number;
  className?: string;
  wrapClassName?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  destroyOnClose?: boolean;
  afterClose?: () => void;
}
export function Modal({
  open = false,
  title,
  footer,
  closable = true,
  closeIcon,
  onCancel,
  onOk,
  confirmLoading = false,
  okText = "确定",
  cancelText = "取消",
  okType = "primary",
  okButtonProps,
  cancelButtonProps,
  width = 520,
  centered = false,
  zIndex,
  className,
  wrapClassName,
  style,
  bodyStyle,
  destroyOnClose,
  destroyOnHidden,
  afterClose,
  afterOpenChange,
  children,
  ...rest
}: ModalProps) {
  const { token: t, component: c, base } = useComponentTokens("Modal");
  const id = useId();
  return (
    <DialogLayer
      {...rest}
      open={open}
      onClose={onCancel}
      destroyOnHidden={destroyOnHidden ?? destroyOnClose}
      titleId={title !== undefined && title !== null ? id : undefined}
      className={[
        "ant-modal-root",
        centered && "ant-modal-centered",
        wrapClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      panelClassName={["ant-modal", className].filter(Boolean).join(" ")}
      style={{
        ...base,
        "--ao-dialog-z": zIndex ?? t.zIndexPopupBase,
        "--ao-dialog-mask": t.colorBgMask,
        "--ao-dialog-shadow": t.boxShadow,
        "--ao-dialog-bg": c?.contentBg ?? t.colorBgElevated,
        "--ao-dialog-radius": `${t.borderRadiusLG}px`,
        "--ao-dialog-padding": `${t.paddingMD}px ${t.paddingContentHorizontalLG}px`,
        "--ao-dialog-title-size": `${c?.titleFontSize ?? t.fontSizeHeading5}px`,
        "--ao-dialog-title-line": c?.titleLineHeight ?? t.lineHeightHeading5,
        "--ao-dialog-title": c?.titleColor ?? t.colorTextHeading,
        "--ao-dialog-header": c?.headerBg ?? t.colorBgElevated,
        "--ao-dialog-footer": c?.footerBg ?? "transparent",
        "--ao-dialog-gap": `${t.marginXS}px`,
      }}
      panelStyle={{ width, ...style }}
      afterOpenChange={(next) => {
        afterOpenChange?.(next);
        if (!next) afterClose?.();
      }}
    >
      <div className="ant-modal-content">
        {closable && closeIcon !== null && closeIcon !== false && (
          <button
            type="button"
            className="ao-dialog-close ant-modal-close"
            aria-label="关闭对话框"
            onClick={onCancel}
          >
            {closeIcon ?? "×"}
          </button>
        )}
        {title !== undefined && title !== null && (
          <div className="ant-modal-header">
            <div id={id} className="ant-modal-title">
              {title}
            </div>
          </div>
        )}
        <div className="ant-modal-body" style={bodyStyle}>
          {children}
        </div>
        {footer !== null && (
          <div className="ant-modal-footer">
            {footer !== undefined ? (
              footer
            ) : (
              <>
                <Button
                  {...cancelButtonProps}
                  onClick={(event) => {
                    cancelButtonProps?.onClick?.(event);
                    if (!event.defaultPrevented) onCancel?.(event);
                  }}
                >
                  {cancelText}
                </Button>
                <Button
                  type={okType}
                  loading={confirmLoading}
                  {...okButtonProps}
                  onClick={(event) => {
                    okButtonProps?.onClick?.(event);
                    if (!event.defaultPrevented) onOk?.(event);
                  }}
                >
                  {okText}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </DialogLayer>
  );
}
