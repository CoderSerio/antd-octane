/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { useEffect, useRef, useState } from "octane";
import { resolvePresetColor } from "../_util/colors";
import { ExclamationCircleFilled } from "../_util/feedback-icons";
import { Floating, type FloatingProps } from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
import { Button, type ButtonProps } from "../button";
import { useConfig } from "../config-provider";
export interface PopconfirmProps extends FloatingProps {
  title: OctaneNode | (() => OctaneNode);
  description?: OctaneNode | (() => OctaneNode);
  icon?: OctaneNode;
  disabled?: boolean;
  okText?: OctaneNode;
  cancelText?: OctaneNode;
  okType?: ButtonProps["type"] | "danger";
  showCancel?: boolean;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  // biome-ignore lint/suspicious/noConfusingVoidType: Confirm handlers may complete synchronously or return an async operation.
  onConfirm?: (event: MouseEvent) => void | Promise<unknown>;
  onCancel?: (event: MouseEvent) => void;
  onPopupClick?: (event: MouseEvent) => void;
}
export function Popconfirm({
  title,
  description,
  icon,
  color,
  disabled = false,
  okText,
  cancelText,
  okType = "primary",
  showCancel = true,
  okButtonProps,
  cancelButtonProps,
  onConfirm,
  onCancel,
  onPopupClick,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  overlayClassName,
  ...props
}: PopconfirmProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Popconfirm");
  const [internal, setInternal] = useState(defaultOpen);
  const [pending, setPending] = useState(false);
  const request = useRef(0);
  const busy = useRef(false);
  const alive = useRef(true);
  useEffect(
    () => () => {
      alive.current = false;
      request.current++;
    },
    [],
  );
  const open = !disabled && (controlled ?? internal);
  const change = (next: boolean, event?: Event) => {
    if (disabled || next === open) return;
    request.current++;
    busy.current = false;
    setPending(false);
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next, event);
  };
  useEffect(() => {
    if (!open) {
      request.current++;
      busy.current = false;
      setPending(false);
    }
  }, [open]);
  const confirm = (event: MouseEvent) => {
    if (busy.current) return;
    const ticket = ++request.current;
    try {
      const result = onConfirm?.(event);
      if (result && typeof result.then === "function") {
        busy.current = true;
        setPending(true);
        void Promise.resolve(result)
          .then(
            () => {
              if (alive.current && request.current === ticket)
                change(false, event);
            },
            () => {},
          )
          .finally(() => {
            if (alive.current && request.current === ticket) {
              busy.current = false;
              setPending(false);
            }
          });
      } else change(false, event);
    } catch {
      busy.current = false;
      setPending(false);
    }
  };
  const heading = typeof title === "function" ? title() : title;
  const body = typeof description === "function" ? description() : description;
  return (
    <Floating
      {...props}
      className={[config.popconfirm?.className, props.className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...config.popconfirm?.style, ...props.style }}
      classNames={{ ...config.popconfirm?.classNames, ...props.classNames }}
      styles={{
        root: { ...config.popconfirm?.styles?.root, ...props.styles?.root },
        body: { ...config.popconfirm?.styles?.body, ...props.styles?.body },
      }}
      kind="popover"
      trigger={props.trigger ?? "click"}
      open={open}
      onOpenChange={change}
      overlayClassName={["ant-popconfirm", overlayClassName]
        .filter(Boolean)
        .join(" ")}
      zIndex={props.zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 60}
      popupStyle={{
        ...base,
        "--ao-popup-bg": color
          ? resolvePresetColor(color, t)
          : t.colorBgElevated,
        "--ao-popup-color": t.colorText,
        "--ao-popup-radius": `${t.borderRadiusLG}px`,
        "--ao-popup-shadow": t.boxShadowSecondary,
        "--ao-popup-padding": `${t.paddingSM}px`,
        "--ao-confirm-icon": t.colorWarning,
        "--ao-confirm-gap": `${t.marginXS}px`,
        "--ao-confirm-weight": t.fontWeightStrong,
        "--ao-confirm-description-gap": `${t.marginXXS}px`,
        "--ao-confirm-heading": t.colorTextHeading,
      }}
      content={
        // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: Upstream onPopupClick exposes clicks anywhere within the confirm popup.
        <div className="ant-popconfirm-inner-content" onClick={onPopupClick}>
          <div className="ant-popconfirm-message">
            <span className="ant-popconfirm-message-icon" aria-hidden="true">
              {icon === undefined ? <ExclamationCircleFilled /> : icon}
            </span>
            <div>
              <div className="ant-popconfirm-title">{heading}</div>
              {body !== undefined && (
                <div className="ant-popconfirm-description">{body}</div>
              )}
            </div>
          </div>
          <div className="ant-popconfirm-buttons">
            {showCancel && (
              <Button
                size="small"
                {...cancelButtonProps}
                disabled={pending || cancelButtonProps?.disabled}
                onClick={(event) => {
                  cancelButtonProps?.onClick?.(event);
                  if (event.defaultPrevented) return;
                  onCancel?.(event);
                  change(false, event);
                }}
              >
                {cancelText ?? config.locale.Popconfirm?.cancelText ?? "Cancel"}
              </Button>
            )}
            <Button
              size="small"
              type={okType === "danger" ? "default" : okType}
              danger={okType === "danger"}
              {...okButtonProps}
              loading={pending || okButtonProps?.loading}
              onClick={(event) => {
                okButtonProps?.onClick?.(event);
                if (!event.defaultPrevented) confirm(event);
              }}
            >
              {okText ?? config.locale.Popconfirm?.okText ?? "OK"}
            </Button>
          </div>
        </div>
      }
    />
  );
}
