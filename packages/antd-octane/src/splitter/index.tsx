import type {
  CSSProperties,
  ElementDescriptor,
  HTMLAttributes,
  OctaneNode,
} from "octane";
import {
  Children,
  descriptorChildren,
  Fragment,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { useComponentTokens } from "../_util/tokens";
export interface PanelProps {
  children?: OctaneNode;
  className?: string;
  style?: CSSProperties;
  size?: number | string;
  defaultSize?: number | string;
  min?: number | string;
  max?: number | string;
  resizable?: boolean;
}
export interface SplitterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onResize"> {
  layout?: "horizontal" | "vertical";
  style?: CSSProperties;
  onResizeStart?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
}
export function splitPixels(
  value: number | string | undefined,
  total: number,
  fallback: number,
) {
  if (value === undefined) return fallback;
  const number = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(number)
    ? Math.max(
        0,
        typeof value === "string" && value.endsWith("%")
          ? (number * total) / 100
          : number,
      )
    : fallback;
}
export function resolvePanelSizes(
  items: PanelProps[],
  total: number,
  inner: number[] = [],
) {
  const values = items.map((item, i) =>
    item.size !== undefined
      ? splitPixels(item.size, total, 0)
      : (inner[i] ??
        (item.defaultSize !== undefined
          ? splitPixels(item.defaultSize, total, 0)
          : NaN)),
  );
  const unknown = values.filter(Number.isNaN).length;
  const used = values.reduce((sum, n) => sum + (Number.isNaN(n) ? 0 : n), 0);
  let sizes = values.map((n) =>
    Number.isNaN(n) ? Math.max(0, total - used) / Math.max(1, unknown) : n,
  );
  const clamp = (n: number, i: number) =>
    Math.max(
      splitPixels(items[i].min, total, 0),
      Math.min(splitPixels(items[i].max, total, Infinity), n),
    );
  sizes = sizes.map(clamp);
  for (let pass = 0; pass < items.length + 1; pass++) {
    const delta = total - sizes.reduce((a, b) => a + b, 0);
    if (Math.abs(delta) < 0.01) break;
    const eligible = items
      .map((item, i) =>
        item.size === undefined &&
        (delta > 0
          ? sizes[i] < splitPixels(item.max, total, Infinity)
          : sizes[i] > splitPixels(item.min, total, 0))
          ? i
          : -1,
      )
      .filter((i) => i >= 0);
    if (!eligible.length) break;
    for (const i of eligible)
      sizes[i] = clamp(sizes[i] + delta / eligible.length, i);
  }
  return sizes;
}
function Panel({ children, className, style }: PanelProps) {
  return (
    <div className={["ant-splitter-panel", className]} style={style}>
      {children}
    </div>
  );
}
function InternalSplitter({
  layout = "horizontal",
  children,
  className,
  style,
  onResize,
  onResizeStart,
  onResizeEnd,
  ...rest
}: SplitterProps) {
  const { token: t, component: c, base } = useComponentTokens("Splitter");
  const node = useRef<HTMLDivElement | null>(null);
  const cleanup = useRef<(() => void) | null>(null);
  const [total, setTotal] = useState(0);
  const [inner, setInner] = useState<number[]>([]);
  const priorTotal = useRef(0);
  const panels = Children.toArray(children).filter(
    (item): item is ElementDescriptor<PanelProps> =>
      isValidElement(item) && item.type === Panel,
  );
  const items = panels.map((panel) => panel.props);
  const sizes = resolvePanelSizes(items, total, inner);
  const vertical = layout === "vertical";
  useLayoutEffect(() => {
    cleanup.current?.();
    const el = node.current;
    if (!el) return;
    const measure = () => {
      const size = vertical ? el.clientHeight : el.clientWidth;
      if (size === priorTotal.current) return;
      cleanup.current?.();
      const previous = priorTotal.current;
      priorTotal.current = size;
      setTotal(size);
      if (previous > 0)
        setInner((values) => values.map((n) => (n * size) / previous));
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    observer?.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [vertical]);
  useEffect(() => () => cleanup.current?.(), []);
  const change = (index: number, first: number, start = sizes) => {
    const sum = start[index] + start[index + 1];
    const min = Math.max(
      splitPixels(items[index].min, total, 0),
      sum - splitPixels(items[index + 1].max, total, Infinity),
    );
    const max = Math.min(
      splitPixels(items[index].max, total, Infinity),
      sum - splitPixels(items[index + 1].min, total, 0),
    );
    if (min > max) return start;
    const next = [...start];
    next[index] = Math.max(min, Math.min(max, first));
    next[index + 1] = sum - next[index];
    if (items[index].size === undefined && items[index + 1].size === undefined)
      setInner((previous) =>
        items.map((item, i) =>
          item.size === undefined ? next[i] : (previous[i] ?? start[i]),
        ),
      );
    onResize?.(next);
    return next;
  };
  const begin = (event: PointerEvent, index: number) => {
    if (event.button !== 0) return;
    event.preventDefault();
    cleanup.current?.();
    const start = [...sizes];
    const origin = vertical ? event.clientY : event.clientX;
    let latest = start;
    onResizeStart?.(start);
    const move = (e: PointerEvent) => {
      if (e.pointerId !== event.pointerId) return;
      latest = change(
        index,
        start[index] + (vertical ? e.clientY : e.clientX) - origin,
        start,
      );
    };
    const stop = (e: PointerEvent) => {
      if (e.pointerId !== event.pointerId) return;
      cleanup.current?.();
      onResizeEnd?.(latest);
    };
    const oldSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", stop);
    document.addEventListener("pointercancel", stop);
    cleanup.current = () => {
      document.body.style.userSelect = oldSelect;
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", stop);
      document.removeEventListener("pointercancel", stop);
      cleanup.current = null;
    };
  };
  return (
    <div
      {...rest}
      ref={node}
      className={["ant-splitter", `ant-splitter-${layout}`, className]}
      style={{
        ...base,
        "--ao-split-bar": `${c?.splitBarSize ?? 2}px`,
        "--ao-split-trigger": `${c?.splitTriggerSize ?? 6}px`,
        "--ao-split-handle": `${c?.splitBarDraggableSize ?? c?.resizeSpinnerSize ?? 20}px`,
        "--ao-split-bg": t.colorFillTertiary,
        "--ao-split-active": t.colorPrimaryHover,
        ...style,
      }}
    >
      {panels.map((panel, index) => (
        <Fragment key={panel.key ?? index}>
          <div
            className={["ant-splitter-panel", panel.props.className]}
            style={{
              flex: total > 0 ? `0 0 ${sizes[index]}px` : "1 1 0",
              ...panel.props.style,
            }}
          >
            {panel.props.children}
          </div>
          {index < panels.length - 1 && (
            <div className="ant-splitter-bar">
              {/* biome-ignore lint/a11y/useSemanticElements: Adjustable range separator, not a thematic break. */}
              <div
                role="separator"
                aria-label={`调整面板 ${index + 1} 和 ${index + 2}`}
                aria-orientation={vertical ? "horizontal" : "vertical"}
                aria-valuemin={Math.round(
                  splitPixels(items[index].min, total, 0),
                )}
                aria-valuemax={Math.round(
                  Math.min(
                    splitPixels(items[index].max, total, total),
                    sizes[index] + sizes[index + 1],
                  ),
                )}
                aria-valuenow={Math.round(sizes[index])}
                aria-disabled={
                  items[index].resizable === false ||
                  items[index + 1].resizable === false
                }
                tabIndex={
                  items[index].resizable === false ||
                  items[index + 1].resizable === false
                    ? -1
                    : 0
                }
                className="ant-splitter-bar-dragger"
                onPointerDown={(event) => {
                  if (
                    items[index].resizable !== false &&
                    items[index + 1].resizable !== false
                  )
                    begin(event, index);
                }}
                onKeyDown={(event) => {
                  if (
                    items[index].resizable === false ||
                    items[index + 1].resizable === false
                  )
                    return;
                  const keys = vertical
                    ? ["ArrowUp", "ArrowDown"]
                    : ["ArrowLeft", "ArrowRight"];
                  if (![...keys, "Home", "End"].includes(event.key)) return;
                  event.preventDefault();
                  onResizeStart?.(sizes);
                  const next = change(
                    index,
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? total
                        : sizes[index] +
                          (event.key === keys[0] ? -1 : 1) *
                            (event.shiftKey ? 1 : 10),
                  );
                  onResizeEnd?.(next);
                }}
              />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
export const Splitter = descriptorChildren(
  Object.assign(InternalSplitter, { Panel }),
);
