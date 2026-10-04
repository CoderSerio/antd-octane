// Adapted from Ant Design 5.29.3 components/modal/Modal.tsx (MIT).
import type { CSSProperties } from "octane";
import { useId } from "octane";
import { componentClassName } from "../_util/componentClassName";
import { DialogLayer } from "../_util/dialog";
import { CloseOutlined } from "../_util/feedback-icons";
import { useClosable } from "../_util/hooks/useClosable";
import { useZIndex } from "../_util/hooks/useZIndex";
import { breakpoints, useBreakpoint } from "../_util/responsive";
import { devUseWarning } from "../_util/warning";
import ZIndexContext from "../_util/zindexContext";
import { useConfig } from "../config-provider";
import { Skeleton } from "../skeleton";
import type { ModalProps } from "./interface";
import ModalPanel from "./ModalPanel";
import { getClickPosition } from "./mousePosition";
import { Footer, renderCloseIcon } from "./shared";
import { useModalStyle } from "./useModalStyle";

export default function Modal(props: ModalProps) {
  const {
    open,
    visible,
    title,
    footer,
    closable,
    closeIcon,
    onCancel,
    onOk,
    confirmLoading,
    width = 520,
    height,
    centered,
    zIndex: customZIndex,
    prefixCls: customPrefix,
    className,
    rootClassName,
    wrapClassName,
    style,
    bodyStyle,
    bodyProps,
    maskStyle,
    maskProps,
    styles,
    classNames,
    wrapProps,
    wrapStyle,
    destroyOnClose,
    destroyOnHidden,
    afterClose,
    afterOpenChange,
    children,
    loading,
    modalRender,
    mousePosition,
    transitionName,
    maskTransitionName,
    getContainer,
    panelRef,
  } = props;
  const warning = devUseWarning("Modal");
  for (const [oldProp, newProp] of [
    ["visible", "open"],
    ["bodyStyle", "styles.body"],
    ["maskStyle", "styles.mask"],
    ["destroyOnClose", "destroyOnHidden"],
  ]) {
    warning.deprecated(!(oldProp in props), oldProp, newProp);
  }
  const config = useConfig();
  const prefixCls = config.getPrefixCls("modal", customPrefix);
  const cls = (suffix = "") =>
    componentClassName("ant-modal", prefixCls, suffix);
  const defaultTransition = `${config.getPrefixCls()}-zoom`;
  const defaultMaskTransition = `${config.getPrefixCls()}-fade`;
  const handleCancel = (event: MouseEvent | KeyboardEvent) => {
    if (!confirmLoading) onCancel?.(event);
  };
  const [zIndex, contextZIndex] = useZIndex("Modal", customZIndex);
  const { token, style: tokenStyle, hashId } = useModalStyle(zIndex, prefixCls);
  const id = useId();
  const [mergedClosable, mergedCloseIcon, disabled, closeAttrs] = useClosable(
    { closable, closeIcon },
    config.modal,
    {
      closable: true,
      closeIcon: (
        <CloseOutlined aria-label="close" className={cls("-close-icon")} />
      ),
      closeIconRender: (icon) => renderCloseIcon(prefixCls, icon),
    },
  );
  const mergedStyles = { ...config.modal?.styles, ...styles };
  // Upstream overrides the Provider wrapper class with the authored wrapper classes.
  const mergedClasses = { ...config.modal?.classNames, ...classNames };
  const panelStyle: CSSProperties = { ...config.modal?.style, ...style };
  const screens = useBreakpoint(typeof width === "object", token);
  if (width && typeof width === "object") {
    let responsiveWidth = width.xs;
    for (const breakpoint of breakpoints) {
      const value = width[breakpoint];
      if ((breakpoint === "xs" || screens[breakpoint]) && value !== undefined)
        responsiveWidth = value;
      if (value !== undefined)
        Object.assign(panelStyle, {
          [`--${prefixCls}-${breakpoint}-width`]:
            typeof value === "number" ? `${value}px` : value,
        });
    }
    if (panelStyle.width === undefined)
      panelStyle.width = responsiveWidth ?? "auto";
  } else panelStyle.width = width;
  if (height !== undefined) panelStyle.height = height;
  const content = (
    <ModalPanel
      prefixCls={prefixCls}
      ariaId={id}
      title={title}
      onCancel={handleCancel}
      closable={mergedClosable}
      closeIcon={mergedCloseIcon}
      disabled={disabled}
      closeAttrs={closeAttrs}
      bodyStyle={bodyStyle}
      bodyProps={bodyProps}
      styles={mergedStyles}
      classNames={mergedClasses}
      footer={
        footer !== null && !loading ? (
          <Footer {...props} onOk={onOk} onCancel={handleCancel} />
        ) : null
      }
    >
      {loading ? (
        <Skeleton
          active
          title={false}
          paragraph={{ rows: 4 }}
          className={cls("-body-skeleton")}
        />
      ) : (
        children
      )}
    </ModalPanel>
  );
  const dataProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => key.startsWith("data-")),
  );
  return (
    <ZIndexContext value={contextZIndex}>
      <DialogLayer
        layerZIndex={contextZIndex}
        open={open ?? visible ?? false}
        onClose={handleCancel}
        motionName={transitionName ?? defaultTransition}
        maskMotionName={maskTransitionName ?? defaultMaskTransition}
        nativeMotion={
          transitionName === undefined || transitionName === defaultTransition
        }
        nativeMaskMotion={
          maskTransitionName === undefined ||
          maskTransitionName === defaultMaskTransition
        }
        motion={token.motion}
        mousePosition={mousePosition ?? getClickPosition()}
        destroyOnHidden={destroyOnHidden ?? destroyOnClose}
        titleId={title ? id : undefined}
        forceRender={props.forceRender}
        mask={props.mask}
        maskClosable={props.maskClosable}
        keyboard={props.keyboard}
        focusTriggerAfterClose={props.focusTriggerAfterClose}
        getContainer={
          getContainer === undefined
            ? (config.getPopupContainer as (() => HTMLElement) | undefined)
            : getContainer
        }
        panelRef={panelRef}
        panelSelector={`.${prefixCls}-${modalRender ? "render" : "content"}`}
        rootProps={dataProps}
        className={[cls("-root"), hashId, rootClassName]
          .filter(Boolean)
          .join(" ")}
        wrapClassName={[
          cls("-wrap"),
          (centered ?? config.modal?.centered) && cls("-centered"),
          config.direction === "rtl" && cls("-wrap-rtl"),
          wrapClassName,
          classNames?.wrapper,
        ]
          .filter(Boolean)
          .join(" ")}
        wrapStyle={{ ...wrapStyle, ...mergedStyles.wrapper }}
        wrapProps={wrapProps}
        maskClassName={[cls("-mask"), mergedClasses.mask]
          .filter(Boolean)
          .join(" ")}
        maskStyle={{ ...maskStyle, ...mergedStyles.mask }}
        maskProps={maskProps}
        panelClassName={[cls(), hashId, className, config.modal?.className]
          .filter(Boolean)
          .join(" ")}
        style={tokenStyle}
        panelStyle={panelStyle}
        afterOpenChange={(next) => {
          if (!next) afterClose?.();
          afterOpenChange?.(next);
        }}
      >
        {modalRender ? (
          <div className={cls("-render")}>{modalRender(content)}</div>
        ) : (
          content
        )}
      </DialogLayer>
    </ZIndexContext>
  );
}
