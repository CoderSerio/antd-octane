/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { createPortal, useEffect, useLayoutEffect, useState } from "octane";
import { useConfig } from "../config-provider";
import type { PopupContainer } from "../config-provider/context";
import type { PreviewMotionPhase } from "./hooks/usePreviewMotion";
import { PreviewIcon } from "./icons";
import type {
  ImageInfo,
  ImagePreviewConfig,
  ImageToolbarRenderInfo,
  ImageTransform,
} from "./interface";
import { getMotionName, previewClass } from "./util";

/** rc-image 7.12.0 Operations (MIT), adapted to native buttons and portals. */
export default function Operations({
  open,
  id,
  phase,
  prefixCls,
  options,
  imageInfo,
  transform,
  count,
  current,
  minScale,
  maxScale,
  group,
  countRender,
  actions,
  style,
  getContainer,
}: {
  open: boolean;
  id: string;
  phase: PreviewMotionPhase;
  prefixCls: string;
  options?: ImagePreviewConfig;
  imageInfo: ImageInfo;
  transform: ImageTransform;
  count: number;
  current: number;
  minScale: number;
  maxScale: number;
  group: boolean;
  countRender?: (current: number, total: number) => OctaneNode;
  actions: ImageToolbarRenderInfo["actions"];
  style: CSSProperties & { [key: `--${string}`]: string | number | undefined };
  getContainer?: PopupContainer | (() => PopupContainer) | false;
}) {
  const { direction } = useConfig();
  const [host, setHost] = useState<PopupContainer | null>(null);
  useLayoutEffect(() => {
    if (getContainer === false) {
      setHost(null);
      return;
    }
    setHost(
      typeof getContainer === "function"
        ? getContainer()
        : (getContainer ?? document.body),
    );
  }, [getContainer]);
  const {
    onActive,
    onClose,
    onFlipY: flipY,
    onFlipX: flipX,
    onRotateLeft: rotateLeft,
    onRotateRight: rotateRight,
    onZoomOut: zoomOut,
    onZoomIn: zoomIn,
  } = actions;
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  const maskMotionName = getMotionName(
    prefixCls,
    options?.maskTransitionName,
    options?.maskAnimation,
  );
  const prevIcon =
    count > 1 ? (
      <button
        className={[
          previewClass(prefixCls, "-operations-operation-prev"),
          previewClass(prefixCls, "-operations-operation"),
        ]}
        type="button"
        aria-label="上一张图片"
        disabled={current === 0}
        onClick={() => onActive(-1)}
      >
        {options?.icons?.left ?? (
          <PreviewIcon kind={direction === "rtl" ? "right" : "left"} />
        )}
      </button>
    ) : undefined;
  const nextIcon =
    count > 1 ? (
      <button
        className={[
          previewClass(prefixCls, "-operations-operation-next"),
          previewClass(prefixCls, "-operations-operation"),
        ]}
        type="button"
        aria-label="下一张图片"
        disabled={current === count - 1}
        onClick={() => onActive(1)}
      >
        {options?.icons?.right ?? (
          <PreviewIcon kind={direction === "rtl" ? "left" : "right"} />
        )}
      </button>
    ) : undefined;
  const flipYIcon = (
    <button
      type="button"
      className={previewClass(prefixCls, "-operations-operation")}
      aria-label="垂直翻转"
      onClick={flipY}
    >
      {options?.icons?.flipY ?? <PreviewIcon kind="flipY" />}
    </button>
  );
  const flipXIcon = (
    <button
      type="button"
      className={previewClass(prefixCls, "-operations-operation")}
      aria-label="水平翻转"
      onClick={flipX}
    >
      {options?.icons?.flipX ?? <PreviewIcon kind="flipX" />}
    </button>
  );
  const rotateLeftIcon = (
    <button
      type="button"
      className={previewClass(prefixCls, "-operations-operation")}
      aria-label="向左旋转"
      onClick={rotateLeft}
    >
      {options?.icons?.rotateLeft ?? <PreviewIcon kind="rotateLeft" />}
    </button>
  );
  const rotateRightIcon = (
    <button
      type="button"
      className={previewClass(prefixCls, "-operations-operation")}
      aria-label="向右旋转"
      onClick={rotateRight}
    >
      {options?.icons?.rotateRight ?? <PreviewIcon kind="rotateRight" />}
    </button>
  );
  const zoomOutIcon = (
    <button
      type="button"
      className={[
        previewClass(prefixCls, "-zoom"),
        previewClass(prefixCls, "-operations-operation"),
      ]}
      aria-label="缩小图片"
      disabled={transform.scale <= minScale}
      onClick={zoomOut}
    >
      {options?.icons?.zoomOut ?? <PreviewIcon kind="zoomOut" />}
    </button>
  );
  const zoomInIcon = (
    <button
      type="button"
      className={[
        previewClass(prefixCls, "-zoom"),
        previewClass(prefixCls, "-operations-operation"),
      ]}
      aria-label="放大图片"
      disabled={transform.scale >= maxScale}
      onClick={zoomIn}
    >
      {options?.icons?.zoomIn ?? <PreviewIcon kind="zoomIn" />}
    </button>
  );
  const toolbarNode = (
    <div
      className={[
        previewClass(prefixCls, "-toolbar"),
        previewClass(prefixCls, "-operations"),
      ]}
    >
      {flipYIcon}
      {flipXIcon}
      {rotateLeftIcon}
      {rotateRightIcon}
      {zoomOutIcon}
      {zoomInIcon}
    </div>
  );
  const toolbar = options?.toolbarRender
    ? options.toolbarRender(toolbarNode, {
        icons: {
          prevIcon,
          nextIcon,
          flipYIcon,
          flipXIcon,
          rotateLeftIcon,
          rotateRightIcon,
          zoomOutIcon,
          zoomInIcon,
        },
        actions,
        transform,
        ...(group ? { current, total: count } : {}),
        image: imageInfo,
      })
    : toolbarNode;
  const content = (
    <div
      id={id}
      className={[
        previewClass(prefixCls, "-operations-wrapper"),
        options?.rootClassName,
        phase && previewClass(prefixCls, `-mask-${phase}`),
        phase &&
          maskMotionName &&
          `${maskMotionName}-${phase} ${maskMotionName}-${phase}-active`,
      ]}
      style={style}
    >
      {options?.closeIcon !== null && (
        <button
          type="button"
          className={previewClass(prefixCls, "-close")}
          aria-label="关闭图片预览"
          onClick={onClose}
        >
          {options?.closeIcon ||
            (options?.icons?.close ?? <PreviewIcon kind="close" />)}
        </button>
      )}
      {count > 1 && (
        <>
          <button
            type="button"
            className={[
              previewClass(prefixCls, "-prev"),
              previewClass(prefixCls, "-switch-left"),
            ]}
            aria-label="上一张图片"
            disabled={current === 0}
            onClick={() => onActive(-1)}
          >
            {options?.icons?.left ?? (
              <PreviewIcon kind={direction === "rtl" ? "right" : "left"} />
            )}
          </button>
          <button
            type="button"
            className={[
              previewClass(prefixCls, "-next"),
              previewClass(prefixCls, "-switch-right"),
            ]}
            aria-label="下一张图片"
            disabled={current === count - 1}
            onClick={() => onActive(1)}
          >
            {options?.icons?.right ?? (
              <PreviewIcon kind={direction === "rtl" ? "left" : "right"} />
            )}
          </button>
        </>
      )}
      <div className={previewClass(prefixCls, "-footer")}>
        {group && count > 0 && (
          <span
            className={[
              previewClass(prefixCls, "-count"),
              previewClass(prefixCls, "-progress"),
            ]}
          >
            {countRender
              ? countRender(current + 1, count)
              : `${current + 1} / ${count}`}
          </span>
        )}
        {toolbar}
      </div>
    </div>
  );
  return getContainer === false
    ? content
    : host
      ? createPortal(content, host)
      : null;
}
