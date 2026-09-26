import { FastColor } from "@ant-design/fast-color";
import type { CSSProperties, ImgHTMLAttributes, OctaneNode } from "octane";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "octane";
import { DialogLayer } from "../_util/dialog";
import { useComponentTokens } from "../_util/tokens";
export interface ImagePreviewConfig {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  src?: string;
}
export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "style"> {
  preview?: boolean | ImagePreviewConfig;
  fallback?: string;
  placeholder?: OctaneNode;
  rootClassName?: string;
  rootStyle?: CSSProperties;
  style?: CSSProperties;
}
export interface ImagePreviewGroupProps {
  children?: OctaneNode;
  preview?:
    | boolean
    | {
        visible?: boolean;
        onVisibleChange?: (visible: boolean) => void;
        current?: number;
        onChange?: (current: number, previous: number) => void;
      };
}
interface Entry {
  id: string;
  src: string;
  alt: string;
}
const Context = createContext<{
  register: (entry: Entry) => () => void;
  show: (id: string) => void;
  enabled: boolean;
} | null>(null);
function Viewer({
  open,
  images,
  current,
  onChange,
  onClose,
}: {
  open: boolean;
  images: Entry[];
  current: number;
  onChange: (next: number) => void;
  onClose: () => void;
}) {
  const { token: t, component: c, base } = useComponentTokens("Image");
  const [zoom, setZoom] = useState(1);
  const image = images[current];
  useEffect(() => setZoom(1), [current, open]);
  return (
    <DialogLayer
      open={open && !!image}
      onClose={onClose}
      label="图片预览"
      className="ant-image-preview-root"
      panelClassName="ant-image-preview"
      maskClosable
      style={{
        ...base,
        "--ao-dialog-z": t.zIndexPopupBase + 80,
        "--ao-dialog-mask": t.colorBgMask,
        "--ao-image-operation":
          c?.previewOperationColor ??
          new FastColor(t.colorTextLightSolid).setA(0.65).toRgbString(),
        "--ao-image-operation-disabled":
          c?.previewOperationColorDisabled ??
          new FastColor(t.colorTextLightSolid).setA(0.25).toRgbString(),
        "--ao-image-operation-hover":
          c?.previewOperationHoverColor ??
          new FastColor(t.colorTextLightSolid).setA(0.85).toRgbString(),
        "--ao-image-operation-bg": c?.previewOperationBg ?? "rgba(0,0,0,.1)",
        "--ao-image-zoom-size": `${c?.previewOperationSizeZoom ?? 22}px`,
        "--ao-image-operation-size": `${c?.previewOperationSize ?? t.fontSizeIcon * 1.5}px`,
      }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: The preview groups image navigation, not form controls. */}
      <div
        className="ant-image-preview-content"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" && current > 0) {
            event.preventDefault();
            onChange(current - 1);
          }
          if (event.key === "ArrowRight" && current < images.length - 1) {
            event.preventDefault();
            onChange(current + 1);
          }
        }}
        role="group"
        aria-label="图片预览操作"
      >
        <div className="ant-image-preview-toolbar">
          <button
            type="button"
            className="ant-image-preview-zoom"
            aria-label="缩小图片"
            disabled={zoom <= 1}
            onClick={() => setZoom((v) => Math.max(1, v - 0.5))}
          >
            −
          </button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="ant-image-preview-zoom"
            aria-label="放大图片"
            disabled={zoom >= 3}
            onClick={() => setZoom((v) => Math.min(3, v + 0.5))}
          >
            +
          </button>
          <button type="button" aria-label="关闭图片预览" onClick={onClose}>
            ×
          </button>
        </div>
        {images.length > 1 && (
          <>
            <button
              className="ant-image-preview-prev"
              type="button"
              aria-label="上一张图片"
              disabled={current === 0}
              onClick={() => onChange(current - 1)}
            >
              ‹
            </button>
            <button
              className="ant-image-preview-next"
              type="button"
              aria-label="下一张图片"
              disabled={current === images.length - 1}
              onClick={() => onChange(current + 1)}
            >
              ›
            </button>
            <span className="ant-image-preview-count">
              {current + 1} / {images.length}
            </span>
          </>
        )}
        <div className="ant-image-preview-stage">
          {image && (
            <img
              className="ant-image-preview-img"
              src={image.src}
              alt={image.alt}
              style={{ transform: `scale(${zoom})` }}
            />
          )}
        </div>
      </div>
    </DialogLayer>
  );
}
function PreviewGroup({ children, preview = true }: ImagePreviewGroupProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [visible, setVisible] = useState(false),
    [index, setIndex] = useState(0);
  const options = typeof preview === "object" ? preview : undefined;
  const current = Math.max(
    0,
    Math.min(entries.length - 1, options?.current ?? index),
  );
  const register = useCallback((entry: Entry) => {
    setEntries((list) => {
      const at = list.findIndex((v) => v.id === entry.id);
      if (at < 0) return [...list, entry];
      if (list[at].src === entry.src && list[at].alt === entry.alt) return list;
      return list.map((value, index) => (index === at ? entry : value));
    });
    return () => setEntries((list) => list.filter((v) => v.id !== entry.id));
  }, []);
  const show = useCallback(
    (id: string) => {
      const next = entries.findIndex((v) => v.id === id);
      if (next < 0) return;
      if (options?.current === undefined) setIndex(next);
      options?.onChange?.(next, current);
      if (options?.visible === undefined) setVisible(true);
      options?.onVisibleChange?.(true);
    },
    [entries, options, current],
  );
  const context = useMemo(
    () => ({ register, show, enabled: preview !== false }),
    [register, show, preview],
  );
  return (
    <Context value={context}>
      {children}
      <Viewer
        open={preview !== false && (options?.visible ?? visible)}
        images={entries}
        current={current}
        onChange={(next) => {
          if (options?.current === undefined) setIndex(next);
          options?.onChange?.(next, current);
        }}
        onClose={() => {
          if (options?.visible === undefined) setVisible(false);
          options?.onVisibleChange?.(false);
        }}
      />
    </Context>
  );
}
function ImageBase({
  src,
  alt = "",
  preview = true,
  fallback,
  placeholder,
  rootClassName,
  rootStyle,
  className,
  style,
  width,
  height,
  onError,
  onLoad,
  ...rest
}: ImageProps) {
  const group = useContext(Context);
  const id = useId();
  const [failed, setFailed] = useState(false),
    [loaded, setLoaded] = useState(false),
    [visible, setVisible] = useState(false);
  const options = typeof preview === "object" ? preview : undefined;
  const actual = failed && fallback ? fallback : src;
  const previewSrc = options?.src ?? actual ?? "";
  const enabled = preview !== false && group?.enabled !== false && !!previewSrc;
  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);
  const register = group?.register;
  useEffect(() => {
    if (register && preview !== false && previewSrc)
      return register({ id, src: previewSrc, alt });
  }, [register, id, preview !== false, !!previewSrc]);
  useEffect(() => {
    if (register && preview !== false && previewSrc)
      register({ id, src: previewSrc, alt });
  }, [register, id, previewSrc, alt, preview !== false]);
  const open = () => {
    if (!enabled) return;
    if (group) {
      group.show(id);
      return;
    }
    if (options?.visible === undefined) setVisible(true);
    options?.onVisibleChange?.(true);
  };
  return (
    <>
      <div
        className={["ant-image", rootClassName]}
        style={{ width, height, ...rootStyle }}
      >
        {!loaded && placeholder && (
          <div className="ant-image-placeholder">{placeholder}</div>
        )}
        <img
          {...rest}
          src={actual}
          alt={alt}
          width={width}
          height={height}
          className={["ant-image-img", className]}
          style={style}
          onLoad={(event) => {
            setLoaded(true);
            onLoad?.(event);
          }}
          onError={(event) => {
            setFailed(true);
            setLoaded(true);
            onError?.(event);
          }}
        />
        {enabled && (
          <button
            type="button"
            className="ant-image-mask"
            aria-label={`预览${alt ? `：${alt}` : "图片"}`}
            onClick={open}
          >
            <span>预览</span>
          </button>
        )}
      </div>
      {!group && (
        <Viewer
          open={enabled && (options?.visible ?? visible)}
          images={[{ id, src: previewSrc, alt }]}
          current={0}
          onChange={() => {}}
          onClose={() => {
            if (options?.visible === undefined) setVisible(false);
            options?.onVisibleChange?.(false);
          }}
        />
      )}
    </>
  );
}
export const Image = Object.assign(ImageBase, { PreviewGroup });
