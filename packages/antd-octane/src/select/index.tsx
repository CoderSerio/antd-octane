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
import { componentClassName } from "../_util/componentClassName";
import { DownOutlined, LoadingOutlined } from "../_util/feedback-icons";
import { positionPopup } from "../_util/floating";
import { useComponentTokens } from "../_util/tokens";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import {
  getPopupContainerElement,
  type PopupContainer,
} from "../config-provider/context";
import { Empty } from "../empty";

export type SelectValue = string | number;
export interface SelectOption {
  value: SelectValue;
  label?: OctaneNode;
  disabled?: boolean;
  title?: string;
}
export interface SelectOptionGroup {
  label: OctaneNode;
  options: SelectOption[];
  key?: string | number;
}
export type SelectOptionItem = SelectOption | SelectOptionGroup;
export interface SelectRef {
  nativeElement: HTMLDivElement | null;
  focus: () => void;
  blur: () => void;
}
interface SelectCommonProps {
  options?: SelectOptionItem[];
  loading?: boolean;
  optionFilterProp?: "label" | "value" | "title";
  prefixCls?: string;
  rootClassName?: string;
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
  /** @deprecated Use popupMatchSelectWidth instead. */
  dropdownMatchSelectWidth?: boolean | number;
  popupMatchSelectWidth?: boolean | number;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<SelectRef>;
}
export interface LabeledSelectValue {
  value: SelectValue;
  label?: OctaneNode;
}
type SelectionProps<Value, Option> = {
  onSelect?: (value: Value, option: Option) => void;
} & (
  | {
      mode?: undefined;
      value?: Value | null;
      defaultValue?: Value | null;
      onChange?: (value: Value | undefined, option?: Option) => void;
    }
  | ((
      | { mode: "multiple"; tokenSeparators?: never }
      | { mode: "tags"; tokenSeparators?: string[] }
    ) & {
      value?: Value[];
      defaultValue?: Value[];
      onChange?: (values: Value[], options: Option[]) => void;
      onDeselect?: (value: Value, option: Option) => void;
    })
);
type ValueProps<Option> =
  | ({ labelInValue?: false } & SelectionProps<SelectValue, Option>)
  | ({ labelInValue: true } & SelectionProps<LabeledSelectValue, Option>);
export type SelectProps = SelectCommonProps & {
  labelInValue?: false;
} & Extract<SelectionProps<SelectValue, SelectOption>, { mode?: undefined }>;
export type MultipleSelectProps = SelectCommonProps & {
  labelInValue?: false;
} & Extract<
    SelectionProps<SelectValue, SelectOption>,
    { mode: "multiple" | "tags" }
  >;
export type LabeledSelectProps = SelectCommonProps & {
  labelInValue: true;
} & SelectionProps<LabeledSelectValue, SelectOption>;
export type SelectComponentProps =
  | SelectProps
  | MultipleSelectProps
  | LabeledSelectProps;

export interface SelectFieldNames {
  label?: string;
  value?: string;
  options?: string;
  groupLabel?: string;
}
type MappedLeaf<Option, Fields extends SelectFieldNames> =
  Option extends Record<
    Fields["options"] extends string ? Fields["options"] : "options",
    (infer Child)[]
  >
    ? Child extends object
      ? Child
      : never
    : Option;
export type MappedSelectProps<
  Option extends object,
  Fields extends SelectFieldNames,
> = Omit<SelectCommonProps, "options" | "filterOption" | "optionFilterProp"> & {
  fieldNames: Fields;
  options?: Option[];
  optionFilterProp?: string;
  filterOption?:
    | boolean
    | ((input: string, option: MappedLeaf<Option, Fields>) => boolean);
} & ValueProps<MappedLeaf<Option, Fields>>;

// The public discriminated unions keep callers' values and callbacks precise.
// Normalize both field mappings and labeled values at this boundary; the control
// only handles primitive keys and always returns the caller's original option.
type FacadeValue = SelectValue | LabeledSelectValue;
type FacadeProps = Omit<
  SelectCommonProps,
  "options" | "filterOption" | "optionFilterProp"
