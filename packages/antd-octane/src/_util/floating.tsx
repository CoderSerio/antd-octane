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
export type Placement =
  | "top"
  | "topLeft"
  | "topRight"
  | "bottom"
  | "bottomLeft"
  | "bottomRight"
  | "left"
  | "leftTop"
  | "leftBottom"
  | "right"
  | "rightTop"
  | "rightBottom";
export type Trigger = "hover" | "focus" | "click" | "contextMenu";
export interface FloatingProps {
  children?: OctaneNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: Trigger | Trigger[];
  placement?: Placement;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  autoAdjustOverflow?: boolean;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  arrow?: boolean;
  destroyOnHidden?: boolean;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
  zIndex?: number;
}
interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}
export function positionPopup(
  anchor: Rect,
  popup: { width: number; height: number },
  viewport: { width: number; height: number },
  placement: Placement,
  adjust = true,
  gap = 12,
) {
  let side = placement.startsWith("top")
    ? "top"
    : placement.startsWith("bottom")
      ? "bottom"
      : placement.startsWith("left")
        ? "left"
        : "right";
  const suffix = placement.slice(side.length);
  const available = {
    top: anchor.top,
    bottom: viewport.height - anchor.top - anchor.height,
    left: anchor.left,
    right: viewport.width - anchor.left - anchor.width,
  };
  const opposite = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  } as const;
  if (adjust) {
    const axisSize =
      side === "top" || side === "bottom" ? popup.height : popup.width;
    const direction = side as keyof typeof available;
    if (
      available[direction] < axisSize + gap &&
      available[opposite[direction]] > available[direction]
    )
      side = opposite[direction];
  }
  let x = anchor.left + (anchor.width - popup.width) / 2;
  let y = anchor.top + (anchor.height - popup.height) / 2;
  if (side === "top" || side === "bottom") {
    y =
      side === "top"
        ? anchor.top - popup.height - gap
        : anchor.top + anchor.height + gap;
    if (suffix === "Left") x = anchor.left;
    if (suffix === "Right") x = anchor.left + anchor.width - popup.width;
  } else {
    x =
      side === "left"
        ? anchor.left - popup.width - gap
        : anchor.left + anchor.width + gap;
    if (suffix === "Top") y = anchor.top;
    if (suffix === "Bottom") y = anchor.top + anchor.height - popup.height;
  }
  if (adjust) {
    x = Math.max(8, Math.min(x, viewport.width - popup.width - 8));
    y = Math.max(8, Math.min(y, viewport.height - popup.height - 8));
  }
  return {
    x,
    y,
    placement: `${side}${suffix}` as Placement,
    side,
    arrowX: Math.max(
      12,
      Math.min(popup.width - 12, anchor.left + anchor.width / 2 - x),
    ),
    arrowY: Math.max(
      12,
      Math.min(popup.height - 12, anchor.top + anchor.height / 2 - y),
    ),
  };
}
export function Floating({
  children,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  trigger = "hover",
  placement = "top",
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  autoAdjustOverflow = true,
  getPopupContainer,
  arrow = true,
  destroyOnHidden = false,
  overlayClassName,
  overlayStyle,
  className,
  style,
  zIndex,
  content,
  kind,
  popupStyle,
}: FloatingProps & {
  content?: OctaneNode;
  kind: "tooltip" | "popover";
  popupStyle: CSSProperties & Record<`--${string}`, string | number>;
}) {
  const [internal, setInternal] = useState(defaultOpen);
  const enabled =
    content !== null &&
    content !== undefined &&
    content !== false &&
    content !== "";
  const open = enabled && (controlled ?? internal);
  const anchor = useRef<HTMLSpanElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(open);
  const id = `ao-${kind}-${useId()}`;
  const [position, setPosition] = useState<ReturnType<
    typeof positionPopup
  > | null>(null);
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const clear = () => {
    if (timer.current !== undefined) clearTimeout(timer.current);
    timer.current = undefined;
  };
  const change = (next: boolean, delay = 0) => {
    clear();
    if (!enabled || next === open) return;
    const commit = () => {
      if (controlled === undefined) setInternal(next);
      onOpenChange?.(next);
    };
    if (delay > 0) timer.current = setTimeout(commit, delay * 1000);
    else commit();
  };
  useEffect(
    () => clear,
    [
      controlled,
      enabled,
      trigger,
      mouseEnterDelay,
      mouseLeaveDelay,
      onOpenChange,
    ],
  );
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
    const host = anchor.current;
    if (!host) return;
    const child = host.firstElementChild as HTMLElement | null;
    const element = child ?? host;
    const attr = kind === "tooltip" ? "aria-describedby" : "aria-controls";
    const old = element.getAttribute(attr);
    const expanded = element.getAttribute("aria-expanded");
    if (open) element.setAttribute(attr, `${old ? `${old} ` : ""}${id}`);
    if (kind === "popover") element.setAttribute("aria-expanded", String(open));
    return () => {
      if (old === null) element.removeAttribute(attr);
      else element.setAttribute(attr, old);
      if (kind === "popover") {
        if (expanded === null) element.removeAttribute("aria-expanded");
        else element.setAttribute("aria-expanded", expanded);
      }
    };
  }, [open, id, kind]);
  useEffect(() => {
    const host = anchor.current;
    if (!host) return;
    const listeners: [string, EventListener][] = [];
    const listen = (name: string, fn: EventListener) => {
      host.addEventListener(name, fn);
      listeners.push([name, fn]);
    };
    if (triggers.includes("hover")) {
      listen("mouseenter", () => change(true, mouseEnterDelay));
      listen("mouseleave", () => {
        if (
          !triggers.includes("focus") ||
          !host.contains(document.activeElement)
        )
          change(false, mouseLeaveDelay);
      });
    }
    if (triggers.includes("focus")) {
      listen("focusin", () => change(true));
      listen("focusout", (event) => {
        const next = (event as FocusEvent).relatedTarget as Node | null;
        if (!host.contains(next) && !popup.current?.contains(next))
          change(false, mouseLeaveDelay);
      });
    }
    if (triggers.includes("click")) listen("click", () => change(!open));
    if (triggers.includes("contextMenu"))
      listen("contextmenu", (event) => {
        event.preventDefault();
        change(true);
      });
    return () => {
      for (const [name, fn] of listeners) host.removeEventListener(name, fn);
    };
  }, [
    open,
    controlled,
    enabled,
    trigger,
    mouseEnterDelay,
    mouseLeaveDelay,
    onOpenChange,
  ]);
  useLayoutEffect(() => {
    if (!open || !target || !popup.current || !anchor.current) return;
    const host = anchor.current;
    const box = popup.current;
    const update = () => {
      const result = positionPopup(
        host.getBoundingClientRect(),
        box.getBoundingClientRect(),
        {
          width: document.documentElement.clientWidth || window.innerWidth,
          height: document.documentElement.clientHeight || window.innerHeight,
        },
        placement,
        autoAdjustOverflow,
        arrow ? 12 : 4,
      );
      if (target !== document.body && target !== document.documentElement) {
        const rect = target.getBoundingClientRect();
        result.x += target.scrollLeft - rect.left - target.clientLeft;
        result.y += target.scrollTop - rect.top - target.clientTop;
      }
      setPosition((previous) =>
        previous &&
        Object.keys(result).every(
          (key) =>
            previous[key as keyof typeof result] ===
            result[key as keyof typeof result],
        )
          ? previous
          : result,
      );
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(update);
    observer?.observe(host);
    observer?.observe(box);
    const outside = (event: Event) => {
      if (
        !host.contains(event.target as Node) &&
        !box.contains(event.target as Node)
      )
        change(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        change(false);
        if (box.contains(document.activeElement))
          (
            host.querySelector(
              "button,a,input,[tabindex]",
            ) as HTMLElement | null
          )?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      observer?.disconnect();
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [
    open,
    mounted,
    target,
    placement,
    autoAdjustOverflow,
    arrow,
    controlled,
    onOpenChange,
  ]);
  useEffect(() => {
    const box = popup.current;
    if (!box || !open) return;
    const enter = () => clear();
    const leave = () => {
      if (triggers.includes("hover") && !box.contains(document.activeElement))
        change(false, mouseLeaveDelay);
    };
    const blur = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (
        triggers.includes("focus") &&
        !box.contains(next) &&
        !anchor.current?.contains(next)
      )
        change(false, mouseLeaveDelay);
    };
    box.addEventListener("mouseenter", enter);
    box.addEventListener("mouseleave", leave);
    box.addEventListener("focusout", blur);
    return () => {
      box.removeEventListener("mouseenter", enter);
      box.removeEventListener("mouseleave", leave);
      box.removeEventListener("focusout", blur);
    };
  }, [open, mounted, trigger, mouseLeaveDelay, controlled, onOpenChange]);
  const body = (
    <div
      ref={popup}
      id={id}
      role={kind === "tooltip" ? "tooltip" : undefined}
      hidden={!open}
      className={[
        `ant-${kind}`,
        `ant-${kind}-placement-${position?.placement ?? placement}`,
        overlayClassName,
      ]}
      data-side={position?.side}
      style={{
        ...popupStyle,
        position:
          target === document.body || target === document.documentElement
            ? "fixed"
            : "absolute",
        left: position?.x ?? 0,
        top: position?.y ?? 0,
        visibility: open && !position ? "hidden" : undefined,
        "--ao-arrow-x": `${position?.arrowX ?? 12}px`,
        "--ao-arrow-y": `${position?.arrowY ?? 12}px`,
        zIndex,
        ...overlayStyle,
      }}
    >
      {arrow && <div className={`ant-${kind}-arrow`} aria-hidden="true" />}
      <div className={`ant-${kind}-inner`}>{content}</div>
    </div>
  );
  return (
    <>
      <span
        ref={anchor}
        className={["ao-floating-trigger", className]}
        style={style}
      >
        {children}
      </span>
      {target && mounted && createPortal(body, target)}
    </>
  );
}
