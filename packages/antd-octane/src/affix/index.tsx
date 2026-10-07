// Native adaptation of Ant Design 5.29.3 components/affix/index.tsx (MIT).
import type { CSSProperties, OctaneNode, Ref } from "octane";
import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "octane";
import throttleByAnimationFrame from "../_util/throttleByAnimationFrame";
import { useConfig } from "../config-provider";
import { getTargetContainerElement } from "../config-provider/context";
import useStyle from "./style";
import { getFixedBottom, getFixedTop, getTargetRect } from "./utils";

const TRIGGER_EVENTS: (keyof WindowEventMap)[] = [
  "resize",
  "scroll",
  "touchstart",
  "touchmove",
  "touchend",
  "pageshow",
  "load",
];
function getDefaultTarget() {
  return typeof window !== "undefined" ? window : null;
}
const AFFIX_STATUS_NONE = 0;
const AFFIX_STATUS_PREPARE = 1;

export interface AffixRef {
  updatePosition: ReturnType<typeof throttleByAnimationFrame<[]>>;
}
export interface AffixProps {
  offsetTop?: number;
  offsetBottom?: number;
  style?: CSSProperties;
  onChange?: (affixed?: boolean) => void;
  target?: () => Window | HTMLElement | null;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  children: OctaneNode;
  ref?: Ref<AffixRef>;
}

