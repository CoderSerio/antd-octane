import type { RefObject } from "octane";
import { useEffect, useRef, useState } from "octane";
import getFixScaleEleTransPosition from "../getFixScaleEleTransPosition";
import type { ImageTransform, ImageTransformAction } from "../interface";

type Point = { x: number; y: number };
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
function center(old1: Point, old2: Point, next1: Point, next2: Point) {
  const first = distance(old1, next1),
    second = distance(old2, next2);
  const ratio = first + second ? first / (first + second) : 0;
  return {
    x: old1.x + ratio * (old2.x - old1.x),
    y: old1.y + ratio * (old2.y - old1.y),
  };
}

/** rc-image 7.12.0 useTouchEvent (MIT), adapted to native touch events. */
export default function useTouchEvent(
  imageRef: RefObject<HTMLImageElement | null>,
  movable: boolean,
  visible: boolean,
  minScale: number,
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
    isTouch?: boolean,
  ) => void,
) {
  const [isTouching, setIsTouching] = useState(false);
  const points = useRef<{
    point1: Point;
    point2: Point;
    eventType: "none" | "move" | "touchZoom";
  }>({ point1: { x: 0, y: 0 }, point2: { x: 0, y: 0 }, eventType: "none" });
  useEffect(() => {
    if (!visible) {
      points.current.eventType = "none";
      setIsTouching(false);
    }
  }, [visible]);
  useEffect(() => {
    if (!visible || !movable) return;
    const preventScroll = (event: TouchEvent) => {
      if (isTouching) event.preventDefault();
    };
    window.addEventListener("touchmove", preventScroll, { passive: false });
    return () => window.removeEventListener("touchmove", preventScroll);
  }, [visible, movable, isTouching]);
  const onTouchStart = (event: TouchEvent) => {
    if (!movable || !visible || !event.touches.length) return;
    event.stopPropagation();
    setIsTouching(true);
    const [first, second] = Array.from(event.touches);
    points.current = second
      ? {
          point1: { x: first.clientX, y: first.clientY },
          point2: { x: second.clientX, y: second.clientY },
          eventType: "touchZoom",
        }
      : {
          ...points.current,
          point1: {
            x: first.clientX - transformRef.current.x,
            y: first.clientY - transformRef.current.y,
          },
          eventType: "move",
        };
  };
  const onTouchMove = (event: TouchEvent) => {
    if (
      !movable ||
      !visible ||
      !event.touches.length ||
      points.current.eventType === "none"
    )
      return;
    event.preventDefault();
    const [first, second] = Array.from(event.touches);
    const previous = points.current;
    if (second && previous.eventType === "touchZoom") {
      const point1 = { x: first.clientX, y: first.clientY },
        point2 = { x: second.clientX, y: second.clientY };
      const anchor = center(previous.point1, previous.point2, point1, point2);
      const before = distance(previous.point1, previous.point2);
      if (before)
        zoom(
          distance(point1, point2) / before,
          "touchZoom",
          anchor.x,
          anchor.y,
          true,
        );
      points.current = { point1, point2, eventType: "touchZoom" };
    } else if (!second && previous.eventType === "move") {
      updateTransform(
        {
          x: first.clientX - previous.point1.x,
          y: first.clientY - previous.point1.y,
        },
        "move",
      );
    } else onTouchStart(event);
  };
  const onTouchEnd = () => {
    setIsTouching(false);
    points.current.eventType = "none";
    if (!visible) return;
    const transform = transformRef.current;
    if (transform.scale < minScale) {
      updateTransform({ x: 0, y: 0, scale: minScale }, "touchZoom");
      return;
    }
    const node = imageRef.current;
    if (!node) return;
    const { left, top } = node.getBoundingClientRect();
    const width = node.offsetWidth * transform.scale,
      height = node.offsetHeight * transform.scale;
    const rotated = transform.rotate % 180 !== 0;
    updateTransform(
      getFixScaleEleTransPosition(
        rotated ? height : width,
        rotated ? width : height,
        left,
        top,
      ),
      "dragRebound",
    );
  };
  return { isTouching, onTouchStart, onTouchMove, onTouchEnd };
}
