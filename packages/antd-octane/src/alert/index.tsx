import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import { useEffect, useImperativeHandle, useRef, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface AlertRef {
  nativeElement: HTMLDivElement | null;
}
export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onClose" | "ref"> {
  ref?: Ref<AlertRef>;
  message?: OctaneNode;
  description?: OctaneNode;
  type?: "success" | "info" | "warning" | "error";
  banner?: boolean;
  showIcon?: boolean;
  icon?: OctaneNode;
  closable?: boolean;
  closeIcon?: OctaneNode;
  onClose?: (event: MouseEvent) => void;
  afterClose?: () => void;
  action?: OctaneNode;
  style?: CSSProperties;
}
export function Alert({
  ref,
  message,
  description,
  type: kind,
  banner = false,
  showIcon,
  icon,
  closable = false,
  closeIcon,
  onClose,
  afterClose,
  action,
  className,
  style,
  ...rest
}: AlertProps) {
  const element = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(
    ref,
    () => ({
      get nativeElement() {
        return element.current;
      },
    }),
    [],
  );
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    if (closed) afterClose?.();
  }, [closed]);
  const { token: t, base } = useComponentTokens("Alert");
  const c = useConfig().theme.components?.Alert;
  const type = kind ?? (banner ? "warning" : "info");
  const status = {
    success: "Success",
    info: "Info",
    warning: "Warning",
    error: "Error",
  }[type];
  const colors = t as unknown as Record<string, string>;
  if (closed) return null;
  return (
    <div
      ref={element}
      role="alert"
      {...rest}
      className={[
        "ant-alert",
        Boolean(description) && "ant-alert-with-description",
        banner && "ant-alert-banner",
        className,
      ]}
      style={{
        ...base,
        "--ao-alert-bg": colors[`color${status}Bg`],
        "--ao-alert-border": colors[`color${status}Border`],
        "--ao-alert-icon": colors[`color${status}`],
        "--ao-alert-padding": description
          ? (c?.withDescriptionPadding ??
            `${t.paddingMD}px ${t.paddingContentHorizontalLG}px`)
          : (c?.defaultPadding ?? `${t.paddingContentVerticalSM}px 12px`),
        "--ao-alert-icon-size": `${description ? (c?.withDescriptionIconSize ?? t.fontSizeHeading3) : t.fontSize}px`,
        "--ao-alert-message-gap": `${t.marginXS}px`,
        "--ao-alert-icon-gap": `${t.marginSM}px`,
        "--ao-alert-heading": `${description ? t.fontSizeLG : t.fontSize}px`,
        "--ao-alert-radius": `${t.borderRadiusLG}px`,
        ...style,
      }}
    >
      {(showIcon ?? banner) && (
        <span className="ant-alert-icon" aria-hidden="true">
          {icon ?? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              {type === "success" ? (
                <path
                  d="m7 12 3 3 7-7"
                  fill="none"
                  stroke={t.colorBgContainer}
                  strokeWidth="2"
                />
              ) : type === "error" ? (
                <path
                  d="m8 8 8 8m0-8-8 8"
                  stroke={t.colorBgContainer}
                  strokeWidth="2"
                />
              ) : (
                <path
                  d="M12 6v8m0 2v2"
                  stroke={t.colorBgContainer}
                  strokeWidth="2"
                />
              )}
            </svg>
          )}
        </span>
      )}
      <div className="ant-alert-content">
        <div className="ant-alert-message">{message}</div>
        {description && (
          <div className="ant-alert-description">{description}</div>
        )}
      </div>
      {action && <div className="ant-alert-action">{action}</div>}
      {closable && (
        <button
          type="button"
          className="ant-alert-close-icon"
          aria-label="关闭提示"
          onClick={(event) => {
            setClosed(true);
            onClose?.(event);
          }}
        >
          {closeIcon ?? "×"}
        </button>
      )}
    </div>
  );
}
