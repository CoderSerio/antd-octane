/** @jsxImportSource octane */
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
import { componentClassName } from "../_util/componentClassName";
import {
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
} from "../_util/layout-icons";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface PanelProps {
  children?: OctaneNode;
  className?: string;
  style?: CSSProperties;
  size?: number | string;
  defaultSize?: number | string;
  min?: number | string;
  max?: number | string;
  resizable?: boolean;
  collapsible?:
    | boolean
    | {
        start?: boolean;
        end?: boolean;
        showCollapsibleIcon?: boolean | "auto";
      };
}
export interface SplitterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onResize"> {
  layout?: "horizontal" | "vertical";
  prefixCls?: string;
  rootClassName?: string;
  lazy?: boolean;
  style?: CSSProperties;
  onResizeStart?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
  onCollapse?: (collapsed: boolean[], sizes: number[]) => void;
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
  // Adapted from Ant Design 5.29.3 splitter/hooks/sizeUtil.ts. Constraints
  // allocate unspecified panels; explicit sizes (including zero) stay explicit.
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
  if (!unknown || used > total) {
    return values.map((n) =>
      Number.isNaN(n)
        ? 0
        : used === 0
          ? total / items.length
          : (n * total) / used,
    );
  }
  const indexes = values
    .map((n, i) => (Number.isNaN(n) ? i : -1))
    .filter((i) => i >= 0);
  const minimums = indexes.map((i) => splitPixels(items[i].min, total, 0));
  const maximums = indexes.map((i) => splitPixels(items[i].max, total, total));
  const average = (total - used) / unknown;
  if (Math.max(...minimums) <= average && average <= Math.min(...maximums))
    return values.map((n) => (Number.isNaN(n) ? average : n));
  let remaining = total - used - minimums.reduce((a, b) => a + b, 0);
  const result = [...values];
  for (let j = 0; j < indexes.length; j++) {
    const added = Math.min(maximums[j] - minimums[j], remaining);
    result[indexes[j]] = minimums[j] + added;
    remaining -= added;
  }
  return result;
}
function collapseConfig(value: PanelProps["collapsible"]) {
  return typeof value === "object"
    ? { ...value, showCollapsibleIcon: value.showCollapsibleIcon ?? "auto" }
    : { start: !!value, end: !!value, showCollapsibleIcon: "auto" as const };
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
  onCollapse,
  lazy = false,
  prefixCls: customPrefixCls,
  rootClassName,
  ...rest
}: SplitterProps) {
  const { token: t, component: c, base } = useComponentTokens("Splitter");
  const config = useConfig();
  const prefixCls = config.getPrefixCls("splitter", customPrefixCls);
  const cls = (suffix = "") =>
    componentClassName("ant-splitter", prefixCls, suffix);
  const node = useRef<HTMLDivElement | null>(null);
  const cleanup = useRef<(() => void) | null>(null);
  const [total, setTotal] = useState(0);
  const [inner, setInner] = useState<number[]>([]);
  const [preview, setPreview] = useState<{
    index: number;
    offset: number;
  } | null>(null);
  const [movingIndex, setMovingIndex] = useState<number | null>(null);
  const collapsedSizes = useRef<number[][]>([]);
  const priorTotal = useRef(0);
  const panels = Children.toArray(children).filter(
    (item): item is ElementDescriptor<PanelProps> =>
      isValidElement(item) && item.type === Panel,
  );
  const items = panels.map((panel) => panel.props);
  const sizes = resolvePanelSizes(items, total, inner);
  const vertical = layout === "vertical";
  const reverse = !vertical && config.direction === "rtl";
  const canResize = (index: number) =>
    items[index].resizable !== false &&
    items[index + 1].resizable !== false &&
    (sizes[index] !== 0 || !items[index].min) &&
    (sizes[index + 1] !== 0 || !items[index + 1].min);
  const renderCollapse = (index: number) => {
    const previous = collapseConfig(items[index].collapsible);
    const next = collapseConfig(items[index + 1].collapsible);
    const prevEnd = !!previous.end && sizes[index] > 0;
    const nextStartExpand =
      !!next.start && sizes[index + 1] === 0 && sizes[index] > 0;
    const nextStart = !!next.start && sizes[index + 1] > 0;
    const prevEndExpand =
      !!previous.end && sizes[index] === 0 && sizes[index + 1] > 0;
    const visibility = (first: boolean, second: boolean) => {
      const modes = [
        first ? previous.showCollapsibleIcon : false,
        second ? next.showCollapsibleIcon : false,
      ];
      return modes.includes(true)
        ? true
        : modes.includes("auto")
          ? "auto"
          : false;
    };
    const options = [
      {
        show: prevEnd || nextStartExpand,
        mode: visibility(prevEnd, nextStartExpand),
      },
      {
        show: nextStart || prevEndExpand,
        mode: visibility(prevEndExpand, nextStart),
      },
    ];
    if (config.direction === "rtl") options.reverse();
    return options.map((option, side) => {
      if (!option.show) return null;
      const physical = side === 0 ? "start" : "end";
      const logical = config.direction === "rtl" ? 1 - side : side;
      const collapsingIndex = index + logical;
      const hiddenIndex = sizes[index] === 0 ? index : index + 1;
      const expanding = sizes[index] === 0 || sizes[index + 1] === 0;
      const Icon = vertical
        ? side === 0
          ? UpOutlined
          : DownOutlined
        : side === 0
          ? LeftOutlined
          : RightOutlined;
      return (
        <button
          key={physical}
          type="button"
          aria-label={`${expanding ? "展开" : "收起"}面板 ${(expanding ? hiddenIndex : collapsingIndex) + 1}`}
          className={[
            cls("-bar-collapse-bar"),
            cls(`-bar-collapse-bar-${physical}`),
            cls(
              `-bar-collapse-bar-${option.mode === true ? "always-visible" : option.mode === false ? "always-hidden" : "hover-only"}`,
            ),
          ]}
          onClick={() => collapse(index, physical)}
        >
          <Icon />
        </button>
      );
    });
  };
  useLayoutEffect(() => {
    cleanup.current?.();
    const el = node.current;
    if (!el) return;
    const measure = () => {
      const bounds = el.getBoundingClientRect();
      const boundary = vertical ? bounds.height : bounds.width;
      const offset = vertical ? el.offsetHeight : el.offsetWidth;
      const size =
        boundary > 0
          ? offset === Math.round(boundary)
            ? boundary
            : offset
          : vertical
            ? el.clientHeight
            : el.clientWidth;
      if (size === 0) return;
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
    const onWindowResize = () => measure();
    window.addEventListener("resize", onWindowResize);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", onWindowResize);
    };
  }, [vertical]);
  useEffect(() => () => cleanup.current?.(), []);
  const updateSizes = (next: number[]) => setInner(next);
  const constrain = (index: number, first: number, start = sizes) => {
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
    return next;
  };
  const change = (index: number, first: number, start = sizes) => {
    const next = constrain(index, first, start);
    updateSizes(next);
    onResize?.(next);
    return next;
  };
  const collapse = (index: number, physical: "start" | "end") => {
    const type =
      config.direction === "rtl"
        ? physical === "start"
          ? "end"
          : "start"
        : physical;
    const currentIndex = type === "start" ? index : index + 1;
    const targetIndex = type === "start" ? index + 1 : index;
    const next = [...sizes];
    if (next[currentIndex] > 0 && next[targetIndex] > 0) {
      collapsedSizes.current[index] = [next[index], next[index + 1]];
      next[targetIndex] += next[currentIndex];
      next[currentIndex] = 0;
    } else {
      const sum = next[index] + next[index + 1];
      const cached = collapsedSizes.current[index];
      const low = Math.max(
        splitPixels(items[index].min, total, 0),
        sum - splitPixels(items[index + 1].max, total, total),
      );
      const high = Math.min(
        splitPixels(items[index].max, total, total),
        sum - splitPixels(items[index + 1].min, total, 0),
      );
      const first =
        cached?.[0] && cached?.[1]
          ? (sum * cached[0]) / (cached[0] + cached[1])
          : sum / 2;
      next[index] = Math.max(low, Math.min(high, first));
      next[index + 1] = sum - next[index];
    }
    updateSizes(next);
    onResize?.(next);
    onResizeEnd?.(next);
    onCollapse?.(
      next.map((size) => Math.abs(size) < Number.EPSILON),
      next,
    );
  };
  const begin = (event: PointerEvent, index: number) => {
    if (event.button !== 0) return;
    event.preventDefault();
    cleanup.current?.();
    const start = [...sizes];
    const origin = vertical ? event.clientY : event.clientX;
    let latest = start;
    setMovingIndex(index);
    onResizeStart?.(start);
    const move = (e: PointerEvent) => {
      if (e.pointerId !== event.pointerId) return;
      const offset =
        ((vertical ? e.clientY : e.clientX) - origin) * (reverse ? -1 : 1);
      if (lazy) {
        latest = constrain(index, start[index] + offset, start);
        setPreview({
          index,
          offset: (latest[index] - start[index]) * (reverse ? -1 : 1),
        });
      } else latest = change(index, start[index] + offset, start);
    };
    const stop = (e: PointerEvent) => {
      if (e.pointerId !== event.pointerId) return;
      cleanup.current?.();
      if (lazy && e.type !== "pointercancel") updateSizes(latest);
      setPreview(null);
      setMovingIndex(null);
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
      setPreview(null);
      setMovingIndex(null);
    };
  };
  return (
    <div
      {...rest}
      ref={node}
      className={[
        cls(),
        cls(`-${layout}`),
        config.direction === "rtl" && cls("-rtl"),
        className,
        rootClassName,
        config.splitter?.className,
      ]}
      style={{
        ...base,
        "--ao-split-bar": `${c?.splitBarSize ?? 2}px`,
        "--ao-split-trigger": `${c?.splitTriggerSize ?? 6}px`,
        "--ao-split-handle": `${c?.splitBarDraggableSize ?? c?.resizeSpinnerSize ?? 20}px`,
        direction: config.direction,
        "--ao-split-bg": t.controlItemBgHover,
        "--ao-split-active": t.controlItemBgActive,
        "--ao-split-active-hover": t.controlItemBgActiveHover,
        "--ao-split-handle-bg": t.colorFill,
        "--ao-split-collapse-width": `${t.fontSizeSM}px`,
        "--ao-split-collapse-height": `${t.controlHeightSM}px`,
        "--ao-split-collapse-radius": `${t.borderRadiusXS}px`,
        ...config.splitter?.style,
        ...style,
      }}
    >
      {panels.map((panel, index) => (
        <Fragment key={panel.key ?? index}>
          <div
            className={[
              cls("-panel"),
              sizes[index] === 0 && cls("-panel-hidden"),
              panel.props.className,
            ]}
            style={{
              ...panel.props.style,
              flexBasis:
                total > 0
                  ? sizes[index]
                  : (panel.props.size ?? panel.props.defaultSize ?? "auto"),
              flexGrow:
                total > 0 ||
                panel.props.size !== undefined ||
                panel.props.defaultSize !== undefined
                  ? 0
                  : 1,
            }}
          >
            {panel.props.children}
          </div>
          {index < panels.length - 1 && (
            <div className={cls("-bar")}>
              {lazy && preview?.index === index && preview.offset !== 0 && (
                <div
                  className={cls("-bar-preview")}
                  style={{
                    transform: vertical
                      ? `translateY(${preview.offset}px)`
                      : `translateX(${preview.offset}px)`,
                  }}
                />
              )}
              {/* biome-ignore lint/a11y/useSemanticElements: Adjustable range separator, not a thematic break. */}
              <div
                role="separator"
                aria-label={`调整面板 ${index + 1} 和 ${index + 2}`}
                aria-orientation={vertical ? "horizontal" : "vertical"}
                aria-valuemin={
                  total > 0
                    ? Math.round(
                        (100 *
                          (sizes.slice(0, index).reduce((a, b) => a + b, 0) +
                            Math.max(
                              splitPixels(items[index].min, total, 0),
                              sizes[index] +
                                sizes[index + 1] -
                                splitPixels(items[index + 1].max, total, total),
                            ))) /
                          total,
                      )
                    : 0
                }
                aria-valuemax={
                  total > 0
                    ? Math.round(
                        (100 *
                          (sizes.slice(0, index).reduce((a, b) => a + b, 0) +
                            Math.min(
                              splitPixels(items[index].max, total, total),
                              sizes[index] +
                                sizes[index + 1] -
                                splitPixels(items[index + 1].min, total, 0),
                            ))) /
                          total,
                      )
                    : 100
                }
                aria-valuenow={
                  total > 0
                    ? Math.round(
                        (sizes.slice(0, index + 1).reduce((a, b) => a + b, 0) *
                          100) /
                          total,
                      )
                    : 0
                }
                aria-disabled={!canResize(index)}
                tabIndex={canResize(index) ? 0 : -1}
                className={[
                  cls("-bar-dragger"),
                  movingIndex === index && cls("-bar-dragger-active"),
                ]}
                onPointerDown={(event) => {
                  if (canResize(index)) begin(event, index);
                }}
                onKeyDown={(event) => {
                  if (!canResize(index)) return;
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
                            (reverse ? -1 : 1) *
                            (event.shiftKey ? 1 : 10),
                  );
                  onResizeEnd?.(next);
                }}
              />
              {renderCollapse(index)}
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
