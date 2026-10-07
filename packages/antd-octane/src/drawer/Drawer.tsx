/** @jsxImportSource octane */
import type { AriaAttributes, CSSProperties, OctaneNode, Ref } from "octane";
import { useContext, useEffect, useId, useMemo, useState } from "octane";
import { componentClassName } from "../_util/componentClassName";
import { DialogLayer, type DialogLayerProps } from "../_util/dialog";
import { useZIndex } from "../_util/hooks/useZIndex";
import warning, { devUseWarning } from "../_util/warning";
import ZIndexContext from "../_util/zindexContext";
import { useConfig } from "../config-provider";
import { DrawerContext } from "./context";
import {
  DrawerPanel,
  type DrawerPanelProps,
  type DrawerSemanticDOM,
} from "./DrawerPanel";
import { useDrawerStyle } from "./useDrawerStyle";

export interface DrawerProps
  extends AriaAttributes,
    Omit<DrawerPanelProps, "prefixCls" | "ariaId">,
    Pick<
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
  prefixCls?: string;
  push?: boolean | { distance?: number | string };
  drawerRender?: (node: OctaneNode) => OctaneNode;
  placement?: "top" | "right" | "bottom" | "left";
  width?: number | string;
  height?: number | string;
  size?: "default" | "large";
  zIndex?: number;
  id?: string;
  panelRef?: Ref<HTMLDivElement>;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseOver?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onClick?: (event: MouseEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  rootStyle?: CSSProperties;
  maskClassName?: string;
  /** @deprecated Use `open` instead. */
  visible?: boolean;
  /** @deprecated Use `afterOpenChange` instead. */
  afterVisibleChange?: (open: boolean) => void;
  /** @deprecated Use `styles.content` instead. */
  drawerStyle?: CSSProperties;
  /** @deprecated Use `styles.wrapper` instead. */
  contentWrapperStyle?: CSSProperties;
  /** @deprecated Use `styles.mask` instead. */
  maskStyle?: CSSProperties;
  /** @deprecated Use `destroyOnHidden` instead. */
  destroyOnClose?: boolean;
}

