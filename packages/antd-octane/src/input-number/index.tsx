/** @jsxImportSource octane */
import type { CSSProperties, InputHTMLAttributes, Ref } from "octane";
import { useImperativeHandle, useLayoutEffect, useRef, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface InputNumberRef {
  input: HTMLInputElement | null;
  nativeElement: HTMLDivElement | null;
  focus: (options?: FocusOptions) => void;
  blur: () => void;
}
export interface InputNumberProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "value"
    | "defaultValue"
    | "onChange"
    | "size"
    | "style"
    | "ref"
    | "min"
    | "max"
    | "step"
    | "type"
    | "children"
  > {
  value?: number | null;
  defaultValue?: number | null;
  min?: number;
  max?: number;
  step?: number | string;
  precision?: number;
  formatter?: (
    value: number | string | undefined,
    info: { userTyping: boolean; input: string },
  ) => string;
  parser?: (displayValue: string | undefined) => number | string;
  controls?: boolean;
  keyboard?: boolean;
  changeOnBlur?: boolean;
  size?: "small" | "middle" | "large";
  status?: "error" | "warning";
  bordered?: boolean;
  onChange?: (value: number | null) => void;
  onStep?: (
    value: number,
    info: { offset: number; type: "up" | "down" },
  ) => void;
  onPressEnter?: (event: KeyboardEvent) => void;
  style?: CSSProperties;
  ref?: Ref<InputNumberRef>;
}
function decimal(value: number) {
  const [coefficient, exponent = "0"] = String(value).split(/e/i);
  const places = (coefficient.split(".")[1]?.length ?? 0) - Number(exponent);
  return { integer: BigInt(coefficient.replace(".", "")), scale: places };
}
function add(value: number, offset: number) {
  const a = decimal(value),
    b = decimal(offset),
    scale = Math.max(a.scale, b.scale, 0);
  const sum =
    a.integer * 10n ** BigInt(scale - a.scale) +
    b.integer * 10n ** BigInt(scale - b.scale);
  return Number(`${sum}e-${scale}`);
}
function round(value: number, precision: number | undefined) {
  if (precision === undefined) return value;
  const { integer, scale } = decimal(value);
  if (scale <= precision) return value;
  const divisor = 10n ** BigInt(scale - precision),
    quotient = integer / divisor,
    remainder = integer % divisor;
  const rounded =
    quotient +
    ((remainder < 0 ? -remainder : remainder) * 2n >= divisor
      ? integer < 0
        ? -1n
        : 1n
      : 0n);
  return Number(`${rounded}e-${precision}`);
}
export function InputNumber({
  value,
  defaultValue = null,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  precision,
  formatter,
  parser,
  controls = true,
  keyboard = true,
  changeOnBlur = true,
  size,
  status,
  bordered = true,
  onChange,
  onStep,
  onPressEnter,
  style,
  ref,
  className,
  disabled,
  readOnly = false,
  onInput,
  onFocus,
  onBlur,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...rest
}: InputNumberProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("InputNumber");
  const blocked = disabled ?? config.componentDisabled;
  const actualSize = size ?? config.componentSize;
  const input = useRef<HTMLInputElement | null>(null),
    wrapper = useRef<HTMLDivElement | null>(null),
    composing = useRef(false),
    editing = useRef(false),
    lastEmitted = useRef<number | null | undefined>(undefined);
  useImperativeHandle(
    ref,
    () => ({
      get input() {
        return input.current;
      },
      get nativeElement() {
        return wrapper.current;
      },
      focus: (options) => input.current?.focus(options),
      blur: () => input.current?.blur(),
    }),
    [],
  );
  const finite = (v: number | null | undefined) =>
    typeof v === "number" && Number.isFinite(v) ? v : null;
  const [inner, setInner] = useState<number | null>(finite(defaultValue));
  const current = finite(value === undefined ? inner : value);
  const digits =
    precision !== undefined && Number.isFinite(precision)
      ? Math.max(0, Math.min(100, Math.floor(precision)))
      : undefined;
  const lower = Number.isFinite(min) ? min : Number.MIN_SAFE_INTEGER,
    upper = Number.isFinite(max) ? max : Number.MAX_SAFE_INTEGER;
  const stepValue = Number(step);
  const increment = Number.isFinite(stepValue) && stepValue > 0 ? stepValue : 1;
  const format = (v: number | null, typing = false, raw = "") =>
    formatter
      ? formatter(v ?? undefined, { userTyping: typing, input: raw })
      : v === null
        ? ""
        : !typing && digits !== undefined
          ? round(v, digits).toFixed(digits)
          : String(v);
  const [draft, setDraftState] = useState(() => format(current));
  const draftRef = useRef(draft);
  const valueRef = useRef(current);
  const setDraft = (next: string) => {
    draftRef.current = next;
    setDraftState(next);
  };
  useLayoutEffect(() => {
    valueRef.current = current;
    if (!editing.current || current !== lastEmitted.current)
      setDraft(format(current));
  }, [current, formatter, digits]);
  const parse = (text: string): number | null | undefined => {
    if (!text.trim()) return null;
    const parsed = parser ? parser(text) : text.replace(/,/g, "").trim();
    if (String(parsed).trim() === "") return null;
    const n = Number(parsed);
    return Number.isFinite(n) && !/^[-+.]+$/.test(String(parsed).trim())
      ? n
      : undefined;
  };
  const normalize = (n: number) =>
    Math.min(upper, Math.max(lower, round(n, digits)));
  const emit = (next: number | null) => {
    if (next === valueRef.current) return;
    if (value === undefined) {
      valueRef.current = next;
      setInner(next);
    }
    lastEmitted.current = next;
    onChange?.(next);
  };
  const type = (text: string) => {
    setDraft(text);
    if (blocked || readOnly || composing.current) return;
    const next = parse(text);
    if (next === undefined) return;
    if (next === null) {
      emit(null);
      return;
    }
    if (next < lower || next > upper) return;
    emit(next);
    if (formatter) setDraft(format(next, true, text));
  };
  const commit = () => {
    if (blocked || readOnly) return;
    const parsed = parse(draftRef.current);
    let next = valueRef.current;
    if (parsed === null) next = null;
    else if (parsed !== undefined) next = normalize(parsed);
    if (changeOnBlur) emit(next);
    setDraft(
      format(value === undefined && changeOnBlur ? next : valueRef.current),
    );
    editing.current = false;
  };
  const stepBy = (direction: 1 | -1) => {
    if (
      blocked ||
      readOnly ||
      lower > upper ||
      (direction === 1 && current !== null && current >= upper) ||
      (direction === -1 && current !== null && current <= lower)
    )
      return;
    const parsed = parse(draftRef.current);
    const from = typeof parsed === "number" ? parsed : (valueRef.current ?? 0);
    const result = add(from, increment * direction);
    if (!Number.isFinite(result)) return;
    const next = normalize(result);
    emit(next);
    setDraft(format(value === undefined ? next : current));
    onStep?.(next, {
      offset: increment * direction,
      type: direction === 1 ? "up" : "down",
    });
    input.current?.focus();
  };
  const font =
    actualSize === "large"
      ? (c?.inputFontSizeLG ?? t.fontSizeLG)
      : actualSize === "small"
        ? (c?.inputFontSizeSM ?? c?.inputFontSize ?? t.fontSize)
        : (c?.inputFontSize ?? t.fontSize);
  const line = actualSize === "large" ? t.lineHeightLG : t.lineHeight;
  const height =
    actualSize === "large"
      ? t.controlHeightLG
      : actualSize === "small"
        ? t.controlHeightSM
        : t.controlHeight;
  const pbDefault = Math.max(
    (actualSize === "large" ? Math.ceil : Math.round)(
      ((height - font * line) / 2) * 10,
    ) /
      10 -
      t.lineWidth,
    0,
  );
  const pb =
    actualSize === "large"
      ? (c?.paddingBlockLG ?? pbDefault)
      : actualSize === "small"
        ? (c?.paddingBlockSM ?? pbDefault)
        : (c?.paddingBlock ?? pbDefault);
  const pi =
    actualSize === "large"
      ? (c?.paddingInlineLG ?? t.controlPaddingHorizontal - t.lineWidth)
      : actualSize === "small"
        ? (c?.paddingInlineSM ?? t.controlPaddingHorizontalSM - t.lineWidth)
        : (c?.paddingInline ?? t.paddingSM - t.lineWidth);
  const outOfRange = current !== null && (current < lower || current > upper);
  return (
    <div
      ref={wrapper}
      className={[
        "ant-input-number",
        actualSize === "large" && "ant-input-number-lg",
        actualSize === "small" && "ant-input-number-sm",
        blocked && "ant-input-number-disabled",
        readOnly && "ant-input-number-readonly",
        !bordered && "ant-input-number-borderless",
        status && `ant-input-number-status-${status}`,
        outOfRange && "ant-input-number-out-of-range",
        className,
      ]}
      style={{
        ...base,
        "--ao-num-width": `${c?.controlWidth ?? 90}px`,
        "--ao-num-font": `${font}px`,
        "--ao-num-line": line,
        "--ao-num-input-line": t.lineHeight,
        "--ao-num-input-radius": `${t.borderRadius}px`,
        "--ao-num-input-height":
          actualSize === "large" || actualSize === "small"
            ? `${height - t.lineWidth * 2}px`
            : "auto",
        "--ao-num-error": t.colorError,
        "--ao-num-pb": `${pb}px`,
        "--ao-num-pi": `${pi}px`,
        "--ao-num-radius": `${actualSize === "large" ? t.borderRadiusLG : actualSize === "small" ? t.borderRadiusSM : t.borderRadius}px`,
        "--ao-num-border":
          status === "error"
            ? t.colorError
            : status === "warning"
              ? t.colorWarning
              : t.colorBorder,
        "--ao-num-hover":
          status === "error"
            ? t.colorErrorBorderHover
            : status === "warning"
              ? t.colorWarningBorderHover
              : (c?.hoverBorderColor ?? t.colorPrimaryHover),
        "--ao-num-active":
          status === "error"
            ? t.colorError
            : status === "warning"
              ? t.colorWarning
              : (c?.activeBorderColor ?? t.colorPrimary),
        "--ao-num-shadow":
          status === "error"
            ? (c?.errorActiveShadow ??
              `0 0 0 ${t.controlOutlineWidth}px ${t.colorErrorOutline}`)
            : status === "warning"
              ? (c?.warningActiveShadow ??
                `0 0 0 ${t.controlOutlineWidth}px ${t.colorWarningOutline}`)
              : (c?.activeShadow ??
                `0 0 0 ${t.controlOutlineWidth}px ${t.controlOutline}`),
        "--ao-num-line-width": `${t.lineWidth}px`,
        "--ao-num-hover-bg": c?.hoverBg ?? t.colorBgContainer,
        "--ao-num-active-bg": c?.activeBg ?? t.colorBgContainer,
        "--ao-num-disabled": t.colorTextDisabled,
        "--ao-num-disabled-bg": t.colorBgContainerDisabled,
        "--ao-num-placeholder": t.colorTextPlaceholder,
        "--ao-num-handle-width": `${c?.handleWidth ?? t.controlHeightSM - t.lineWidth * 2}px`,
        "--ao-num-handle-font": `${c?.handleFontSize ?? t.fontSize / 2}px`,
        "--ao-num-handle-bg": c?.handleBg ?? t.colorBgContainer,
        "--ao-num-handle-active": c?.handleActiveBg ?? t.colorFillAlter,
        "--ao-num-handle-hover": c?.handleHoverColor ?? t.colorPrimary,
        "--ao-num-handle-border": c?.handleBorderColor ?? t.colorBorder,
        "--ao-num-handle-opacity": c?.handleVisible === true ? 1 : 0,
        "--ao-num-motion": t.motion ? t.motionDurationMid : "0s",
        ...style,
      }}
    >
      <div className="ant-input-number-input-wrap">
        <input
          {...rest}
          ref={input}
          type="text"
          inputMode={rest.inputMode ?? "decimal"}
          role="spinbutton"
          className="ant-input-number-input"
          value={draft}
          disabled={blocked}
          readOnly={readOnly}
          aria-valuemin={lower}
          aria-valuemax={upper}
          aria-valuenow={current ?? undefined}
          aria-invalid={status === "error" || outOfRange || undefined}
          onFocus={(event) => {
            editing.current = true;
            onFocus?.(event);
          }}
          onBlur={(event) => {
            commit();
            onBlur?.(event);
          }}
          onInput={(event) => {
            type(event.currentTarget.value);
            onInput?.(event);
          }}
          onCompositionStart={(event) => {
            composing.current = true;
            onCompositionStart?.(event);
          }}
          onCompositionEnd={(event) => {
            composing.current = false;
            type(event.currentTarget.value);
            onCompositionEnd?.(event);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented || composing.current) return;
            if (
              keyboard &&
              (event.key === "ArrowUp" || event.key === "ArrowDown")
            ) {
              event.preventDefault();
              stepBy(event.key === "ArrowUp" ? 1 : -1);
            }
            if (event.key === "Enter") {
              commit();
              onPressEnter?.(event);
            }
          }}
        />
      </div>
      {controls && !blocked && !readOnly && (
        <div className="ant-input-number-handler-wrap">
          <button
            type="button"
            tabIndex={-1}
            className="ant-input-number-handler ant-input-number-handler-up"
            aria-label="增加数值"
            disabled={current !== null && current >= upper}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => stepBy(1)}
          >
            <svg viewBox="0 0 12 8" width="1em" height="1em" aria-hidden="true">
              <path
                d="m1 7 5-5 5 5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="ant-input-number-handler ant-input-number-handler-down"
            aria-label="减少数值"
            disabled={current !== null && current <= lower}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => stepBy(-1)}
          >
            <svg viewBox="0 0 12 8" width="1em" height="1em" aria-hidden="true">
              <path
                d="m1 1 5 5 5-5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
