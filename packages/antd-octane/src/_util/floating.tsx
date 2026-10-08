/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode, Ref } from "octane";
import {
  cloneElement,
  createContext,
  createPortal,
  Fragment,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { useConfig } from "../config-provider";
import {
  getPopupContainerElement,
  type PopupContainer,
} from "../config-provider/context";
import getLayoutSize from "./getLayoutSize";
import getPopupContainerSize from "./getPopupContainerSize";
import { devUseWarning } from "./warning";

// Native equivalent of rc-trigger's popup-child registration. Portals keep
// their logical parent even when both popup elements are mounted in body.
const FloatingParentContext = createContext<string | undefined>(undefined);

export function useFloatingParentId() {
  return useContext(FloatingParentContext);
}

function containsNestedPopup(id: string, target: EventTarget | null) {
  const element =
    target instanceof Element
      ? target
      : target instanceof Node
        ? target.parentElement
        : null;
  let popup = element?.closest<HTMLElement>("[data-ao-floating-parent]");
  const visited = new Set<string>();
  while (popup) {
    const parent = popup.dataset.aoFloatingParent;
    if (parent === id) return true;
    if (!parent || visited.has(parent)) return false;
    visited.add(parent);
    popup = document.getElementById(parent);
  }
  return false;
}
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
export type FloatingOffset = number | string;
export interface FloatingOverflow {
  adjustX?: boolean | number;
  adjustY?: boolean | number;
  shiftX?: boolean | number;
  shiftY?: boolean | number;
}
export interface FloatingAlign {
  points?: string[];
  offset?: FloatingOffset[];
  targetOffset?: FloatingOffset[];
  overflow?: FloatingOverflow;
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
  autoArrow?: boolean;
  htmlRegion?: "visible" | "scroll" | "visibleFirst";
  dynamicInset?: boolean;
  ignoreShake?: boolean;
  _experimental?: Record<string, unknown>;
}
export interface FloatingPlacement extends FloatingAlign {
  [field: string]: unknown;
}
export type FloatingBuiltinPlacements = Record<string, FloatingPlacement>;
export interface TooltipRef {
  /** @deprecated Use forceAlign instead. */
  forcePopupAlign: VoidFunction;
  forceAlign: VoidFunction;
  nativeElement: HTMLElement;
  popupElement: HTMLDivElement;
}
export function floatingArrowStyleVars(
  token: {
    sizePopupArrow: number;
    borderRadiusXS: number;
    borderRadiusOuter: number;
    boxShadowPopoverArrow: string;
    marginXXS: number;
  },
  contentRadius: number,
  outerRadius = token.borderRadiusOuter,
) {
  const size = token.sizePopupArrow;
  const half = size / 2;
  const smallRadius = token.borderRadiusXS;
  const rootTwo = Math.sqrt(2);
  const bx = outerRadius / rootTwo;
  const by = half - outerRadius * (1 - 1 / rootTwo);
  const cx = half - smallRadius / rootTwo;
  const cy = outerRadius * (rootTwo - 1) + smallRadius / rootTwo;
  const dx = size - cx;
  const ex = size - bx;
  const shadowSize = half * rootTwo + outerRadius * (rootTwo - 2);
  const polygonOffset = outerRadius * (rootTwo - 1);
  const arrowOffsetHorizontal = contentRadius > 12 ? contentRadius + 2 : 12;
  return {
    "--ao-popup-arrow-size": `${size}px`,
    "--ao-popup-arrow-shadow-size": `${shadowSize}px`,
    "--ao-popup-arrow-shadow": token.boxShadowPopoverArrow,
    "--ao-popup-arrow-radius": `${smallRadius}px`,
    "--ao-popup-arrow-gap": `${token.marginXXS}px`,
    "--ao-popup-arrow-offset-horizontal": `${arrowOffsetHorizontal}px`,
    "--ao-popup-arrow-offset-vertical": `${Math.min(8, arrowOffsetHorizontal)}px`,
    "--ao-popup-arrow-polygon": `polygon(${polygonOffset}px 100%, 50% ${polygonOffset}px, ${size - polygonOffset}px 100%, ${polygonOffset}px 100%)`,
    "--ao-popup-arrow-path": `path('M 0 ${half} A ${outerRadius} ${outerRadius} 0 0 0 ${bx} ${by} L ${cx} ${cy} A ${smallRadius} ${smallRadius} 0 0 1 ${dx} ${cy} L ${ex} ${by} A ${outerRadius} ${outerRadius} 0 0 0 ${size} ${half} Z')`,
    "--ao-popup-tooltip-min-width": `${contentRadius * 2 + size}px`,
    "--ao-popup-tooltip-edge-min-width": `${contentRadius + size + arrowOffsetHorizontal}px`,
  };
}
export interface FloatingProps {
  children?: OctaneNode;
  prefixCls?: string;
  color?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, event?: Event) => void;
  afterOpenChange?: (open: boolean) => void;
  /** @deprecated Use afterOpenChange instead. */
  afterVisibleChange?: (visible: boolean) => void;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  trigger?: Trigger | Trigger[];
  placement?: Placement;
  align?: FloatingAlign;
  builtinPlacements?: FloatingBuiltinPlacements;
  onPopupAlign?: (element: HTMLElement, align: FloatingAlign) => void;
  forceRender?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  autoAdjustOverflow?: boolean | { adjustX?: 0 | 1; adjustY?: 0 | 1 };
  getPopupContainer?: (trigger: HTMLElement) => PopupContainer;
  getTooltipContainer?: (trigger: HTMLElement) => PopupContainer;
  arrowPointAtCenter?: boolean;
  arrow?: boolean | { pointAtCenter?: boolean; arrowPointAtCenter?: boolean };
  fresh?: boolean;
  destroyOnHidden?: boolean;
  destroyTooltipOnHide?: boolean | { keepParent?: boolean };
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  /** @deprecated Use styles.body instead. */
  overlayInnerStyle?: CSSProperties;
  rootClassName?: string;
  classNames?: { root?: string; body?: string };
  styles?: { root?: CSSProperties; body?: CSSProperties };
  openClassName?: string;
  triggerClassName?: string;
  triggerStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
  zIndex?: number;
  transitionName?: string;
  ref?: Ref<TooltipRef>;
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
  viewport: { width: number; height: number; left?: number; top?: number },
  placement: Placement,
  adjust: boolean | { adjustX?: 0 | 1; adjustY?: 0 | 1 } = true,
  gap = 12,
  options: {
    align?: FloatingAlign;
    builtinPlacements?: FloatingBuiltinPlacements;
    scrollRegion?: {
      width: number;
      height: number;
      left?: number;
      top?: number;
    };
    pointAtCenter?: boolean;
    arrowOffsetHorizontal?: number;
    arrowOffsetVertical?: number;
    arrowWidth?: number;
  } = {},
) {
  // Keep the point/offset and overflow rules aligned with @rc-component/trigger's
  // useAlign and Ant Design's getPlacements. This is a native Octane adaptation.
  let side = placement.startsWith("top")
    ? "top"
    : placement.startsWith("bottom")
      ? "bottom"
      : placement.startsWith("left")
        ? "left"
        : "right";
  let suffix = placement.slice(side.length);
  const effectivePlacement = `${side}${suffix}` as Placement;
  const regularPoints: Record<Placement, [string, string]> = {
    left: ["cr", "cl"],
    right: ["cl", "cr"],
    top: ["bc", "tc"],
    bottom: ["tc", "bc"],
    topLeft: ["bl", "tl"],
    leftTop: ["tr", "tl"],
    topRight: ["br", "tr"],
    rightTop: ["tl", "tr"],
    bottomRight: ["tr", "br"],
    rightBottom: ["bl", "br"],
    bottomLeft: ["tl", "bl"],
    leftBottom: ["br", "bl"],
  };
  const centerPoints: Partial<Record<Placement, [string, string]>> = {
    topLeft: ["bl", "tc"],
    leftTop: ["tr", "cl"],
    topRight: ["br", "tc"],
    rightTop: ["tl", "cr"],
    bottomRight: ["tr", "bc"],
    rightBottom: ["bl", "cr"],
    bottomLeft: ["tl", "bc"],
    leftBottom: ["br", "cl"],
  };
  const pointOffset = (
    rect: Rect | { width: number; height: number },
    point: string,
  ) => {
    const vertical = point[0];
    const horizontal = point[1];
    return {
      x:
        horizontal === "l"
          ? 0
          : horizontal === "r"
            ? rect.width
            : rect.width / 2,
      y:
        vertical === "t" ? 0 : vertical === "b" ? rect.height : rect.height / 2,
    };
  };
  const resolveUnitOffset = (
    value: FloatingOffset | undefined,
    size: number,
  ) => {
    if (typeof value === "string") {
      const numeric = Number.parseFloat(value);
      if (!Number.isFinite(numeric)) return 0;
      return value.endsWith("%") ? (numeric / 100) * size : numeric;
    }
    return value ?? 0;
  };
  const arrowOffsetHorizontal = options.arrowOffsetHorizontal ?? 12;
  const arrowOffsetVertical =
    options.arrowOffsetVertical ?? arrowOffsetHorizontal;
  const arrowWidth = options.arrowWidth ?? 16;
  const getOverflow = (currentPlacement: Placement): FloatingOverflow => {
    if (adjust === false) return { adjustX: false, adjustY: false };
    const base: FloatingOverflow =
      currentPlacement === "top" || currentPlacement === "bottom"
        ? {
            adjustY: true,
            shiftX: arrowOffsetHorizontal * 2 + arrowWidth,
            shiftY: true,
          }
        : currentPlacement === "left" || currentPlacement === "right"
          ? {
              adjustX: true,
              shiftX: true,
              shiftY: arrowOffsetVertical * 2 + arrowWidth,
            }
          : {};
    const merged = {
      ...base,
      ...(typeof adjust === "object" ? adjust : {}),
    };
    if (!merged.shiftX) merged.adjustX = true;
    if (!merged.shiftY) merged.adjustY = true;
    return merged;
  };
  const defaultPlacement = (currentPlacement: Placement): FloatingPlacement => {
    const sideGap = gap;
    const offset: [number, number] = [0, 0];
    if (currentPlacement.startsWith("top")) offset[1] = -sideGap;
    else if (currentPlacement.startsWith("bottom")) offset[1] = sideGap;
    else if (currentPlacement.startsWith("left")) offset[0] = -sideGap;
    else offset[0] = sideGap;

    const centeredPoints = options.pointAtCenter
      ? centerPoints[currentPlacement]
      : undefined;
    if (centeredPoints) {
      const halfArrow = arrowWidth / 2;
      if (currentPlacement === "topLeft" || currentPlacement === "bottomLeft")
        offset[0] = -arrowOffsetHorizontal - halfArrow;
      else if (
        currentPlacement === "topRight" ||
        currentPlacement === "bottomRight"
      )
        offset[0] = arrowOffsetHorizontal + halfArrow;
      else if (
        currentPlacement === "leftTop" ||
        currentPlacement === "rightTop"
      )
        offset[1] = -arrowOffsetHorizontal * 2 + halfArrow;
      else offset[1] = arrowOffsetHorizontal * 2 - halfArrow;
    }

    const fixedArrow = new Set<Placement>([
      "topLeft",
      "topRight",
      "bottomLeft",
      "bottomRight",
      "leftTop",
      "leftBottom",
      "rightTop",
      "rightBottom",
    ]);
    return {
      points: centeredPoints ?? regularPoints[currentPlacement],
      offset,
      overflow: getOverflow(currentPlacement),
      dynamicInset: true,
      autoArrow: !fixedArrow.has(currentPlacement),
      htmlRegion: "visibleFirst",
    };
  };
  const placementInfo = options.builtinPlacements
    ? (options.builtinPlacements[placement] ?? {})
    : defaultPlacement(placement);
  const placementAlign: FloatingAlign = {
    ...placementInfo,
    ...options.align,
  };
  const placementPoints = placementAlign.points ?? regularPoints[placement];
  let points: [string, string] = [
    placementPoints[0] ?? "cc",
    placementPoints[1] ?? "cc",
  ];
  const calculate = (
    points: [string, string],
    offset = placementAlign.offset,
  ) => {
    const [popupPoint, targetPoint] = points;
    const popupOffset = pointOffset(popup, popupPoint);
    const targetOffset = pointOffset(anchor, targetPoint);
    const targetShift = placementAlign.targetOffset;
    return {
      x:
        anchor.left +
        targetOffset.x -
        resolveUnitOffset(targetShift?.[0], anchor.width) -
        popupOffset.x +
        resolveUnitOffset(offset?.[0], popup.width),
      y:
        anchor.top +
        targetOffset.y -
        resolveUnitOffset(targetShift?.[1], anchor.height) -
        popupOffset.y +
        resolveUnitOffset(offset?.[1], popup.height),
    };
  };
  const overflow = placementAlign.overflow ?? {};
  const visibleRegion = {
    left: viewport.left ?? 0,
    top: viewport.top ?? 0,
    right: (viewport.left ?? 0) + viewport.width,
    bottom: (viewport.top ?? 0) + viewport.height,
  };
  const scrollRegion = options.scrollRegion
    ? {
        left: options.scrollRegion.left ?? 0,
        top: options.scrollRegion.top ?? 0,
        right: (options.scrollRegion.left ?? 0) + options.scrollRegion.width,
        bottom: (options.scrollRegion.top ?? 0) + options.scrollRegion.height,
      }
    : visibleRegion;
  const placementRegion =
    placementAlign.htmlRegion === "scroll" ? scrollRegion : visibleRegion;
  const intersectionRegion =
    placementAlign.htmlRegion === "scroll" ||
    placementAlign.htmlRegion === "visibleFirst"
      ? scrollRegion
      : visibleRegion;
  const canAdjust = (value: boolean | number | undefined) =>
    typeof value === "boolean"
      ? value
      : value === undefined
        ? false
        : value >= 0;
  const invertPointAxis = (point: string, axis: "x" | "y") => {
    const chars = point.split("");
    const index = axis === "x" ? 1 : 0;
    chars[index] =
      chars[index] === "t"
        ? "b"
        : chars[index] === "b"
          ? "t"
          : chars[index] === "l"
            ? "r"
            : chars[index] === "r"
              ? "l"
              : chars[index];
    return chars.join("");
  };
  const flippedPoints = (source: [string, string], axis: "x" | "y") =>
    source.map((point) => invertPointAxis(point, axis)) as [string, string];
  let currentPlacement = effectivePlacement;
  let currentOffset = placementAlign.offset;
  let { x, y } = calculate(points);
  const intersection = (
    left: number,
    top: number,
    region = intersectionRegion,
  ) => {
    const right = left + popup.width;
    const bottom = top + popup.height;
    return (
      Math.max(0, Math.min(right, region.right) - Math.max(left, region.left)) *
      Math.max(0, Math.min(bottom, region.bottom) - Math.max(top, region.top))
    );
  };
  const tryFlip = (axis: "x" | "y") => {
    const coordinate = axis === "x" ? x : y;
    const size = axis === "x" ? popup.width : popup.height;
    const regionStart =
      axis === "x" ? placementRegion.left : placementRegion.top;
    const regionEnd =
      axis === "x" ? placementRegion.right : placementRegion.bottom;
    const isOut = coordinate < regionStart || coordinate + size > regionEnd;
    if (!canAdjust(overflow[axis === "x" ? "adjustX" : "adjustY"]) || !isOut)
      return;
    const nextPoints = flippedPoints(points, axis);
    const nextOffset = currentOffset?.map((value, index) => {
      if (index !== (axis === "x" ? 0 : 1)) return value;
      return -resolveUnitOffset(
        value,
        axis === "x" ? popup.width : popup.height,
      );
    });
    const nextPlacement =
      axis === "x"
        ? side === "left" || side === "right"
          ? `${side === "left" ? "right" : "left"}${suffix}`
          : `${side}${suffix === "Left" ? "Right" : suffix === "Right" ? "Left" : suffix}`
        : side === "top" || side === "bottom"
          ? `${side === "top" ? "bottom" : "top"}${suffix}`
          : `${side}${suffix === "Top" ? "Bottom" : suffix === "Bottom" ? "Top" : suffix}`;
    const next = calculate(nextPoints, nextOffset);
    const nextIntersection = intersection(next.x, next.y);
    const currentIntersection = intersection(x, y);
    const shouldFlip =
      nextIntersection > currentIntersection ||
      (nextIntersection === currentIntersection &&
        (placementAlign.htmlRegion !== "visibleFirst" ||
          intersection(next.x, next.y, visibleRegion) >=
            intersection(x, y, visibleRegion)));
    if (shouldFlip) {
      points = nextPoints;
      currentOffset = nextOffset;
      x = next.x;
      y = next.y;
      currentPlacement = nextPlacement as Placement;
      side = currentPlacement.startsWith("top")
        ? "top"
        : currentPlacement.startsWith("bottom")
          ? "bottom"
          : currentPlacement.startsWith("left")
            ? "left"
            : "right";
      suffix = currentPlacement.slice(side.length);
    }
  };
  tryFlip("y");
  tryFlip("x");
  const shift = (axis: "x" | "y") => {
    const setting = overflow[axis === "x" ? "shiftX" : "shiftY"];
    if (setting === undefined || setting === false) return;
    const isX = axis === "x";
    const pos = isX ? x : y;
    const size = isX ? popup.width : popup.height;
    const regionStart = isX ? visibleRegion.left : visibleRegion.top;
    const regionEnd = isX ? visibleRegion.right : visibleRegion.bottom;
    const anchorStart = isX ? anchor.left : anchor.top;
    const anchorEnd = anchorStart + (isX ? anchor.width : anchor.height);
    const inset = typeof setting === "number" ? setting : 0;
    const popupOffset = resolveUnitOffset(currentOffset?.[isX ? 0 : 1], size);
    let next = pos;
    if (next < regionStart) {
      next = regionStart + popupOffset;
      if (anchorEnd < regionStart + inset)
        next += anchorEnd - regionStart - inset;
    }
    if (next + size > regionEnd) {
      next = regionEnd - size + popupOffset;
      if (anchorStart > regionEnd - inset)
        next += anchorStart - regionEnd + inset;
    }
    if (isX) x = next;
    else y = next;
  };
  shift("x");
  shift("y");
  const arrowHalf = arrowWidth / 2;
  const staticArrowX =
    suffix === "Left"
      ? arrowOffsetHorizontal + arrowHalf
      : suffix === "Right"
        ? popup.width - arrowOffsetHorizontal - arrowHalf
        : popup.width / 2;
  const staticArrowY =
    suffix === "Top"
      ? arrowOffsetVertical + arrowHalf
      : suffix === "Bottom"
        ? popup.height - arrowOffsetVertical - arrowHalf
        : popup.height / 2;
  const arrowX =
    placementAlign.autoArrow === false
      ? staticArrowX
      : (Math.max(x, anchor.left) +
          Math.min(x + popup.width, anchor.left + anchor.width)) /
          2 -
        x;
  const arrowY =
    placementAlign.autoArrow === false
      ? staticArrowY
      : (Math.max(y, anchor.top) +
          Math.min(y + popup.height, anchor.top + anchor.height)) /
          2 -
        y;
  const alignedInfo: FloatingAlign = { ...placementAlign, points };
  return {
    x,
    y,
    placement: currentPlacement,
    side,
    arrowX: Math.max(arrowHalf, Math.min(popup.width - arrowHalf, arrowX)),
    arrowY: Math.max(arrowHalf, Math.min(popup.height - arrowHalf, arrowY)),
    align: alignedInfo,
  };
}
type InternalFloatingProps = FloatingProps & {
  content?: OctaneNode;
  kind: "tooltip" | "popover";
  popupStyle: CSSProperties & Record<`--${string}`, string | number>;
  tooltipHasTitle?: boolean;
};
export function Floating(props: InternalFloatingProps) {
  const {
    children,
    prefixCls,
    open: requestedOpen,
    visible,
    defaultOpen,
    defaultVisible,
    onOpenChange,
    afterOpenChange,
    afterVisibleChange,
    onVisibleChange,
    trigger = "hover",
    placement = "top",
    align,
    builtinPlacements,
    onPopupAlign,
    forceRender = false,
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    autoAdjustOverflow = true,
    getPopupContainer,
    getTooltipContainer,
    arrowPointAtCenter,
    arrow = true,
    fresh = false,
    destroyOnHidden,
    destroyTooltipOnHide,
    overlayClassName,
    overlayStyle,
    overlayInnerStyle,
    className,
    rootClassName,
    classNames,
    styles,
    openClassName,
    triggerClassName,
    triggerStyle,
    style,
    zIndex,
    transitionName,
    ref,
    content,
    kind,
    popupStyle,
    tooltipHasTitle,
  } = props;
  const warning = devUseWarning("Tooltip");
  for (const [oldProp, newProp] of [
    ["visible", "open"],
    ["defaultVisible", "defaultOpen"],
    ["onVisibleChange", "onOpenChange"],
    ["afterVisibleChange", "afterOpenChange"],
    ["destroyTooltipOnHide", "destroyOnHidden"],
    ["arrowPointAtCenter", "arrow={{ pointAtCenter: true }}"],
    ["overlayStyle", "styles={{ root: {} }}"],
    ["overlayInnerStyle", "styles={{ body: {} }}"],
    ["overlayClassName", 'classNames={{ root: "" }}'],
  ]) {
    // Upstream Popover consumes these two props before forwarding to Tooltip.
    if (
      kind === "popover" &&
      (oldProp === "overlayStyle" || oldProp === "overlayClassName")
    )
      continue;
    warning.deprecated(!(oldProp in props), oldProp, newProp);
  }
  warning(
    !destroyTooltipOnHide || typeof destroyTooltipOnHide === "boolean",
    "usage",
    "`destroyTooltipOnHide` no need config `keepParent` anymore. Please use `boolean` value directly.",
  );
  warning(
    !arrow || typeof arrow === "boolean" || !("arrowPointAtCenter" in arrow),
    "deprecated",
    "`arrowPointAtCenter` in `arrow` is deprecated. Please use `pointAtCenter` instead.",
  );
  const config = useConfig();
  const componentConfig = config[kind];
  const resolvedPrefixCls = prefixCls ?? config.getPrefixCls(kind);
  const triggerOpenClass = openClassName ?? `${resolvedPrefixCls}-open`;
  const controlled = requestedOpen ?? visible;
  const destroy = destroyOnHidden ?? Boolean(destroyTooltipOnHide);
  const [internal, setInternal] = useState(
    defaultOpen ?? defaultVisible ?? false,
  );
  const enabled =
    tooltipHasTitle ??
    (content !== null &&
      content !== undefined &&
      content !== false &&
      content !== "");
  const open = controlled === undefined ? enabled && internal : controlled;
  const cachedContent = useRef(content);
  if (open) cachedContent.current = content;
  type MotionPhase = "appear" | "enter" | "leave" | "idle";
  const [motionPhase, setMotionPhase] = useState<MotionPhase>(
    open ? "appear" : "idle",
  );
  const previousOpen = useRef(open);
  const motionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const afterChange = afterOpenChange ?? afterVisibleChange;
  const afterChangeRef = useRef(afterChange);
  afterChangeRef.current = afterChange;
  const showArrow = typeof arrow === "boolean" ? arrow : true;
  const pointAtCenter =
    typeof arrow === "object"
      ? (arrow.pointAtCenter ??
        arrow.arrowPointAtCenter ??
        arrowPointAtCenter ??
        false)
      : (arrowPointAtCenter ?? false);
  const getPopupNumber = (name: string, fallback: number) => {
    const value = Number.parseFloat(
      String((popupStyle as Record<string, unknown>)[name] ?? fallback),
    );
    return Number.isFinite(value) ? value : fallback;
  };
  const popupRadius = getPopupNumber("--ao-popup-radius", 6);
  const popupArrowSize = getPopupNumber("--ao-popup-arrow-size", 16);
  const popupArrowGap = getPopupNumber("--ao-popup-arrow-gap", 4);
  const arrowOffsetHorizontal = getPopupNumber(
    "--ao-popup-arrow-offset-horizontal",
    popupRadius > 12 ? popupRadius + 2 : 12,
  );
  const arrowOffsetVertical = getPopupNumber(
    "--ao-popup-arrow-offset-vertical",
    Math.min(8, arrowOffsetHorizontal),
  );
  const adjustOverflow = autoAdjustOverflow;
  const anchor = useRef<HTMLSpanElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const alignRef = useRef<() => void>(() => {});
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [target, setTarget] = useState<PopupContainer | null>(null);
  const [mounted, setMounted] = useState(open || forceRender);
  const id = `ao-${kind}-${useId()}`;
  const parentPopupId = useContext(FloatingParentContext);
  const [position, setPosition] = useState<
    | (ReturnType<typeof positionPopup> & {
        cssX: number;
        cssY: number;
        cssRight: number;
        cssBottom: number;
      })
    | null
  >(null);
  const defaultMotionName = `${config.getPrefixCls()}-${kind === "tooltip" ? "zoom-big-fast" : "zoom-big"}`;
  const motionName = transitionName ?? defaultMotionName;
  const nativeMotion = motionName === defaultMotionName;
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const canCloneTrigger =
    isValidElement<{ className?: string }>(children) &&
    children.type !== Fragment;
  const triggerChild =
    isValidElement<{ className?: string }>(children) &&
    children.type !== Fragment
      ? cloneElement(children, {
          className: [children.props.className, open && triggerOpenClass],
        })
      : children;
  const clear = () => {
    if (timer.current !== undefined) clearTimeout(timer.current);
    timer.current = undefined;
  };
  const clearMotionTimer = () => {
    if (motionTimer.current !== undefined) clearTimeout(motionTimer.current);
    motionTimer.current = undefined;
  };
  const change = (next: boolean, delay = 0, event?: Event) => {
    clear();
    if (!enabled || next === open) return;
    const commit = () => {
      if (controlled === undefined) setInternal(next);
      if (kind === "popover" && event?.type === "keydown")
        onOpenChange?.(next, event);
      else onOpenChange?.(next);
      onVisibleChange?.(next);
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
      onVisibleChange,
    ],
  );
  useLayoutEffect(() => {
    if (anchor.current)
      setTarget(
        (
          getPopupContainer ??
          getTooltipContainer ??
          config.getPopupContainer
        )?.(
          (anchor.current.firstElementChild as HTMLElement) ?? anchor.current,
        ) ?? document.body,
      );
  }, [getPopupContainer, getTooltipContainer, config.getPopupContainer]);
  useLayoutEffect(() => {
    if (previousOpen.current === open) return;
    previousOpen.current = open;
    clearMotionTimer();
    if (open) {
      setMounted(true);
      setMotionPhase("enter");
    } else {
      setMotionPhase("leave");
    }
  }, [open]);
  useLayoutEffect(() => {
    if (forceRender) {
      if (!mounted) setMounted(true);
      return;
    }
    if (open || !destroy || motionPhase !== "idle") return;
    setMounted(false);
  }, [open, forceRender, destroy, motionPhase, mounted]);
  useLayoutEffect(() => {
    const box = popup.current;
    if (!box || !mounted || motionPhase === "idle") return;
    // Match @rc-component/trigger Popup + rc-motion CSSMotion: initial appear
    // participates, and visible-change callbacks follow the motion end/deadline.
    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      clearMotionTimer();
      const nextOpen = motionPhase !== "leave";
      setMotionPhase("idle");
      afterChangeRef.current?.(nextOpen);
    };
    const animationName = nativeMotion
      ? position?.align?.useCssTransform
        ? motionPhase === "leave"
          ? "ao-floating-scale-out"
          : "ao-floating-scale-in"
        : motionPhase === "leave"
          ? "ao-floating-zoom-out"
          : "ao-floating-zoom-in"
      : undefined;
    const onAnimationEnd = (event: AnimationEvent) => {
      if (
        event.target === box &&
        (animationName === undefined || event.animationName === animationName)
      )
        finish();
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      const hasRunningAnimation = box
        .getAnimations()
        .some((animation) => animation.playState === "running");
      if (event.target === box && !hasRunningAnimation) finish();
    };
    box.addEventListener("animationend", onAnimationEnd);
    box.addEventListener("transitionend", onTransitionEnd);
    // rc-motion's Tooltip wrapper uses a 1000ms motion deadline as a fallback
    // when no CSS transition/animation event is emitted.
    motionTimer.current = setTimeout(finish, 1000);
    return () => {
      box.removeEventListener("animationend", onAnimationEnd);
      box.removeEventListener("transitionend", onTransitionEnd);
      clearMotionTimer();
    };
  }, [
    motionPhase,
    mounted,
    target,
    position?.align?.useCssTransform,
    nativeMotion,
  ]);
  useImperativeHandle(ref, () => ({
    forceAlign: () => alignRef.current(),
    forcePopupAlign: () => {
      warning.deprecated(false, "forcePopupAlign", "forceAlign");
      alignRef.current();
    },
    get nativeElement() {
      return (anchor.current?.firstElementChild ??
        anchor.current) as HTMLElement;
    },
    get popupElement() {
      return popup.current as HTMLDivElement;
    },
  }));
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
        if (
          !host.contains(next) &&
          !popup.current?.contains(next) &&
          !containsNestedPopup(id, next)
        )
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
    onVisibleChange,
  ]);
  useLayoutEffect(() => {
    if (!open || !target || !popup.current || !anchor.current) {
      alignRef.current = () => {};
      return;
    }
    const host =
      (canCloneTrigger &&
        (anchor.current.firstElementChild as HTMLElement | null)) ||
      anchor.current;
    const box = popup.current;
    const update = () => {
      const documentElement = document.documentElement;
      const targetElement = getPopupContainerElement(target);
      const isFixed =
        targetElement === document.body || targetElement === documentElement;
      const viewport = {
        width: documentElement.clientWidth || window.innerWidth,
        height: documentElement.clientHeight || window.innerHeight,
      };
      const scrollLeft = window.scrollX || documentElement.scrollLeft;
      const scrollTop = window.scrollY || documentElement.scrollTop;
      const layoutSize = getLayoutSize(box);
      const offsetParent = box.offsetParent as HTMLElement | null;
      const parentScaleX =
        !isFixed &&
        offsetParent &&
        offsetParent !== document.body &&
        offsetParent !== documentElement &&
        offsetParent.offsetWidth > 0
          ? offsetParent.getBoundingClientRect().width /
              offsetParent.offsetWidth || 1
          : 1;
      const parentScaleY =
        !isFixed &&
        offsetParent &&
        offsetParent !== document.body &&
        offsetParent !== documentElement &&
        offsetParent.offsetHeight > 0
          ? offsetParent.getBoundingClientRect().height /
              offsetParent.offsetHeight || 1
          : 1;
      const result = positionPopup(
        host.getBoundingClientRect(),
        {
          // Preserve fractional dimensions near overflow boundaries. Layout
          // dimensions also exclude the popup's entry/leave motion transform.
          width: layoutSize.width * parentScaleX,
          height: layoutSize.height * parentScaleY,
        },
        viewport,
        placement,
        adjustOverflow,
        popupArrowGap + (showArrow ? popupArrowSize / 2 : 0),
        {
          align,
          builtinPlacements,
          scrollRegion: {
            width: documentElement.scrollWidth,
            height: documentElement.scrollHeight,
            left: -scrollLeft,
            top: -scrollTop,
          },
          pointAtCenter,
          arrowOffsetHorizontal,
          arrowOffsetVertical,
          arrowWidth: showArrow ? popupArrowSize : 0,
        },
      );
      onPopupAlign?.(box, result.align);
      let cssX = result.x;
      let cssY = result.y;
      const fixedContainer = isFixed ? getPopupContainerSize(box) : undefined;
      let containerWidth = fixedContainer?.width || viewport.width;
      let containerHeight = fixedContainer?.height || viewport.height;
      if (!isFixed) {
        if (
          offsetParent &&
          offsetParent !== document.body &&
          offsetParent !== documentElement
        ) {
          const rect = offsetParent.getBoundingClientRect();
          const scaleX =
            offsetParent.offsetWidth > 0
              ? rect.width / offsetParent.offsetWidth || 1
              : 1;
          const scaleY =
            offsetParent.offsetHeight > 0
              ? rect.height / offsetParent.offsetHeight || 1
              : 1;
          cssX =
            (result.x - rect.left - offsetParent.clientLeft * scaleX) / scaleX +
            offsetParent.scrollLeft;
          cssY =
            (result.y - rect.top - offsetParent.clientTop * scaleY) / scaleY +
            offsetParent.scrollTop;
          containerWidth = offsetParent.clientWidth;
          containerHeight = offsetParent.clientHeight;
        } else {
          cssX += window.scrollX;
          cssY += window.scrollY;
          containerWidth = documentElement.scrollWidth;
          containerHeight = documentElement.scrollHeight;
        }
      }
      // rc-trigger floors both leading and trailing insets when unscaled.
      // Keep fractional values under a transformed popup container.
      const cssRight = containerWidth - cssX - layoutSize.width;
      const cssBottom = containerHeight - cssY - layoutSize.height;
      const next = {
        ...result,
        cssX:
          Math.round(parentScaleX * 1000) === 1000 ? Math.floor(cssX) : cssX,
        cssY:
          Math.round(parentScaleY * 1000) === 1000 ? Math.floor(cssY) : cssY,
        cssRight:
          Math.round(parentScaleX * 1000) === 1000
            ? Math.floor(cssRight)
            : cssRight,
        cssBottom:
          Math.round(parentScaleY * 1000) === 1000
            ? Math.floor(cssBottom)
            : cssBottom,
      };
      alignRef.current = update;
      setPosition((previous) =>
        previous &&
        Object.keys(next).every(
          (key) =>
            previous[key as keyof typeof next] ===
            next[key as keyof typeof next],
        )
          ? previous
          : next,
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
        !box.contains(event.target as Node) &&
        !containsNestedPopup(id, event.target)
      )
        change(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !event.defaultPrevented &&
        !containsNestedPopup(id, document.activeElement)
      ) {
        change(false, 0, event);
        if (box.contains(document.activeElement))
          (host.matches("button,a,input,[tabindex]")
            ? host
            : (host.querySelector(
                "button,a,input,[tabindex]",
              ) as HTMLElement | null)
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
    canCloneTrigger,
    target,
    placement,
    align,
    builtinPlacements,
    onPopupAlign,
    adjustOverflow,
    showArrow,
    pointAtCenter,
    arrowOffsetHorizontal,
    arrowOffsetVertical,
    popupArrowSize,
    popupArrowGap,
    controlled,
    onOpenChange,
    onVisibleChange,
  ]);
  useEffect(() => {
    const box = popup.current;
    if (!box || !open) return;
    const enter = () => clear();
    const leave = (event: MouseEvent) => {
      if (
        triggers.includes("hover") &&
        !box.contains(document.activeElement) &&
        !containsNestedPopup(id, event.relatedTarget)
      )
        change(false, mouseLeaveDelay);
    };
    const blur = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (
        triggers.includes("focus") &&
        !box.contains(next) &&
        !anchor.current?.contains(next) &&
        !containsNestedPopup(id, next)
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
  }, [
    open,
    mounted,
    trigger,
    mouseLeaveDelay,
    controlled,
    onOpenChange,
    onVisibleChange,
  ]);
  const resolvedAlign =
    position?.align ??
    ({ ...builtinPlacements?.[placement], ...align } as FloatingAlign);
  const useCssTransform = resolvedAlign.useCssTransform === true;
  const useCssRight =
    resolvedAlign.useCssRight ??
    (resolvedAlign.dynamicInset && resolvedAlign.points?.[0]?.[1] === "r");
  const useCssBottom =
    resolvedAlign.useCssBottom ??
    (resolvedAlign.dynamicInset && resolvedAlign.points?.[0]?.[0] === "b");
  const body = (
    <div
      ref={popup}
      id={id}
      data-ao-floating-parent={parentPopupId}
      role={kind === "tooltip" ? "tooltip" : undefined}
      aria-hidden={open ? undefined : "true"}
      dir={config.direction}
      hidden={!open && motionPhase === "idle"}
      className={[
        resolvedPrefixCls !== `ant-${kind}` && resolvedPrefixCls,
        `ant-${kind}`,
        resolvedPrefixCls !== `ant-${kind}` &&
          `${resolvedPrefixCls}-placement-${position?.placement ?? placement}`,
        `ant-${kind}-placement-${position?.placement ?? placement}`,
        motionPhase !== "idle" && `${motionName}-${motionPhase}`,
        motionPhase !== "idle" && `${motionName}-${motionPhase}-active`,
        componentConfig?.className,
        className,
        rootClassName,
        componentConfig?.classNames?.root,
        classNames?.root,
        overlayClassName,
      ]}
      data-side={position?.side}
      data-motion-phase={motionPhase}
      data-native-motion={nativeMotion ? "true" : undefined}
      data-use-css-transform={useCssTransform ? "true" : undefined}
      style={{
        ...popupStyle,
        ...componentConfig?.styles?.root,
        ...componentConfig?.style,
        ...overlayStyle,
        ...styles?.root,
        position:
          getPopupContainerElement(target) === document.body ||
          getPopupContainerElement(target) === document.documentElement
            ? "fixed"
            : "absolute",
        left: useCssTransform
          ? 0
          : useCssRight
            ? "auto"
            : (position?.cssX ?? 0),
        right:
          useCssRight && !useCssTransform
            ? (position?.cssRight ?? "auto")
            : "auto",
        top: useCssTransform
          ? 0
          : useCssBottom
            ? "auto"
            : (position?.cssY ?? 0),
        bottom:
          useCssBottom && !useCssTransform
            ? (position?.cssBottom ?? "auto")
            : "auto",
        transform: useCssTransform
          ? `translate3d(${position?.cssX ?? 0}px, ${position?.cssY ?? 0}px, 0)`
          : undefined,
        pointerEvents: open ? undefined : "none",
        visibility: open && !position ? "hidden" : undefined,
        "--ao-arrow-x": `${position?.arrowX ?? 12}px`,
        "--ao-arrow-y": `${position?.arrowY ?? 12}px`,
        zIndex,
        ...style,
      }}
    >
      {showArrow && (
        <div
          className={[
            resolvedPrefixCls !== `ant-${kind}` && `${resolvedPrefixCls}-arrow`,
            `ant-${kind}-arrow`,
          ]}
          aria-hidden="true"
        />
      )}
      <div
        className={[
          resolvedPrefixCls !== `ant-${kind}` && `${resolvedPrefixCls}-inner`,
          `ant-${kind}-inner`,
          componentConfig?.classNames?.body,
          classNames?.body,
        ]}
        style={{
          ...componentConfig?.styles?.body,
          ...overlayInnerStyle,
          ...styles?.body,
        }}
      >
        {fresh || open ? content : cachedContent.current}
      </div>
    </div>
  );
  return (
    <FloatingParentContext value={id}>
      <span
        ref={anchor}
        dir={config.direction}
        className={[
          "ao-floating-trigger",
          triggerClassName,
          !canCloneTrigger && open && triggerOpenClass,
        ]}
        style={triggerStyle}
      >
        {triggerChild}
      </span>
      {target && mounted && createPortal(body, target)}
    </FloatingParentContext>
  );
}
