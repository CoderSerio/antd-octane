/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import {
  createPortal,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { type Placement, positionPopup } from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
import { Menu, type MenuProps } from "../menu";
export interface DropdownProps {
  children?: OctaneNode;
  menu?: MenuProps;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, info: { source: "trigger" | "menu" }) => void;
  trigger?: ("click" | "hover" | "contextMenu")[];
  placement?: Placement;
  disabled?: boolean;
  autoFocus?: boolean;
  autoAdjustOverflow?: boolean;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  destroyOnHidden?: boolean;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
}
export function Dropdown({
  children,
  menu,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  trigger = ["hover"],
  placement = "bottomLeft",
  disabled = false,
  autoFocus = false,
  autoAdjustOverflow = true,
  getPopupContainer,
  destroyOnHidden = false,
  overlayClassName,
  overlayStyle,
  className,
  style,
}: DropdownProps) {
  const { token: t, component: c, base } = useComponentTokens("Dropdown");
  const popupId = `ao-dropdown-${useId()}`;
  const [inner, setInner] = useState(defaultOpen);
  const open = !disabled && (controlled ?? inner);
  const [mounted, setMounted] = useState(open);
  const [contextVersion, setContextVersion] = useState(0);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
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
    if (controlled === undefined) setInner(next);
    onOpenChange?.(next, { source });
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
        getPopupContainer?.(
          (anchor.current.firstElementChild as HTMLElement) ?? anchor.current,
        ) ?? document.body,
      );
  }, [getPopupContainer]);
  useLayoutEffect(() => {
    if (open) setMounted(true);
    else if (destroyOnHidden) setMounted(false);
  }, [open, destroyOnHidden]);
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
      const next = positionPopup(
        context.current ?? host.getBoundingClientRect(),
        box.getBoundingClientRect(),
        { width: window.innerWidth, height: window.innerHeight },
        placement,
        autoAdjustOverflow,
        4,
      );
      if (target !== document.body) {
        const rect = target.getBoundingClientRect();
        next.x += target.scrollLeft - rect.left - target.clientLeft;
        next.y += target.scrollTop - rect.top - target.clientTop;
      }
      setPosition((old) =>
        old?.x === next.x && old?.y === next.y ? old : { x: next.x, y: next.y },
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
    if (trigger.includes("hover")) change(true);
  };
  const leave = () => {
    clear();
    if (trigger.includes("hover"))
      timer.current = setTimeout(() => change(false), 100);
  };
  const body = (
    // biome-ignore lint/a11y/noStaticElementInteractions: Hover boundaries wrap a keyboard-accessible Menu.
    <div
      ref={popup}
      id={popupId}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !event.defaultPrevented) {
          event.preventDefault();
          event.stopPropagation();
          change(false);
          restore();
        }
      }}
      hidden={!open}
      className={["ant-dropdown", overlayClassName]}
      style={{
        ...base,
        position: target === document.body ? "fixed" : "absolute",
        left: position?.x ?? 0,
        top: position?.y ?? 0,
        visibility: open && !position ? "hidden" : undefined,
        zIndex: c?.zIndexPopup ?? t.zIndexPopupBase + 50,
        "--ao-dropdown-padding": `${c?.paddingBlock ?? t.paddingXXS}px`,
        "--ao-dropdown-bg": t.colorBgElevated,
        "--ao-dropdown-selected":
          c?.controlItemBgActive ?? t.controlItemBgActive,
        "--ao-dropdown-shadow": t.boxShadowSecondary,
        ...overlayStyle,
      }}
      onMouseEnter={clear}
      onMouseLeave={leave}
    >
      <Menu
        {...menu}
        selectable={menu?.selectable ?? false}
        onClick={(info) => {
          menu?.onClick?.(info);
          change(false, "menu");
          restore();
        }}
      />
    </div>
  );
  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Events delegate from the caller-provided interactive trigger; no extra tab stop. */}
      <span
        ref={anchor}
        className={["ao-dropdown-trigger", className]}
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
        {children}
      </span>
      {target && mounted && createPortal(body, target)}
    </>
  );
}
