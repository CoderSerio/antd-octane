/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import { createPortal, useLayoutEffect, useRef, useState } from "octane";
import type { PopupContainer } from "../config-provider/context";
import { usePanelRef } from "../watermark/context";
import { useMotion } from "./useMotion";
export interface DialogLayerProps {
  mode?: "modal" | "drawer";
  /** Shared container context priority, independent of effect registration order. */
  layerZIndex?: number;
  open?: boolean;
  children?: OctaneNode;
  titleId?: string;
  label?: string;
  className: string;
  panelClassName: string;
  hiddenPanelClassName?: string;
  style?: CSSProperties & { [key: `--${string}`]: string | number | undefined };
  panelStyle?: CSSProperties;
  maskStyle?: CSSProperties;
  maskClassName?: string;
  maskProps?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  wrapStyle?: CSSProperties;
  wrapClassName?: string;
  wrapProps?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  panelProps?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  panelRef?: Ref<HTMLDivElement>;
  panelSelector?: string;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  autoFocus?: boolean;
  /** Internal distinction between rc-drawer root focus and dialog button focus. */
  initialFocus?: "root" | "first";
  focusTriggerAfterClose?: boolean;
  destroyOnHidden?: boolean;
  forceRender?: boolean;
  getContainer?: string | PopupContainer | (() => PopupContainer) | false;
  onClose?: (event: MouseEvent | KeyboardEvent) => void;
  afterOpenChange?: (open: boolean) => void;
  motionName?: string;
  maskMotionName?: string;
  nativeMotion?: boolean;
  nativeMaskMotion?: boolean;
  motion?: boolean;
  motionDeadline?: number;
  mousePosition?: { x: number; y: number } | null;
}
const layers: HTMLElement[] = [];
const layerPriorities = new WeakMap<HTMLElement, number>();
function sortLayers() {
  layers.sort(
    (a, b) => (layerPriorities.get(a) ?? 0) - (layerPriorities.get(b) ?? 0),
  );
}
let origin: HTMLElement | null = null;
let locks = 0;
let originalOverflow = "";
let originalOverflowX = "";
let originalOverflowY = "";
let originalPadding = "";
function lockBody() {
  if (locks++ === 0) {
    originalOverflow = document.body.style.overflow;
    originalOverflowX = document.body.style.overflowX;
    originalOverflowY = document.body.style.overflowY;
    originalPadding = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    // rc-util ScrollLocker hides the vertical scrollbar without forcing overflow-x.
    document.body.style.overflowY = "hidden";
    if (gap > 0 && document.documentElement.clientWidth > 0)
      document.body.style.paddingRight = `${(parseFloat(getComputedStyle(document.body).paddingRight) || 0) + gap}px`;
  }
  return () => {
    if (--locks === 0) {
      document.body.style.overflow = originalOverflow;
      document.body.style.overflowX = originalOverflowX;
      document.body.style.overflowY = originalOverflowY;
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
  mode = "modal",
  layerZIndex,
  open = false,
  children,
  titleId,
  label,
  className,
  panelClassName,
  hiddenPanelClassName,
  style,
  panelStyle,
  maskStyle,
  maskClassName,
  maskProps,
  wrapStyle,
  wrapClassName,
  wrapProps,
  panelProps,
  panelRef,
  panelSelector,
  rootProps,
  mask = true,
  maskClosable = true,
  keyboard = true,
  autoFocus = true,
  initialFocus = "first",
  focusTriggerAfterClose = true,
  destroyOnHidden = false,
  forceRender = false,
  getContainer,
  onClose,
  afterOpenChange,
  motionName = "",
  maskMotionName = "",
  nativeMotion = true,
  nativeMaskMotion = true,
  motion = true,
  motionDeadline,
  mousePosition,
}: DialogLayerProps) {
  const watermarkPanelRef = usePanelRef(
    panelSelector ??
      (panelClassName.includes("drawer")
        ? ".ant-drawer-content"
        : ".ant-modal-content"),
  );
  const layerRoot = useRef<HTMLDivElement | null>(null),
    sentinelStart = useRef<HTMLDivElement | null>(null),
    sentinelEnd = useRef<HTMLDivElement | null>(null),
    panel = useRef<HTMLDivElement | null>(null),
    maskElement = useRef<HTMLDivElement | null>(null),
    lastOutside = useRef<HTMLElement | null>(null),
    latest = useRef({
      onClose,
      open,
      keyboard,
      focusTriggerAfterClose,
      afterOpenChange,
    });
  latest.current = {
    onClose,
    open,
    keyboard,
    focusTriggerAfterClose,
    afterOpenChange,
  };
  const contentMouseDown = useRef(false);
  const contentTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const cachedChildren = useRef(children);
  if (mode !== "modal" || open || forceRender)
    cachedChildren.current = children;
  useLayoutEffect(() => () => clearTimeout(contentTimer.current), []);
  // Capture the trigger when opening, before a nested portal can take focus.
  // rc-dialog and rc-drawer keep this independently of their animated visibility.
  useLayoutEffect(() => {
    if (
      open &&
      document.activeElement instanceof HTMLElement &&
      !panel.current?.parentElement?.contains(document.activeElement)
    ) {
      lastOutside.current = document.activeElement;
    }
  }, [open]);
  const [mounted, setMounted] = useState(open || forceRender);
  const [host, setHost] = useState<PopupContainer | null>(null);
  const ready = mounted && (getContainer === false || host !== null);
  const panelMotion = useMotion(open, panel, {
    enabled: motion && !!motionName,
    ready,
    deadline: motionDeadline,
    onVisibleChanged: (next) => {
      const node = panel.current;
      if (
        next &&
        autoFocus &&
        node &&
        layers[layers.length - 1] === node &&
        document.activeElement !== layerRoot.current &&
        document.activeElement !== node.parentElement &&
        !containsFocus(node, document.activeElement)
      ) {
        (initialFocus === "root"
          ? layerRoot.current
          : sentinelStart.current
        )?.focus({
          preventScroll: true,
        });
      }
      if (
        !next &&
        mode === "modal" &&
        mask &&
        latest.current.focusTriggerAfterClose
      ) {
        lastOutside.current?.focus({ preventScroll: true });
      }
      latest.current.afterOpenChange?.(next);
    },
  });
  const maskMotion = useMotion(open, maskElement, {
    enabled: motion && !!maskMotionName,
    ready,
    deadline: motionDeadline,
  });
  const shown = panelMotion.present;
  useLayoutEffect(() => {
    if (getContainer === false) {
      setHost(null);
      return;
    }
    const target =
      typeof getContainer === "string"
        ? (document.querySelector<HTMLElement>(getContainer) ?? document.body)
        : typeof getContainer === "function"
          ? getContainer()
          : (getContainer ?? document.body);
    setHost(target);
  }, [getContainer, wrapProps?.onKeyDown]);
  useLayoutEffect(() => {
    if (open) setMounted(true);
    else if (!shown && destroyOnHidden && !forceRender) setMounted(false);
  }, [open, shown, destroyOnHidden, forceRender]);
  useLayoutEffect(() => {
    const node = panel.current;
    if (!shown || !node) return;
    const previous = lastOutside.current;
    if (!layers.length) origin = previous;
    layerPriorities.set(
      node,
      layerZIndex ?? (layerPriorities.get(layers[layers.length - 1]) ?? 0) + 1,
    );
    layers.push(node);
    sortLayers();
    const unlock =
      getContainer === false ||
      host !== document.body ||
      (mode === "drawer" && !mask)
        ? () => {}
        : lockBody();
    const top = () => layers[layers.length - 1] === node;
    const focusFirst = () => {
      if (initialFocus === "root") {
        layerRoot.current?.focus({ preventScroll: true });
        return;
      }
      if (mode === "modal") {
        sentinelStart.current?.focus({ preventScroll: true });
        return;
      }
      const candidates = focusables(node);
      (
        candidates.find(
          (item) =>
            item.hasAttribute("autofocus") || item.dataset.autoFocus === "true",
        ) ??
        candidates[0] ??
        node
      ).focus({ preventScroll: true });
    };
    const key = (event: KeyboardEvent) => {
      if (!top()) return;
      if (
        !(mode === "drawer" ? layerRoot.current : node.parentElement)?.contains(
          event.target as Node,
        )
      )
        return;
      if (
        event.key === "Escape" &&
        latest.current.open &&
        latest.current.keyboard &&
        (mode === "drawer" || ownedRoots(node).length === 1)
      ) {
        event.stopPropagation();
        latest.current.onClose?.(event);
      }
      if (event.key === "Tab") {
        if (!event.shiftKey && document.activeElement === sentinelEnd.current)
          sentinelStart.current?.focus({ preventScroll: true });
        else if (
          event.shiftKey &&
          document.activeElement === sentinelStart.current
        )
          sentinelEnd.current?.focus({ preventScroll: true });
      }
    };
    const keyTarget = mode === "drawer" ? document : node.parentElement;
    const attachKey = mode === "drawer" || !wrapProps?.onKeyDown;
    if (attachKey) keyTarget?.addEventListener("keydown", key as EventListener);
    if (autoFocus && top()) focusFirst();
    return () => {
      if (attachKey)
        keyTarget?.removeEventListener("keydown", key as EventListener);
      const index = layers.indexOf(node);
      if (index >= 0) layers.splice(index, 1);
      unlock();
      if (
        latest.current.focusTriggerAfterClose &&
        (mode === "drawer" || (!latest.current.open && mask))
      ) {
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
  }, [
    shown,
    host,
    mounted,
    autoFocus,
    initialFocus,
    mode,
    mask,
    getContainer,
    wrapProps?.onKeyDown,
  ]);
  useLayoutEffect(() => {
    const node = panel.current;
    if (node && layerZIndex !== undefined && layers.includes(node)) {
      layerPriorities.set(node, layerZIndex);
      sortLayers();
    }
  }, [layerZIndex]);
  useLayoutEffect(() => {
    const node = panel.current;
    if (!node || !open || !mousePosition) return;
    const rect = node.getBoundingClientRect();
    node.style.transformOrigin = `${mousePosition.x - rect.left - window.scrollX}px ${mousePosition.y - rect.top - window.scrollY}px`;
  }, [open, host, mounted, mousePosition]);
  if (!shown && !mounted && !forceRender) return null;
  const panelNode = (
    // biome-ignore lint/a11y/noStaticElementInteractions: rc-dialog tracks pointer presses inside its dialog panel.
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: Modal panels have role=dialog; Drawer wrappers carry no dialog ARIA.
    <div
      {...panelProps}
      ref={[panel, panelRef, watermarkPanelRef]}
      role={mode === "drawer" ? undefined : "dialog"}
      aria-modal={mode === "drawer" ? undefined : true}
      aria-labelledby={mode === "drawer" ? undefined : titleId}
      aria-label={mode === "drawer" ? undefined : label}
      onMouseDown={
        mode === "modal"
          ? () => {
              clearTimeout(contentTimer.current);
              contentMouseDown.current = true;
            }
          : undefined
      }
      onMouseUp={
        mode === "modal"
          ? () => {
              contentTimer.current = setTimeout(() => {
                contentMouseDown.current = false;
              });
            }
          : undefined
      }
      className={[
        panelProps?.className,
        panelClassName,
        mode === "drawer" && !shown && hiddenPanelClassName,
        panelMotion.className(motionName),
      ]}
      data-motion-phase={panelMotion.phase}
      data-motion-active={panelMotion.active ? "true" : undefined}
      data-native-motion={nativeMotion ? "true" : undefined}
      style={{
        display: mode === "modal" && !shown ? "none" : undefined,
        ...panelProps?.style,
        ...panelStyle,
      }}
    >
      {mode === "modal" ? (
        <>
          <div
            ref={sentinelStart}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: rc-dialog focuses this content sentinel when opening.
            tabIndex={0}
            style={{ outline: "none" }}
            data-sentinel="start"
          >
            {cachedChildren.current}
          </div>
          <div
            ref={sentinelEnd}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: rc-dialog uses a zero-size end sentinel to wrap keyboard focus.
            tabIndex={0}
            style={{ width: 0, height: 0, overflow: "hidden", outline: "none" }}
            data-sentinel="end"
          />
        </>
      ) : (
        children
      )}
    </div>
  );
  const sentinelStyle: CSSProperties = {
    width: 0,
    height: 0,
    overflow: "hidden",
    outline: "none",
    position: "absolute",
  };
  const content = (
    <div
      {...rootProps}
      ref={layerRoot}
      tabIndex={initialFocus === "root" ? -1 : undefined}
      className={className}
      style={style}
    >
      {mask && shown && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: Escape and the close button provide keyboard dismissal.
        // biome-ignore lint/a11y/noStaticElementInteractions: The mask is a pointer shortcut matching rc-drawer.
        <div
          ref={maskElement}
          className={[
            "ao-dialog-mask",
            maskClassName,
            maskMotion.className(maskMotionName),
          ]}
          style={maskStyle}
          data-motion-phase={maskMotion.phase}
          data-motion-active={maskMotion.active ? "true" : undefined}
          data-native-motion={nativeMaskMotion ? "true" : undefined}
          onClick={
            mode === "drawer" && maskClosable && open ? onClose : undefined
          }
          {...maskProps}
        />
      )}
      {mode === "drawer" ? (
        <>
          {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: rc-drawer uses hidden zero-size sentinels to wrap keyboard focus. */}
          <div
            ref={sentinelStart}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: The sentinel catches Tab at the drawer boundary.
            tabIndex={0}
            style={sentinelStyle}
            aria-hidden="true"
            data-sentinel="start"
          />
          {panelNode}
          {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: rc-drawer uses hidden zero-size sentinels to wrap keyboard focus. */}
          <div
            ref={sentinelEnd}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: The sentinel catches Tab at the drawer boundary.
            tabIndex={0}
            style={sentinelStyle}
            aria-hidden="true"
            data-sentinel="end"
          />
        </>
      ) : (
        <>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape and the close button provide keyboard dismissal. */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: The backdrop is a pointer shortcut; Escape and the close button provide keyboard dismissal. */}
          <div
            className={["ao-dialog-wrap", wrapClassName]}
            tabIndex={-1}
            style={{
              ...wrapStyle,
              display: !shown ? "none" : undefined,
            }}
            onClick={(event) => {
              if (contentMouseDown.current) {
                contentMouseDown.current = false;
                return;
              }
              if (
                event.target === event.currentTarget &&
                open &&
                maskClosable &&
                layers[layers.length - 1] === panel.current
              )
                onClose?.(event);
            }}
            {...wrapProps}
          >
            {panelNode}
          </div>
        </>
      )}
    </div>
  );
  return getContainer === false
    ? content
    : host
      ? createPortal(content, host)
      : null;
}
