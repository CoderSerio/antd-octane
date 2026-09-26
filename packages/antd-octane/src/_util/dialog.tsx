import type { CSSProperties, OctaneNode } from "octane";
import { createPortal, useLayoutEffect, useRef, useState } from "octane";
export interface DialogLayerProps {
  open?: boolean;
  children?: OctaneNode;
  titleId?: string;
  label?: string;
  className: string;
  panelClassName: string;
  style?: CSSProperties & { [key: `--${string}`]: string | number | undefined };
  panelStyle?: CSSProperties;
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  autoFocus?: boolean;
  focusTriggerAfterClose?: boolean;
  destroyOnHidden?: boolean;
  forceRender?: boolean;
  getContainer?: HTMLElement | (() => HTMLElement) | false;
  onClose?: (event: MouseEvent | KeyboardEvent) => void;
  afterOpenChange?: (open: boolean) => void;
}
const layers: HTMLElement[] = [];
let origin: HTMLElement | null = null;
let locks = 0;
let originalOverflow = "";
let originalPadding = "";
function lockBody() {
  if (locks++ === 0) {
    originalOverflow = document.body.style.overflow;
    originalPadding = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0 && document.documentElement.clientWidth > 0)
      document.body.style.paddingRight = `${(parseFloat(getComputedStyle(document.body).paddingRight) || 0) + gap}px`;
  }
  return () => {
    if (--locks === 0) {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    }
  };
}
function ownedRoots(panel: HTMLElement) {
  const roots = [panel];
  for (let index = 0; index < roots.length; index++) {
    for (const trigger of roots[index].querySelectorAll("[aria-controls]")) {
      for (const id of (trigger.getAttribute("aria-controls") ?? "").split(
        /\s+/,
      )) {
        const popup = document.getElementById(id);
        if (
          popup &&
          !roots.includes(popup) &&
          !panel.contains(popup) &&
          !popup.closest("[hidden],[inert]") &&
          getComputedStyle(popup).display !== "none" &&
          getComputedStyle(popup).visibility !== "hidden"
        )
          roots.push(popup);
      }
    }
  }
  return roots;
}
function containsFocus(panel: HTMLElement, target: Node | null) {
  return (
    target !== null && ownedRoots(panel).some((root) => root.contains(target))
  );
}
function isVisible(node: HTMLElement) {
  for (
    let current: HTMLElement | null = node;
    current;
    current = current.parentElement
  ) {
    const style = getComputedStyle(current);
    if (style.display === "none" || style.visibility === "hidden") return false;
  }
  return true;
}
function focusables(panel: HTMLElement) {
  return [
    ...new Set(
      ownedRoots(panel).flatMap((root) => [
        ...root.querySelectorAll<HTMLElement>(
          "button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]",
        ),
      ]),
    ),
  ].filter(
    (node) =>
      node.tabIndex >= 0 &&
      !node.closest("[hidden],[inert]") &&
      isVisible(node),
  );
}
export function DialogLayer({
  open = false,
  children,
  titleId,
  label,
  className,
  panelClassName,
  style,
  panelStyle,
  mask = true,
  maskClosable = true,
  keyboard = true,
  autoFocus = true,
  focusTriggerAfterClose = true,
  destroyOnHidden = false,
  forceRender = false,
  getContainer,
  onClose,
  afterOpenChange,
}: DialogLayerProps) {
  const panel = useRef<HTMLDivElement | null>(null),
    latest = useRef({
      onClose,
      keyboard,
      focusTriggerAfterClose,
      afterOpenChange,
    }),
    wasOpen = useRef(false);
  latest.current = {
    onClose,
    keyboard,
    focusTriggerAfterClose,
    afterOpenChange,
  };
  const [mounted, setMounted] = useState(open || forceRender);
  const [host, setHost] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (getContainer === false) {
      setHost(null);
      return;
    }
    const target =
      typeof getContainer === "function"
        ? getContainer()
        : (getContainer ?? document.body);
    setHost(target);
  }, [getContainer]);
  useLayoutEffect(() => {
    if (open) setMounted(true);
    else if (destroyOnHidden && !forceRender) setMounted(false);
  }, [open, destroyOnHidden, forceRender]);
  useLayoutEffect(() => {
    const node = panel.current;
    if (!open || !node) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (!layers.length) origin = previous;
    layers.push(node);
    const unlock = lockBody();
    const top = () => layers[layers.length - 1] === node;
    const focusFirst = () => {
      (focusables(node)[0] ?? node).focus({ preventScroll: true });
    };
    const key = (event: KeyboardEvent) => {
      if (!top() || event.defaultPrevented) return;
      if (
        event.key === "Escape" &&
        latest.current.keyboard &&
        ownedRoots(node).length === 1
      ) {
        event.stopPropagation();
        event.preventDefault();
        latest.current.onClose?.(event);
      }
      if (event.key === "Tab") {
        const nodes = focusables(node),
          first = nodes[0],
          last = nodes[nodes.length - 1];
        if (!first) {
          event.preventDefault();
          node.focus();
        } else if (
          event.shiftKey &&
          (document.activeElement === first ||
            !containsFocus(node, document.activeElement))
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !containsFocus(node, document.activeElement))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const focus = (event: FocusEvent) => {
      if (top() && !containsFocus(node, event.target as Node)) focusFirst();
    };
    document.addEventListener("keydown", key);
    document.addEventListener("focusin", focus);
    if (autoFocus) focusFirst();
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("focusin", focus);
      const index = layers.indexOf(node);
      if (index >= 0) layers.splice(index, 1);
      unlock();
      if (latest.current.focusTriggerAfterClose) {
        const next = layers[layers.length - 1];
        const restore = previous?.isConnected
          ? previous
          : origin?.isConnected
            ? origin
            : null;
        if (restore && (!next || containsFocus(next, restore)))
          restore.focus({ preventScroll: true });
        else if (next) (focusables(next)[0] ?? next).focus();
      }
      if (!layers.length) origin = null;
    };
  }, [open, host, mounted, autoFocus]);
  useLayoutEffect(() => {
    if (open !== wasOpen.current && (!open || panel.current)) {
      wasOpen.current = open;
      latest.current.afterOpenChange?.(open);
    }
  }, [open, host, mounted]);
  if (!open && !mounted && !forceRender) return null;
  const content = (
    <div className={className} style={style} hidden={!open}>
      {mask && <div className="ao-dialog-mask" />}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: The backdrop is a pointer shortcut; Escape and the close button provide keyboard dismissal. */}
      <div
        className="ao-dialog-wrap"
        style={{ pointerEvents: mask ? undefined : "none" }}
        onMouseDown={(event) => {
          if (
            event.target === event.currentTarget &&
            mask &&
            maskClosable &&
            layers[layers.length - 1] === panel.current
          )
            onClose?.(event);
        }}
      >
        <div
          ref={panel}
          role="dialog"
          aria-modal={open && mask ? true : undefined}
          aria-labelledby={titleId}
          aria-label={titleId ? undefined : (label ?? "对话框")}
          tabIndex={-1}
          className={panelClassName}
          style={panelStyle}
        >
          {children}
        </div>
      </div>
    </div>
  );
  return getContainer === false
    ? content
    : host
      ? createPortal(content, host)
      : null;
}
