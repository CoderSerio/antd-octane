/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useEffect, useRef, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export type SliderValue = number | [number, number];
export type SliderMark =
  | OctaneNode
  | { style?: CSSProperties; label: OctaneNode };
export interface SliderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: SliderValue;
  defaultValue?: SliderValue;
  range?: boolean;
  min?: number;
  max?: number;
  step?: number | null;
  marks?: Record<number, SliderMark>;
  included?: boolean;
  dots?: boolean;
  disabled?: boolean;
  vertical?: boolean;
  reverse?: boolean;
  keyboard?: boolean;
  onChange?: (value: SliderValue) => void;
  onChangeComplete?: (value: SliderValue) => void;
  tooltip?: {
    open?: boolean;
    formatter?: null | ((value: number) => OctaneNode);
  };
  style?: CSSProperties;
}
export function Slider({
  value,
  defaultValue,
  range = false,
  min = 0,
  max = 100,
  step = 1,
  marks = {},
  included = true,
  dots = false,
  disabled,
  vertical = false,
  reverse = false,
  keyboard = true,
  onChange,
  onChangeComplete,
  tooltip,
  className,
  style,
  ...rest
}: SliderProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Slider");
  const blocked = (disabled ?? config.componentDisabled) || max <= min;
  const low = Number.isFinite(min) ? min : 0;
  const high = Number.isFinite(max) ? Math.max(low, max) : 100;
  const increment =
    step === null ? null : Number.isFinite(step) && step > 0 ? step : 1;
  const markValues = Object.keys(marks)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n >= low && n <= high)
    .sort((a, b) => a - b);
  const snap = (n: number) => {
    const clamped = Math.max(low, Math.min(high, Number.isFinite(n) ? n : low));
    const choices = [low, high, ...markValues];
    if (increment !== null)
      choices.push(
        Math.min(
          high,
          Number(
            (
              low +
              Math.round((clamped - low) / increment) * increment
            ).toPrecision(12),
          ),
        ),
      );
    return choices.reduce(
      (best, n) =>
        Math.abs(n - clamped) < Math.abs(best - clamped) ? n : best,
      choices[0],
    );
  };
  const [inner, setInner] = useState<SliderValue>(
    defaultValue ?? (range ? [low, low] : low),
  );
  const raw = value ?? inner;
  const values = range
    ? (Array.isArray(raw) ? raw : [low, raw]).map(snap).sort((a, b) => a - b)
    : [snap(Array.isArray(raw) ? raw[0] : raw)];
  const root = useRef<HTMLDivElement | null>(null);
  const handles = useRef<(HTMLDivElement | null)[]>([]);
  const cleanup = useRef<(() => void) | undefined>(undefined);
  const latest = useRef({ values, onChangeComplete });
  latest.current = { values, onChangeComplete };
  const keyPending = useRef<SliderValue | undefined>(undefined);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState<number | null>(null);
  useEffect(() => () => cleanup.current?.(), []);
  const output = (next: number[]): SliderValue =>
    range ? [next[0], next[1]] : next[0];
  const update = (
    index: number,
    n: number,
    previous = latest.current.values,
  ) => {
    const next = [...previous];
    next[index] = Math.max(
      index === 1 ? next[0] : low,
      Math.min(index === 0 && range ? next[1] : high, snap(n)),
    );
    if (next.every((v, i) => v === previous[i])) return undefined;
    const result = output(next);
    if (value === undefined) setInner(result);
    onChange?.(result);
    return next;
  };
  const ratio = (n: number) =>
    (high === low ? 0 : (n - low) / (high - low)) * 100;
  const position = (n: number) => (reverse ? 100 - ratio(n) : ratio(n));
  const point = (event: PointerEvent) => {
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return low;
    const fraction = vertical
      ? (rect.bottom - event.clientY) / rect.height
      : (event.clientX - rect.left) / rect.width;
    return low + (reverse ? 1 - fraction : fraction) * (high - low);
  };
  const begin = (event: PointerEvent, index?: number) => {
    if (blocked || event.button !== 0) return;
    event.preventDefault();
    cleanup.current?.();
    let draft = [...values];
    const n = point(event);
    const chosen =
      index ??
      (range &&
      (Math.abs(n - values[1]) < Math.abs(n - values[0]) ||
        (values[0] === values[1] && n > values[1]))
        ? 1
        : 0);
    handles.current[chosen]?.focus();
    setDragging(true);
    let changed = false;
    const apply = (event: PointerEvent) => {
      const next = update(chosen, point(event), draft);
      if (next) {
        draft = next;
        changed = true;
      }
    };
    apply(event);
    const move = (next: PointerEvent) => {
      if (next.pointerId === event.pointerId) apply(next);
    };
    const finish = (next: PointerEvent) => {
      if (next.pointerId !== event.pointerId) return;
      cleanup.current?.();
      cleanup.current = undefined;
      setDragging(false);
      if (changed) latest.current.onChangeComplete?.(output(draft));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    cleanup.current = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
  };
  const tickValues =
    dots && increment !== null
      ? (high - low) / increment <= 1000
        ? Array.from(
            { length: Math.floor((high - low) / increment) + 1 },
            (_, i) => Number((low + i * increment).toPrecision(12)),
          )
        : markValues
      : markValues;
  const start = range ? values[0] : low,
    end = range ? values[1] : values[0];
  const trackStart = Math.min(position(start), position(end)),
    trackSize = Math.abs(position(end) - position(start));
  return (
    <div
      {...rest}
      ref={root}
      className={[
        "ant-slider",
        vertical ? "ant-slider-vertical" : "ant-slider-horizontal",
        blocked && "ant-slider-disabled",
        markValues.length > 0 && "ant-slider-with-marks",
        dragging && "ant-slider-dragging",
        className,
      ]}
      style={{
        ...base,
        "--ao-slider-control": `${c?.controlSize ?? t.controlHeightLG / 4}px`,
        "--ao-slider-rail-size": `${c?.railSize ?? 4}px`,
        "--ao-slider-handle": `${c?.handleSize ?? t.controlHeightLG / 4}px`,
        "--ao-slider-handle-hover": `${c?.handleSizeHover ?? t.controlHeightSM / 2}px`,
        "--ao-slider-handle-line-hover": `${c?.handleLineWidthHover ?? t.lineWidth + 1.5}px`,
        "--ao-slider-active-outline":
          c?.handleActiveOutlineColor ?? t.colorPrimaryBg,
        "--ao-slider-handle-line": `${c?.handleLineWidth ?? t.lineWidth + 1}px`,
        "--ao-slider-rail": c?.railBg ?? t.colorFillTertiary,
        "--ao-slider-rail-hover": c?.railHoverBg ?? t.colorFillSecondary,
        "--ao-slider-track": c?.trackBg ?? t.colorPrimaryBorder,
        "--ao-slider-track-hover": c?.trackHoverBg ?? t.colorPrimaryBorderHover,
        "--ao-slider-handle-color": c?.handleColor ?? t.colorPrimaryBorder,
        "--ao-slider-active": c?.handleActiveColor ?? t.colorPrimary,
        "--ao-slider-disabled": c?.handleColorDisabled ?? t.colorTextDisabled,
        "--ao-slider-track-disabled":
          c?.trackBgDisabled ?? t.colorBgContainerDisabled,
        "--ao-slider-dot": `${c?.dotSize ?? 8}px`,
        "--ao-slider-dot-border": c?.dotBorderColor ?? t.colorBorderSecondary,
        "--ao-slider-dot-active":
          c?.dotActiveBorderColor ?? t.colorPrimaryBorder,
        "--ao-slider-margin": `${(t.controlHeight - (c?.controlSize ?? t.controlHeightLG / 4)) / 2}px`,
        "--ao-slider-full-margin": `${(c?.controlSize ?? t.controlHeightLG / 4) / 2}px`,
        ...style,
      }}
      onPointerDown={(event) => begin(event)}
    >
      <div className="ant-slider-rail" />
      {included && (
        <div
          className="ant-slider-track"
          style={
            vertical
              ? { bottom: `${trackStart}%`, height: `${trackSize}%` }
              : { left: `${trackStart}%`, width: `${trackSize}%` }
          }
        />
      )}
      <div className="ant-slider-step">
        {[...new Set(tickValues)].map((n) => (
          <span
            key={n}
            className={[
              "ant-slider-dot",
              included && n >= start && n <= end && "ant-slider-dot-active",
            ]}
            style={
              vertical
                ? { bottom: `${position(n)}%` }
                : { left: `${position(n)}%` }
            }
          />
        ))}
      </div>
      {values.map((n, index) => (
        <div
          key={index}
          ref={(node) => {
            handles.current[index] = node;
          }}
          className="ant-slider-handle"
          role="slider"
          tabIndex={blocked ? -1 : 0}
          aria-label={
            rest["aria-label"] ??
            (range ? (index === 0 ? "范围下限" : "范围上限") : "滑动输入")
          }
          aria-orientation={vertical ? "vertical" : "horizontal"}
          aria-valuemin={index === 1 ? values[0] : low}
          aria-valuemax={index === 0 && range ? values[1] : high}
          aria-valuenow={n}
          aria-disabled={blocked || undefined}
          style={
            vertical
              ? { bottom: `${position(n)}%` }
              : { left: `${position(n)}%` }
          }
          onPointerDown={(event) => {
            event.stopPropagation();
            begin(event, index);
          }}
          onFocus={() => setFocused(index)}
          onBlur={() => {
            setFocused(null);
            if (keyPending.current !== undefined) {
              onChangeComplete?.(keyPending.current);
              keyPending.current = undefined;
            }
          }}
          onKeyDown={(event) => {
            if (blocked || !keyboard) return;
            let next: number | undefined;
            const direction =
              event.key === "ArrowRight" || event.key === "ArrowUp"
                ? 1
                : event.key === "ArrowLeft" || event.key === "ArrowDown"
                  ? -1
                  : 0;
            if (event.key === "Home") next = low;
            else if (event.key === "End") next = high;
            else if (direction) {
              const sign = direction * (reverse ? -1 : 1);
              next =
                increment === null
                  ? sign > 0
                    ? [...markValues, high].find((mark) => mark > n)
                    : [low, ...markValues].reverse().find((mark) => mark < n)
                  : n + sign * increment;
            } else if (event.key === "PageUp" || event.key === "PageDown")
              next =
                n +
                (event.key === "PageUp" ? 1 : -1) *
                  (increment ?? (high - low) / 10) *
                  10;
            if (next !== undefined) {
              event.preventDefault();
              const result = update(index, next);
              if (result) keyPending.current = output(result);
            }
          }}
          onKeyUp={() => {
            if (keyPending.current !== undefined) {
              onChangeComplete?.(keyPending.current);
              keyPending.current = undefined;
            }
          }}
        >
          {tooltip?.formatter !== null &&
            tooltip?.open !== false &&
            (tooltip?.open || focused === index) && (
              <span className="ant-slider-value" aria-hidden="true">
                {tooltip?.formatter ? tooltip.formatter(n) : n}
              </span>
            )}
        </div>
      ))}
      {markValues.length > 0 && (
        <div className="ant-slider-mark">
          {markValues.map((n) => {
            const mark = marks[n];
            const object =
              typeof mark === "object" && mark !== null && "label" in mark;
            return (
              <span
                key={n}
                className="ant-slider-mark-text"
                style={{
                  ...(vertical
                    ? { bottom: `${position(n)}%` }
                    : { left: `${position(n)}%` }),
                  ...(object
                    ? (mark as { style?: CSSProperties }).style
                    : undefined),
                }}
              >
                {object ? mark.label : (mark as OctaneNode)}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
