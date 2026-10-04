/** @jsxImportSource octane */
import {
  isValidElement,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import type { Responsive } from "../_util/responsive";
import { breakpoints, useBreakpoint } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { AvatarGroupContext } from "./context";
import type { AvatarProps } from "./types";

type FixedAvatarSize = number | "small" | "default" | "large";

export function InternalAvatar({
  ref,
  prefixCls,
  rootClassName,
  src,
  srcSet,
  alt,
  icon,
  size,
  shape,
  gap = 4,
  onError,
  draggable,
  crossOrigin,
  children,
  className,
  style,
  ...rest
}: AvatarProps) {
  const group = useContext(AvatarGroupContext);
  const config = useConfig();
  const componentSize =
    config.componentSize === "small"
      ? "small"
      : config.componentSize === "large"
        ? "large"
        : "default";
  const requestedSize = size ?? group.size ?? componentSize;
  const responsive =
    typeof requestedSize === "object" &&
    requestedSize !== null &&
    Object.keys(requestedSize).some((key) =>
      (breakpoints as readonly string[]).includes(key),
    );
  const screens = useBreakpoint(responsive);
  const activeBreakpoint = responsive
    ? [...breakpoints].reverse().find((breakpoint) => screens[breakpoint])
    : undefined;
  const responsiveSize = activeBreakpoint
    ? (requestedSize as Responsive<number>)[activeBreakpoint]
    : undefined;
  const resolvedSize = responsive
    ? responsiveSize || "default"
    : (requestedSize as FixedAvatarSize);
  const resolvedShape = shape ?? group.shape ?? "circle";
  const [failed, setFailed] = useState(false);
  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);
  const outer = useRef<HTMLSpanElement | null>(null);
  const text = useRef<HTMLSpanElement | null>(null);
  useImperativeHandle(ref, () => outer.current as HTMLSpanElement, []);
  const { token: t, base } = useComponentTokens("Avatar");
  const c = config.theme.components?.Avatar;
  const dimension =
    typeof resolvedSize === "number"
      ? resolvedSize
      : resolvedSize === "small"
        ? (c?.containerSizeSM ?? t.controlHeightSM)
        : resolvedSize === "large"
          ? (c?.containerSizeLG ?? t.controlHeightLG)
          : (c?.containerSize ?? t.controlHeight);
  const font = responsiveSize
    ? icon || children
      ? dimension / 2
      : 18
    : typeof resolvedSize === "number"
      ? icon
        ? resolvedSize / 2
        : 18
      : icon
        ? resolvedSize === "large"
          ? (c?.iconFontSizeLG ?? t.fontSizeHeading3)
          : resolvedSize === "small"
            ? (c?.iconFontSizeSM ?? t.fontSize)
            : (c?.iconFontSize ?? Math.round((t.fontSizeLG + t.fontSizeXL) / 2))
        : resolvedSize === "large"
          ? (c?.textFontSizeLG ?? t.fontSize)
          : resolvedSize === "small"
            ? (c?.textFontSizeSM ?? t.fontSize)
            : (c?.textFontSize ?? t.fontSize);
  const hasImageElement = isValidElement(src);
  const hasImage = (Boolean(src) && !failed) || hasImageElement;
  const prefix = config.getPrefixCls("avatar", prefixCls);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setFailed(false);
    setScale(1);
  }, [src]);
  useLayoutEffect(() => {
    const measure = () => {
      if (outer.current && text.current) {
        // Measure the untransformed width. An impossible gap should not hide
        // the text; antd retains the previous scale in that case.
        const width = text.current.offsetWidth;
        const available = outer.current.offsetWidth;
        if (width && available && gap * 2 < available)
          setScale(Math.min(1, (available - gap * 2) / width));
      }
    };
    measure();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    if (outer.current) observer?.observe(outer.current);
    if (text.current) observer?.observe(text.current);
    return () => observer?.disconnect();
  }, [children, dimension, gap, failed, src, font]);

  return (
    <span
      {...rest}
      ref={outer}
      className={[
        prefix,
        prefix !== "ant-avatar" && "ant-avatar",
        `${prefix}-${resolvedShape}`,
        prefix !== "ant-avatar" && `ant-avatar-${resolvedShape}`,
        resolvedSize === "large" ? `${prefix}-lg` : undefined,
        prefix !== "ant-avatar" && resolvedSize === "large" && "ant-avatar-lg",
        resolvedSize === "small" ? `${prefix}-sm` : undefined,
        prefix !== "ant-avatar" && resolvedSize === "small" && "ant-avatar-sm",
        hasImage ? `${prefix}-image` : undefined,
        prefix !== "ant-avatar" && hasImage && "ant-avatar-image",
        icon ? `${prefix}-icon` : undefined,
        prefix !== "ant-avatar" && icon && "ant-avatar-icon",
        config.avatar?.className,
        className,
        rootClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...base,
        "--ao-avatar-size": `${dimension}px`,
        "--ao-avatar-font": `${font}px`,
        "--ao-avatar-bg": t.colorTextPlaceholder,
        "--ao-avatar-color": t.colorTextLightSolid,
        "--ao-avatar-border-width": `${t.lineWidth}px`,
        "--ao-avatar-border-style": t.lineType,
        "--ao-avatar-radius": `${resolvedSize === "large" ? t.borderRadiusLG : resolvedSize === "small" ? t.borderRadiusSM : t.borderRadius}px`,
        ...config.avatar?.style,
        ...style,
      }}
    >
      {typeof src === "string" && !failed ? (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          crossOrigin={crossOrigin}
          draggable={draggable}
          onError={() => {
            if (onError?.() !== false) setFailed(true);
          }}
        />
      ) : hasImageElement ? (
        src
      ) : (
        icon || (
          <span
            ref={text}
            className={[
              `${prefix}-string`,
              prefix !== "ant-avatar" && "ant-avatar-string",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              transform: `scale(${scale})`,
              opacity: mounted || scale !== 1 ? undefined : 0,
            }}
          >
            {children}
          </span>
        )
      )}
    </span>
  );
}
