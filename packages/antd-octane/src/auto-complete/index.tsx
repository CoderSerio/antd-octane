/** @jsxImportSource octane */
import type {
  CSSProperties,
  InputHTMLAttributes,
  OctaneNode,
  Ref,
} from "octane";
import {
  createPortal,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { positionPopup } from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";

export interface AutoCompleteOption {
  value: string;
  label?: OctaneNode;
  disabled?: boolean;
  title?: string;
}
export interface AutoCompleteRef {
  nativeElement: HTMLDivElement | null;
  input: HTMLInputElement | null;
  focus: (options?: FocusOptions) => void;
  blur: () => void;
}
export interface AutoCompleteProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
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
  options?: AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: AutoCompleteOption) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  filterOption?:
    | boolean
    | ((value: string, option: AutoCompleteOption) => boolean);
  defaultActiveFirstOption?: boolean;
  allowClear?: boolean | { clearIcon?: OctaneNode };
  onClear?: () => void;
  size?: "small" | "middle" | "large";
  status?: "error" | "warning";
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  onInputKeyDown?: (event: KeyboardEvent) => void;
  style?: CSSProperties;
  ref?: Ref<AutoCompleteRef>;
}

export function AutoComplete({
  options = [],
  value,
  defaultValue = "",
  onChange,
  onSearch,
  onSelect,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  filterOption = false,
  defaultActiveFirstOption = false,
  allowClear,
  onClear,
  size,
  status,
  getPopupContainer,
  onInputKeyDown,
  disabled: localDisabled,
  readOnly,
  style,
  className,
  ref,
  onKeyDown,
  onFocus,
  onBlur,
  onCompositionStart,
  onCompositionEnd,
  ...inputProps
}: AutoCompleteProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Select");
  const listId = `ao-autocomplete-${useId()}`;
  const host = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const composing = useRef(false);
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [active, setActive] = useState<string | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const disabled = localDisabled ?? config.componentDisabled ?? false;
  const blocked = disabled || readOnly;
  const actualSize = size ?? config.componentSize ?? "middle";
  const text = value ?? innerValue;
  const requestedOpen = controlledOpen ?? innerOpen;
  const filtered = options.filter((option) => {
    if (!filterOption || !text) return true;
    return typeof filterOption === "function"
      ? filterOption(text, option)
      : option.value.toLocaleLowerCase().includes(text.toLocaleLowerCase());
  });
  const enabled = filtered.filter((option) => !option.disabled);
  // Empty suggestions must never prevent free text input or show an empty menu.
  const open = !blocked && requestedOpen && filtered.length > 0;
  const activeValue = enabled.some((option) => option.value === active)
    ? active
    : defaultActiveFirstOption
      ? (enabled[0]?.value ?? null)
      : null;
  const activeIndex = filtered.findIndex(
    (option) => option.value === activeValue,
  );
  const changeOpen = (next: boolean) => {
    if (blocked || next === requestedOpen) return;
    if (controlledOpen === undefined) setInnerOpen(next);
    onOpenChange?.(next);
    setActive(null);
  };
  const changeValue = (next: string) => {
    if (value === undefined) setInnerValue(next);
    if (next !== text) onChange?.(next);
  };
  const select = (option: AutoCompleteOption) => {
    if (blocked || option.disabled) return;
    changeValue(option.value);
    onSelect?.(option.value, option);
    changeOpen(false);
    input.current?.focus();
  };

  useImperativeHandle(
    ref,
    () => ({
      get nativeElement() {
        return host.current;
      },
      get input() {
        return input.current;
      },
      focus: (focusOptions?: FocusOptions) =>
        input.current?.focus(focusOptions),
      blur: () => input.current?.blur(),
    }),
    [],
  );
  useLayoutEffect(() => {
    if (host.current)
      setTarget(getPopupContainer?.(host.current) ?? document.body);
  }, [getPopupContainer]);
  useLayoutEffect(() => {
    if (!open || !host.current || !popup.current || !target) return;
    const trigger = host.current;
    const list = popup.current;
    const update = () => {
      const next = positionPopup(
        trigger.getBoundingClientRect(),
        list.getBoundingClientRect(),
        { width: window.innerWidth, height: window.innerHeight },
        "bottomLeft",
        true,
        4,
      );
      if (target !== document.body) {
        const containingBlock =
          (list.offsetParent as HTMLElement | null) ??
          (getComputedStyle(target).position === "static"
            ? document.body
            : target);
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
    const outside = (event: PointerEvent) => {
      if (
        !trigger.contains(event.target as Node) &&
        !list.contains(event.target as Node)
      )
        changeOpen(false);
    };
    update();
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(update);
    observer?.observe(trigger);
    observer?.observe(list);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      observer?.disconnect();
    };
  }, [
    open,
    target,
    filtered.length,
    getPopupContainer,
    controlledOpen,
    onOpenChange,
    blocked,
  ]);
  useLayoutEffect(() => {
    if (!open || activeIndex < 0) return;
    const option = popup.current?.children[activeIndex];
    if (option instanceof HTMLElement)
      option.scrollIntoView({ block: "nearest" });
  }, [open, target, activeIndex]);

  const list = (
    <div
      ref={popup}
      id={listId}
      role="listbox"
      className="ant-auto-complete-dropdown"
      style={{
        ...base,
        position: target === document.body ? "fixed" : "absolute",
        left: position?.x ?? 0,
        top: position?.y ?? 0,
        width: host.current?.getBoundingClientRect().width ?? 0,
        visibility: position ? undefined : "hidden",
        zIndex: c?.zIndexPopup ?? t.zIndexPopupBase + 50,
        "--ao-autocomplete-popup": t.colorBgElevated,
        "--ao-autocomplete-hover": t.controlItemBgHover,
        "--ao-autocomplete-selected": t.controlItemBgActive,
        "--ao-autocomplete-shadow": t.boxShadowSecondary,
      }}
    >
      {filtered.map((option, index) => (
        // biome-ignore lint/a11y/useFocusableInteractive lint/a11y/useKeyWithClickEvents: The input owns focus and keyboard selection through aria-activedescendant.
        <div
          key={option.value}
          id={`${listId}-option-${index}`}
          role="option"
          aria-selected={option.value === text}
          aria-disabled={option.disabled || undefined}
          className={[
            "ant-auto-complete-option",
            option.value === activeValue && "ant-auto-complete-option-active",
            option.value === text && "ant-auto-complete-option-selected",
            option.disabled && "ant-auto-complete-option-disabled",
          ]}
          title={option.title}
          onMouseDown={(event) => event.preventDefault()}
          onMouseEnter={() => {
            if (!option.disabled) setActive(option.value);
          }}
          onClick={() => select(option)}
        >
          {option.label ?? option.value}
        </div>
      ))}
    </div>
  );
  const height =
    actualSize === "large"
      ? t.controlHeightLG
      : actualSize === "small"
        ? t.controlHeightSM
        : t.controlHeight;
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: The nested input owns keyboard events and focus.
    <div
      ref={host}
      className={[
        "ant-auto-complete",
        `ant-auto-complete-${actualSize}`,
        disabled && "ant-auto-complete-disabled",
        status && `ant-auto-complete-status-${status}`,
        className,
      ]}
      style={{
        ...base,
        "--ao-autocomplete-height": `${height}px`,
        "--ao-autocomplete-border":
          status === "error"
            ? t.colorError
            : status === "warning"
              ? t.colorWarning
              : t.colorBorder,
        "--ao-autocomplete-hover-border": t.colorPrimaryHover,
        "--ao-autocomplete-focus":
          status === "error"
            ? t.colorError
            : status === "warning"
              ? t.colorWarning
              : t.colorPrimary,
        "--ao-autocomplete-disabled": t.colorBgContainerDisabled,
        ...style,
      }}
      onClick={(event) => {
        if (blocked || event.target === input.current) return;
        input.current?.focus();
        changeOpen(true);
      }}
    >
      <input
        {...inputProps}
        ref={input}
        value={text}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={inputProps.autoComplete ?? "off"}
        role="combobox"
        aria-label={
          inputProps["aria-label"] ??
          (inputProps["aria-labelledby"] ? undefined : inputProps.placeholder)
        }
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && activeIndex >= 0
            ? `${listId}-option-${activeIndex}`
            : undefined
        }
        aria-invalid={status === "error" || inputProps["aria-invalid"]}
        onClick={(event) => {
          inputProps.onClick?.(event);
          if (!event.defaultPrevented) changeOpen(true);
        }}
        onInput={(event) => {
          if (blocked) return;
          const next = event.currentTarget.value;
          changeValue(next);
          onSearch?.(next);
          setActive(null);
          changeOpen(true);
        }}
        onFocus={onFocus}
        onBlur={(event) => {
          changeOpen(false);
          onBlur?.(event);
        }}
        onCompositionStart={(event) => {
          composing.current = true;
          onCompositionStart?.(event);
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          onCompositionEnd?.(event);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          onInputKeyDown?.(event);
          if (
            event.defaultPrevented ||
            blocked ||
            composing.current ||
            event.isComposing ||
            event.keyCode === 229
          )
            return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            if (!enabled.length) return;
            event.preventDefault();
            changeOpen(true);
            if (!open) return;
            const index = enabled.findIndex(
              (option) => option.value === activeValue,
            );
            const next =
              index < 0
                ? event.key === "ArrowDown"
                  ? 0
                  : enabled.length - 1
                : (index +
                    (event.key === "ArrowDown" ? 1 : -1) +
                    enabled.length) %
                  enabled.length;
            setActive(enabled[next].value);
          } else if (event.key === "Enter" && open) {
            const option = enabled.find((item) => item.value === activeValue);
            if (option) {
              event.preventDefault();
              select(option);
            } else changeOpen(false);
          } else if (event.key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            changeOpen(false);
          } else if (event.key === "Tab") changeOpen(false);
        }}
      />
      {allowClear && !blocked && text.length > 0 && (
        <button
          type="button"
          className="ant-auto-complete-clear"
          aria-label="清除输入"
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation();
            onClear?.();
            changeValue("");
            onSearch?.("");
            changeOpen(false);
            input.current?.focus();
          }}
        >
          {typeof allowClear === "object" ? (allowClear.clearIcon ?? "×") : "×"}
        </button>
      )}
      {open && target && createPortal(list, target)}
    </div>
  );
}
