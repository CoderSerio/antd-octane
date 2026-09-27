/** @jsxImportSource octane */
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  OctaneNode,
  Ref,
} from "octane";
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "octane";
import { useConfig } from "../config-provider";
import { buttonVariables } from "./tokens";

export interface ButtonRef {
  nativeElement: HTMLButtonElement | HTMLAnchorElement | null;
  focus: (options?: FocusOptions) => void;
  blur: () => void;
}
export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "ref" | "children" | "style" | "onClick"
  > {
  type?: "default" | "primary" | "dashed" | "text" | "link";
  htmlType?: "button" | "submit" | "reset";
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
  useImperativeHandle(
    props.ref,
    () => ({
      get nativeElement() {
        return node.current;
      },
      focus: (options?: FocusOptions) => node.current?.focus(options),
      blur: () => node.current?.blur(),
    }),
    [],
  );
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
    children,
    href,
    target,
    rel,
    style,
    className,
    ref: _ref,
    onClick,
    ...rest
  } = props;
  const loading = innerLoading;
  const iconPlacement = requestedIconPlacement ?? iconPosition ?? "start";
  const hasContent =
    children !== undefined &&
    children !== null &&
    children !== false &&
    children !== "";
  const classes = [
    "ant-btn",
    `ant-btn-${type}`,
    `ant-btn-${size}`,
    `ant-btn-${shape}`,
    danger && "ant-btn-dangerous",
    ghost && "ant-btn-background-ghost",
    block && "ant-btn-block",
    loading && "ant-btn-loading",
    !hasContent && (Boolean(icon) || loading) && "ant-btn-icon-only",
    className,
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
      <span className="ant-btn-icon" aria-hidden="true">
        {loadingIcon}
      </span>
    ) : (
      <span className="ao-btn-spinner" aria-hidden="true" />
    )
  ) : icon ? (
    <span className="ant-btn-icon">{icon}</span>
  ) : null;
  const content = (
    <>
      {iconPlacement === "start" ? renderedIcon : null}
      {hasContent ? <span>{children}</span> : null}
      {iconPlacement === "end" ? renderedIcon : null}
    </>
  );
  const mergedStyle = { ...variables, ...style };
  if (href !== undefined) {
    return (
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
    );
  }
  return (
    <button
      {...rest}
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
  );
}
