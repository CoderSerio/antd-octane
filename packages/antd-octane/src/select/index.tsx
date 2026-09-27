/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode, Ref } from "octane";
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

export type SelectValue = string | number;
export interface SelectOption {
  value: SelectValue;
  label?: OctaneNode;
  disabled?: boolean;
  title?: string;
}
export interface SelectRef {
  nativeElement: HTMLDivElement | null;
  focus: () => void;
  blur: () => void;
}
export interface SelectProps {
  options: SelectOption[];
  value?: SelectValue | null;
  defaultValue?: SelectValue | null;
  onChange?: (value: SelectValue | undefined, option?: SelectOption) => void;
  onSelect?: (value: SelectValue, option: SelectOption) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean);
  placeholder?: string;
  allowClear?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  status?: "error" | "warning";
  notFoundContent?: OctaneNode;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<SelectRef>;
}

function optionText(option: SelectOption) {
  return typeof option.label === "string" || typeof option.label === "number"
    ? String(option.label)
    : String(option.value);
}

export function Select(props: SelectProps) {
  const config = useConfig();
  const { token: t, component: c, base } = useComponentTokens("Select");
  const listId = `ao-select-${useId()}`;
  const host = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const [innerValue, setInnerValue] = useState<SelectValue | null>(
    props.defaultValue ?? null,
  );
  const [innerOpen, setInnerOpen] = useState(props.defaultOpen ?? false);
  const [innerSearch, setInnerSearch] = useState("");
  const [active, setActive] = useState<SelectValue | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const disabled = props.disabled ?? config.componentDisabled ?? false;
  const size = props.size ?? config.componentSize ?? "middle";
  const value = props.value !== undefined ? props.value : innerValue;
  const open = !disabled && (props.open ?? innerOpen);
  const search = props.searchValue ?? innerSearch;
  const selected = props.options.find((option) => option.value === value);
  const filtered = props.options.filter((option) => {
    if (!props.showSearch || !search || props.filterOption === false)
      return true;
    if (typeof props.filterOption === "function")
      return props.filterOption(search, option);
    return optionText(option)
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase());
  });
  const enabled = filtered.filter((option) => !option.disabled);
  const activeValue = enabled.some((option) => option.value === active)
    ? active
    : (enabled.find((option) => option.value === value)?.value ??
      enabled[0]?.value ??
      null);
  const activeIndex = filtered.findIndex(
    (option) => option.value === activeValue,
  );

  useImperativeHandle(
    props.ref,
    () => ({
      get nativeElement() {
        return host.current;
      },
      focus: () => input.current?.focus(),
      blur: () => input.current?.blur(),
    }),
    [],
  );
  const changeOpen = (next: boolean) => {
    if (disabled || next === open) return;
    if (props.open === undefined) setInnerOpen(next);
    props.onOpenChange?.(next);
    if (!next && props.searchValue === undefined) setInnerSearch("");
    if (next) setActive(null);
  };
  const changeSearch = (next: string) => {
    if (props.searchValue === undefined) setInnerSearch(next);
    props.onSearch?.(next);
    setActive(null);
  };
  const select = (option: SelectOption) => {
    if (disabled || option.disabled) return;
    if (option.value !== value) {
      if (props.value === undefined) setInnerValue(option.value);
      props.onChange?.(option.value, option);
    }
    props.onSelect?.(option.value, option);
    changeOpen(false);
    input.current?.focus();
  };
  useLayoutEffect(() => {
    if (host.current)
      setTarget(props.getPopupContainer?.(host.current) ?? document.body);
  }, [props.getPopupContainer]);
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
    update();
    const outside = (event: PointerEvent) => {
      if (
        !trigger.contains(event.target as Node) &&
        !list.contains(event.target as Node)
      )
        changeOpen(false);
    };
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
    props.getPopupContainer,
    props.open,
    props.onOpenChange,
    props.searchValue,
    disabled,
  ]);
  useLayoutEffect(() => {
    if (!open || activeIndex < 0) return;
    const option = popup.current?.children[activeIndex];
    if (option instanceof HTMLElement)
      option.scrollIntoView({ block: "nearest" });
  }, [open, target, activeIndex]);

  const height =
    size === "large"
      ? t.controlHeightLG
      : size === "small"
        ? t.controlHeightSM
        : t.controlHeight;
  const list = (
    <div
      ref={popup}
      id={listId}
      role="listbox"
      className="ant-select-dropdown"
      style={{
        ...base,
        position: target === document.body ? "fixed" : "absolute",
        left: position?.x ?? 0,
        top: position?.y ?? 0,
        minWidth: host.current?.getBoundingClientRect().width ?? 0,
        visibility: position ? undefined : "hidden",
        zIndex: c?.zIndexPopup ?? t.zIndexPopupBase + 50,
        "--ao-select-popup": t.colorBgElevated,
        "--ao-select-hover": t.controlItemBgHover,
        "--ao-select-selected": t.controlItemBgActive,
        "--ao-select-shadow": t.boxShadowSecondary,
      }}
    >
      {filtered.length ? (
        filtered.map((option, index) => (
          // biome-ignore lint/a11y/useFocusableInteractive lint/a11y/useKeyWithClickEvents: Keyboard selection stays on the combobox through aria-activedescendant.
          <div
            key={option.value}
            id={`${listId}-option-${index}`}
            role="option"
            aria-selected={option.value === value}
            aria-disabled={option.disabled || undefined}
            className={[
              "ant-select-item-option",
              option.value === activeValue && "ant-select-item-option-active",
              option.value === value && "ant-select-item-option-selected",
              option.disabled && "ant-select-item-option-disabled",
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
        ))
      ) : (
        <div className="ant-select-item-empty">
          {props.notFoundContent ?? "无匹配结果"}
        </div>
      )}
    </div>
  );
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: The nested combobox owns keyboard interaction and focus.
    <div
      ref={host}
      onClick={(event) => {
        if (disabled || event.target === input.current) return;
        input.current?.focus();
        changeOpen(true);
      }}
      className={[
        "ant-select",
        `ant-select-${size}`,
        props.status && `ant-select-status-${props.status}`,
        disabled && "ant-select-disabled",
        open && "ant-select-open",
        props.className,
      ]}
      style={{
        ...base,
        "--ao-select-height": `${height}px`,
        "--ao-select-border":
          props.status === "error"
            ? t.colorError
            : props.status === "warning"
              ? t.colorWarning
              : t.colorBorder,
        "--ao-select-hover-border": t.colorPrimaryHover,
        "--ao-select-focus": t.colorPrimary,
        "--ao-select-disabled": t.colorBgContainerDisabled,
        ...props.style,
      }}
    >
      <input
        ref={input}
        id={props.id}
        role="combobox"
        aria-label={
          props["aria-label"] ??
          (props["aria-labelledby"] ? undefined : props.placeholder)
        }
        aria-labelledby={props["aria-labelledby"]}
        aria-describedby={props["aria-describedby"]}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && activeIndex >= 0
            ? `${listId}-option-${activeIndex}`
            : undefined
        }
        aria-autocomplete={props.showSearch ? "list" : "none"}
        aria-invalid={props.status === "error" || undefined}
        disabled={disabled}
        readOnly={!props.showSearch}
        value={
          open && props.showSearch
            ? search
            : selected
              ? optionText(selected)
              : value == null
                ? ""
                : String(value)
        }
        placeholder={props.placeholder}
        onClick={() => changeOpen(true)}
        onInput={(event) => {
          if (!props.showSearch) return;
          changeSearch(event.currentTarget.value);
          changeOpen(true);
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            changeOpen(false);
          } else if (event.key === "Tab") {
            changeOpen(false);
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) {
              changeOpen(true);
              return;
            }
            if (!enabled.length) return;
            const index = enabled.findIndex(
              (option) => option.value === activeValue,
            );
            const delta = event.key === "ArrowDown" ? 1 : -1;
            setActive(
              enabled[(index + delta + enabled.length) % enabled.length].value,
            );
          } else if (event.key === "Home" || event.key === "End") {
            if (!open || !enabled.length) return;
            event.preventDefault();
            setActive(
              event.key === "Home"
                ? enabled[0].value
                : enabled[enabled.length - 1].value,
            );
          } else if (event.key === "Enter") {
            if (!open) {
              event.preventDefault();
              changeOpen(true);
            } else {
              event.preventDefault();
              const option = enabled.find((item) => item.value === activeValue);
              if (option) select(option);
            }
          }
        }}
      />
      {props.allowClear && !disabled && value != null && (
        <button
          type="button"
          className="ant-select-clear"
          aria-label="清除选择"
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation();
            if (props.value === undefined) setInnerValue(null);
            props.onChange?.(undefined);
            props.onClear?.();
            changeOpen(false);
            input.current?.focus();
          }}
        >
          ×
        </button>
      )}
      <span className="ant-select-arrow" aria-hidden="true">
        ⌄
      </span>
      {open && target && createPortal(list, target)}
    </div>
  );
}
