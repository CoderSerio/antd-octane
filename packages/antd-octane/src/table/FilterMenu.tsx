/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "octane";
import { Checkbox } from "../checkbox";
import type { PopupContainer } from "../config-provider/context";
import { Popover } from "../popover";
import { Radio } from "../radio";
import type { ColumnFilterItem, FilterSearch } from "./types";

/**
 * Native Table filter menu based on antd 5.29.3's useFilter renderFilterItems.
 * Submenus use independent floating panels because the source menu portals each
 * submenu outside the clipped filter dropdown. MIT, Ant Design contributors.
 */
export interface FilterMenuProps {
  filters: ColumnFilterItem[];
  selectedKeys: string[];
  filterMultiple: boolean;
  filterSearch?: FilterSearch;
  search: string;
  direction?: "ltr" | "rtl";
  getPopupContainer?: (trigger: HTMLElement) => PopupContainer;
  submenuZIndex?: number;
  submenuStyle?: CSSProperties;
  panelOpen?: boolean;
  emptyContent?: OctaneNode;
  onChange: (keys: string[]) => void;
}

interface FilterMenuEntry {
  key: string;
  identity: string;
  item: ColumnFilterItem;
  children?: FilterMenuEntry[];
}

function matchesSearch(
  query: string,
  item: ColumnFilterItem,
  filterSearch: FilterSearch | undefined,
) {
  if (typeof filterSearch === "function") return filterSearch(query, item);
  const text = item.text;
  return (
    (typeof text === "string" || typeof text === "number") &&
    String(text).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  );
}

function createEntries(
  filters: ColumnFilterItem[],
  search: string,
  filterSearch: FilterSearch | undefined,
  parentIdentity = "",
): FilterMenuEntry[] {
  return filters.flatMap((item, index) => {
    const valueKey =
      item.value === undefined ? String(index) : String(item.value);
    const key = item.children ? valueKey || String(index) : valueKey;
    const identity = parentIdentity
      ? `${parentIdentity}/${index}:${key}`
      : `${index}:${key}`;

    // Upstream filters leaves only. Parent submenu items stay visible even when
    // all their children are filtered out, matching renderFilterItems exactly.
    if (item.children) {
      return [
        {
          key,
          identity,
          item,
          children: createEntries(
            item.children,
            search,
            filterSearch,
            identity,
          ),
        },
      ];
    }

    if (search.trim() && !matchesSearch(search, item, filterSearch)) return [];
    return [{ key, identity, item }];
  });
}

interface MenuLevelProps extends Omit<FilterMenuProps, "filters" | "search"> {
  items: FilterMenuEntry[];
  className?: string;
  id?: string;
  autoFocusFirst?: boolean;
  onClose?: () => void;
  closeSignal: number;
  onCloseAllSubmenus: () => void;
}

function containsSelectedKey(item: FilterMenuEntry, keys: string[]): boolean {
  return (
    keys.includes(item.key) ||
    (item.children?.some((child) => containsSelectedKey(child, keys)) ?? false)
  );
}

function focusMenuItem(node: HTMLElement | undefined) {
  (node?.querySelector<HTMLAnchorElement>("a[href]") ?? node)?.focus();
}

