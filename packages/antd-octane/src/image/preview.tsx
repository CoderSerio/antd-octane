/** @jsxImportSource octane */
import { FastColor } from "@ant-design/fast-color";
import type { OctaneNode } from "octane";
import { useEffect, useId, useMemo, useRef, useState } from "octane";
import { DialogLayer } from "../_util/dialog";
import { useComponentTokens } from "../_util/tokens";
import useImageTransform from "./hooks/useImageTransform";
import useMouseEvent from "./hooks/useMouseEvent";
import usePreviewMotion from "./hooks/usePreviewMotion";
import useTouchEvent from "./hooks/useTouchEvent";
import type { Entry, ImageInfo, ImagePreviewConfig } from "./interface";
import Operations from "./Operations";
import { getMotionName, previewClass } from "./util";

export { PreviewIcon } from "./icons";
export function Viewer({
  open,
  images,
  current,
  onChange,
  onClose,
  options,
  countRender,
  group = false,
  fallback,
  prefixCls = "ant-image-preview",
}: {
  open: boolean;
  images: Entry[];
  current: number;
  onChange: (next: number) => void;
  onClose: () => void;
  options?: ImagePreviewConfig;
  countRender?: (current: number, total: number) => OctaneNode;
  group?: boolean;
  fallback?: string;
  prefixCls?: string;
}) {
  const { token: t, component: c, base } = useComponentTokens("Image");
  const operationsId = useId();
  const titleId = useId();
  const [previewFailed, setPreviewFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const [transformOrigin, setTransformOrigin] = useState<string | undefined>(
    undefined,
  );
  const currentImage = images[current];
  const image =
    options?.src === undefined
      ? currentImage
      : { ...(currentImage ?? { id: "preview", alt: "" }), src: options.src };
  const minScale = options?.minScale ?? 1;
  const maxScale = options?.maxScale ?? 50;
  const scaleStep = options?.scaleStep ?? 0.5;
  const {
    transform,
    transformRef,
    updateTransform,
    resetTransform,
    dispatchZoomChange: changeZoom,
  } = useImageTransform(imageRef, minScale, maxScale, options?.onTransform);
  const mouse = useMouseEvent(
    imageRef,
    options?.movable ?? true,
    open,
    scaleStep,
    transformRef,
    updateTransform,
    changeZoom,
  );
  const touch = useTouchEvent(
    imageRef,
    options?.movable ?? true,
    open,
    minScale,
    transformRef,
    updateTransform,
    changeZoom,
  );
  const motionName = getMotionName(
    prefixCls,
    options?.transitionName,
    options?.animation,
  );
  const maskMotionName = getMotionName(
    prefixCls,
    options?.maskTransitionName,
    options?.maskAnimation,
  );
  const motionDuration = t.motion && motionName ? t.motionDurationSlow : "0s";
  const { displayOpen, phase, onMotionEnd } = usePreviewMotion(
    open,
    motionDuration,
    (shown) => {
      if (!shown) resetTransform("close");
      options?.afterOpenChange?.(shown);
    },
    () => {
      const node = panel.current;
      const point = options?.mousePosition;
      if (!node || !point || !(point.x || point.y)) {
        setTransformOrigin(undefined);
        return;
      }
      const bounds = node.getBoundingClientRect();
      setTransformOrigin(
        `${point.x - bounds.left - window.scrollX}px ${point.y - bounds.top - window.scrollY}px`,
      );
    },
  );
  useEffect(() => setPreviewFailed(false), [image?.src]);
  const onActive = (offset: number) => {
    const next = current + offset;
    if (!Number.isInteger(next) || next < 0 || next >= images.length) return;
    resetTransform(offset < 0 ? "prev" : "next");
    onChange(next);
  };
  const flipY = () =>
    updateTransform({ flipY: !transformRef.current.flipY }, "flipY");
  const flipX = () =>
    updateTransform({ flipX: !transformRef.current.flipX }, "flipX");
  const rotateLeft = () =>
    updateTransform({ rotate: transformRef.current.rotate - 90 }, "rotateLeft");
  const rotateRight = () =>
    updateTransform(
      { rotate: transformRef.current.rotate + 90 },
      "rotateRight",
    );
  const zoomOut = () => changeZoom(1 / (1 + scaleStep), "zoomOut");
  const zoomIn = () => changeZoom(1 + scaleStep, "zoomIn");
  const imageInfo: ImageInfo = {
    url: image?.src ?? "",
    alt: image?.alt ?? "",
    ...(group ? {} : { width: image?.width, height: image?.height }),
  };
  const container = options?.getContainer;
  const mergedContainer = useMemo(
    () =>
      typeof container === "string"
        ? () => document.querySelector<HTMLElement>(container) ?? document.body
        : container,
    [container],
  );
  const previewStyle = {
    ...base,
    "--ao-dialog-z":
      options?.zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 80,
    "--ao-dialog-mask": t.colorBgMask,
    "--ao-image-motion-duration": motionDuration,
    "--ao-image-motion-ease": t.motionEaseOut,
    "--ao-image-close-color": t.colorTextLightSolid,
    "--ao-image-switch-size": `${t.controlHeightLG}px`,
    "--ao-image-switch-margin": `${t.marginSM}px`,
    "--ao-image-switch-z":
      (options?.zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 80) + 1,
    "--ao-image-operation-padding": `${t.paddingSM}px`,
    "--ao-image-operation":
      c?.previewOperationColor ??
      new FastColor(t.colorTextLightSolid).setA(0.65).toRgbString(),
    "--ao-image-operation-disabled":
      c?.previewOperationColorDisabled ??
      new FastColor(t.colorTextLightSolid).setA(0.25).toRgbString(),
    "--ao-image-operation-hover":
      c?.previewOperationHoverColor ??
      new FastColor(t.colorTextLightSolid).setA(0.85).toRgbString(),
    "--ao-image-operation-bg": c?.previewOperationBg ?? "rgba(0,0,0,.1)",
    "--ao-image-operation-bg-hover": "rgba(0,0,0,.2)",
    "--ao-image-zoom-size": `${c?.previewOperationSizeZoom ?? c?.previewOperationSize ?? t.fontSizeIcon * 1.5}px`,
    "--ao-image-operation-size": `${c?.previewOperationSize ?? t.fontSizeIcon * 1.5}px`,
    "--ao-image-footer-bottom": `${t.marginXL}px`,
    "--ao-image-progress-gap": `${t.margin}px`,
    "--ao-image-toolbar-padding": `${t.paddingLG}px`,
    "--ao-image-operation-gap": `${t.paddingSM}px`,
    "--ao-image-operation-target": `${(c?.previewOperationSize ?? t.fontSizeIcon * 1.5) + t.paddingSM * 2}px`,
  };
  useEffect(() => {
    if (!open || !group || images.length <= 1) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onActive(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onActive(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, group, images.length, current]);
  return (
    <>
      <DialogLayer
        open={displayOpen}
        onClose={onClose}
        label="图片预览"
        titleId={options?.title ? titleId : undefined}
        className={[previewClass(prefixCls, "-root"), options?.rootClassName]
          .filter(Boolean)
          .join(" ")}
        panelClassName={[
          previewClass(prefixCls, ""),
          options?.className,
          phase && previewClass(prefixCls, `-${phase}`),
          phase &&
            motionName &&
            `${motionName}-${phase} ${motionName}-${phase}-active`,
        ]
          .filter(Boolean)
          .join(" ")}
        maskClosable={options?.maskClosable}
        panelRef={[panel, options?.panelRef]}
        panelProps={{
          onAnimationEnd: onMotionEnd,
          onTransitionEnd: onMotionEnd,
        }}
        panelStyle={{
          ...options?.style,
          transformOrigin,
          ...(options?.width === undefined ? {} : { width: options.width }),
          ...(options?.height === undefined ? {} : { height: options.height }),
        }}
        maskStyle={{ ...options?.maskStyle, ...options?.styles?.mask }}
        maskClassName={[
          previewClass(prefixCls, "-mask"),
          options?.classNames?.mask,
          phase && previewClass(prefixCls, `-mask-${phase}`),
          phase &&
            maskMotionName &&
            `${maskMotionName}-${phase} ${maskMotionName}-${phase}-active`,
        ]
          .filter(Boolean)
          .join(" ")}
        maskProps={options?.maskProps}
        wrapClassName={options?.classNames?.wrapper}
        wrapStyle={{ ...options?.wrapStyle, ...options?.styles?.wrapper }}
        wrapProps={options?.wrapProps}
        autoFocus={false}
        focusTriggerAfterClose={options?.focusTriggerAfterClose}
        afterOpenChange={(shown) => {
          if (shown) content.current?.focus({ preventScroll: true });
        }}
        getContainer={mergedContainer}
        forceRender={options?.forceRender}
        destroyOnHidden={options?.destroyOnHidden ?? options?.destroyOnClose}
        keyboard={options?.keyboard}
        style={previewStyle}
      >
        {(options?.modalRender ?? ((node) => node))(
          <div
            ref={content}
            className={[
              previewClass(prefixCls, "-content"),
              options?.classNames?.content,
            ]}
            style={options?.styles?.content}
            tabIndex={-1}
            aria-controls={operationsId}
          >
            {!!options?.title && (
              <div
                className={[
                  previewClass(prefixCls, "-header"),
                  options?.classNames?.header,
                ]}
                style={options?.styles?.header}
              >
                <div className={previewClass(prefixCls, "-title")} id={titleId}>
                  {options.title}
                </div>
              </div>
            )}
            <div
              className={[
                previewClass(prefixCls, "-body"),
                options?.classNames?.body,
              ]}
              style={{
                ...options?.bodyStyle,
                ...options?.styles?.body,
              }}
              {...options?.bodyProps}
            >
              <div
                className={[
                  previewClass(prefixCls, "-stage"),
                  previewClass(prefixCls, "-img-wrapper"),
                ]}
              >
                {image &&
                  (() => {
                    const originalNode = (
                      <img
                        {...image.props}
                        ref={imageRef}
                        className={previewClass(prefixCls, "-img")}
                        src={previewFailed && fallback ? fallback : image.src}
                        alt={image.alt}
                        onError={() => {
                          if (fallback && !previewFailed)
                            setPreviewFailed(true);
                        }}
                        onWheel={mouse.onWheel}
                        onDoubleClick={(event) => {
                          if (!open) return;
                          if (transformRef.current.scale !== 1)
                            updateTransform(
                              { scale: 1, x: 0, y: 0 },
                              "doubleClick",
                            );
                          else
                            changeZoom(
                              1 + scaleStep,
                              "doubleClick",
                              event.clientX,
                              event.clientY,
                            );
                        }}
                        onPointerDown={mouse.onPointerDown}
                        onPointerMove={mouse.onPointerMove}
                        onPointerUp={mouse.onPointerUp}
                        onPointerCancel={mouse.onPointerCancel}
                        onTouchStart={touch.onTouchStart}
                        onTouchMove={touch.onTouchMove}
                        onTouchEnd={touch.onTouchEnd}
                        onTouchCancel={touch.onTouchEnd}
                        draggable={image.props?.draggable ?? false}
                        style={{
                          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale3d(${transform.flipX ? -transform.scale : transform.scale}, ${transform.flipY ? -transform.scale : transform.scale}, 1) rotate(${transform.rotate}deg)`,
                          transitionDuration:
                            mouse.isMoving || touch.isTouching
                              ? "0s"
                              : undefined,
                          touchAction:
                            options?.movable === false ? undefined : "none",
                          cursor:
                            options?.movable === false
                              ? undefined
                              : mouse.isMoving
                                ? "grabbing"
                                : "grab",
                        }}
                      />
                    );
                    return options?.imageRender
                      ? options.imageRender(originalNode, {
                          transform,
                          image: imageInfo,
                          ...(group ? { current } : {}),
                        })
                      : originalNode;
                  })()}
              </div>
            </div>
            {!!options?.footer && (
              <div
                className={[
                  previewClass(prefixCls, "-footer"),
                  options?.classNames?.footer,
                ]}
                style={options?.styles?.footer}
              >
                {options.footer}
              </div>
            )}
          </div>,
        )}
      </DialogLayer>
      <Operations
        open={displayOpen}
        id={operationsId}
        phase={phase}
        prefixCls={prefixCls}
        options={options}
        imageInfo={imageInfo}
        transform={transform}
        count={images.length}
        current={current}
        minScale={minScale}
        maxScale={maxScale}
        group={group}
        countRender={countRender}
        actions={{
          onActive,
          onClose,
          onFlipY: flipY,
          onFlipX: flipX,
          onRotateLeft: rotateLeft,
          onRotateRight: rotateRight,
          onZoomOut: zoomOut,
          onZoomIn: zoomIn,
          onReset: () => resetTransform("reset"),
        }}
        style={{
          ...previewStyle,
          zIndex:
            (options?.zIndex ?? c?.zIndexPopup ?? t.zIndexPopupBase + 80) + 1,
        }}
        getContainer={mergedContainer}
      />
    </>
  );
}
