/** @jsxImportSource octane */
import { FastColor } from "@ant-design/fast-color";
import { createPortal, useId, useLayoutEffect, useRef, useState } from "octane";
import { positionPopup } from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import useScrollLocker from "./hooks/useScrollLocker";
import useTarget from "./hooks/useTarget";
import type { TourPlacement, TourProps, TourStepProps } from "./interface";
import Mask from "./Mask";
import TourPanel from "./panelRender";
import { getAlign, getArrowToken, resolveClosable } from "./utils";

export type {
  TourAlign,
  TourButtonProps,
  TourClosable,
  TourMask,
  TourPlacement,
  TourProps,
  TourStepProps,
} from "./interface";

const DEFAULT_SCROLL_INTO_VIEW = { block: "center", inline: "center" } as const;
interface TourPosition
  extends Omit<ReturnType<typeof positionPopup>, "placement"> {
  placement: TourPlacement;
  right?: number;
  bottom?: number;
}

// The component, mask, target hook and panel follow Ant Design 5.29.3 and
// @rc-component/tour 1.15.1. All rendering and state remain Octane-native.
export function Tour({
  steps = [],
  open: controlledOpen,
  defaultOpen = true,
  current: controlledCurrent,
  defaultCurrent = 0,
  onChange,
  onClose,
  onFinish,
  placement,
  type = "default",
  mask = true,
  arrow = true,
  closable,
  closeIcon,
  gap,
  scrollIntoViewOptions = DEFAULT_SCROLL_INTO_VIEW,
  indicatorsRender,
  actionsRender,
  zIndex,
  getPopupContainer,
  disabledInteraction = false,
  prefixCls: customizePrefixCls,
  className,
  rootClassName,
  style,
  onPopupAlign,
}: TourProps) {
  const config = useConfig();
  const prefixCls = config.getPrefixCls("tour", customizePrefixCls);
  const { token: t, component: c, base } = useComponentTokens("Tour");
  const [innerOpen, setOpen] = useState(defaultOpen);
  const [innerCurrent, setCurrent] = useState(defaultCurrent);
  const current = controlledCurrent ?? innerCurrent;
  const step = steps[current];
  const open = (controlledOpen ?? innerOpen) && !!step;
  const wasOpen = useRef(open);
  const panel = useRef<HTMLDivElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<TourPosition | null>(null);
  const alignCallback = useRef(onPopupAlign);
  alignCallback.current = onPopupAlign;

  // A reopened uncontrolled tour starts from the first step without emitting
  // onChange; a controlled current still belongs to the caller.
  useLayoutEffect(() => {
    if (open && !wasOpen.current) setCurrent(0);
    wasOpen.current = open;
  }, [open]);

  const { targetElement, targetRect } = useTarget(
    step?.target,
    open,
    gap,
    step?.scrollIntoViewOptions ?? scrollIntoViewOptions,
  );
  useScrollLocker(open);
  useLayoutEffect(() => {
    if (!open || targetElement === undefined) return;
    setHost(
      getPopupContainer?.(targetElement ?? document.body) ?? document.body,
    );
  }, [open, targetElement, getPopupContainer]);

  const stepArrow = step?.arrow ?? arrow;
  const showArrow = !!targetElement && stepArrow !== false;
  // rc-tour sends false for a boolean arrow. Only an object with an omitted
  // pointAtCenter reaches Ant Design's builtinPlacements true fallback.
  const pointAtCenter =
    typeof stepArrow === "object" ? (stepArrow.pointAtCenter ?? true) : false;
  const currentPlacement =
    step?.placement ??
    placement ??
    (targetElement === null ? "center" : "bottom");
  const arrowOffsetHorizontal = t.borderRadius > 12 ? t.borderRadius + 2 : 12;
  const styleArrowOffset = t.borderRadiusLG > 12 ? t.borderRadiusLG + 2 : 12;

  useLayoutEffect(() => {
    if (!open || !host || targetElement === undefined) return;
    let frame = 0;
    const read = () => {
      const element = popup.current;
      if (!element || !panel.current) return;
      // rc-trigger measures the natural popup and its opposite inset before
      // alignment. Measuring an already constrained fit-content popup would
      // change its wrapping and cause the next alignment to use the wrong size.
      const origin = {
        left: element.style.left,
        top: element.style.top,
        right: element.style.right,
        bottom: element.style.bottom,
        overflow: element.style.overflow,
      };
      Object.assign(element.style, {
        left: "0px",
        top: "0px",
        right: "auto",
        bottom: "auto",
        overflow: "hidden",
      });
      const bounds = element.getBoundingClientRect();
      Object.assign(element.style, {
        left: "auto",
        top: "auto",
        right: "0px",
        bottom: "0px",
      });
      const mirror = element.getBoundingClientRect();
      Object.assign(element.style, origin);
      const viewport = {
        width: document.documentElement.clientWidth || window.innerWidth,
        height: document.documentElement.clientHeight || window.innerHeight,
      };
      // rc-tour uses a one-pixel fixed placeholder at 50%/50% when target=null.
      // Explicit placement still aligns to that placeholder before falling back
      // to center. Center placement also centers over an existing target.
      const anchor = targetRect ?? {
        left: viewport.width / 2,
        top: viewport.height / 2,
        width: 1,
        height: 1,
      };
      const next: TourPosition =
        currentPlacement !== "center"
          ? positionPopup(
              anchor,
              { width: bounds.width, height: bounds.height },
              viewport,
              currentPlacement,
              true,
              t.marginXXS + t.sizePopupArrow / 2,
              {
                pointAtCenter,
                arrowOffsetHorizontal,
                arrowWidth: t.sizePopupArrow,
              },
            )
          : {
              x: anchor.left + (anchor.width - bounds.width) / 2,
              y: anchor.top + (anchor.height - bounds.height) / 2,
              side: "center",
              placement: "center",
              arrowX: 0,
              arrowY: 0,
              align: {},
            };
      // Corner placements disable autoArrow in Ant Design. Their arrow uses
      // the static CSS inset rather than the center alignment calculation.
      if (next.placement.endsWith("Left"))
        next.arrowX = styleArrowOffset + t.sizePopupArrow / 2;
      else if (next.placement.endsWith("Right"))
        next.arrowX = bounds.width - styleArrowOffset - t.sizePopupArrow / 2;
      else if (next.placement.endsWith("Top"))
        next.arrowY = 8 + t.sizePopupArrow / 2;
      else if (next.placement.endsWith("Bottom"))
        next.arrowY = bounds.height - 8 - t.sizePopupArrow / 2;
      if (next.align.dynamicInset && next.align.points?.[0]?.[1] === "r")
        next.right = Math.floor(mirror.right - next.x - bounds.width);
      if (next.align.dynamicInset && next.align.points?.[0]?.[0] === "b")
        next.bottom = Math.floor(mirror.bottom - next.y - bounds.height);
      next.x = Math.floor(next.x - bounds.left);
      next.y = Math.floor(next.y - bounds.top);
      setPosition((previous) =>
        previous &&
        Object.keys(next).every(
          (key) =>
            previous[key as keyof typeof previous] ===
            next[key as keyof typeof next],
        )
          ? previous
          : next,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    read();
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(schedule);
    if (panel.current) observer?.observe(panel.current);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [
    open,
    host,
    targetElement,
    targetRect,
    currentPlacement,
    pointAtCenter,
    arrowOffsetHorizontal,
    styleArrowOffset,
    t.marginXXS,
    t.sizePopupArrow,
  ]);

  useLayoutEffect(() => {
    if (open && panel.current && position)
      alignCallback.current?.(
        panel.current.parentElement?.parentElement ?? panel.current,
        position.placement === "center"
          ? {}
          : getAlign(
              position.placement,
              pointAtCenter,
              t.marginXXS + t.sizePopupArrow / 2,
              arrowOffsetHorizontal,
              t.sizePopupArrow,
            ),
      );
  }, [
    open,
    position,
    pointAtCenter,
    t.marginXXS,
    t.sizePopupArrow,
    arrowOffsetHorizontal,
  ]);

  const close = () => {
    if (controlledOpen === undefined) setOpen(false);
    onClose?.(current);
  };
  const change = (next: number) => {
    if (controlledCurrent === undefined) setCurrent(next);
    onChange?.(next);
  };
  // Keep rc-tour's spread order: step callbacks may replace the root callbacks.
  const panelStep: Omit<TourStepProps, "closable"> & {
    closable: ReturnType<typeof resolveClosable>;
  } = {
    total: steps.length,
    current,
    onPrev: () => change(current - 1),
    onNext: () => change(current + 1),
    onClose: close,
    onFinish: () => {
      close();
      onFinish?.();
    },
    ...step,
    closable: resolveClosable(
      step?.closable,
      step?.closeIcon,
      closable,
      closeIcon ?? config.tour?.closeIcon,
    ),
  };
  const primary = (step?.type ?? type) === "primary";
  const mergedMask = step?.mask ?? mask;
  const showMask = mergedMask !== false;
  const maskConfig = typeof mergedMask === "object" ? mergedMask : undefined;
  const arrowToken = getArrowToken(
    t.sizePopupArrow,
    t.borderRadiusXS,
    t.borderRadiusOuter,
  );
  const themeStyle = {
    ...base,
    "--ao-tour-bg": primary ? t.colorPrimary : t.colorBgElevated,
    "--ao-tour-color": primary ? t.colorTextLightSolid : t.colorText,
    "--ao-tour-title": primary ? t.colorTextLightSolid : t.colorText,
    "--ao-tour-shadow": t.boxShadowTertiary,
    "--ao-tour-radius": `${primary ? t.borderRadius : t.borderRadiusLG}px`,
    "--ao-tour-padding": `${t.padding}px`,
    "--ao-tour-small-padding": `${t.paddingXS}px`,
    "--ao-tour-title-size": `${t.fontSize}px`,
    "--ao-tour-title-weight": t.fontWeightStrong,
    "--ao-tour-close-size": `${c?.closeBtnSize ?? t.fontSize * t.lineHeight}px`,
    "--ao-tour-close-color": primary ? t.colorTextLightSolid : t.colorIcon,
    "--ao-tour-close-hover-color": primary
      ? t.colorTextLightSolid
      : t.colorIconHover,
    "--ao-tour-close-hover-bg": t.colorBgTextHover,
    "--ao-tour-close-active-bg": t.colorBgTextActive,
    "--ao-tour-close-radius": `${t.borderRadiusSM}px`,
    "--ao-tour-prev-bg":
      c?.primaryPrevBtnBg ??
      new FastColor(t.colorTextLightSolid).setA(0.15).toRgbString(),
    "--ao-tour-next-hover":
      c?.primaryNextBtnHoverBg ??
      new FastColor(t.colorBgTextHover)
        .onBackground(t.colorWhite)
        .toRgbString(),
    "--ao-tour-next-bg": t.colorWhite,
    "--ao-tour-next-color": t.colorPrimary,
    "--ao-tour-indicator": primary
      ? (c?.primaryPrevBtnBg ??
        new FastColor(t.colorTextLightSolid).setA(0.15).toRgbString())
      : t.colorFill,
    "--ao-tour-indicator-active": primary
      ? t.colorTextLightSolid
      : t.colorPrimary,
    "--ao-tour-button-margin": `${t.marginXS}px`,
    "--ao-tour-arrow-size": `${t.sizePopupArrow}px`,
    "--ao-tour-arrow-path": arrowToken.path,
    "--ao-tour-arrow-polygon": arrowToken.polygon,
    "--ao-tour-arrow-shadow-width": `${arrowToken.shadowWidth}px`,
    "--ao-tour-arrow-shadow": t.boxShadowPopoverArrow,
    "--ao-tour-arrow-radius": `${t.borderRadiusXS}px`,
    "--ao-tour-motion": t.motion ? t.motionDurationSlow : "0s",
    "--ao-tour-motion-mid": t.motion ? t.motionDurationMid : "0s",
    zIndex: zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 70,
    direction: config.direction,
  };
  if (!open || targetElement === undefined || !host) return null;
  const rootClasses = [
    "ant-tour-root",
    prefixCls !== "ant-tour" && `${prefixCls}-root`,
    rootClassName,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      {createPortal(
        <div className={rootClasses} style={themeStyle}>
          <Mask
            prefixCls={prefixCls}
            rootClassName={rootClassName}
            targetRect={targetRect}
            showMask={showMask}
            disabledInteraction={disabledInteraction}
            color={maskConfig?.color ?? "rgba(0,0,0,0.5)"}
            style={maskConfig?.style}
          />
          {targetRect && (
            <div
              className={[
                "ant-tour-target-placeholder ant-tour-spotlight",
                prefixCls !== "ant-tour" && `${prefixCls}-target-placeholder`,
                rootClassName,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
              style={{
                position: "fixed",
                left: targetRect.left,
                top: targetRect.top,
                width: targetRect.width,
                height: targetRect.height,
                pointerEvents: "none",
              }}
            />
          )}
        </div>,
        document.body,
      )}
      {createPortal(
        <div className={rootClasses} style={themeStyle}>
          <div
            ref={popup}
            className={[
              "ant-tour",
              prefixCls !== "ant-tour" && prefixCls,
              primary && "ant-tour-primary",
              primary && prefixCls !== "ant-tour" && `${prefixCls}-primary`,
              config.direction === "rtl" && "ant-tour-rtl",
              config.direction === "rtl" &&
                prefixCls !== "ant-tour" &&
                `${prefixCls}-rtl`,
              position?.side !== "center" &&
                position &&
                `ant-tour-placement-${position.placement}`,
              className,
              rootClassName,
              step?.className,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              left: position?.right === undefined ? (position?.x ?? 8) : "auto",
              right: position?.right ?? "auto",
              top: position?.bottom === undefined ? (position?.y ?? 8) : "auto",
              bottom: position?.bottom ?? "auto",
              visibility: position ? "visible" : "hidden",
              ...style,
              ...step?.style,
            }}
          >
            {showArrow && position && position.side !== "center" && (
              <div
                className={[
                  `ant-tour-arrow ant-tour-arrow-${position.side}`,
                  prefixCls !== "ant-tour" && `${prefixCls}-arrow`,
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden="true"
                style={{
                  "--ao-tour-arrow-x": `${position.arrowX}px`,
                  "--ao-tour-arrow-y": `${position.arrowY}px`,
                }}
              />
            )}
            <TourPanel
              stepProps={panelStep}
              current={panelStep.current ?? current}
              total={panelStep.total ?? 1}
              prefixCls={panelStep.prefixCls ?? prefixCls}
              type={type}
              indicatorsRender={indicatorsRender}
              actionsRender={actionsRender}
              titleId={titleId}
              panelRef={panel}
            />
          </div>
        </div>,
        host,
      )}
    </>
  );
}
