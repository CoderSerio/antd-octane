/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "octane";
import { useComponentTokens } from "../_util/tokens";
import { Tooltip } from "../tooltip";
export interface FloatButtonProps {
  icon?: OctaneNode;
  description?: OctaneNode;
  tooltip?: OctaneNode;
  type?: "default" | "primary";
  shape?: "circle" | "square";
  href?: string;
  target?: string;
  onClick?: (event: MouseEvent) => void;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}
export interface FloatButtonGroupProps
  extends Omit<FloatButtonProps, "href" | "target"> {
  children?: OctaneNode;
  trigger?: "click" | "hover";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export interface BackTopProps extends Omit<FloatButtonProps, "target"> {
  visibilityHeight?: number;
  target?: () => Window | HTMLElement;
  duration?: number;
}
const GroupContext = createContext<{ shape?: "circle" | "square" } | null>(
  null,
);
function FloatButtonControl({
  icon,
  description,
  tooltip,
  type = "default",
  shape = "circle",
  href,
  target,
  onClick,
  className,
  style,
  "aria-label": label,
  "aria-expanded": expanded,
  "aria-controls": controls,
}: FloatButtonProps) {
  const { token: t, base } = useComponentTokens("FloatButton");
  const group = useContext(GroupContext);
  const actualShape = group?.shape ?? shape;
  const classes = [
    "ant-float-btn",
    `ant-float-btn-${type}`,
    `ant-float-btn-${actualShape}`,
    className,
  ];
  const vars = {
    ...base,
    "--ao-float-size": `${t.controlHeightLG}px`,
    "--ao-float-icon": `${t.fontSizeIcon * 1.5}px`,
    "--ao-float-bottom": `${t.marginXXL}px`,
    "--ao-float-z": t.zIndexPopupBase,
    "--ao-float-gap": `${t.margin}px`,
    "--ao-float-right": `${t.marginLG}px`,
    "--ao-float-bg": type === "primary" ? t.colorPrimary : t.colorBgElevated,
    "--ao-float-hover":
      type === "primary" ? t.colorPrimaryHover : t.controlItemBgHover,
    "--ao-float-color":
      type === "primary" ? t.colorTextLightSolid : t.colorText,
    "--ao-float-shadow": t.boxShadowSecondary,
    "--ao-float-desc": `${t.fontSizeSM}px`,
    ...style,
  };
  const body = (
    <span className="ant-float-btn-body">
      <span className="ant-float-btn-content">
        {(icon !== undefined || !description) && (
          <span className="ant-float-btn-icon">{icon ?? "?"}</span>
        )}
        {description && (
          <span className="ant-float-btn-description">{description}</span>
        )}
      </span>
    </span>
  );
  const node = href ? (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      className={classes}
      style={vars}
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={label}
    >
      {body}
    </a>
  ) : (
    <button
      type="button"
      className={classes}
      style={vars}
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={
        label ??
        (typeof description === "string"
          ? description
          : typeof tooltip === "string"
            ? tooltip
            : "浮动操作")
      }
    >
      {body}
    </button>
  );
  return tooltip ? (
    <Tooltip title={tooltip} trigger={["hover", "focus"]}>
      {node}
    </Tooltip>
  ) : (
    node
  );
}
function Group({
  children,
  trigger,
  open: controlled,
  onOpenChange,
  onClick,
  shape = "circle",
  icon,
  description,
  tooltip,
  type,
  className,
  style,
  ...rest
}: FloatButtonGroupProps) {
  const id = useId();
  const [inner, setInner] = useState(false);
  const open = controlled ?? inner;
  const { token: t, base } = useComponentTokens("FloatButton");
  const change = (next: boolean) => {
    if (controlled === undefined) setInner(next);
    onOpenChange?.(next);
  };
  return (
    <GroupContext value={{ shape }}>
      <fieldset
        aria-label="浮动操作组"
        onKeyDown={(event) => {
          if (event.key === "Escape" && trigger && open) {
            event.preventDefault();
            change(false);
            event.currentTarget
              .querySelector<HTMLButtonElement>(".ant-float-btn-group-trigger")
              ?.focus();
          }
        }}
        className={["ant-float-btn-group", className]}
        style={{
          ...base,
          "--ao-float-bottom": `${t.marginXXL}px`,
          "--ao-float-z": t.zIndexPopupBase,
          "--ao-float-gap": `${t.margin}px`,
          "--ao-float-right": `${t.marginLG}px`,
          ...style,
        }}
        onMouseEnter={() => {
          if (trigger === "hover") change(true);
        }}
        onMouseLeave={() => {
          if (trigger === "hover") change(false);
        }}
      >
        {(!trigger || open) && (
          <div id={id} className="ant-float-btn-group-items">
            {children}
          </div>
        )}
        {trigger && (
          <FloatButtonControl
            {...rest}
            className="ant-float-btn-group-trigger"
            aria-expanded={open}
            aria-controls={open ? id : undefined}
            shape={shape}
            type={type}
            icon={open ? "×" : (icon ?? "☰")}
            description={description}
            tooltip={tooltip}
            aria-label={open ? "收起浮动按钮组" : "展开浮动按钮组"}
            onClick={(event) => {
              onClick?.(event);
              if (!event.defaultPrevented) change(!open);
            }}
          />
        )}
      </fieldset>
    </GroupContext>
  );
}
function BackTop({
  visibilityHeight = 400,
  target,
  duration = 450,
  onClick,
  icon,
  ...rest
}: BackTopProps) {
  const { token: t } = useComponentTokens("FloatButton");
  const [visible, setVisible] = useState(false);
  const frame = useRef(0);
  useEffect(() => {
    const container = target?.() ?? window;
    const read = () =>
      setVisible(
        (container === window
          ? window.scrollY
          : (container as HTMLElement).scrollTop) >= visibilityHeight,
      );
    read();
    container.addEventListener("scroll", read, { passive: true });
    return () => {
      container.removeEventListener("scroll", read);
      cancelAnimationFrame(frame.current);
    };
  }, [target, visibilityHeight]);
  if (!visible) return null;
  return (
    <FloatButtonControl
      {...rest}
      icon={icon ?? "↑"}
      aria-label={rest["aria-label"] ?? "返回顶部"}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const container = target?.() ?? window;
        const start =
          container === window
            ? window.scrollY
            : (container as HTMLElement).scrollTop;
        const time = performance.now();
        const timeSpan =
          Number.isFinite(duration) && duration > 0 ? duration : 0;
        cancelAnimationFrame(frame.current);
        const animate = (now: number) => {
          const progress =
            timeSpan <= 0 ||
            !t.motion ||
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
              ? 1
              : Math.min(1, (now - time) / timeSpan);
          container.scrollTo(0, start * (1 - progress) ** 3);
          if (progress < 1) frame.current = requestAnimationFrame(animate);
        };
        frame.current = requestAnimationFrame(animate);
      }}
    />
  );
}
export const FloatButton = Object.assign(FloatButtonControl, {
  Group,
  BackTop,
});
