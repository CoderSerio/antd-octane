/** @jsxImportSource octane */
import type { HTMLAttributes } from "octane";
import {
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { useComponentTokens } from "../_util/tokens";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import useLocale from "../locale/useLocale";
import type { Entry, ImageProps } from "./interface";

export type {
  Entry,
  ImageElementProps,
  ImageInfo,
  ImagePreviewConfig,
  ImagePreviewGroupProps,
  ImageProps,
  ImageToolbarRenderInfo,
  ImageTransform,
  ImageTransformAction,
} from "./interface";

import { Context } from "./group-context";
import { PreviewIcon, Viewer } from "./preview";
import { PreviewGroup } from "./preview-group";

function imageClass(prefixCls: string, suffix: string) {
  const base = `ant-image${suffix}`;
  const custom = `${prefixCls}${suffix}`;
  return custom === base ? base : [base, custom].join(" ");
}
function ImageBase({
  prefixCls: customizePrefixCls,
  previewPrefixCls,
  src,
  alt = "",
  preview = true,
  fallback,
  placeholder,
  rootClassName,
  rootStyle,
  wrapperClassName,
  wrapperStyle,
  className,
  style,
  onClick,
  width,
  height,
  onError,
  onLoad,
  onPreviewClose,
  ...rest
}: ImageProps) {
  const warning = devUseWarning("Image");
  warning.deprecated(
    !(typeof preview === "object" && preview && "destroyOnClose" in preview),
    "destroyOnClose",
    "destroyOnHidden",
  );
  const { token: t, base } = useComponentTokens("Image");
  const config = useConfig();
  const [imageLocale] = useLocale("Image");
  const prefixCls = config.getPrefixCls("image", customizePrefixCls);
  const mergedStyle = { ...config.image?.style, ...style };
  const mergedFallback = fallback ?? config.image?.fallback;
  const group = useContext(Context);
  const id = useId();
  const thumbnail = useRef<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false),
    [loaded, setLoaded] = useState(false),
    [visible, setVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const userOptions = typeof preview === "object" ? preview : undefined;
  const options = {
    ...userOptions,
    transitionName:
      userOptions?.transitionName ?? `${config.getPrefixCls()}-zoom`,
    maskTransitionName:
      userOptions?.maskTransitionName ?? `${config.getPrefixCls()}-fade`,
    mousePosition: userOptions?.mousePosition ?? mousePosition,
    closeIcon: userOptions?.closeIcon ?? config.image?.preview?.closeIcon,
    rootClassName: [rootClassName, userOptions?.rootClassName]
      .filter(Boolean)
      .join(" "),
    getContainer: userOptions?.getContainer ?? config.getPopupContainer,
  };
  const mergedPreviewPrefixCls = previewPrefixCls ?? `${prefixCls}-preview`;
  const {
    crossOrigin,
    decoding,
    draggable,
    loading,
    referrerPolicy,
    sizes,
    srcSet,
    useMap,
    ...wrapperImageProps
  } = rest;
  const wrapperProps =
    wrapperImageProps as unknown as HTMLAttributes<HTMLDivElement>;
  const actual = failed && mergedFallback ? mergedFallback : src;
  const previewSrc = options?.src ?? src ?? "";
  const enabled = preview !== false && group?.enabled !== false;
  const makeEntry = (): Entry => ({
    id,
    src: previewSrc,
    alt,
    width,
    height,
    props: {
      src: previewSrc,
      alt,
      crossOrigin,
      decoding,
      draggable,
      loading,
      referrerPolicy,
      sizes,
      srcSet,
      useMap,
    },
  });
  useLayoutEffect(() => {
    setFailed(false);
    const node = thumbnail.current;
    setLoaded(!!node?.complete && !!(node.naturalWidth || node.naturalHeight));
  }, [src]);
  const register = group?.register;
  useEffect(() => {
    if (register && preview !== false) return register(makeEntry());
  }, [register, id, preview !== false, !!previewSrc]);
  useEffect(() => {
    if (register && preview !== false) register(makeEntry());
  }, [
    register,
    id,
    previewSrc,
    alt,
    width,
    height,
    crossOrigin,
    decoding,
    draggable,
    loading,
    referrerPolicy,
    sizes,
    srcSet,
    useMap,
    preview !== false,
  ]);
  const open = (event: MouseEvent) => {
    if (!enabled) return;
    const target =
      event.target instanceof Element
        ? event.target
        : (event.currentTarget as Element);
    const bounds = target.getBoundingClientRect();
    const position = {
      x: bounds.left + window.scrollX,
      y: bounds.top + window.scrollY,
    };
    if (group) {
      group.show(id, previewSrc, position);
      return;
    }
    setMousePosition(position);
    if (options?.visible === undefined) setVisible(true);
    if (!(options.visible ?? visible))
      (options.onVisibleChange ?? onPreviewClose)?.(true, false);
  };
  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: rc-image attaches onClick to the wrapper; the preview mask supplies keyboard activation. */}
      <div
        {...wrapperProps}
        className={[
          imageClass(prefixCls, ""),
          failed && imageClass(prefixCls, "-error"),
          rootClassName,
          wrapperClassName,
        ]}
        onClick={(event) => {
          if (enabled) open(event);
          onClick?.(event);
        }}
        style={{
          ...base,
          fontSize: t.fontSize,
          "--ao-image-mask-color": t.colorTextLightSolid,
          "--ao-image-mask-padding": `${t.paddingXXS}px`,
          "--ao-image-mask-gap": `${t.marginXXS}px`,
          "--ao-image-motion-duration": t.motion ? t.motionDurationSlow : "0s",
          "--ao-image-placeholder-bg": t.colorBgContainerDisabled,
          width,
          height,
          ...rootStyle,
          ...wrapperStyle,
        }}
      >
        {!loaded && placeholder && placeholder !== true && (
          <div className={imageClass(prefixCls, "-placeholder")}>
            {placeholder}
          </div>
        )}
        <img
          ref={thumbnail}
          crossOrigin={crossOrigin}
          decoding={decoding}
          draggable={draggable}
          loading={loading}
          referrerPolicy={referrerPolicy}
          sizes={sizes}
          srcSet={srcSet}
          useMap={useMap}
          src={actual}
          alt={alt}
          width={width}
          height={height}
          className={[
            imageClass(prefixCls, "-img"),
            placeholder === true && imageClass(prefixCls, "-img-placeholder"),
            config.image?.className,
            className,
          ]}
          style={{
            height,
            ...mergedStyle,
          }}
          onLoad={(event) => {
            setLoaded(true);
            onLoad?.(event);
          }}
          onError={(event) => {
            // rc-image's error status removes a custom placeholder before trying fallback.
            setLoaded(true);
            setFailed(true);
            onError?.(event);
          }}
        />
        {enabled && (options.mask === undefined || !!options.mask) && (
          <button
            type="button"
            className={[imageClass(prefixCls, "-mask"), options?.maskClassName]}
            aria-label={`${imageLocale.preview}${alt ? `: ${alt}` : ""}`}
            style={{
              display: mergedStyle.display === "none" ? "none" : undefined,
            }}
          >
            {options?.mask === undefined ? (
              <span className={imageClass(prefixCls, "-mask-info")}>
                <PreviewIcon kind="eye" />
                {imageLocale.preview}
              </span>
            ) : (
              options.mask
            )}
          </button>
        )}
      </div>
      {!group && (
        <Viewer
          open={enabled && (options?.visible ?? visible)}
          images={[makeEntry()]}
          current={0}
          options={options}
          prefixCls={mergedPreviewPrefixCls}
          fallback={mergedFallback}
          onChange={() => {}}
          onClose={() => {
            setMousePosition(null);
            if (options?.visible === undefined) setVisible(false);
            const previous = options?.visible ?? visible;
            if (previous)
              (options?.onVisibleChange ?? onPreviewClose)?.(false, true);
          }}
        />
      )}
    </>
  );
}
export const Image = Object.assign(ImageBase, { PreviewGroup });
