/** @jsxImportSource octane */
import type {
  CSSProperties,
  OctaneNode,
  Ref,
  TextareaHTMLAttributes,
} from "octane";
import {
  createPortal,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { positionPopup, useFloatingParentId } from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { inputVariables } from "../input/tokens";
import { useLocale } from "../locale";

export interface MentionsOption {
  value: string;
  label?: OctaneNode;
  key?: string;
  disabled?: boolean;
  title?: string;
  className?: string;
  style?: CSSProperties;
}
export interface MentionsRef {
  nativeElement: HTMLDivElement | null;
  textarea: HTMLTextAreaElement | null;
  focus: (options?: FocusOptions) => void;
  blur: () => void;
}
export interface MentionsProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    | "prefix"
    | "size"
    | "style"
    | "ref"
    | "value"
    | "defaultValue"
    | "onChange"
    | "onInput"
    | "onSelect"
    | "children"
  > {
  options?: MentionsOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  onSearch?: (text: string, prefix: string) => void;
  onSelect?: (option: MentionsOption, prefix: string) => void;
  onClear?: () => void;
  onPopupScroll?: (event: Event) => void;
  onPressEnter?: (event: KeyboardEvent) => void;
  prefix?: string | string[];
  split?: string;
  filterOption?: false | ((text: string, option: MentionsOption) => boolean);
  validateSearch?: (text: string, split: string) => boolean;
  notFoundContent?: OctaneNode;
  placement?: "top" | "bottom";
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  popupClassName?: string;
  allowClear?: boolean | { clearIcon?: OctaneNode };
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  size?: "small" | "middle" | "large";
  status?: "error" | "warning";
  variant?: "outlined" | "filled" | "borderless" | "underlined";
  style?: CSSProperties;
  ref?: Ref<MentionsRef>;
}

interface Measure {
  text: string;
  location: number;
  prefix: string;
  query: string;
  cursor: number;
}

function findMeasure(
  text: string,
  cursor: number,
  prefixes: string[],
  split: string,
  validate: (query: string, split: string) => boolean,
): Measure | null {
  const before = text.slice(0, cursor);
  let location = -1;
  let prefix = "";
  for (const candidate of prefixes) {
    if (!candidate) continue;
    const index = before.lastIndexOf(candidate);
    if (index > location) {
      location = index;
      prefix = candidate;
    }
  }
  if (location < 0) return null;
  const query = before.slice(location + prefix.length);
  return validate(query, split)
    ? { text, location, prefix, query, cursor }
    : null;
}

function insertMention(
  text: string,
  measure: Measure,
  value: string,
  split: string,
) {
  let before = text.slice(0, measure.location);
  if (split && before.endsWith(split)) before = before.slice(0, -split.length);
  if (before) before += split;
  let after = text.slice(measure.cursor);
  // A selection can end inside a word already being typed. Reuse the matching
  // suffix instead of duplicating it after the completed mention.
  const remainingValue = value.slice(measure.query.length);
  let overlap = 0;
  while (
    overlap < remainingValue.length &&
    overlap < after.length &&
    remainingValue[overlap].toLocaleLowerCase() ===
      after[overlap].toLocaleLowerCase()
  )
    overlap += 1;
  after = after.slice(overlap);
  // Existing separators belong to the newly completed mention, not to the suffix.
  if (split && after.startsWith(split)) after = after.slice(split.length);
  const start = `${before}${measure.prefix}${value}${split}`;
  return { value: `${start}${after}`, cursor: start.length };
}

/** Extract completed mentions separated by `split` (the Ant Design 5 helper). */
export function getMentions(
  value: string,
  config: { prefix?: string | string[]; split?: string } = {},
) {
  const prefixes = Array.isArray(config.prefix)
    ? config.prefix
    : [config.prefix ?? "@"];
  const split = config.split ?? " ";
  if (!split) return [];
  return value.split(split).flatMap((segment) => {
    const prefix = prefixes.find((item) => item && segment.startsWith(item));
    return prefix && segment.length > prefix.length
      ? [{ prefix, value: segment.slice(prefix.length) }]
      : [];
  });
}

function MentionsInternal({
  options = [],
  value,
  defaultValue = "",
  onChange,
  onSearch,
  onSelect,
  onClear,
  onPopupScroll,
  onPressEnter,
  prefix = "@",
  split = " ",
  filterOption,
  validateSearch = (query, delimiter) =>
    !delimiter || !query.includes(delimiter),
  notFoundContent,
  placement = "bottom",
  getPopupContainer,
  popupClassName,
  allowClear = false,
  autoSize = false,
  size,
  status,
  variant,
  disabled: localDisabled,
  readOnly,
  rows = 1,
  style,
  className,
  ref,
  onKeyDown,
  onKeyUp,
  onFocus,
  onBlur,
  onClick,
  onCompositionStart,
  onCompositionEnd,
  ...textareaProps
}: MentionsProps) {
  const config = useConfig();
  const parentPopupId = useFloatingParentId();
  const [locale] = useLocale("Mentions");
  const { token: t, component: c, base } = useComponentTokens("Select");
  const id = `ao-mentions-${useId()}`;
  const host = useRef<HTMLDivElement | null>(null);
  const field = useRef<HTMLTextAreaElement | null>(null);
  const mirror = useRef<HTMLDivElement | null>(null);
  const caret = useRef<HTMLSpanElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const composing = useRef(false);
  const dismissed = useRef<string | null>(null);
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [measure, setMeasure] = useState<Measure | null>(null);
  const [active, setActive] = useState(0);
  const [target, setTarget] = useState<HTMLElement | ShadowRoot | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const disabled = localDisabled ?? config.componentDisabled ?? false;
  const blocked = disabled || readOnly;
  const actualSize = size ?? config.componentSize ?? "middle";
  const text = value ?? innerValue;
  const prefixes = Array.isArray(prefix) ? prefix : [prefix];
  const visible = !blocked && measure !== null && measure.text === text;
  const filtered = measure
    ? options.filter((option) =>
        filterOption === false
          ? true
          : filterOption
            ? filterOption(measure.query, option)
            : option.value
                .toLocaleLowerCase()
                .includes(measure.query.toLocaleLowerCase()),
      )
    : [];
  const enabled = filtered.filter((option) => !option.disabled);
  const activeOption = enabled.some(
    (option) => filtered.indexOf(option) === active,
  )
    ? filtered[active]
    : enabled[0];
  const activeIndex = activeOption ? filtered.indexOf(activeOption) : -1;

  useImperativeHandle(
    ref,
    () => ({
      get nativeElement() {
        return host.current;
      },
      get textarea() {
        return field.current;
      },
      focus: (options?: FocusOptions) => field.current?.focus(options),
      blur: () => field.current?.blur(),
    }),
    [],
  );

  const updateMeasure = (next: string, cursor: number, emitSearch: boolean) => {
    if (blocked || composing.current) return;
    const found = findMeasure(next, cursor, prefixes, split, validateSearch);
    const key = found
      ? `${found.location}\0${found.prefix}\0${found.query}\0${found.cursor}`
      : null;
    if (key && key === dismissed.current) return;
    dismissed.current = null;
    setMeasure(found);
    setActive(0);
    if (found && emitSearch) onSearch?.(found.query, found.prefix);
  };
  const changeValue = (next: string) => {
    if (value === undefined) setInnerValue(next);
    if (next !== text) onChange?.(next);
  };
  const stopMeasure = () => {
    if (measure)
      dismissed.current = `${measure.location}\0${measure.prefix}\0${measure.query}\0${measure.cursor}`;
    setMeasure(null);
  };
  const choose = (option: MentionsOption) => {
    if (!measure || !visible || option.disabled) return;
    const next = insertMention(text, measure, option.value, split);
    changeValue(next.value);
    setMeasure(null);
    dismissed.current = null;
    onSelect?.(option, measure.prefix);
    queueMicrotask(() => {
      const element = field.current;
      element?.focus();
      element?.setSelectionRange(next.cursor, next.cursor);
    });
  };

  useLayoutEffect(() => {
    if (host.current)
      setTarget(
        (getPopupContainer ?? config.getPopupContainer)?.(host.current) ??
          document.body,
      );
  }, [getPopupContainer, config.getPopupContainer]);
  useLayoutEffect(() => {
    const element = field.current;
    if (!element || !autoSize) return;
    const resize = () => {
      const css = getComputedStyle(element);
      const line = Number.parseFloat(css.lineHeight) || 22;
      const vertical =
        Number.parseFloat(css.paddingTop) +
        Number.parseFloat(css.paddingBottom) +
        Number.parseFloat(css.borderTopWidth) +
        Number.parseFloat(css.borderBottomWidth);
      const limits = typeof autoSize === "object" ? autoSize : {};
      const minimum = Math.max(1, limits.minRows ?? 1);
      const maximum = Math.max(minimum, limits.maxRows ?? Infinity);
      element.style.height = "auto";
      const desired =
        element.scrollHeight +
        Number.parseFloat(css.borderTopWidth) +
        Number.parseFloat(css.borderBottomWidth);
      const height = Math.max(
        minimum * line + vertical,
        Math.min(maximum * line + vertical, desired),
      );
      element.style.height = `${height}px`;
      element.style.overflowY = desired > height ? "auto" : "hidden";
    };
    resize();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(resize);
    observer?.observe(element);
    return () => {
      observer?.disconnect();
      element.style.height = "";
      element.style.overflowY = "";
    };
  }, [autoSize, text, actualSize]);
  useLayoutEffect(() => {
    if (
      !visible ||
      !target ||
      !field.current ||
      !popup.current ||
      !mirror.current ||
      !caret.current
    )
      return;
    const element = field.current;
    const list = popup.current;
    const measuringMirror = mirror.current;
    const update = () => {
      const css = getComputedStyle(element);
      measuringMirror.style.width = `${element.offsetWidth}px`;
      measuringMirror.style.font = css.font;
      measuringMirror.style.letterSpacing = css.letterSpacing;
      measuringMirror.style.lineHeight = css.lineHeight;
      measuringMirror.style.padding = css.padding;
      measuringMirror.style.border = css.border;
      measuringMirror.style.textAlign = css.textAlign;
      measuringMirror.style.tabSize = css.tabSize;
      measuringMirror.style.top = `${element.offsetTop - element.scrollTop}px`;
      measuringMirror.style.left = `${element.offsetLeft - element.scrollLeft}px`;
      const anchor =
        caret.current?.getBoundingClientRect() ??
        element.getBoundingClientRect();
      const next = positionPopup(
        anchor,
        list.getBoundingClientRect(),
        { width: window.innerWidth, height: window.innerHeight },
        placement === "top" ? "topLeft" : "bottomLeft",
        true,
        4,
      );
      if (target !== document.body) {
        const containingBlock =
          (list.offsetParent as HTMLElement | null) ??
          (target instanceof HTMLElement &&
          getComputedStyle(target).position !== "static"
            ? target
            : document.body);
        const rect = containingBlock.getBoundingClientRect();
        next.x +=
          containingBlock.scrollLeft - rect.left - containingBlock.clientLeft;
        next.y +=
          containingBlock.scrollTop - rect.top - containingBlock.clientTop;
      }
      setPosition((old) =>
        old?.x === next.x && old?.y === next.y ? old : { x: next.x, y: next.y },
      );
    };
    update();
    const outside = (event: PointerEvent) => {
      if (
        !host.current?.contains(event.target as Node) &&
        !list.contains(event.target as Node)
      )
        stopMeasure();
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    element.addEventListener("scroll", update);
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(update);
    observer?.observe(element);
    observer?.observe(list);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      element.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  }, [visible, target, measure, filtered.length, placement, getPopupContainer]);
  useLayoutEffect(() => {
    if (!visible || activeIndex < 0) return;
    const option = popup.current?.children[activeIndex];
    if (option instanceof HTMLElement)
      option.scrollIntoView({ block: "nearest" });
  }, [visible, activeIndex]);

  const list = (
    <div
      ref={popup}
      id={id}
      role="listbox"
      data-ao-floating-parent={parentPopupId}
      className={["ant-mentions-dropdown", popupClassName]}
      style={{
        ...base,
        position: target === document.body ? "fixed" : "absolute",
        top: position?.y ?? 0,
        left: position?.x ?? 0,
        visibility: position ? undefined : "hidden",
        zIndex: c?.zIndexPopup ?? t.zIndexPopupBase + 50,
        "--ao-mentions-popup": t.colorBgElevated,
        "--ao-mentions-hover": t.controlItemBgHover,
        "--ao-mentions-shadow": t.boxShadowSecondary,
      }}
      onScroll={onPopupScroll}
    >
      {filtered.length ? (
        filtered.map((option, index) => (
          // biome-ignore lint/a11y/useFocusableInteractive lint/a11y/useKeyWithClickEvents: Keyboard focus remains in the textarea combobox.
          <div
            key={option.key ?? option.value}
            id={`${id}-option-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            aria-disabled={option.disabled || undefined}
            className={[
              "ant-mentions-option",
              index === activeIndex && "ant-mentions-option-active",
              option.disabled && "ant-mentions-option-disabled",
              option.className,
            ]}
            style={option.style}
            title={option.title}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => {
              if (!option.disabled) setActive(index);
            }}
            onClick={() => choose(option)}
          >
            {option.label ?? option.value}
          </div>
        ))
      ) : (
        <div className="ant-mentions-empty">
          {notFoundContent === undefined
            ? (locale.notFoundContent ?? "无匹配结果")
            : notFoundContent}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={host}
      className={[
        "ant-mentions",
        `ant-mentions-${actualSize}`,
        `ant-mentions-${variant ?? config.variant ?? "outlined"}`,
        status && `ant-mentions-status-${status}`,
        disabled && "ant-mentions-disabled",
        readOnly && "ant-mentions-readonly",
        className,
      ]}
      style={{ ...inputVariables(config.theme, config.token), ...style }}
    >
      <textarea
        {...textareaProps}
        ref={field}
        rows={rows}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={visible}
        aria-controls={visible ? id : undefined}
        aria-activedescendant={
          visible && activeIndex >= 0
            ? `${id}-option-${activeIndex}`
            : undefined
        }
        aria-autocomplete="list"
        aria-invalid={status === "error" || undefined}
        disabled={disabled}
        readOnly={readOnly}
        className="ant-mentions-textarea ant-input"
        value={text}
        onInput={(event) => {
          const next = event.currentTarget.value;
          changeValue(next);
          if (composing.current) return;
          updateMeasure(next, event.currentTarget.selectionStart, true);
        }}
        onCompositionStart={(event) => {
          composing.current = true;
          setMeasure(null);
          onCompositionStart?.(event);
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          updateMeasure(
            event.currentTarget.value,
            event.currentTarget.selectionStart,
            true,
          );
          onCompositionEnd?.(event);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || blocked) return;
          if (event.isComposing || composing.current || event.keyCode === 229)
            return;
          if (
            visible &&
            (event.key === "ArrowDown" || event.key === "ArrowUp")
          ) {
            if (!enabled.length) return;
            event.preventDefault();
            const current = enabled.indexOf(activeOption);
            const delta = event.key === "ArrowDown" ? 1 : -1;
            const next =
              enabled[(current + delta + enabled.length) % enabled.length];
            setActive(filtered.indexOf(next));
          } else if (visible && event.key === "Enter") {
            event.preventDefault();
            if (activeOption) choose(activeOption);
            else stopMeasure();
          } else if (visible && event.key === "Escape") {
            event.preventDefault();
            stopMeasure();
          } else if (event.key === "Enter") {
            onPressEnter?.(event);
          }
        }}
        onKeyUp={(event) => {
          onKeyUp?.(event);
          if (
            !blocked &&
            !event.isComposing &&
            !composing.current &&
            !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key)
          )
            updateMeasure(
              event.currentTarget.value,
              event.currentTarget.selectionStart,
              false,
            );
        }}
        onClick={(event) => {
          onClick?.(event);
          updateMeasure(
            event.currentTarget.value,
            event.currentTarget.selectionStart,
            false,
          );
        }}
        onFocus={onFocus}
        onBlur={(event) => {
          onBlur?.(event);
          queueMicrotask(() => {
            if (!popup.current?.contains(document.activeElement)) stopMeasure();
          });
        }}
      />
      {allowClear && !blocked && text && (
        <button
          type="button"
          className="ant-mentions-clear"
          aria-label={locale.clear ?? "清除提及内容"}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            changeValue("");
            setMeasure(null);
            onClear?.();
            field.current?.focus();
          }}
        >
          {typeof allowClear === "object" ? (allowClear.clearIcon ?? "×") : "×"}
        </button>
      )}
      <div ref={mirror} className="ant-mentions-mirror" aria-hidden="true">
        {measure ? text.slice(0, measure.location) : ""}
        <span ref={caret}>{"\u200b"}</span>
      </div>
      {visible && target && createPortal(list, target)}
    </div>
  );
}

export const Mentions = Object.assign(MentionsInternal, { getMentions });
