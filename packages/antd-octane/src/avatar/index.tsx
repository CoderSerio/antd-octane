/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface AvatarRef {
  nativeElement: HTMLSpanElement | null;
}
export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "onError" | "ref"> {
  ref?: Ref<AvatarRef>;
  src?: string;
  srcSet?: string;
  alt?: string;
  icon?: OctaneNode;
  size?: number | "small" | "default" | "large";
  shape?: "circle" | "square";
  gap?: number;
  // biome-ignore lint/suspicious/noConfusingVoidType: A consumer may return false or use a normal void callback.
  onError?: () => boolean | void;
  draggable?: boolean;
  style?: CSSProperties;
}
export function Avatar({
  ref,
  src,
  srcSet,
  alt,
  icon,
  size = "default",
  shape = "circle",
  gap = 4,
  onError,
  draggable,
  children,
  className,
  style,
  ...rest
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const [scale, setScale] = useState(1);
  const outer = useRef<HTMLSpanElement | null>(null);
  useImperativeHandle(
    ref,
    () => ({
      get nativeElement() {
        return outer.current;
      },
    }),
    [],
  );
  const text = useRef<HTMLSpanElement | null>(null);
  const { token: t, base } = useComponentTokens("Avatar");
  const c = useConfig().theme.components?.Avatar;
  const dimension =
    typeof size === "number"
      ? size
      : size === "small"
        ? (c?.containerSizeSM ?? t.controlHeightSM)
        : size === "large"
          ? (c?.containerSizeLG ?? t.controlHeightLG)
          : (c?.containerSize ?? t.controlHeight);
  const font = icon
    ? typeof size === "number"
      ? size / 2
      : size === "large"
        ? (c?.iconFontSizeLG ?? t.fontSizeHeading3)
        : size === "small"
          ? (c?.iconFontSizeSM ?? t.fontSize)
          : (c?.iconFontSize ?? Math.round((t.fontSizeLG + t.fontSizeXL) / 2))
    : size === "large"
      ? (c?.textFontSizeLG ?? t.fontSize)
      : size === "small"
        ? (c?.textFontSizeSM ?? t.fontSize)
        : (c?.textFontSize ?? t.fontSize);
  useEffect(() => setFailed(false), [src]);
  useLayoutEffect(() => {
    const measure = () => {
      if (outer.current && text.current) {
        const width = text.current.scrollWidth;
        setScale(
          width
            ? Math.min(
                1,
                Math.max(0, outer.current.clientWidth - gap * 2) / width,
              )
            : 1,
        );
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
        "ant-avatar",
        shape === "square" && "ant-avatar-square",
        className,
      ]}
      style={{
        ...base,
        "--ao-avatar-size": `${dimension}px`,
        "--ao-avatar-font": `${font}px`,
        "--ao-avatar-bg": t.colorTextPlaceholder,
        "--ao-avatar-color": t.colorTextLightSolid,
        "--ao-avatar-radius": `${size === "large" ? t.borderRadiusLG : size === "small" ? t.borderRadiusSM : t.borderRadius}px`,
        ...style,
      }}
    >
      {src && !failed ? (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt ?? ""}
          draggable={draggable}
          onError={() => {
            if (onError?.() !== false) setFailed(true);
          }}
        />
      ) : (
        (icon ?? (
          <span
            ref={text}
            className="ant-avatar-string"
            style={{ transform: `scale(${scale})` }}
          >
            {children}
          </span>
        ))
      )}
    </span>
  );
}
