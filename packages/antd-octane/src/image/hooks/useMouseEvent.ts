import type { RefObject } from "octane";
import { useEffect, useRef, useState } from "octane";
import getFixScaleEleTransPosition from "../getFixScaleEleTransPosition";
import type { ImageTransform, ImageTransformAction } from "../interface";

/** rc-image 7.12.0 useMouseEvent (MIT), using pointer capture for native dragging. */
export default function useMouseEvent(
  imageRef: RefObject<HTMLImageElement | null>,
  movable: boolean,
  visible: boolean,
  scaleStep: number,
  transformRef: RefObject<ImageTransform>,
  updateTransform: (
    patch: Partial<ImageTransform>,
    action: ImageTransformAction,
  ) => void,
  zoom: (
    ratio: number,
    action: ImageTransformAction,
    x?: number,
    y?: number,
  ) => void,
) {
  const [isMoving, setIsMoving] = useState(false);
  const start = useRef<{
    pointerId: number;
    diffX: number;
    diffY: number;
    x: number;
    y: number;
  } | null>(null);
  useEffect(() => {
    if (!visible) {
      start.current = null;
      setIsMoving(false);
    }
  }, [visible]);
  const rebound = () => {
    const node = imageRef.current;
    if (!node?.offsetWidth || !node.offsetHeight) return;
    const transform = transformRef.current;
    const width = node.offsetWidth * transform.scale,
      height = node.offsetHeight * transform.scale;
    const { left, top } = node.getBoundingClientRect();
    const rotated = transform.rotate % 180 !== 0;
    const patch = getFixScaleEleTransPosition(
      rotated ? height : width,
      rotated ? width : height,
      left,
      top,
    );
    if (
      Object.entries(patch).some(
        ([key, value]) => transform[key as "x" | "y"] !== value,
      )
    )
      updateTransform(patch, "dragRebound");
  };
  const onPointerDown = (event: PointerEvent) => {
    if (
      !movable ||
      !visible ||
      event.button !== 0 ||
      event.pointerType === "touch"
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    const transform = transformRef.current;
    start.current = {
      pointerId: event.pointerId,
      diffX: event.clientX - transform.x,
      diffY: event.clientY - transform.y,
      x: transform.x,
      y: transform.y,
    };
    setIsMoving(true);
    imageRef.current?.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!visible || start.current?.pointerId !== event.pointerId) return;
    updateTransform(
      {
        x: event.clientX - start.current.diffX,
        y: event.clientY - start.current.diffY,
      },
      "move",
    );
  };
  const onPointerUp = (event: PointerEvent) => {
    const origin = start.current;
    if (!origin || origin.pointerId !== event.pointerId) return;
    start.current = null;
    setIsMoving(false);
    imageRef.current?.releasePointerCapture?.(event.pointerId);
    if (
      transformRef.current.x !== origin.x ||
      transformRef.current.y !== origin.y
    )
      rebound();
  };
  const onPointerCancel = () => {
    start.current = null;
    setIsMoving(false);
    rebound();
  };
  const onWheel = (event: WheelEvent) => {
    if (!visible || !event.deltaY) return;
    event.preventDefault();
    const ratio = 1 + Math.min(Math.abs(event.deltaY) / 100, 1) * scaleStep;
    zoom(
      event.deltaY > 0 ? 1 / ratio : ratio,
      "wheel",
      event.clientX,
      event.clientY,
    );
  };
  return {
    isMoving,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onWheel,
  };
}
