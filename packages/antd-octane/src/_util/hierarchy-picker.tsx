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
import { useConfig } from "../config-provider";
import {
  getPopupContainerElement,
  type PopupContainer,
} from "../config-provider/context";
import { positionPopup, useFloatingParentId } from "./floating";
import { useComponentTokens } from "./tokens";

export interface HierarchyPickerRef {
  nativeElement: HTMLDivElement | null;
  focus: () => void;
  blur: () => void;
}
export interface HierarchyPickerProps {
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  onClear?: () => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearch?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
  size?: "small" | "middle" | "large";
  status?: "error" | "warning";
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HierarchyPickerRef>;
}
export function HierarchyPicker(
  props: HierarchyPickerProps & {
    name: "tree-select" | "cascader";
    label: OctaneNode;
    hasValue: boolean;
    clear: () => void;
    content: (search: string, close: () => void) => OctaneNode;
  },
) {
  const config = useConfig();
  const parentPopupId = useFloatingParentId();
  const { token: t, base } = useComponentTokens("Select");
  const host = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<PopupContainer | null>(null);
  const [innerOpen, setOpen] = useState(props.defaultOpen ?? false);
  const [innerSearch, setSearch] = useState("");
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const disabled = props.disabled ?? config.componentDisabled ?? false;
  const open = !disabled && (props.open ?? innerOpen);
  const search = props.searchValue ?? innerSearch;
  const popupId = `ao-hierarchy-${useId()}`;
  const size = props.size ?? config.componentSize ?? "middle";
  const getContainer = props.getPopupContainer ?? config.getPopupContainer;
  const changeOpen = (next: boolean) => {
    if (disabled || open === next) return;
    if (props.open === undefined) setOpen(next);
    props.onOpenChange?.(next);
    if (!next && props.searchValue === undefined) setSearch("");
  };
  const close = () => {
    changeOpen(false);
    input.current?.focus();
  };
  useImperativeHandle(
    props.ref,
    () => ({
      nativeElement: host.current,
      focus: () => input.current?.focus(),
      blur: () => input.current?.blur(),
    }),
    [],
  );
  useLayoutEffect(() => {
    if (host.current) setTarget(getContainer?.(host.current) ?? document.body);
  }, [getContainer]);
  useLayoutEffect(() => {
    if (!open || !target || !host.current || !popup.current) return;
    const trigger = host.current;
    const list = popup.current;
    const update = () => {
      const point = positionPopup(
        trigger.getBoundingClientRect(),
        list.getBoundingClientRect(),
        { width: window.innerWidth, height: window.innerHeight },
        config.direction === "rtl" ? "bottomRight" : "bottomLeft",
        true,
        4,
      );
      const parent =
        (list.offsetParent as HTMLElement | null) ??
        getPopupContainerElement(target);
      const rect = parent.getBoundingClientRect();
      const body =
        parent === document.body &&
        getComputedStyle(parent).position === "static";
      const next = {
        left:
          point.x +
          (body
            ? window.scrollX
            : -rect.left - parent.clientLeft + parent.scrollLeft),
        top:
          point.y +
          (body
            ? window.scrollY
            : -rect.top - parent.clientTop + parent.scrollTop),
      };
      setPosition((old) =>
        old.left === next.left && old.top === next.top ? old : next,
      );
    };
    const outside = (event: PointerEvent) => {
      if (
        !trigger.contains(event.target as Node) &&
        !list.contains(event.target as Node)
      )
        changeOpen(false);
    };
    const focusOutside = (event: FocusEvent) => {
      if (
        !trigger.contains(event.target as Node) &&
        !list.contains(event.target as Node)
      )
        changeOpen(false);
    };
    update();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(update);
    observer?.observe(trigger);
    observer?.observe(list);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", focusOutside);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer?.disconnect();
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", focusOutside);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, target, config.direction, props.open, props.onOpenChange]);
  const theme: CSSProperties & Record<`--${string}`, string | number> = {
    ...base,
    "--ao-hierarchy-bg": t.colorBgElevated,
    "--ao-hierarchy-color": t.colorText,
    "--ao-hierarchy-border":
      props.status === "error"
        ? t.colorError
        : props.status === "warning"
          ? t.colorWarning
          : t.colorBorder,
    "--ao-hierarchy-primary": t.colorPrimary,
    "--ao-hierarchy-selected": t.controlItemBgActive,
    "--ao-hierarchy-radius": `${t.borderRadius}px`,
    "--ao-hierarchy-height": `${size === "small" ? t.controlHeightSM : size === "large" ? t.controlHeightLG : t.controlHeight}px`,
  };
  return (
    <div
      ref={host}
      className={[
        "ao-hierarchy-picker",
        `ant-${props.name}`,
        disabled && "ao-hierarchy-disabled",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...theme, ...props.style }}
      dir={config.direction}
    >
      <input
        ref={input}
        id={props.id}
        role="combobox"
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
        aria-expanded={open}
        aria-controls={open ? popupId : undefined}
        aria-haspopup="dialog"
        aria-invalid={props.status === "error" || undefined}
        disabled={disabled}
        readOnly={!props.showSearch}
        value={
          open && props.showSearch
            ? search
            : typeof props.label === "string"
              ? props.label
              : ""
        }
        placeholder={!props.hasValue ? props.placeholder : undefined}
        onClick={() => changeOpen(true)}
        onInput={(event) => {
          if (props.searchValue === undefined)
            setSearch(event.currentTarget.value);
          props.onSearch?.(event.currentTarget.value);
          changeOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.isComposing) return;
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
          if (
            event.key === "ArrowDown" ||
            (!props.showSearch && (event.key === "Enter" || event.key === " "))
          ) {
            event.preventDefault();
            if (!open) changeOpen(true);
            else
              popup.current
                ?.querySelector<HTMLElement>(
                  '[role="tree"],button:not(:disabled)',
                )
                ?.focus();
          }
        }}
      />
      {typeof props.label !== "string" &&
        !(open && props.showSearch && search) &&
        props.hasValue && (
          <span className="ao-hierarchy-value" aria-hidden="true">
            {props.label}
          </span>
        )}
      {props.allowClear && props.hasValue && !disabled && (
        <button
          type="button"
          className="ao-hierarchy-clear"
          aria-label="Clear selection"
          onClick={() => {
            props.clear();
            props.onClear?.();
            input.current?.focus();
          }}
        >
          ×
        </button>
      )}
      {open &&
        target &&
        createPortal(
          <div
            id={popupId}
            data-ao-floating-parent={parentPopupId}
            role="dialog"
            aria-label={
              props["aria-label"]
                ? `${props["aria-label"]} options`
                : "Selection options"
            }
            ref={popup}
            className="ao-hierarchy-popup"
            dir={config.direction}
            style={{
              ...theme,
              position: "absolute",
              left: position.left,
              top: position.top,
              minWidth: host.current?.getBoundingClientRect().width,
              zIndex: t.zIndexPopupBase,
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                close();
              }
            }}
          >
            {props.content(search, close)}
          </div>,
          target,
        )}
    </div>
  );
}