export function Affix({
  style,
  offsetTop,
  offsetBottom,
  prefixCls: customPrefix,
  className,
  rootClassName,
  children,
  target,
  onChange,
  ref,
  ...restProps
}: AffixProps) {
  const { getPrefixCls, getTargetContainer } = useConfig();
  const prefixCls = getPrefixCls("affix", customPrefix);
  const fixedStyle = useStyle();
  const targetFunc = target ?? getTargetContainer ?? getDefaultTarget;
  const internalOffsetTop =
    offsetBottom === undefined && offsetTop === undefined ? 0 : offsetTop;
  const [lastAffix, setLastAffix] = useState(false);
  const lastAffixRef = useRef(false);
  const [affixStyle, setAffixStyle] = useState<CSSProperties>();
  const [placeholderStyle, setPlaceholderStyle] = useState<CSSProperties>();
  const status = useRef(AFFIX_STATUS_NONE);
  const placeholderNodeRef = useRef<HTMLDivElement | null>(null);
  const fixedNodeRef = useRef<HTMLDivElement | null>(null);

  const measure = () => {
    if (
      status.current !== AFFIX_STATUS_PREPARE ||
      !fixedNodeRef.current ||
      !placeholderNodeRef.current
    )
      return;
    const targetNode = getTargetContainerElement(targetFunc());
    if (!targetNode) return;
    const placeholderRect = getTargetRect(placeholderNodeRef.current);
    if (
      placeholderRect.top === 0 &&
      placeholderRect.left === 0 &&
      placeholderRect.width === 0 &&
      placeholderRect.height === 0
    )
      return;
    const targetRect = getTargetRect(targetNode);
    const fixedTop = getFixedTop(
      placeholderRect,
      targetRect,
      internalOffsetTop,
    );
    const fixedBottom = getFixedBottom(
      placeholderRect,
      targetRect,
      offsetBottom,
    );
    let nextAffixStyle: CSSProperties | undefined;
    let nextPlaceholderStyle: CSSProperties | undefined;
    if (fixedTop !== undefined || fixedBottom !== undefined) {
      nextAffixStyle = {
        position: "fixed",
        ...(fixedTop !== undefined
          ? { top: fixedTop }
          : { bottom: fixedBottom }),
        width: placeholderRect.width,
        height: placeholderRect.height,
      };
      nextPlaceholderStyle = {
        width: placeholderRect.width,
        height: placeholderRect.height,
      };
    }
    const nextAffix = !!nextAffixStyle;
    // Multiple update/resize tasks can run before the microtask render commits.
    // Publish each state transition once, independently of the render snapshot.
    if (lastAffixRef.current !== nextAffix) onChange?.(nextAffix);
    lastAffixRef.current = nextAffix;
    status.current = AFFIX_STATUS_NONE;
    setAffixStyle(nextAffixStyle);
    setPlaceholderStyle(nextPlaceholderStyle);
    setLastAffix(nextAffix);
  };
  const prepareMeasure = () => {
    status.current = AFFIX_STATUS_PREPARE;
    measure();
  };
  const lazyPrepareMeasure = () => {
    if (affixStyle) {
      const targetNode = getTargetContainerElement(targetFunc());
      if (targetNode && placeholderNodeRef.current) {
        const targetRect = getTargetRect(targetNode);
        const placeholderRect = getTargetRect(placeholderNodeRef.current);
        const fixedTop = getFixedTop(
          placeholderRect,
          targetRect,
          internalOffsetTop,
        );
        const fixedBottom = getFixedBottom(
          placeholderRect,
          targetRect,
          offsetBottom,
        );
        if (
          (fixedTop !== undefined && affixStyle.top === fixedTop) ||
          (fixedBottom !== undefined && affixStyle.bottom === fixedBottom)
        )
          return;
      }
    }
    prepareMeasure();
  };
  const callbacks = useRef({ prepareMeasure, lazyPrepareMeasure });
  callbacks.current = { prepareMeasure, lazyPrepareMeasure };
  const updatePosition = useMemo(
    () => throttleByAnimationFrame(() => callbacks.current.prepareMeasure()),
    [],
  );
  const lazyUpdatePosition = useMemo(
    () =>
      throttleByAnimationFrame(() => callbacks.current.lazyPrepareMeasure()),
    [],
  );
  const prevTarget = useRef<Window | HTMLElement | null>(null);
  const addListeners = () => {
    const listenerTarget = getTargetContainerElement(targetFunc());
    if (!listenerTarget) return;
    TRIGGER_EVENTS.forEach((eventName) => {
      prevTarget.current?.removeEventListener(eventName, lazyUpdatePosition);
      listenerTarget.addEventListener(eventName, lazyUpdatePosition);
    });
    prevTarget.current = listenerTarget;
  };
  const removeListeners = () => {
    const newTarget = getTargetContainerElement(targetFunc());
    TRIGGER_EVENTS.forEach((eventName) => {
      newTarget?.removeEventListener(eventName, lazyUpdatePosition);
      prevTarget.current?.removeEventListener(eventName, lazyUpdatePosition);
    });
    updatePosition.cancel();
    lazyUpdatePosition.cancel();
  };
  const listeners = useRef({ addListeners, removeListeners });
  listeners.current = { addListeners, removeListeners };
  useImperativeHandle(ref, () => ({ updatePosition }), [updatePosition]);
  useEffect(() => {
    // Parent refs may be assigned after the child mounts.
    const timer = setTimeout(() => listeners.current.addListeners());
    return () => {
      clearTimeout(timer);
      listeners.current.removeListeners();
    };
  }, []);
  useEffect(() => {
    addListeners();
    return removeListeners;
  }, [target, affixStyle, lastAffix, offsetTop, offsetBottom]);
  useEffect(() => {
    updatePosition();
  }, [target, offsetTop, offsetBottom]);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const observedNodes = useRef(new Set<Element>());
  useLayoutEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    resizeObserver.current = new ResizeObserver(updatePosition);
    return () => {
      resizeObserver.current?.disconnect();
      resizeObserver.current = null;
      observedNodes.current.clear();
    };
  }, [updatePosition]);
  useLayoutEffect(() => {
    const observer = resizeObserver.current;
    if (!observer) return;
    // Keep observing the actual DOM nodes across descriptor re-renders, as
    // rc-resize-observer does. Re-observing would emit a spurious initial resize.
    const nodes = new Set<Element>(fixedNodeRef.current?.children ?? []);
    if (placeholderNodeRef.current) nodes.add(placeholderNodeRef.current);
    for (const node of observedNodes.current) {
      if (!nodes.has(node)) observer.unobserve(node);
    }
    for (const node of nodes) {
      if (!observedNodes.current.has(node)) observer.observe(node);
    }
    observedNodes.current = nodes;
  });
  return (
    <div
      style={style}
      className={className}
      ref={placeholderNodeRef}
      {...restProps}
    >
      {affixStyle && <div style={placeholderStyle} aria-hidden="true" />}
      <div
        ref={fixedNodeRef}
        className={affixStyle ? [rootClassName, prefixCls] : undefined}
        style={
          affixStyle
            ? {
                ...affixStyle,
                ...fixedStyle,
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
