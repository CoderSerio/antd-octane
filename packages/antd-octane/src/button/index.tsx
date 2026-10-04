/** @jsxImportSource octane */
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  OctaneNode,
  Ref,
} from "octane";
import {
  createPortal,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "octane";
import { componentClassName } from "../_util/componentClassName";
import useWave from "../_util/wave/useWave";
import { useConfig } from "../config-provider";
import DefaultLoadingIcon from "./DefaultLoadingIcon";
import { buttonVariables } from "./tokens";

export type ButtonRef = HTMLButtonElement | HTMLAnchorElement;
export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "ref" | "children" | "style" | "onClick"
  > {
  type?: "default" | "primary" | "dashed" | "text" | "link";
  color?:
    | "default"
    | "primary"
    | "danger"
    | "blue"
    | "purple"
    | "cyan"
    | "green"
    | "magenta"
    | "pink"
    | "red"
    | "orange"
    | "yellow"
    | "volcano"
    | "geekblue"
    | "lime"
    | "gold";
  variant?: "outlined" | "dashed" | "solid" | "filled" | "text" | "link";
  htmlType?: "button" | "submit" | "reset";
  prefixCls?: string;
  rootClassName?: string;
  size?: "small" | "middle" | "large";
  shape?: "default" | "circle" | "round";
  danger?: boolean;
  ghost?: boolean;
  block?: boolean;
  loading?: boolean | { delay?: number; icon?: OctaneNode };
  icon?: OctaneNode;
  /** Ant Design 5.x name; iconPlacement takes precedence when both are set. */
  iconPosition?: "start" | "end";
  iconPlacement?: "start" | "end";
  autoInsertSpace?: boolean;
  children?: OctaneNode;
  href?: string;
  target?: string;
  rel?: string;
  style?: CSSProperties;
  ref?: Ref<ButtonRef>;
  onClick?: (event: MouseEvent) => void;
}

export function Button(props: ButtonProps) {
  const config = useConfig();
  const node = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  useImperativeHandle(props.ref, () => node.current as ButtonRef, [props.href]);
  const variables = useMemo(
    () => buttonVariables(config.theme, config.token),
    [config.theme, config.token],
  );
  const loadingRequested = Boolean(props.loading);
  const loadingDelay =
    typeof props.loading === "object"
      ? Math.max(0, props.loading.delay ?? 0)
      : 0;
  const [innerLoading, setInnerLoading] = useState(
    loadingRequested && loadingDelay === 0,
  );
  useEffect(() => {
    if (!loadingRequested) {
      setInnerLoading(false);
      return;
    }
    if (loadingDelay === 0) {
      setInnerLoading(true);
      return;
    }
    setInnerLoading(false);
    const timer = window.setTimeout(() => setInnerLoading(true), loadingDelay);
    return () => window.clearTimeout(timer);
  }, [loadingRequested, loadingDelay]);
  const {
    type = "default",
    htmlType = "button",
    size = config.componentSize ?? "middle",
    shape = "default",
    danger = false,
    ghost = false,
    block = false,
    loading: _loading,
    disabled = config.componentDisabled ?? false,
    icon,
    iconPosition,
    iconPlacement: requestedIconPlacement,
    autoInsertSpace = config.button?.autoInsertSpace ?? true,
    color: requestedColor,
    variant: requestedVariant,
    children,
    href,
    target,
    rel,
    style,
    className,
    prefixCls: customizePrefixCls,
    rootClassName,
    ref: _ref,
    onClick,
    ...rest
  } = props;
  const prefixCls = config.getPrefixCls("btn", customizePrefixCls);
  const cls = (suffix = "") => componentClassName("ant-btn", prefixCls, suffix);
  const legacyVariant =
    type === "primary" ? "solid" : type === "default" ? "outlined" : type;
  const [color, variant] =
    requestedColor && requestedVariant
      ? [requestedColor, requestedVariant]
      : props.type || props.danger
        ? [
            danger ? "danger" : type === "primary" ? "primary" : "default",
            legacyVariant,
          ]
        : config.button?.color && config.button?.variant
          ? [config.button.color, config.button.variant]
          : ["default", "outlined"];
  const loading = innerLoading;
  useWave(
    node,
    "Button",
    loading || href !== undefined || variant === "text" || variant === "link",
  );
  const iconPlacement = requestedIconPlacement ?? iconPosition ?? "start";
  // Ant Design 5 buttonHelpers inserts a space in a single two-character
  // Chinese label for bordered buttons without an icon.
  const label =
    autoInsertSpace &&
    !icon &&
    variant !== "text" &&
    variant !== "link" &&
    typeof children === "string" &&
    /^[\u4E00-\u9FA5]{2}$/.test(children)
      ? children.split("").join(" ")
      : children;
  const hasContent =
    children !== undefined &&
    children !== null &&
    children !== false &&
    children !== "";
  const classes = [
    cls(),
    cls(
      `-${variant === "solid" ? "primary" : variant === "text" || variant === "link" || variant === "dashed" ? variant : "default"}`,
    ),
    color && cls(`-color-${color}`),
    variant && cls(`-variant-${variant}`),
    cls(`-${size}`),
    size !== "middle" && cls(size === "large" ? "-lg" : "-sm"),
    cls(`-${shape}`),
    color === "danger" && cls("-dangerous"),
    ghost && cls("-background-ghost"),
    block && cls("-block"),
    loading && cls("-loading"),
    config.direction === "rtl" && cls("-rtl"),
    !hasContent && (Boolean(icon) || loading) && cls("-icon-only"),
    config.button?.className,
    className,
    rootClassName,
  ].filter(Boolean);
  const handleClick = (event: MouseEvent) => {
    if (disabled || loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };
  const loadingIcon =
    typeof props.loading === "object" ? props.loading.icon : undefined;
  const renderedIcon = loading ? (
    loadingIcon ? (
      <span className={cls("-icon")} aria-hidden="true">
        {loadingIcon}
      </span>
    ) : (
      <DefaultLoadingIcon prefixCls={prefixCls} />
    )
  ) : icon ? (
    <span className={cls("-icon")}>{icon}</span>
  ) : null;
  const content = (
    <>
      {iconPlacement === "start" ? renderedIcon : null}
      {hasContent ? <span>{label}</span> : null}
      {iconPlacement === "end" ? renderedIcon : null}
    </>
  );
  const preset =
    color && color !== "default" && color !== "primary" && color !== "danger"
      ? color === "pink"
        ? "magenta"
        : color
      : undefined;
  const tone = (index: number) => {
    if (preset)
      return config.token[`${preset}${index}` as keyof typeof config.token];
    const t = config.token;
    if (color === "primary" || color === "danger") {
      const name = color === "danger" ? "colorError" : "colorPrimary";
      return index === 1
        ? t[`${name}Bg`]
        : index === 2
          ? t[`${name}BgHover`]
          : index === 3
            ? t[`${name}Border`]
            : index === 5
              ? t[`${name}Hover`]
              : index === 7
                ? t[`${name}Active`]
                : t[name];
    }
    return index === 1
      ? t.colorFillTertiary
      : index === 2
        ? t.colorFillSecondary
        : index === 3
          ? t.colorFill
          : index === 5
            ? t.colorText
            : index === 7
              ? t.colorText
              : t.colorText;
  };
  const palette =
    color !== "default" || variant === "solid" || variant === "filled"
      ? {
          "--ao-btn-color": tone(6),
          "--ao-btn-border": tone(6),
          "--ao-btn-hover-color": tone(5),
          "--ao-btn-hover-border": tone(5),
          "--ao-btn-active-color": tone(7),
          "--ao-btn-active-border": tone(7),
          "--ao-btn-primary": tone(6),
          "--ao-btn-primary-hover": tone(5),
          "--ao-btn-primary-active": tone(7),
          "--ao-btn-text-color": tone(6),
          "--ao-btn-text-hover-color": tone(5),
          "--ao-btn-text-active-color": tone(7),
          "--ao-btn-text-hover-bg": tone(1),
          "--ao-btn-link": tone(6),
          "--ao-btn-link-hover": tone(5),
          "--ao-btn-link-active": tone(7),
          ...(variant === "filled"
            ? {
                "--ao-btn-bg": tone(1),
                "--ao-btn-hover-bg": tone(2),
                "--ao-btn-active-bg": tone(3),
                "--ao-btn-border": "transparent",
                "--ao-btn-hover-border": "transparent",
                "--ao-btn-active-border": "transparent",
              }
            : {}),
        }
      : {};
  const mergedStyle = {
    ...variables,
    ...palette,
    ...config.button?.style,
    ...style,
  } as CSSProperties;
  // Keep the live region outside the busy control so loading is announced.
  const loadingStatus = (
    <span className="ao-btn-loading-status" role="status" aria-live="polite">
      {loading ? "Loading" : ""}
    </span>
  );
  const loadingAnnouncement =
    typeof document === "undefined"
      ? null
      : createPortal(loadingStatus, document.body);
  if (href !== undefined) {
    return (
      <>
        <a
          id={props.id}
          title={props.title}
          aria-label={props["aria-label"]}
          aria-describedby={props["aria-describedby"]}
          ref={(element) => {
            node.current = element;
          }}
          href={disabled || loading ? undefined : href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          role={disabled || loading ? "link" : undefined}
          tabIndex={disabled ? -1 : (props.tabIndex ?? 0)}
          aria-disabled={disabled || undefined}
          aria-busy={loading || undefined}
          className={classes}
          style={mergedStyle}
          onClick={handleClick}
        >
          {content}
        </a>
        {loadingAnnouncement}
      </>
    );
  }
  return (
    <>
      <button
        {...rest}
        data-auto-focus={props.autoFocus ? "true" : undefined}
        ref={(element) => {
          node.current = element;
        }}
        type={htmlType}
        disabled={disabled}
        aria-busy={loading || undefined}
        className={classes}
        style={mergedStyle}
        onClick={handleClick}
      >
        {content}
      </button>
      {loadingAnnouncement}
    </>
  );
}
