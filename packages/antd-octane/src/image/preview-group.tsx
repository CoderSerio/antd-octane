/** @jsxImportSource octane */
import { useCallback, useEffect, useMemo, useRef, useState } from "octane";
import { useConfig } from "../config-provider";
import { Context } from "./group-context";
import type {
  Entry,
  ImagePreviewConfig,
  ImagePreviewGroupProps,
} from "./interface";
import { Viewer } from "./preview";
export function PreviewGroup({
  children,
  items,
  fallback,
  previewPrefixCls: customizePrefixCls,
  icons,
  preview = true,
}: ImagePreviewGroupProps) {
  const config = useConfig();
  const previewPrefixCls = `${config.getPrefixCls("image", customizePrefixCls)}-preview`;
  const keepOpenIndex = useRef(false);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [visible, setVisible] = useState(false),
    [index, setIndex] = useState(0);
  const options = typeof preview === "object" ? preview : undefined;
  const mergedOptions = {
    ...options,
    icons: options?.icons ?? icons,
    mousePosition: options?.mousePosition ?? mousePosition,
    transitionName: options?.transitionName ?? `${config.getPrefixCls()}-zoom`,
    maskTransitionName:
      options?.maskTransitionName ?? `${config.getPrefixCls()}-fade`,
  };
  const images = items
    ? items.map((item, index) => ({
        id: `item-${index}`,
        src: typeof item === "string" ? item : (item.src ?? ""),
        alt: typeof item === "string" ? "" : (item.alt ?? ""),
        props: typeof item === "string" ? undefined : item,
      }))
    : entries;
  const current = options?.current ?? index;
  const mergedVisible = options?.visible ?? visible;
  // PreviewGroup keeps a thumbnail's index, and resets imperative reopen to the first image.
  useEffect(() => {
    if (mergedVisible) {
      if (!keepOpenIndex.current && options?.current === undefined) setIndex(0);
    } else keepOpenIndex.current = false;
  }, [mergedVisible]);
  const register = useCallback((entry: Entry) => {
    setEntries((list) => {
      const at = list.findIndex((v) => v.id === entry.id);
      if (at < 0) return [...list, entry];
      const previous = list[at];
      if (
        previous.src === entry.src &&
        previous.alt === entry.alt &&
        previous.width === entry.width &&
        previous.height === entry.height &&
        previous.props?.crossOrigin === entry.props?.crossOrigin &&
        previous.props?.decoding === entry.props?.decoding &&
        previous.props?.draggable === entry.props?.draggable &&
        previous.props?.loading === entry.props?.loading &&
        previous.props?.referrerPolicy === entry.props?.referrerPolicy &&
        previous.props?.sizes === entry.props?.sizes &&
        previous.props?.srcSet === entry.props?.srcSet &&
        previous.props?.useMap === entry.props?.useMap
      )
        return list;
      return list.map((value, index) => (index === at ? entry : value));
    });
    return () => setEntries((list) => list.filter((v) => v.id !== entry.id));
  }, []);
  const show = useCallback(
    (id: string, src: string, position?: { x: number; y: number }) => {
      setMousePosition(position ?? null);
      const found = items
        ? images.findIndex((entry) => entry.src === src)
        : images.findIndex((entry) => entry.id === id);
      const next = found < 0 ? 0 : found;
      keepOpenIndex.current = true;
      if (options?.current === undefined) setIndex(next);
      if (options?.visible === undefined) setVisible(true);
      if (!mergedVisible)
        options?.onVisibleChange?.(true, false, options?.current ?? next);
    },
    [images, items, options, mergedVisible],
  );
  const context = useMemo(
    () => ({ register, show, enabled: preview !== false }),
    [register, show, preview],
  );
  return (
    <Context value={context}>
      {children}
      <Viewer
        group
        open={preview !== false && mergedVisible}
        images={images}
        current={current}
        options={mergedOptions as ImagePreviewConfig | undefined}
        prefixCls={previewPrefixCls}
        countRender={options?.countRender}
        fallback={fallback}
        onChange={(next) => {
          if (options?.current === undefined) setIndex(next);
          options?.onChange?.(next, current);
        }}
        onClose={() => {
          setMousePosition(null);
          if (options?.visible === undefined) setVisible(false);
          if (mergedVisible) options?.onVisibleChange?.(false, true, current);
        }}
      />
    </Context>
  );
}