function FilterMenuLevel({
  items,
  selectedKeys,
  filterMultiple,
  direction = "ltr",
  getPopupContainer,
  submenuZIndex,
  submenuStyle,
  panelOpen = true,
  closeSignal,
  onCloseAllSubmenus,
  onChange,
  className,
  id,
  autoFocusFirst = false,
  onClose,
}: MenuLevelProps) {
  const [activeIdentity, setActiveIdentity] = useState<string>();
  const elements = useRef(new Map<string, HTMLElement>());
  const focusFrame = useRef<number | undefined>(undefined);
  const focusTarget = useRef<string | undefined>(undefined);
  const submenuOpen = useRef(new Map<string, () => void>());
  const active = items.some((item) => item.identity === activeIdentity)
    ? activeIdentity
    : undefined;

  useEffect(
    () => () => {
      if (focusFrame.current !== undefined)
        cancelAnimationFrame(focusFrame.current);
    },
    [],
  );

  useLayoutEffect(() => {
    const firstIdentity = items[0]?.identity;
    if (!autoFocusFirst || firstIdentity === undefined) return;

    setActiveIdentity(firstIdentity);
    // rc-menu defers child focus until its submenu portal has been aligned.
    // A hidden floating panel cannot receive focus during its initial layout.
    let frame: number;
    const focusAfterAlignment = (remaining: number) => {
      frame = requestAnimationFrame(() => {
        if (remaining > 1) focusAfterAlignment(remaining - 1);
        else focusMenuItem(elements.current.get(firstIdentity));
      });
    };
    // useAccessibility waits five frames before discovering children, then
    // one more before focusing. Reopened panels also need this alignment wait.
    focusAfterAlignment(6);
    return () => cancelAnimationFrame(frame);
  }, [autoFocusFirst, items]);

  const registerItem = (identity: string, node: HTMLElement | null) => {
    if (node) elements.current.set(identity, node);
    else elements.current.delete(identity);
  };

  const focusAt = (index: number) => {
    if (!items.length) return;
    const wrapped = (index + items.length) % items.length;
    const target = items[wrapped];
    setActiveIdentity(target.identity);
    focusTarget.current = target.identity;
    if (focusFrame.current !== undefined)
      cancelAnimationFrame(focusFrame.current);
    // rc-menu applies its active state before focusing on the next frame.
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = undefined;
      if (focusTarget.current === target.identity)
        focusMenuItem(elements.current.get(target.identity));
    });
  };

  const onItemKeyDown = (
    event: KeyboardEvent,
    item: FilterMenuEntry,
    index: number,
    openSubmenu?: () => void,
  ) => {
    const activeIndex = items.findIndex((entry) => entry.identity === active);
    if (activeIndex !== -1) {
      item = items[activeIndex];
      index = activeIndex;
      openSubmenu = submenuOpen.current.get(item.identity);
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusAt(index + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusAt(event.key === "Home" ? 0 : items.length - 1);
    } else if (
      item.children &&
      (event.key === (direction === "rtl" ? "ArrowLeft" : "ArrowRight") ||
        event.key === "Enter")
    ) {
      event.preventDefault();
      openSubmenu?.();
    } else if (
      (event.key === (direction === "rtl" ? "ArrowRight" : "ArrowLeft") ||
        event.key === "Escape") &&
      onClose
    ) {
      if (event.key !== "Escape") event.preventDefault();
      onClose();
    }
  };

  const renderItem = (item: FilterMenuEntry, index: number): OctaneNode => {
    if (item.children) {
      return (
        <SubmenuItem
          key={item.identity}
          item={item}
          index={index}
          active={active === item.identity}
          direction={direction}
          getPopupContainer={getPopupContainer}
          submenuZIndex={submenuZIndex}
          submenuStyle={submenuStyle}
          panelOpen={panelOpen}
          closeSignal={closeSignal}
          onCloseAllSubmenus={onCloseAllSubmenus}
          selectedKeys={selectedKeys}
          filterMultiple={filterMultiple}
          onChange={onChange}
          onRegister={registerItem}
          onRegisterOpen={(identity, open) => {
            if (open) submenuOpen.current.set(identity, open);
            else submenuOpen.current.delete(identity);
          }}
          onKeyDown={onItemKeyDown}
          onFocus={() => setActiveIdentity(item.identity)}
        />
      );
    }

    const checked = selectedKeys.includes(item.key);
    const selectItem = (fromKeyboard = false) => {
      if (!filterMultiple) {
        onChange([item.key]);
        // rc-menu's bubbling Enter accessibility handler retains the open
        // parent path after selection. A click closes the single-select path.
        if (!fromKeyboard) onCloseAllSubmenus();
      } else {
        onChange(
          checked
            ? selectedKeys.filter((key) => key !== item.key)
            : [...selectedKeys, item.key],
        );
      }
    };
    return (
      <li
        key={item.identity}
        ref={(node) => registerItem(item.identity, node)}
        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: rc-menu uses focusable li menuitems within ul[role=menu].
        role="menuitem"
        tabIndex={-1}
        className={[
          "ant-menu-item",
          "ant-table-filter-menu-item",
          activeIdentity === item.identity && "ant-menu-item-active",
          checked && "ant-menu-item-selected",
        ]}
        onFocus={() => setActiveIdentity(item.identity)}
        onMouseEnter={() => setActiveIdentity(item.identity)}
        onMouseLeave={() => {
          setActiveIdentity((current) =>
            current === item.identity ? undefined : current,
          );
        }}
        onKeyDown={(event) => {
          onItemKeyDown(event, item, index);
          // A menuitem is not a button: Enter selects, while Space only
          // selects when the nested native checkbox/radio dispatches a click.
          if (event.key === "Enter") selectItem(true);
        }}
        onClick={() => selectItem()}
      >
        <FilterIndicator checked={checked} multiple={filterMultiple} />
        <span
          className={[
            "ant-menu-title-content",
            filterMultiple && "ant-table-filter-checkbox-label",
          ]}
        >
          {item.item.text}
        </span>
      </li>
    );
  };

  return (
    <ul
      id={id}
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: WAI-ARIA menu semantics match rc-menu's ul focus entry.
      role="menu"
      tabIndex={onClose ? -1 : 0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget || !items.length) return;
        // The menu itself is the sequential focus entry. With no active item,
        // rc-menu's first direction/Enter key focuses a sibling rather than
        // selecting it. Item handlers take over once an item has focus.
        const index = items.findIndex((item) => item.identity === active);
        if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          focusAt(event.key === "Home" ? 0 : items.length - 1);
        } else if (
          [
            "ArrowDown",
            "ArrowUp",
            "ArrowLeft",
            "ArrowRight",
            "Enter",
            "Escape",
          ].includes(event.key)
        ) {
          if (event.key.startsWith("Arrow")) event.preventDefault();
          if (index === -1)
            focusAt(
              event.key === "ArrowUp" ||
                event.key ===
                  (direction === "rtl" ? "ArrowRight" : "ArrowLeft") ||
                event.key === "Escape"
                ? items.length - 1
                : 0,
            );
          else if (event.key === "ArrowDown" || event.key === "ArrowUp")
            focusAt(index + (event.key === "ArrowDown" ? 1 : -1));
          else
            onItemKeyDown(
              event,
              items[index],
              index,
              submenuOpen.current.get(items[index].identity),
            );
        }
      }}
      className={[
        "ant-menu",
        "ant-menu-vertical",
        "ant-table-filter-menu-list",
        className,
      ]}
    >
      {items.map(renderItem)}
    </ul>
  );
}