> & {
  fieldNames?: SelectFieldNames;
  options?: object[];
  filterOption?: boolean | ((input: string, option: object) => boolean);
  optionFilterProp?: string;
  mode?: "multiple" | "tags";
  tokenSeparators?: string[];
  labelInValue?: boolean;
  value?: FacadeValue | FacadeValue[] | null;
  defaultValue?: FacadeValue | FacadeValue[] | null;
  onChange?: (
    value: FacadeValue | FacadeValue[] | undefined,
    options?: object | object[],
  ) => void;
  onSelect?: (value: FacadeValue, option: object) => void;
  onDeselect?: (value: FacadeValue, option: object) => void;
};

export function Select<
  Option extends object,
  const Fields extends SelectFieldNames,
>(props: MappedSelectProps<Option, Fields>): OctaneNode;
export function Select(props: SelectComponentProps): OctaneNode;
export function Select(inputProps: unknown): OctaneNode {
  const props = inputProps as FacadeProps;
  const [innerValue, setInnerValue] = useState(
    props.defaultValue ?? (props.mode ? [] : null),
  );
  const value = props.value !== undefined ? props.value : innerValue;
  const values = value == null ? [] : Array.isArray(value) ? value : [value];
  const keyOf = (item: FacadeValue): SelectValue =>
    typeof item === "object" ? item.value : item;
  const labels = new Map<SelectValue, OctaneNode>();
  for (const item of values) {
    if (typeof item === "object" && item.label !== undefined)
      labels.set(item.value, item.label);
  }
  const fields = {
    label: props.fieldNames?.label ?? "label",
    value: props.fieldNames?.value ?? "value",
    options: props.fieldNames?.options ?? "options",
  };
  const groupLabel = props.fieldNames?.groupLabel ?? fields.label;
  const originals = new Map<SelectOptionItem, object>();
  const leaf = (raw: object): SelectOption => {
    const record = raw as Record<string, unknown>;
    const value = record[fields.value];
    if (typeof value !== "string" && typeof value !== "number")
      throw new Error("Select: mapped option value must be a string or number");
    const option: SelectOption = {
      value,
      label: record[fields.label] as OctaneNode,
      disabled: record.disabled === true,
      title: typeof record.title === "string" ? record.title : undefined,
    };
    originals.set(option, raw);
    return option;
  };
  const options: SelectOptionItem[] = (props.options ?? []).map((raw) => {
    const record = raw as Record<string, unknown>;
    const children = record[fields.options];
    if (!Array.isArray(children)) return leaf(raw);
    const group: SelectOptionGroup = {
      label: record[groupLabel] as OctaneNode,
      key:
        typeof record.key === "string" || typeof record.key === "number"
          ? record.key
          : undefined,
      options: children.map((child) => {
        if (
          !child ||
          typeof child !== "object" ||
          Array.isArray((child as Record<string, unknown>)[fields.options])
        )
          throw new Error(
            "Select: fieldNames supports one level of option groups",
          );
        return leaf(child);
      }),
    };
    originals.set(group, raw);
    return group;
  });
  const original = (option: SelectOption): object =>
    originals.get(option) ??
    [...originals].find(
      ([entry]) => "value" in entry && entry.value === option.value,
    )?.[1] ?? {
      [fields.value]: option.value,
      [fields.label]: option.label,
    };
  const predicate = props.filterOption;
  const filterProp = props.optionFilterProp;
  const filterOption =
    typeof predicate === "function"
      ? (query: string, option: SelectOption) =>
          predicate(query, original(option))
      : predicate;
  const labeled = (key: SelectValue, option: SelectOption): FacadeValue =>
    props.labelInValue
      ? { value: key, label: labels.get(key) ?? option.label ?? key }
      : key;
  const change = (
    next: SelectValue | SelectValue[] | undefined,
    selected?: SelectOption | SelectOption[],
  ) => {
    const output = Array.isArray(next)
      ? next.map((key, index) =>
          labeled(key, (selected as SelectOption[])[index]),
        )
      : next === undefined
        ? undefined
        : labeled(next, selected as SelectOption);
    if (props.value === undefined) setInnerValue(output ?? null);
    if (selected === undefined) props.onChange?.(output);
    else
      props.onChange?.(
        output,
        Array.isArray(selected) ? selected.map(original) : original(selected),
      );
  };
  const common: SelectControlProps = {
    ...props,
    options,
    displayLabels: labels,
    filterOption,
    optionFilterProp: undefined,
    optionSearchText: filterProp
      ? (option) =>
          String(
            (original(option as SelectOption) as Record<string, unknown>)[
              filterProp
            ] ?? "",
          )
      : undefined,
    onSelect: (key, option) =>
      props.onSelect?.(labeled(key, option), original(option)),
  };
  return props.mode ? (
    <SelectControl
      {...common}
      {...(props.mode === "tags"
        ? { mode: "tags" as const, tokenSeparators: props.tokenSeparators }
        : { mode: "multiple" as const })}
      value={values.map(keyOf)}
      onChange={change}
      onDeselect={(key: SelectValue, option: SelectOption) =>
        props.onDeselect?.(labeled(key, option), original(option))
      }
    />
  ) : (
    <SelectControl
      {...common}
      mode={undefined}
      value={value == null ? null : keyOf(value as FacadeValue)}
      onChange={change}
    />
  );
}

