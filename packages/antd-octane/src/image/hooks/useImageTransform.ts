import type { RefObject } from "octane";
import { useEffect, useRef, useState } from "octane";
import type {
  ImagePreviewConfig,
  ImageTransform,
  ImageTransformAction,
} from "../interface";

export const initialTransform: ImageTransform = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  flipX: false,
  flipY: false,
};

/** rc-image 7.12.0 useImageTransform (MIT), adapted to Octane and native RAF. */
export default function useImageTransform(
  imageRef: RefObject<HTMLImageElement | null>,
  minScale: number,
  maxScale: number,
  onTransform: ImagePreviewConfig["onTransform"],
) {
  const [transform, setTransform] = useState(initialTransform);
  const transformRef = useRef(initialTransform);
  const frame = useRef<number | null>(null);
  const pendingAction = useRef<ImageTransformAction>("reset");
  const callback = useRef(onTransform);
  callback.current = onTransform;

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const resetTransform = (action: ImageTransformAction) => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    const changed = Object.keys(initialTransform).some(
      (key) =>
        transformRef.current[key as keyof ImageTransform] !==
        initialTransform[key as keyof ImageTransform],
    );
    transformRef.current = initialTransform;
    setTransform(initialTransform);
    if (changed) callback.current?.({ transform: initialTransform, action });
  };
  // Pointer/wheel events can arrive repeatedly before a paint; notify once per frame.
  const updateTransform = (
    patch: Partial<ImageTransform>,
    action: ImageTransformAction,
  ) => {
    transformRef.current = { ...transformRef.current, ...patch };
    if (frame.current !== null) return;
    pendingAction.current = action;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      setTransform(transformRef.current);
      callback.current?.({
        transform: transformRef.current,
        action: pendingAction.current,
      });
    });
  };
  const dispatchZoomChange = (
    ratio: number,
    action: ImageTransformAction,
    centerX?: number,
    centerY?: number,
    isTouch = false,
  ) => {
    const node = imageRef.current;
    if (!node || !Number.isFinite(ratio) || ratio <= 0) return;
    const previous = transformRef.current;
    let scale = previous.scale * ratio;
    if (scale > maxScale) scale = maxScale;
    else if (scale < minScale && !isTouch) scale = minScale;
    const diffRatio = scale / previous.scale - 1;
    const anchorX = centerX ?? window.innerWidth / 2;
    const anchorY = centerY ?? window.innerHeight / 2;
    let x =
      previous.x -
      diffRatio * (anchorX - previous.x - node.offsetLeft - node.width / 2);
    let y =
      previous.y -
      diffRatio * (anchorY - previous.y - node.offsetTop - node.height / 2);
    if (
      ratio < 1 &&
      scale === 1 &&
      node.offsetWidth * scale <= document.documentElement.clientWidth &&
      node.offsetHeight * scale <= document.documentElement.clientHeight
    ) {
      x = 0;
      y = 0;
    }
    updateTransform({ x, y, scale }, action);
  };
  return {
    transform,
    transformRef,
    updateTransform,
    resetTransform,
    dispatchZoomChange,
  };
}
