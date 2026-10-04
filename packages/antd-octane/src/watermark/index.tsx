/** @jsxImportSource octane */
// Native adaptation of Ant Design 5.29.3 watermark (MIT).
import type { CSSProperties, OctaneNode } from "octane";
import { useEffect, useMemo, useRef, useState } from "octane";
import { useConfig } from "../config-provider";
import { WatermarkContext } from "./context";
import useClips, { FontGap } from "./useClips";
import useRafDebounce from "./useRafDebounce";
import useSingletonCache from "./useSingletonCache";
import useWatermark from "./useWatermark";
import { getPixelRatio, reRendering } from "./utils";

export interface WatermarkProps {
  zIndex?: number;
  rotate?: number;
  width?: number;
  height?: number;
  image?: string;
  content?: string | string[];
  className?: string;
  rootClassName?: string;
  children?: OctaneNode;
  inherit?: boolean;
  font?: {
    color?: CanvasFillStrokeStyles["fillStyle"];
    fontSize?: number | string;
    fontWeight?: "normal" | "light" | "weight" | number;
    fontStyle?: "none" | "normal" | "italic" | "oblique";
    fontFamily?: string;
    textAlign?: CanvasTextAlign;
  };
  gap?: [number, number];
  offset?: [number, number];
  style?: CSSProperties;
}

const DEFAULT_GAP_X = 100;
const DEFAULT_GAP_Y = 100;
const fixedStyle: CSSProperties = { position: "relative", overflow: "hidden" };

export function Watermark({
  zIndex = 9,
  rotate = -22,
  width,
  height,
  image,
  content,
  font = {},
  gap = [DEFAULT_GAP_X, DEFAULT_GAP_Y],
  offset,
  inherit = true,
  children,
  className,
  rootClassName,
  style,
}: WatermarkProps) {
  const mergedStyle = { ...fixedStyle, ...style };
  const { token } = useConfig();
  const {
    color = token.colorFill,
    fontSize = token.fontSizeLG,
    fontWeight = "normal",
    fontStyle = "normal",
    fontFamily = "sans-serif",
    textAlign = "center",
  } = font;
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [subElements, setSubElements] = useState(() => new Set<HTMLElement>());
  const [tile, setTile] = useState<[string, number] | null>(null);
  const [gapX = DEFAULT_GAP_X, gapY = DEFAULT_GAP_Y] = gap,
    offsetLeft = (offset?.[0] ?? gapX / 2) - gapX / 2,
    offsetTop = (offset?.[1] ?? gapY / 2) - gapY / 2;
  const markStyle = useMemo<CSSProperties>(
    () => ({
      zIndex,
      position: "absolute",
      left: offsetLeft > 0 ? `${offsetLeft}px` : 0,
      top: offsetTop > 0 ? `${offsetTop}px` : 0,
      width: offsetLeft > 0 ? `calc(100% - ${offsetLeft}px)` : "100%",
      height: offsetTop > 0 ? `calc(100% - ${offsetTop}px)` : "100%",
      pointerEvents: "none",
      backgroundRepeat: "repeat",
      backgroundPosition: `${Math.min(0, offsetLeft)}px ${Math.min(0, offsetTop)}px`,
    }),
    [zIndex, offsetLeft, offsetTop],
  );
  const targetElements = useMemo(
    () => [...(container ? [container] : []), ...subElements],
    [container, subElements],
  );
  const getClips = useClips();
  const getClipsCache = useSingletonCache<
    Parameters<typeof getClips>,
    ReturnType<typeof getClips>
  >();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const detachImage = () => {
    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
      imageRef.current = null;
    }
  };

  const renderWatermark = () => {
    detachImage();
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;
    const lines = Array.isArray(content) ? content : [content];
    ctx.font = `${Number(fontSize)}px ${fontFamily}`;
    const metrics = lines.map((line) => ctx.measureText(String(line)));
    const markWidth =
      width ??
      (image ? 120 : Math.ceil(Math.max(...metrics.map((item) => item.width))));
    const markHeight =
      height ??
      (image
        ? 64
        : Math.ceil(
            Math.max(
              ...metrics.map(
                (item) =>
                  item.fontBoundingBoxAscent + item.fontBoundingBoxDescent,
              ),
            ),
          ) *
            lines.length +
          (lines.length - 1) * FontGap);
    const draw = (value: string | string[] | HTMLImageElement) => {
      try {
        const params: Parameters<typeof getClips> = [
          value,
          rotate,
          getPixelRatio(),
          markWidth,
          markHeight,
          { color, fontSize, fontWeight, fontStyle, fontFamily, textAlign },
          gapX,
          gapY,
        ];
        const [url, clipWidth] = getClipsCache(params, () =>
          getClips(...params),
        );
        setTile([url, clipWidth]);
      } catch {
        if (value instanceof HTMLImageElement) draw(content ?? "");
        else setTile(null);
      }
    };
    if (image) {
      const img = new Image();
      imageRef.current = img;
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      img.onload = () => draw(img);
      img.onerror = () => draw(content ?? "");
      img.src = image;
    } else draw(content ?? "");
  };
  const syncWatermark = useRafDebounce(renderWatermark);
  const [appendWatermark, removeWatermark, isWatermarkEle] =
    useWatermark(markStyle);

  useEffect(() => {
    if (tile)
      targetElements.forEach((target) => {
        appendWatermark(...tile, target);
      });
  }, [tile, targetElements, markStyle, appendWatermark]);

  const handleMutate = (records: MutationRecord[]) => {
    records.forEach((record) => {
      if (reRendering(record, isWatermarkEle)) syncWatermark();
      else if (
        record.target === container &&
        record.attributeName === "style"
      ) {
        for (const key of ["position", "overflow"] as const) {
          const original = mergedStyle[key];
          if (original && container.style[key] !== original)
            container.style[key] = original;
        }
      }
    });
  };
  const onMutate = useRef(handleMutate);
  onMutate.current = handleMutate;
  useEffect(() => {
    const observer = new MutationObserver((records) =>
      onMutate.current(records),
    );
    targetElements.forEach((target) => {
      observer.observe(target, {
        attributeFilter: ["style", "class"],
        subtree: true,
        childList: true,
      });
    });
    return () => observer.disconnect();
  }, [targetElements]);

  useEffect(syncWatermark, [
    content,
    image,
    width,
    height,
    rotate,
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
    textAlign,
    gapX,
    gapY,
    offsetLeft,
    offsetTop,
    zIndex,
    syncWatermark,
  ]);
  useEffect(() => detachImage, []);

  const context = useMemo(
    () => ({
      add(element: HTMLElement) {
        setSubElements((previous) =>
          previous.has(element) ? previous : new Set([...previous, element]),
        );
      },
      remove(element: HTMLElement) {
        removeWatermark(element);
        setSubElements((previous) => {
          if (!previous.has(element)) return previous;
          const next = new Set(previous);
          next.delete(element);
          return next;
        });
      },
    }),
    [],
  );
  return (
    <div
      ref={setContainer}
      className={[className, rootClassName]}
      style={mergedStyle}
    >
      {inherit ? (
        <WatermarkContext value={context}>{children}</WatermarkContext>
      ) : (
        children
      )}
    </div>
  );
}