const defaultPushState = { distance: 180 };
function parseWidthHeight(value: string | number) {
  if (typeof value === "string" && String(Number(value)) === value) {
    warning(
      false,
      "Drawer",
      "Invalid value type of `width` or `height` which should be number type instead.",
    );
    return Number(value);
  }
  return value;
}
export function Drawer(props: DrawerProps) {
  const {
    prefixCls: customPrefix,
    push = defaultPushState,
    drawerRender,
    styles,
    classNames,
    open: customOpen,
    visible,
    afterOpenChange,
    afterVisibleChange,
    drawerStyle,
    getContainer: customGetContainer,
    title,
    width,
    height,
    size = "default",
    placement = "right",
    zIndex: customZIndex,
    className,
    rootClassName,
    style,
    rootStyle,
    destroyOnClose,
    destroyOnHidden,
    children,
    panelRef,
    id,
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
    contentWrapperStyle,
    maskStyle,
    maskClassName,
    mask = true,
    onClose,
    ...rest
  } = props;
  const open = customOpen ?? visible ?? false;
  const config = useConfig();
  const prefixCls = config.getPrefixCls("drawer", customPrefix);
  const cls = (suffix = "") =>
    componentClassName("ant-drawer", prefixCls, suffix);
  const getPopupContainer = config.getPopupContainer;
  const getContainer = useMemo(
    () =>
      customGetContainer === undefined && getPopupContainer
        ? () => getPopupContainer(document.body)
        : customGetContainer,
    [customGetContainer, getPopupContainer],
  );
  const warning = devUseWarning("Drawer");
  for (const [oldProp, newProp] of [
    ["visible", "open"],
    ["afterVisibleChange", "afterOpenChange"],
    ["headerStyle", "styles.header"],
    ["bodyStyle", "styles.body"],
    ["footerStyle", "styles.footer"],
    ["contentWrapperStyle", "styles.wrapper"],
    ["maskStyle", "styles.mask"],
    ["drawerStyle", "styles.content"],
    ["destroyInactivePanel", "destroyOnHidden"],
  ])
    warning.deprecated(!(oldProp in props), oldProp, newProp);
  warning(
    !(getContainer !== undefined && style?.position === "absolute"),
    "breaking",
    "`style` is replaced by `rootStyle` in v5. Please check that `position: absolute` is necessary.",
  );
  const parent = useContext(DrawerContext);
  const [pushed, setPushed] = useState(false);
  const pushConfig =
    typeof push === "boolean" ? (push ? {} : { distance: 0 }) : push;
  const pushDistance = pushConfig.distance ?? parent?.pushDistance ?? 180;
  const context = useMemo(
    () => ({
      pushDistance,
      push: () => setPushed(true),
      pull: () => setPushed(false),
    }),
    [pushDistance],
  );
  useEffect(() => {
    if (open) parent?.push();
    else parent?.pull();
  }, [open, parent]);
  useEffect(() => () => parent?.pull(), [parent]);
  const drawerStyleTokens = useDrawerStyle(placement, customZIndex);
  const [zIndex, contextZIndex] = useZIndex("Drawer", customZIndex);
  const translation =
    !pushed || !pushDistance
      ? undefined
      : placement === "left"
        ? `translateX(${pushDistance}px)`
        : placement === "right"
          ? `translateX(${-Number(pushDistance)}px)`
          : placement === "top"
            ? `translateY(${pushDistance}px)`
            : `translateY(${-Number(pushDistance)}px)`;
  const ariaId = useId();
  const attrs = Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("aria-")),
  );
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-")),
  );
  const mergedClass = (part: DrawerSemanticDOM) =>
    [classNames?.[part], config.drawer?.classNames?.[part]]
      .filter(Boolean)
      .join(" ");
  const content = (
    // biome-ignore lint/a11y/useKeyWithMouseEvents: These are consumer-provided panel event callbacks, matching DrawerPanelEvents.
    <div
      id={id}
      ref={panelRef}
      className={[
        cls("-content"),
        config.drawer?.className,
        className,
        mergedClass("content"),
      ]}
      role="dialog"
      {...attrs}
      aria-modal="true"
      aria-labelledby={props["aria-labelledby"] ?? (title ? ariaId : undefined)}
      style={{
        ...config.drawer?.style,
        ...style,
        ...styles?.content,
        ...drawerStyle,
        ...config.drawer?.styles?.content,
      }}
      onMouseEnter={onMouseEnter}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    >
      <DrawerPanel
        {...props}
        prefixCls={prefixCls}
        ariaId={title ? ariaId : undefined}
      >
        {children}
      </DrawerPanel>
    </div>
  );
  return (
    <DrawerContext value={context}>
      <ZIndexContext value={contextZIndex}>
        <DialogLayer
          mode="drawer"
          layerZIndex={contextZIndex}
          {...rest}
          open={open}
          mask={mask}
          initialFocus="root"
          getContainer={getContainer}
          afterOpenChange={afterOpenChange ?? afterVisibleChange}
          onClose={onClose}
          motionName={`${prefixCls}-panel-motion-${placement}`}
          maskMotionName={`${prefixCls}-mask-motion`}
          motion={drawerStyleTokens.motion}
          motionDeadline={500}
          destroyOnHidden={destroyOnHidden ?? destroyOnClose}
          className={[
            cls(),
            cls(`-${placement}`),
            open && cls("-open"),
            getContainer === false && cls("-inline"),
            !mask && "no-mask",
            rootClassName,
            config.direction === "rtl" && cls("-rtl"),
          ]
            .filter(Boolean)
            .join(" ")}
          panelClassName={[cls("-content-wrapper"), mergedClass("wrapper")]
            .filter(Boolean)
            .join(" ")}
          hiddenPanelClassName={cls("-content-wrapper-hidden")}
          panelProps={dataAttrs}
          maskClassName={[cls("-mask"), mergedClass("mask"), maskClassName]
            .filter(Boolean)
            .join(" ")}
          maskStyle={{
            ...styles?.mask,
            ...maskStyle,
            ...config.drawer?.styles?.mask,
          }}
          style={{
            ...drawerStyleTokens.style,
            "--ao-dialog-z": zIndex || drawerStyleTokens.style["--ao-dialog-z"],
            ...rootStyle,
            ...(zIndex ? { zIndex } : {}),
          }}
          panelStyle={{
            ...(placement === "top" || placement === "bottom"
              ? {
                  height: parseWidthHeight(
                    height ?? (size === "large" ? 736 : 378),
                  ),
                }
              : {
                  width: parseWidthHeight(
                    width ?? (size === "large" ? 736 : 378),
                  ),
                }),
            transform: translation,
            ...styles?.wrapper,
            ...contentWrapperStyle,
            ...config.drawer?.styles?.wrapper,
          }}
        >
          {drawerRender ? drawerRender(content) : content}
        </DialogLayer>
      </ZIndexContext>
    </DrawerContext>
  );
}
