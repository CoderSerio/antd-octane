/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import {
  cloneElement,
  createPortal,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { componentClassName } from "../_util/componentClassName";
import {
  type FloatingAlign,
  type FloatingProps,
  floatingArrowStyleVars,
  type Placement,
  positionPopup,
} from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import {
  getPopupContainerElement,
  type PopupContainer,
} from "../config-provider/context";
import type { MenuProps } from "../menu";
export interface DropdownProps {
  children?: OctaneNode;
  arrow?: boolean | { pointAtCenter?: boolean };
  popupRender?: (menus: OctaneNode) => OctaneNode;
  dropdownRender?: (menus: OctaneNode) => OctaneNode;
  overlay?: OctaneNode | (() => OctaneNode);
  visible?: boolean;
  onVisibleChange?: (open: boolean) => void;
  prefixCls?: string;
  rootClassName?: string;
  align?: FloatingAlign;
  forceRender?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  openClassName?: string;
  menu?: MenuProps;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, info: { source: "trigger" | "menu" }) => void;
  trigger?: ("click" | "hover" | "contextMenu")[];
  placement?: Placement | "topCenter" | "bottomCenter";
  disabled?: boolean;
  autoFocus?: boolean;
  autoAdjustOverflow?: FloatingProps["autoAdjustOverflow"];
  getPopupContainer?: (trigger: HTMLElement) => PopupContainer;
  destroyOnHidden?: boolean;
  destroyPopupOnHide?: boolean;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
}
interface DropdownPopupProps extends DropdownProps {
  renderMenu?: (close: () => void) => OctaneNode;
}
export function DropdownPopup({
  children,
  arrow = false,
  popupRender,
  dropdownRender,
  overlay,
  visible,
  onVisibleChange,
  prefixCls: customPrefix,
  rootClassName,
  align,
  forceRender = false,
  mouseEnterDelay = 0.15,
  mouseLeaveDelay = 0.1,
  openClassName,
  renderMenu,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  trigger = ["hover"],
  placement: customPlacement,
  disabled = false,
  autoFocus = false,
  autoAdjustOverflow = true,
  getPopupContainer,
  destroyOnHidden,
  destroyPopupOnHide,
  overlayClassName,
  overlayStyle,
  className,
  style,
}: DropdownPopupProps) {
  const config = useConfig();
  const prefixCls = config.getPrefixCls("dropdown", customPrefix);
  const cls = (suffix = "") =>
    componentClassName("ant-dropdown", prefixCls, suffix);
  const classTokens = (
    Array.isArray(className)
      ? className.flat(Infinity).filter(Boolean).join(" ")
      : (className ?? "")
  ).split(/\s+/);
  const compactClass = classTokens.filter((name) =>
    name.startsWith("ant-space-compact-"),
  );
  const triggerClass = classTokens
    .filter((name) => !name.startsWith("ant-space-compact-"))
    .join(" ");
  const placement = (customPlacement?.replace("Center", "") ??
    (config.direction === "rtl" ? "bottomRight" : "bottomLeft")) as Placement;
  const controlledOpen = controlled ?? visible;
  const destroy = destroyOnHidden ?? destroyPopupOnHide ?? false;
  const { token: t, component: c, base } = useComponentTokens("Dropdown");
  const popupId = `ao-dropdown-${useId()}`;
  const [inner, setInner] = useState(defaultOpen);
  const open = !disabled && (controlledOpen ?? inner);
  const [mounted, setMounted] = useState(open || forceRender);
  const [contextVersion, setContextVersion] = useState(0);
  const [target, setTarget] = useState<PopupContainer | null>(null);
  const [position, setPosition] = useState<ReturnType<
    typeof positionPopup
  > | null>(null);
  const anchor = useRef<HTMLSpanElement | null>(null),
    popup = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const context = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const focusPending = useRef(false);
  const clear = () => {
    if (timer.current !== undefined) clearTimeout(timer.current);
    timer.current = undefined;
  };
  const change = (next: boolean, source: "trigger" | "menu" = "trigger") => {
    clear();
    if (disabled || next === open) return;
    if (controlledOpen === undefined) setInner(next);
    onOpenChange?.(next, { source });
    if (source === "trigger") onVisibleChange?.(next);
  };
  const restore = () => {
    (
      anchor.current?.querySelector(
        "button,a,input,[tabindex]",
      ) as HTMLElement | null
    )?.focus();
  };
  useEffect(() => () => clear(), []);
  useLayoutEffect(() => {
    if (anchor.current)
      setTarget(
        (getPopupContainer ?? config.getPopupContainer)?.(
          (anchor.current.firstElementChild as HTMLElement) ?? anchor.current,
        ) ?? document.body,
      );
  }, [getPopupContainer, config.getPopupContainer]);
  useLayoutEffect(() => {
    if (open || forceRender) setMounted(true);
    else if (destroy) setMounted(false);
  }, [open, forceRender, destroy]);
  useLayoutEffect(() => {
    const element = anchor.current?.firstElementChild;
    if (!element) return;
    const oldPopup = element.getAttribute("aria-haspopup"),
      oldExpanded = element.getAttribute("aria-expanded"),
      oldControls = element.getAttribute("aria-controls");
    element.setAttribute("aria-haspopup", "menu");
    element.setAttribute("aria-expanded", String(open));
    if (open)
      element.setAttribute(
        "aria-controls",
        `${oldControls ? `${oldControls} ` : ""}${popupId}`,
      );
    return () => {
      if (oldPopup === null) element.removeAttribute("aria-haspopup");
      else element.setAttribute("aria-haspopup", oldPopup);
      if (oldControls === null) element.removeAttribute("aria-controls");
      else element.setAttribute("aria-controls", oldControls);
      if (oldExpanded === null) element.removeAttribute("aria-expanded");
      else element.setAttribute("aria-expanded", oldExpanded);
    };
  }, [open, popupId]);
  useLayoutEffect(() => {
    if (!open || !target || !popup.current || !anchor.current) return;
    const host = anchor.current,
      box = popup.current;
    const update = () => {
      const triggerRect = (
        host.firstElementChild ?? host
      ).getBoundingClientRect();
      const minWidth =
        overlayStyle?.minWidth ?? config.dropdown?.style?.minWidth;
      box.style.minWidth =
        minWidth !== undefined
          ? typeof minWidth === "number"
            ? `${minWidth}px`
            : String(minWidth)
          : context.current
            ? ""
            : `${triggerRect.width}px`;
      const next = positionPopup(
        context.current ?? triggerRect,
        box.getBoundingClientRect(),
        { width: window.innerWidth, height: window.innerHeight },
        placement,
        autoAdjustOverflow,
        t.marginXXS + (arrow ? t.sizePopupArrow / 2 : 0),
        {
          align,
          pointAtCenter: typeof arrow === "object" && arrow.pointAtCenter,
          arrowOffsetHorizontal: t.borderRadius > 12 ? t.borderRadius + 2 : 12,
          arrowWidth: arrow ? t.sizePopupArrow : 0,
        },
      );
      const targetElement = getPopupContainerElement(target);
      if (targetElement !== document.body) {
        const rect = targetElement.getBoundingClientRect();
        next.x +=
          targetElement.scrollLeft - rect.left - targetElement.clientLeft;
        next.y += targetElement.scrollTop - rect.top - targetElement.clientTop;
      }
      setPosition((old) =>
        old?.x === next.x &&
        old?.y === next.y &&
        old?.placement === next.placement &&
        old?.arrowX === next.arrowX
          ? old
          : next,
      );
    };
    update();
    const outside = (event: PointerEvent) => {
      if (
        !host.contains(event.target as Node) &&
        !box.contains(event.target as Node)
      )
        change(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        change(false);
        restore();
      } else if (event.key === "Tab") change(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : undefined;
    observer?.observe(box);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      observer?.disconnect();
    };
  }, [
    open,
    target,
    mounted,
    placement,
    autoAdjustOverflow,
    autoFocus,
    controlled,
    onOpenChange,
    contextVersion,
    arrow,
    align,
  ]);
  const focusedOpen = useRef(false);
  useLayoutEffect(() => {
    if (!open) {
      focusedOpen.current = false;
      return;
    }
    if (
      !position ||
      !popup.current ||
      focusedOpen.current ||
      !(autoFocus || focusPending.current)
    )
      return;
    const item = popup.current.querySelector<HTMLElement>(
      '[role="menuitem"]:not(:disabled),[role="menuitemcheckbox"]:not(:disabled)',
    );
    if (item) {
      item.focus();
      focusPending.current = false;
      focusedOpen.current = true;
    }
  }, [open, position, mounted, autoFocus]);
  const enter = () => {
    clear();
    if (trigger.includes("hover"))
      timer.current = setTimeout(() => change(true), mouseEnterDelay * 1000);
  };
  const leave = () => {
    clear();
    if (trigger.includes("hover"))
      timer.current = setTimeout(() => change(false), mouseLeaveDelay * 1000);
  };
  const menuNode = renderMenu
    ? renderMenu(() => {
        change(false, "menu");
        restore();
      })
    : typeof overlay === "function"
      ? overlay()
      : overlay;
  const renderPopup = popupRender ?? dropdownRender;
  const content = renderPopup ? renderPopup(menuNode) : menuNode;
  const body = (
    // biome-ignore lint/a11y/noStaticElementInteractions: Hover boundaries wrap a keyboard-accessible Menu.
    <div
      ref={popup}
      id={popupId}
      onKeyDown={(event) => {
        if (
          (event.key === "Escape" ||
            (placement.startsWith("right") && event.key === "ArrowLeft") ||
            (placement.startsWith("left") && event.key === "ArrowRight")) &&
          !event.defaultPrevented
        ) {
          event.preventDefault();
          event.stopPropagation();
          change(false);
          restore();
        }
      }}
      hidden={!open}
      data-side={position?.side}
      className={[
        cls(),
        cls(`-placement-${position?.placement ?? placement}`),
        config.direction === "rtl" && cls("-rtl"),
        config.dropdown?.className,
        rootClassName,
        overlayClassName,
      ]}
      style={{
        ...base,
        ...floatingArrowStyleVars(t, t.borderRadius),
        position:
          getPopupContainerElement(target) === document.body
            ? "fixed"
            : "absolute",
        left: position?.x ?? 0,
        top: position?.y ?? 0,
        visibility: open && !position ? "hidden" : undefined,
        zIndex: c?.zIndexPopup ?? t.zIndexPopupBase + 50,
        "--ao-dropdown-padding": `${c?.paddingBlock ?? t.paddingXXS}px`,
        "--ao-dropdown-item-padding": `${t.paddingSM}px`,
        "--ao-dropdown-icon-gap": `${t.marginXS}px`,
        "--ao-dropdown-bg": t.colorBgElevated,
        "--ao-dropdown-selected":
          c?.controlItemBgActive ?? t.controlItemBgActive,
        "--ao-dropdown-shadow": t.boxShadowSecondary,
        "--ao-popup-bg": t.colorBgElevated,
        "--ao-arrow-x": `${position?.arrowX ?? 12}px`,
        "--ao-arrow-y": `${position?.arrowY ?? 12}px`,
        direction: config.direction,
        ...config.dropdown?.style,
        ...overlayStyle,
      }}
      onMouseEnter={clear}
      onMouseLeave={leave}
    >
      {arrow && <div className={cls("-arrow")} aria-hidden="true" />}
      {content}
    </div>
  );
  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Events delegate from the caller-provided interactive trigger; no extra tab stop. */}
      <span
        ref={anchor}
        className={["ao-dropdown-trigger", triggerClass, open && openClassName]}
        style={style}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onClick={() => {
          if (trigger.includes("click")) {
            context.current = null;
            change(!open);
          }
        }}
        onContextMenu={(event) => {
          if (disabled || !trigger.includes("contextMenu")) return;
          event.preventDefault();
          context.current = {
            left: event.clientX,
            top: event.clientY,
            width: 0,
            height: 0,
          };
          setPosition(null);
          setContextVersion((v) => v + 1);
          change(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            change(false);
            return;
          }
          if (event.key === "ArrowDown" && !disabled) {
            event.preventDefault();
            context.current = null;
            focusPending.current = true;
            change(true);
            if (open)
              (
                popup.current?.querySelector(
                  '[role="menuitem"]:not(:disabled)',
                ) as HTMLElement | null
              )?.focus();
          }
        }}
      >
        {isValidElement(children)
          ? cloneElement(children, {
              className: [
                cls("-trigger"),
                children.props.className,
                ...compactClass,
              ],
              disabled: children.props.disabled ?? disabled,
            })
          : children}
      </span>
      {target && mounted && createPortal(body, target)}
    </>
  );
}