function FilterIndicator({
  checked,
  multiple,
}: {
  checked: boolean;
  multiple: boolean;
}) {
  return (
    <span className="ant-table-filter-menu-indicator">
      {multiple ? (
        <Checkbox
          skipGroup
          checked={checked}
          className="ant-table-filter-menu-checkbox"
        />
      ) : (
        <Radio checked={checked} className="ant-table-filter-menu-radio" />
      )}
    </span>
  );
}

function SubmenuItem({
  item,
  index,
  active,
  direction,
  getPopupContainer,
  submenuZIndex,
  submenuStyle,
  panelOpen,
  closeSignal,
  onCloseAllSubmenus,
  selectedKeys,
  filterMultiple,
  onChange,
  onRegister,
  onRegisterOpen,
  onKeyDown,
  onFocus,
}: {
  item: FilterMenuEntry;
  index: number;
  active: boolean;
  direction: "ltr" | "rtl";
  getPopupContainer?: (trigger: HTMLElement) => PopupContainer;
  submenuZIndex?: number;
  submenuStyle?: CSSProperties;
  panelOpen: boolean;
  closeSignal: number;
  onCloseAllSubmenus: () => void;
  selectedKeys: string[];
  filterMultiple: boolean;
  onChange: (keys: string[]) => void;
  onRegister: (identity: string, node: HTMLElement | null) => void;
  onRegisterOpen: (identity: string, open: (() => void) | null) => void;
  onKeyDown: (
    event: KeyboardEvent,
    item: FilterMenuEntry,
    index: number,
    openSubmenu?: () => void,
  ) => void;
  onFocus: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [focusFirst, setFocusFirst] = useState(false);
  const trigger = useRef<HTMLDivElement | null>(null);
  const popupId = `${useId()}-popup`;
  const lastCloseSignal = useRef(closeSignal);
  const close = () => {
    setOpen(false);
    setFocusFirst(false);
    trigger.current?.focus();
  };
  const openFromKeyboard = () => {
    setFocusFirst(true);
    setOpen(true);
  };

  useLayoutEffect(() => {
    onRegisterOpen(item.identity, openFromKeyboard);
    return () => onRegisterOpen(item.identity, null);
  }, [item.identity, onRegisterOpen]);

  useEffect(() => {
    if (!panelOpen) {
      setOpen(false);
      setFocusFirst(false);
    }
  }, [panelOpen]);

  useEffect(() => {
    if (lastCloseSignal.current !== closeSignal) {
      lastCloseSignal.current = closeSignal;
      setOpen(false);
      setFocusFirst(false);
    }
  }, [closeSignal]);

  return (
    <li
      role="none"
      className={[
        "ant-menu-submenu",
        containsSelectedKey(item, selectedKeys) && "ant-menu-submenu-selected",
        active && "ant-menu-submenu-active",
      ]}
    >
      <Popover
        fresh
        trigger="hover"
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setFocusFirst(false);
        }}
        placement={direction === "rtl" ? "leftTop" : "rightTop"}
        align={{ offset: [0, 0], htmlRegion: "visible", dynamicInset: false }}
        arrow={false}
        zIndex={submenuZIndex}
        getPopupContainer={getPopupContainer}
        overlayClassName="ant-dropdown-menu-submenu-popup ant-table-filter-submenu-popup"
        styles={{ root: submenuStyle, body: { padding: 0 } }}
        content={
          <FilterMenuLevel
            id={popupId}
            items={item.children ?? []}
            selectedKeys={selectedKeys}
            filterMultiple={filterMultiple}
            direction={direction}
            getPopupContainer={getPopupContainer}
            submenuZIndex={submenuZIndex}
            submenuStyle={submenuStyle}
            panelOpen={panelOpen}
            closeSignal={closeSignal}
            onCloseAllSubmenus={onCloseAllSubmenus}
            onChange={onChange}
            autoFocusFirst={focusFirst}
            onClose={close}
          />
        }
      >
        <div
          ref={(node) => {
            trigger.current = node;
            onRegister(item.identity, node);
          }}
          role="menuitem"
          aria-haspopup={true}
          aria-controls={popupId}
          aria-expanded={open}
          tabIndex={-1}
          className="ant-menu-submenu-title ant-table-filter-menu-item ant-table-filter-submenu-trigger"
          onFocus={onFocus}
          onKeyDown={(event) => onKeyDown(event, item, index, openFromKeyboard)}
        >
          <span className="ant-menu-title-content">{item.item.text}</span>
          <span className="ant-menu-submenu-arrow" aria-hidden="true">
            {/* RightOutlined geometry from @ant-design/icons-svg 4.6.0 (MIT). */}
            <svg
              viewBox="64 64 896 896"
              width="1em"
              height="1em"
              fill="currentColor"
              focusable="false"
              aria-hidden="true"
              style={
                direction === "rtl"
                  ? { transform: "rotate(180deg)" }
                  : undefined
              }
            >
              <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
            </svg>
          </span>
        </div>
      </Popover>
    </li>
  );
}

export function FilterMenu(props: FilterMenuProps) {
  const items = useMemo(
    () => createEntries(props.filters, props.search, props.filterSearch),
    [props.filters, props.search, props.filterSearch],
  );
  const [closeSignal, setCloseSignal] = useState(0);
  if (items.length === 0) return props.emptyContent ?? null;

  return (
    <div className="ant-table-filter-menu" data-filter-mode="menu">
      <FilterMenuLevel
        items={items}
        {...props}
        closeSignal={closeSignal}
        onCloseAllSubmenus={() => setCloseSignal((value) => value + 1)}
      />
    </div>
  );
}
