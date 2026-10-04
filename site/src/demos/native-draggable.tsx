// Native demo adapter for react-draggable 4.4.6 (MIT). See THIRD_PARTY_NOTICES.md.
import type { OctaneNode } from "octane";
import { useLayoutEffect, useRef } from "octane";
export type DraggableEvent = MouseEvent | TouchEvent;
export interface DraggableData {
  node: HTMLDivElement;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
}
// biome-ignore lint/suspicious/noConfusingVoidType: Upstream allows no return value or a boolean cancellation result.
type StartResult = boolean | void;
export type DraggableEventHandler = (
  event: DraggableEvent,
  data: DraggableData,
) => StartResult;
export default function Draggable({
  children,
  disabled,
  bounds,
  nodeRef,
  onStart,
}: {
  children: OctaneNode;
  disabled?: boolean;
  bounds: { left: number; right: number; top: number; bottom: number };
  nodeRef: { current: HTMLDivElement | null };
  onStart?: DraggableEventHandler;
}) {
  const position = useRef({ x: 0, y: 0 });
  const latest = useRef({ disabled, bounds, onStart });
  latest.current = { disabled, bounds, onStart };
  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const doc = node.ownerDocument;
    let lastPoint: { x: number; y: number } | null = null;
    let identifier: number | undefined;
    let slack = { x: 0, y: 0 };
    node.classList.add("react-draggable");
    node.style.transform = `translate(${position.current.x}px,${position.current.y}px)`;
    const getPoint = (event: DraggableEvent) => {
      const touch = event.type.startsWith("touch");
      const e = event as TouchEvent;
      const point = touch
        ? [
            ...Array.from(e.targetTouches),
            ...Array.from(e.changedTouches),
          ].find((item) => item.identifier === identifier)
        : (event as MouseEvent);
      if (!point) return null;
      const parent = (node.offsetParent as HTMLElement | null) ?? doc.body;
      const rect =
        parent === doc.body
          ? { left: 0, top: 0 }
          : parent.getBoundingClientRect();
      return {
        x: point.clientX + parent.scrollLeft - rect.left,
        y: point.clientY + parent.scrollTop - rect.top,
      };
    };
    const clearSelection = () => {
      doc.body.classList.remove("react-draggable-transparent-selection");
      const selection = doc.defaultView?.getSelection();
      if (selection?.type !== "Caret") selection?.removeAllRanges();
    };
    const up = () => {
      if (!lastPoint) return;
      lastPoint = null;
      identifier = undefined;
      slack = { x: 0, y: 0 };
      node.classList.remove("react-draggable-dragging");
      clearSelection();
      doc.removeEventListener("mousemove", move, true);
      doc.removeEventListener("mouseup", up, true);
      doc.removeEventListener("touchmove", move, true);
      doc.removeEventListener("touchend", up, true);
    };
    const move = (event: DraggableEvent) => {
      if (!lastPoint) return;
      const point = getPoint(event);
      if (!point) return;
      const b = latest.current.bounds;
      const x = position.current.x + point.x - lastPoint.x;
      const y = position.current.y + point.y - lastPoint.y;
      const next = {
        x: Math.min(b.right, Math.max(b.left, x + slack.x)),
        y: Math.min(b.bottom, Math.max(b.top, y + slack.y)),
      };
      slack = { x: slack.x + x - next.x, y: slack.y + y - next.y };
      position.current = next;
      lastPoint = point;
      node.style.transform = `translate(${next.x}px,${next.y}px)`;
    };
    const down = (event: DraggableEvent) => {
      const touch = event.type.startsWith("touch");
      if (
        latest.current.disabled ||
        (!touch && (event as MouseEvent).button !== 0)
      )
        return;
      if (touch) {
        const e = event as TouchEvent;
        identifier = (e.targetTouches[0] ?? e.changedTouches[0])?.identifier;
        event.preventDefault();
      }
      const point = getPoint(event);
      if (!point) return;
      const { x, y } = position.current;
      if (
        latest.current.onStart?.(event, {
          node,
          x,
          y,
          deltaX: 0,
          deltaY: 0,
          lastX: x,
          lastY: y,
        }) === false
      )
        return;
      lastPoint = point;
      node.classList.add("react-draggable-dragging", "react-draggable-dragged");
      if (!doc.getElementById("react-draggable-style-el")) {
        const style = doc.createElement("style");
        style.id = "react-draggable-style-el";
        style.textContent =
          ".react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n.react-draggable-transparent-selection *::selection {all: inherit;}";
        doc.head.append(style);
      }
      doc.body.classList.add("react-draggable-transparent-selection");
      doc.addEventListener(touch ? "touchmove" : "mousemove", move, true);
      doc.addEventListener(touch ? "touchend" : "mouseup", up, true);
    };
    node.addEventListener("mousedown", down);
    node.addEventListener("touchstart", down, { passive: false });
    return () => {
      up();
      node.removeEventListener("mousedown", down);
      node.removeEventListener("touchstart", down);
    };
  }, [nodeRef]);
  return children;
}
