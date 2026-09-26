import type { CSSProperties, OctaneNode } from "octane";
import { useId } from "octane";
import { DialogLayer, type DialogLayerProps } from "../_util/dialog";
import { useComponentTokens } from "../_util/tokens";
export interface DrawerProps
  extends Pick<
    DialogLayerProps,
    | "open"
    | "mask"
    | "maskClosable"
    | "keyboard"
    | "autoFocus"
    | "destroyOnHidden"
    | "forceRender"
    | "getContainer"
    | "afterOpenChange"
  > {
  children?: OctaneNode;
  title?: OctaneNode;
  footer?: OctaneNode;
  extra?: OctaneNode;
  closable?: boolean;
  closeIcon?: OctaneNode;
  onClose?: (event: MouseEvent | KeyboardEvent) => void;
  placement?: "top" | "right" | "bottom" | "left";
  width?: number | string;
  height?: number | string;
  size?: "default" | "large";
  zIndex?: number;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  rootStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  destroyOnClose?: boolean;
}
export function Drawer({
  open = false,
  title,
  footer,
  extra,
  closable = true,
  closeIcon,
  onClose,
  placement = "right",
  width,
  height,
  size = "default",
  zIndex,
  className,
  rootClassName,
  style,
  rootStyle,
  bodyStyle,
  destroyOnClose,
  destroyOnHidden,
  children,
  ...rest
}: DrawerProps) {
  const { token: t, component: c, base } = useComponentTokens("Drawer");
  const id = useId();
  const vertical = placement === "top" || placement === "bottom";
  return (
    <DialogLayer
      {...rest}
      open={open}
      onClose={onClose}
      destroyOnHidden={destroyOnHidden ?? destroyOnClose}
      titleId={title !== undefined && title !== null ? id : undefined}
      className={["ant-drawer", `ant-drawer-${placement}`, rootClassName]
        .filter(Boolean)
        .join(" ")}
      panelClassName={["ant-drawer-content-wrapper", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...base,
        "--ao-dialog-z": zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase,
        "--ao-dialog-mask": t.colorBgMask,
        "--ao-dialog-shadow": t.boxShadow,
        "--ao-dialog-bg": t.colorBgElevated,
        "--ao-drawer-padding": `${t.paddingLG}px`,
        "--ao-drawer-title-size": `${t.fontSizeLG}px`,
        "--ao-drawer-title-line": t.lineHeightLG,
        "--ao-drawer-footer-padding": `${c?.footerPaddingBlock ?? t.paddingXS}px ${c?.footerPaddingInline ?? t.padding}px`,
        ...rootStyle,
      }}
      panelStyle={{
        ...(vertical
          ? { height: height ?? (size === "large" ? 736 : 378) }
          : { width: width ?? (size === "large" ? 736 : 378) }),
        ...style,
      }}
    >
      <div className="ant-drawer-content">
        {(closable || title !== undefined || extra !== undefined) && (
          <div className="ant-drawer-header">
            <div className="ant-drawer-header-title">
              {closable && closeIcon !== null && closeIcon !== false && (
                <button
                  type="button"
                  className="ao-dialog-close ant-drawer-close"
                  aria-label="关闭抽屉"
                  onClick={onClose}
                >
                  {closeIcon ?? "×"}
                </button>
              )}
              {title !== undefined && title !== null && (
                <div id={id} className="ant-drawer-title">
                  {title}
                </div>
              )}
            </div>
            {extra !== undefined && (
              <div className="ant-drawer-extra">{extra}</div>
            )}
          </div>
        )}
        <div className="ant-drawer-body" style={bodyStyle}>
          {children}
        </div>
        {footer !== undefined && footer !== null && (
          <div className="ant-drawer-footer">{footer}</div>
        )}
      </div>
    </DialogLayer>
  );
}
