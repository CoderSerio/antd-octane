/** @jsxImportSource octane */
import type { AriaAttributes, CSSProperties, OctaneNode } from "octane";
import type { ClosableType } from "../_util/closable";
import { componentClassName } from "../_util/componentClassName";
import { CloseOutlined } from "../_util/feedback-icons";
import { useConfig } from "../config-provider";
import { Skeleton } from "../skeleton";

export type DrawerSemanticDOM =
  | "header"
  | "body"
  | "footer"
  | "mask"
  | "wrapper"
  | "content";
export type DrawerClassNames = Partial<Record<DrawerSemanticDOM, string>>;
export type DrawerStyles = Partial<Record<DrawerSemanticDOM, CSSProperties>>;
export type DrawerClosable =
  | boolean
  | (Extract<ClosableType, object> & { placement?: "start" | "end" });

export interface DrawerPanelProps {
  prefixCls: string;
  ariaId?: string;
  title?: OctaneNode;
  footer?: OctaneNode;
  extra?: OctaneNode;
  closable?: DrawerClosable;
  closeIcon?: OctaneNode;
  onClose?: (event: MouseEvent | KeyboardEvent) => void;
  children?: OctaneNode;
  classNames?: DrawerClassNames;
  styles?: DrawerStyles;
  loading?: boolean;
  headerStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  footerStyle?: CSSProperties;
}

// Mirror useClosable's props > Provider > fallback merge, skipping undefined values.
function closeConfig(closable?: ClosableType, closeIcon?: OctaneNode) {
  if (
    !closable &&
    (closable === false || closeIcon === false || closeIcon === null)
  )
    return false;
  if (closable === undefined && closeIcon === undefined) return null;
  return {
    closeIcon:
      typeof closeIcon !== "boolean" && closeIcon !== null
        ? closeIcon
        : undefined,
    ...(typeof closable === "object" ? closable : {}),
  };
}

export function DrawerPanel(props: DrawerPanelProps) {
  const {
    prefixCls,
    ariaId,
    title,
    footer,
    extra,
    closable,
    closeIcon,
    onClose,
    children,
    classNames,
    styles,
    loading,
    headerStyle,
    bodyStyle,
    footerStyle,
  } = props;
  const config = useConfig();
  const context = config.drawer;
  const propClose = closeConfig(closable, closeIcon);
  const contextClose = closeConfig(context?.closable, context?.closeIcon);
  const enabled =
    propClose === false ? false : propClose ? true : contextClose !== false;
  const mergedClose: Record<string, unknown> = {
    closeIcon: <CloseOutlined aria-label="close" />,
  };
  for (const source of [contextClose, propClose]) {
    if (source)
      for (const [key, value] of Object.entries(source))
        if (value !== undefined) mergedClose[key] = value;
  }
  const closeAttrs = Object.fromEntries(
    Object.entries(mergedClose).filter(
      ([key]) => key.startsWith("aria-") || key.startsWith("data-"),
    ),
  ) as AriaAttributes;
  const placement =
    closable === false
      ? undefined
      : typeof closable === "object" && closable.placement === "end"
        ? "end"
        : "start";
  const cls = (suffix: string) =>
    componentClassName("ant-drawer", prefixCls, suffix);
  const closeButton = enabled &&
    mergedClose.closeIcon !== null &&
    mergedClose.closeIcon !== undefined && (
      <button
        type="button"
        className={[cls("-close"), placement === "end" && cls("-close-end")]}
        aria-label={config.locale.global?.close ?? "Close"}
        {...closeAttrs}
        disabled={!!propClose && !!propClose.disabled}
        onClick={onClose}
      >
        {mergedClose.closeIcon as OctaneNode}
      </button>
    );
  return (
    <>
      {!!(title || enabled) && (
        <div
          className={[
            cls("-header"),
            enabled && !title && !extra && cls("-header-close-only"),
            context?.classNames?.header,
            classNames?.header,
          ]}
          style={{
            ...context?.styles?.header,
            ...headerStyle,
            ...styles?.header,
          }}
        >
          <div className={cls("-header-title")}>
            {placement === "start" && closeButton}
            {title && (
              <div id={ariaId} className={cls("-title")}>
                {title}
              </div>
            )}
          </div>
          {extra && <div className={cls("-extra")}>{extra}</div>}
          {placement === "end" && closeButton}
        </div>
      )}
      <div
        className={[cls("-body"), classNames?.body, context?.classNames?.body]}
        style={{ ...context?.styles?.body, ...bodyStyle, ...styles?.body }}
      >
        {loading ? (
          <Skeleton
            active
            title={false}
            paragraph={{ rows: 5 }}
            className={cls("-body-skeleton")}
          />
        ) : (
          children
        )}
      </div>
      {!!footer && (
        <div
          className={[
            cls("-footer"),
            context?.classNames?.footer,
            classNames?.footer,
          ]}
          style={{
            ...context?.styles?.footer,
            ...footerStyle,
            ...styles?.footer,
          }}
        >
          {footer}
        </div>
      )}
    </>
  );
}