function optionText(option: SelectOption) {
  return typeof option.label === "string" || typeof option.label === "number"
    ? String(option.label)
    : String(option.value);
}

type SelectControlProps = SelectCommonProps & {
  onSelect?: (value: SelectValue, option: SelectOption) => void;
  displayLabels?: ReadonlyMap<SelectValue, OctaneNode>;
  optionSearchText?: (option: SelectOptionItem) => string;
};
function SelectControl(
  props: (SelectProps | MultipleSelectProps) &
    Pick<SelectControlProps, "optionSearchText" | "displayLabels">,
) {
  const config = useConfig();
  const warning = devUseWarning("Select");
  warning.deprecated(
    !("dropdownMatchSelectWidth" in props),
    "dropdownMatchSelectWidth",
    "popupMatchSelectWidth",
  );
  const entries = props.options ?? [];
  const options = entries.flatMap((entry) =>
    "options" in entry ? entry.options : [entry],
  );
  const prefixCls = config.getPrefixCls("select", props.prefixCls);
  const cls = (suffix = "") =>
    componentClassName("ant-select", prefixCls, suffix);
  const getPopupContainer = props.getPopupContainer ?? config.getPopupContainer;
  const popupMatchSelectWidth =
    props.popupMatchSelectWidth ??
    props.dropdownMatchSelectWidth ??
    config.popupMatchSelectWidth ??
    true;
  const popupOverflow = config.popupOverflow ?? "viewport";
  const { token: t, component: c, base } = useComponentTokens("Select");
  const listId = `ao-select-${useId()}`;
  const host = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const composing = useRef(false);
  const popup = useRef<HTMLDivElement | null>(null);
  const [innerValue, setInnerValue] = useState<
    SelectValue | SelectValue[] | null
  >(props.defaultValue ?? (props.mode !== undefined ? [] : null));
  const [innerOpen, setInnerOpen] = useState(props.defaultOpen ?? false);
  const [innerSearch, setInnerSearch] = useState("");
  const [active, setActive] = useState<SelectValue | null>(null);
  const [target, setTarget] = useState<PopupContainer | null>(null);
  const [position, setPosition] = useState<{
    x: number;
    y: number;
    right?: number;
  } | null>(null);
  const disabled = props.disabled ?? config.componentDisabled ?? false;
  const size = props.size ?? config.componentSize ?? "middle";
  const multiple = props.mode !== undefined;
  const showSearch = props.showSearch ?? multiple;
  const value = props.value !== undefined ? props.value : innerValue;
  const singleValue = Array.isArray(value) ? null : value;
  const selectedValues = multiple
    ? Array.isArray(value)
      ? [...new Set(value)]
      : []
    : singleValue == null
      ? []
      : [singleValue];
  const open = !disabled && (props.open ?? innerOpen);
  const search = props.searchValue ?? innerSearch;
  const cachedOptions = useRef(new Map<SelectValue, SelectOption>());
  const optionFor = (selectedValue: SelectValue): SelectOption => {
    const option = options.find((item) => item.value === selectedValue) ??
      cachedOptions.current.get(selectedValue) ?? {
        value: selectedValue,
        label: String(selectedValue),
      };
    return props.displayLabels?.has(selectedValue)
      ? { ...option, label: props.displayLabels.get(selectedValue) }
      : option;
  };
  useLayoutEffect(() => {
    cachedOptions.current = new Map(
      selectedValues.map((key) => [key, optionFor(key)]),
    );
  });
  const selected = singleValue == null ? undefined : optionFor(singleValue);
  const searchEnabled = showSearch && search && props.filterOption !== false;
  const matches = (option: SelectOption) => {
    if (!searchEnabled) return true;
    if (typeof props.filterOption === "function")
      return props.filterOption(search, option);
    const prop = props.optionFilterProp ?? "label";
    const text =
      props.optionSearchText?.(option) ??
      (prop === "label" ? optionText(option) : String(option[prop] ?? ""));
    return text.toLocaleLowerCase().includes(search.toLocaleLowerCase());
  };
  const filteredEntries = entries.flatMap((entry): SelectOptionItem[] => {
    if (!("options" in entry)) return matches(entry) ? [entry] : [];
    // Group names participate in default label filtering. Custom predicates
    // keep the existing leaf-only callback contract.
    const groupMatches =
      searchEnabled &&
      typeof props.filterOption !== "function" &&
      (props.optionFilterProp ?? "label") === "label" &&
      (props.optionSearchText !== undefined ||
        typeof entry.label === "string" ||
        typeof entry.label === "number") &&
      (props.optionSearchText?.(entry) ?? String(entry.label))
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase());
    const children = groupMatches
      ? entry.options
      : entry.options.filter(matches);
    return children.length ? [{ ...entry, options: children }] : [];
  });
  if (props.mode === "tags") {
    for (const key of selectedValues) {
      if (
        !options.some((option) => option.value === key) &&
        matches(optionFor(key))
      )
        filteredEntries.push(optionFor(key));
    }
    if (
      search &&
      ![...options, ...selectedValues.map(optionFor)].some(
        (option) => option.value === search,
      )
    )
      filteredEntries.unshift({ value: search, label: search });
  }
  const filtered = filteredEntries.flatMap((entry) =>
    "options" in entry ? entry.options : [entry],
  );
  const enabled = filtered.filter((option) => !option.disabled);
  const activeValue = enabled.some((option) => option.value === active)
    ? active
    : (enabled.find((option) => option.value === singleValue)?.value ??
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
    if (props.mode !== undefined) {
      setActive(option.value);
      const removing = selectedValues.includes(option.value);
      const next = removing
        ? selectedValues.filter((item) => item !== option.value)
        : [...selectedValues, option.value];
      if (props.value === undefined) setInnerValue(next);
      props.onChange?.(
        next,
        next.map((key) => (key === option.value ? option : optionFor(key))),
      );
      if (removing) props.onDeselect?.(option.value, option);
      else props.onSelect?.(option.value, option);
      if (props.searchValue === undefined) setInnerSearch("");
    } else {
      if (option.value !== singleValue) {
        if (props.value === undefined) setInnerValue(option.value);
        props.onChange?.(option.value, option);
      }
      props.onSelect?.(option.value, option);
      changeOpen(false);
    }
    input.current?.focus();
  };
  const commitTags = (texts: string[]) => {
    if (props.mode !== "tags" || disabled) return;
    const additions = [...new Set(texts)].filter(
      (text) =>
        text &&
        !selectedValues.includes(text) &&
        !options.some((option) => option.value === text && option.disabled),
    );
    if (additions.length) {
      const next = [...selectedValues, ...additions];
      if (props.value === undefined) setInnerValue(next);
      props.onChange?.(next, next.map(optionFor));
      for (const text of additions) props.onSelect?.(text, optionFor(text));
    }
    if (props.searchValue === undefined) setInnerSearch("");
  };
  const editSearch = (text: string) => {
    if (
      props.mode === "tags" &&
      !composing.current &&
      props.tokenSeparators?.some(
        (separator) => separator && text.includes(separator),
      )
    ) {
      let parts = [text];
      for (const separator of props.tokenSeparators)
        if (separator) parts = parts.flatMap((part) => part.split(separator));
      commitTags(parts);
      changeSearch("");
    } else changeSearch(text);
    changeOpen(true);
  };
  const remove = (selectedValue: SelectValue) => {
    if (props.mode === undefined || disabled) return;
    const option = optionFor(selectedValue);
    if (option.disabled) return;
    const next = selectedValues.filter((item) => item !== selectedValue);
    if (props.value === undefined) setInnerValue(next);
    props.onChange?.(next, next.map(optionFor));
    props.onDeselect?.(selectedValue, option);
    input.current?.focus();
  };
  useLayoutEffect(() => {
    if (host.current)
      setTarget(getPopupContainer?.(host.current) ?? document.body);
  }, [getPopupContainer]);
  useLayoutEffect(() => {
    if (!open || !host.current || !popup.current || !target) return;
    const trigger = host.current;
    const list = popup.current;
    const update = () => {
      const listRect = list.getBoundingClientRect();
      const targetElement = getPopupContainerElement(target);
      const scrollRegion =
        popupOverflow === "scroll" && targetElement !== document.body
          ? (() => {
              const rect = targetElement.getBoundingClientRect();
              return {
                left: rect.left + targetElement.clientLeft,
                top: rect.top + targetElement.clientTop,
                width: targetElement.clientWidth,
                height: targetElement.clientHeight,
              };
            })()
          : undefined;
      const next = positionPopup(
        trigger.getBoundingClientRect(),
        listRect,
        { width: window.innerWidth, height: window.innerHeight },
        config.direction === "rtl" ? "bottomRight" : "bottomLeft",
        true,
        4,
        {
          align: {
            htmlRegion: popupOverflow === "scroll" ? "scroll" : "visible",
          },
          scrollRegion,
        },
      );
      let containingWidth = window.innerWidth;
      if (
        targetElement === document.body &&
        (getComputedStyle(targetElement).position || "static") === "static"
      ) {
        next.x += window.scrollX;
        next.y += window.scrollY;
      } else {
        const containingBlock =
          (list.offsetParent as HTMLElement | null) ??
          (getComputedStyle(targetElement).position === "static"
            ? document.body
            : targetElement);
        const rect = containingBlock.getBoundingClientRect();
        containingWidth =
          rect.width -
          containingBlock.clientLeft -
          Number.parseFloat(getComputedStyle(containingBlock).borderRightWidth);
        next.x +=
          containingBlock.scrollLeft - rect.left - containingBlock.clientLeft;
        next.y +=
          containingBlock.scrollTop - rect.top - containingBlock.clientTop;
      }
      // rc-trigger floors the active inset; RTL uses right rather than left.
      const right =
        config.direction === "rtl"
          ? Math.floor(containingWidth - next.x - listRect.width)
          : undefined;
      next.x = Math.floor(next.x);
      next.y = Math.floor(next.y);
      setPosition((old) =>
        old?.x === next.x && old?.y === next.y && old?.right === right
          ? old
          : { x: next.x, y: next.y, right },
      );
    };
    update();
    const outside = (event: PointerEvent) => {
      if (
        !trigger.contains(event.target as Node) &&
        !list.contains(event.target as Node)
      ) {
        if (!composing.current && search) commitTags([search]);
        changeOpen(false);
      }
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
    search,
    value,
    getPopupContainer,
    config.direction,
    popupOverflow,
    props.open,
    props.onOpenChange,
    props.searchValue,
    disabled,
  ]);
  useLayoutEffect(() => {
    if (!open || activeIndex < 0) return;
    const option =
      popup.current?.querySelectorAll('[role="option"]')[activeIndex];
    if (option instanceof HTMLElement)
      option.scrollIntoView({ block: "nearest" });
  }, [open, target, activeIndex]);

  const height =
    size === "large"
      ? t.controlHeightLG
      : size === "small"
        ? t.controlHeightSM
        : t.controlHeight;
  const optionIndexes = new Map(
    filtered.map((option, index) => [option.value, index]),
  );
  const renderOption = (option: SelectOption) => {
    const index = optionIndexes.get(option.value);
    return (
      // biome-ignore lint/a11y/useFocusableInteractive lint/a11y/useKeyWithClickEvents: Keyboard selection stays on the combobox through aria-activedescendant.
      <div
        key={`${typeof option.value}:${option.value}`}
        id={`${listId}-option-${index}`}
        role="option"
        aria-selected={selectedValues.includes(option.value)}
        aria-disabled={option.disabled || undefined}
        className={[
          cls("-item-option"),
          option.value === activeValue && cls("-item-option-active"),
          selectedValues.includes(option.value) && cls("-item-option-selected"),
          option.disabled && cls("-item-option-disabled"),
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
    );
  };
  const list = (
    <div
      ref={popup}
      id={listId}
      role="listbox"
      aria-multiselectable={multiple || undefined}
      aria-busy={props.loading || undefined}
      className={[
        cls("-dropdown"),
        config.direction === "rtl" && cls("-dropdown-rtl"),
        props.rootClassName,
      ]}
      dir={config.direction}
      style={{
        ...base,
        position: "absolute",
        left: position?.right === undefined ? (position?.x ?? 0) : "auto",
        right: position?.right,
        top: position?.y ?? 0,
        width:
          typeof popupMatchSelectWidth === "number"
            ? popupMatchSelectWidth
            : popupMatchSelectWidth
              ? (host.current?.getBoundingClientRect().width ?? 0)
              : undefined,
        minWidth:
          popupMatchSelectWidth === false
            ? (host.current?.getBoundingClientRect().width ?? 0)
            : undefined,
        visibility: position ? undefined : "hidden",
        zIndex: c?.zIndexPopup ?? t.zIndexPopupBase + 50,
        "--ao-select-popup": t.colorBgElevated,
        "--ao-select-popup-padding": `${t.paddingXXS}px`,
        "--ao-select-option-radius": `${t.borderRadiusSM}px`,
        "--ao-select-disabled": t.colorTextDisabled,
        "--ao-select-disabled-bg": t.colorBgContainerDisabled,
        "--ao-select-hover": c?.optionActiveBg ?? t.controlItemBgHover,
        "--ao-select-selected": c?.optionSelectedBg ?? t.controlItemBgActive,
        "--ao-select-selected-color": c?.optionSelectedColor ?? t.colorText,
        "--ao-select-selected-weight":
          c?.optionSelectedFontWeight ?? t.fontWeightStrong,
        "--ao-select-shadow": t.boxShadowSecondary,
        "--ao-select-option-height": `${c?.optionHeight ?? t.controlHeight}px`,
        "--ao-select-option-padding":
          c?.optionPadding ??
          `${(t.controlHeight - t.fontSize * t.lineHeight) / 2}px ${t.controlPaddingHorizontal}px`,
        "--ao-select-group-color": t.colorTextDescription,
        "--ao-select-group-font": `${t.fontSizeSM}px`,
        "--ao-select-option-font": `${c?.optionFontSize ?? t.fontSize}px`,
        "--ao-select-option-line": c?.optionLineHeight ?? t.lineHeight,
      }}
    >
      {filtered.length ? (
        filteredEntries.map((entry, groupIndex) =>
          "options" in entry ? (
            // biome-ignore lint/a11y/useSemanticElements: ARIA option groups inside a listbox are not form fieldsets.
            <div
              key={entry.key ?? `group-${groupIndex}`}
              role="group"
              aria-labelledby={`${listId}-group-${groupIndex}`}
            >
              {/* biome-ignore lint/a11y/noStaticElementInteractions: Prevent blur on nonselectable group headings. */}
              <div
                id={`${listId}-group-${groupIndex}`}
                className={cls("-item-group")}
                onMouseDown={(event) => event.preventDefault()}
              >
                {entry.label}
              </div>
              {entry.options.map(renderOption)}
            </div>
          ) : (
            renderOption(entry)
          ),
        )
      ) : (
        <div className={cls("-item-empty")}>
          {props.notFoundContent !== undefined ? (
            props.notFoundContent
          ) : config.renderEmpty ? (
            config.renderEmpty("Select")
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className={componentClassName(
                "ant-empty",
                config.getPrefixCls("empty"),
                "-small",
              )}
            />
          )}
        </div>
      )}
    </div>
  );
  const field = (
    <input
      ref={input}
      id={props.id}
      role="combobox"
      className={cls("-selection-search-input")}
      aria-label={
        props["aria-label"] ??
        (props["aria-labelledby"] ? undefined : props.placeholder)
      }
      aria-labelledby={props["aria-labelledby"]}
      aria-describedby={
        [props["aria-describedby"], multiple && `${listId}-selection`]
          .filter(Boolean)
          .join(" ") || undefined
      }
      aria-haspopup="listbox"
      aria-busy={props.loading || undefined}
      aria-expanded={open}
      aria-controls={open ? listId : undefined}
      aria-activedescendant={
        open && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
      }
      aria-autocomplete={showSearch ? "list" : "none"}
      aria-invalid={props.status === "error" || undefined}
      disabled={disabled}
      readOnly={!showSearch}
      value={
        multiple
          ? search
          : open && showSearch
            ? search
            : selected
              ? optionText(selected)
              : singleValue == null
                ? ""
                : String(singleValue)
      }
      placeholder={
        multiple && selectedValues.length ? undefined : props.placeholder
      }
      onClick={() => changeOpen(true)}
      onCompositionStart={() => {
        composing.current = true;
      }}
      onCompositionEnd={(event) => {
        composing.current = false;
        editSearch(event.currentTarget.value);
      }}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (
          next &&
          (host.current?.contains(next) || popup.current?.contains(next))
        )
          return;
        if (!composing.current && search) commitTags([search]);
        changeOpen(false);
      }}
      onInput={(event) => {
        if (!showSearch) return;
        editSearch(event.currentTarget.value);
      }}
      onKeyDown={(event) => {
        if (
          disabled ||
          event.isComposing ||
          composing.current ||
          event.keyCode === 229
        )
          return;
        if (multiple && event.key === "Backspace" && !search) {
          const removable = [...selectedValues]
            .reverse()
            .find((item) => !optionFor(item).disabled);
          if (removable !== undefined) {
            event.preventDefault();
            remove(removable);
          }
        } else if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          changeOpen(false);
        } else if (event.key === "Tab") {
          if (search) commitTags([search]);
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
          if (showSearch || !open || !enabled.length) return;
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
  );
  const selectedItems = selectedValues.map((selectedValue) => {
    const option = optionFor(selectedValue);
    return (
      <span
        key={`${typeof selectedValue}:${selectedValue}`}
        className={cls("-selection-item")}
        title={option.title ?? optionText(option)}
      >
        <span className={cls("-selection-item-content")}>
          {option.label ?? selectedValue}
        </span>
        {!disabled && !option.disabled && (
          <button
            type="button"
            className={cls("-selection-item-remove")}
            aria-label={`移除 ${optionText(option)}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.stopPropagation();
              remove(selectedValue);
            }}
          >
            ×
          </button>
        )}
      </span>
    );
  });
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
        cls(),
        cls(multiple ? "-multiple" : "-single"),
        cls(`-${size}`),
        size !== "middle" && cls(size === "large" ? "-lg" : "-sm"),
        config.direction === "rtl" && cls("-rtl"),
        props.status && cls(`-status-${props.status}`),
        disabled && cls("-disabled"),
        open && cls("-open"),
        props.loading && cls("-loading"),
        config.select?.className,
        props.className,
        props.rootClassName,
      ]}
      dir={config.direction}
      style={{
        ...base,
        "--ao-select-height": `${height}px`,
        "--ao-select-baseline-height": `${height - t.lineWidth * 2}px`,
        "--ao-select-border":
          props.status === "error"
            ? t.colorError
            : props.status === "warning"
              ? t.colorWarning
              : t.colorBorder,
        "--ao-select-hover-border": c?.hoverBorderColor ?? t.colorPrimaryHover,
        "--ao-select-focus":
          props.status === "error"
            ? t.colorError
            : props.status === "warning"
              ? t.colorWarning
              : (c?.activeBorderColor ?? t.colorPrimary),
        "--ao-select-outline":
          props.status === "error"
            ? t.colorErrorOutline
            : props.status === "warning"
              ? t.colorWarningOutline
              : (c?.activeOutlineColor ?? t.controlOutline),
        "--ao-select-outline-width": `${t.controlOutlineWidth}px`,
        "--ao-select-disabled": t.colorBgContainerDisabled,
        "--ao-select-disabled-color": t.colorTextDisabled,
        "--ao-select-placeholder": t.colorTextPlaceholder,
        "--ao-select-selection-bg": t.colorFillSecondary,
        "--ao-select-selection-border": t.colorBorderSecondary,
        "--ao-radius": `${t.borderRadius}px`,
        "--ao-select-arrow-size": `${t.fontSizeIcon}px`,
        "--ao-select-arrow-color": t.colorTextQuaternary,
        "--ao-select-arrow-inset": `${t.paddingSM - t.lineWidth}px`,
        "--ao-bg": c?.selectorBg ?? t.colorBgContainer,
        ...config.select?.style,
        ...props.style,
      }}
    >
      {multiple ? (
        <span className={cls("-selection-overflow")}>
          {selectedItems}
          {field}
        </span>
      ) : (
        field
      )}
      {props.allowClear && !disabled && selectedValues.length > 0 && (
        <button
          type="button"
          className={cls("-clear")}
          aria-label="清除选择"
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation();
            if (props.mode !== undefined) {
              if (props.value === undefined) setInnerValue([]);
              props.onChange?.([], []);
              if (props.searchValue === undefined) setInnerSearch("");
            } else {
              if (props.value === undefined) setInnerValue(null);
              props.onChange?.(undefined);
            }
            props.onClear?.();
            changeOpen(false);
            input.current?.focus();
          }}
        >
          ×
        </button>
      )}
      <span className={cls("-arrow")} aria-hidden="true">
        {props.loading ? <LoadingOutlined spin /> : <DownOutlined />}
      </span>
      {multiple && (
        <span
          id={`${listId}-selection`}
          className={cls("-selection-summary")}
          role="status"
        >
          {selectedValues.length
            ? `已选择 ${selectedValues.length} 项：${selectedValues.map((item) => optionText(optionFor(item))).join("、")}`
            : "未选择"}
        </span>
      )}
      {open && target && createPortal(list, target)}
    </div>
  );
}
