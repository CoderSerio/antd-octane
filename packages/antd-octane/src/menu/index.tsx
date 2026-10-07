/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import {
  cloneElement,
  isValidElement,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { componentClassName } from "../_util/componentClassName";
import {
  DownOutlined,
  LeftOutlined,
  RightOutlined,
} from "../_util/layout-icons";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { DropdownPopup } from "../dropdown/popup";
import { SiderCollapseContext } from "../layout/context";
export interface MenuItem {
  key?: string | number;
  label?: OctaneNode;
  icon?: OctaneNode;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItem[];
  type?: "group" | "divider";
  title?: string;
  extra?: OctaneNode;
  dashed?: boolean;
  popupClassName?: string;
  popupOffset?: [number, number];
  onTitleClick?: (info: {
    key: string;
    domEvent: MouseEvent | KeyboardEvent;
  }) => void;
  theme?: "light" | "dark";
}
export interface MenuInfo {
  key: string;
  keyPath: string[];
  selectedKeys: string[];
  domEvent: MouseEvent | KeyboardEvent;
  item: HTMLElement | null;
}
export interface MenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "onSelect"> {
  items?: MenuItem[];
  mode?: "inline" | "vertical" | "horizontal";
  inlineCollapsed?: boolean;
  theme?: "light" | "dark";
  prefixCls?: string;
  rootClassName?: string;
  expandIcon?:
    | OctaneNode
    | ((props: {
        isOpen: boolean;
        isSubMenu: boolean;
        disabled?: boolean;
      }) => OctaneNode);
  overflowedIndicator?: OctaneNode;
  forceSubMenuRender?: boolean;
  triggerSubMenuAction?: "hover" | "click";
  subMenuOpenDelay?: number;
  subMenuCloseDelay?: number;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  openKeys?: string[];
  defaultOpenKeys?: string[];
  selectable?: boolean;
  multiple?: boolean;
  inlineIndent?: number;
  onClick?: (info: MenuInfo) => void;
  onSelect?: (info: MenuInfo) => void;
  onDeselect?: (info: MenuInfo) => void;
  onOpenChange?: (keys: string[]) => void;
  style?: CSSProperties;
}
function normalizeKey(value: string | number | undefined, fallback: string) {
  return value === undefined ? fallback : String(value);
}
export function Menu({
  items = [],
  mode = "vertical",
  inlineCollapsed: customInlineCollapsed,
  theme = "light",
  prefixCls: customPrefix,
  rootClassName,
  expandIcon,
  overflowedIndicator,
  forceSubMenuRender = false,
  triggerSubMenuAction = "hover",
  subMenuOpenDelay = 0,
  subMenuCloseDelay = 0.1,
  getPopupContainer,
  selectedKeys,
  defaultSelectedKeys = [],
  openKeys,
  defaultOpenKeys = [],
  selectable = true,
  multiple = false,
  inlineIndent = 24,
  onClick,
  onSelect,
  onDeselect,
  onOpenChange,
  className,
  style,
  ...rest
}: MenuProps) {
  const config = useConfig();
  const siderCollapsed = useContext(SiderCollapseContext);
  const inlineCollapsed = customInlineCollapsed ?? siderCollapsed ?? false;
  const prefixCls = config.getPrefixCls("menu", customPrefix);
  const cls = (suffix = "") =>
    componentClassName("ant-menu", prefixCls, suffix);
  const inline = mode === "inline" && !inlineCollapsed;
  const { token: t, component: c, base } = useComponentTokens("Menu");
  const [selected, setSelected] = useState(defaultSelectedKeys),
    [opened, setOpened] = useState(defaultOpenKeys),
    [active, setActive] = useState<string>();
  const selection = selectedKeys ?? selected,
    open = openKeys ?? opened;
  const elements = useRef(new Map<string, HTMLElement>());
  const pending = useRef<string>();
  const rootElement = useRef<HTMLDivElement | null>(null);
  const [overflowKeys, setOverflowKeys] = useState<string[]>([]);
  const previousCollapsed = useRef(inlineCollapsed);
  const inlineOpenCache = useRef(defaultOpenKeys);
  useLayoutEffect(() => {
    if (previousCollapsed.current === inlineCollapsed) return;
    previousCollapsed.current = inlineCollapsed;
    if (inlineCollapsed) {
      inlineOpenCache.current = open;
      if (openKeys === undefined) setOpened([]);
    } else if (openKeys === undefined) setOpened(inlineOpenCache.current);
  }, [inlineCollapsed]);
  type Entry = {
    key: string;
    item: MenuItem;
    parent?: string;
    path: string[];
    depth: number;
  };
  const entries: Entry[] = [];
  const visible: string[] = [];
  const collect = (
    nodes: MenuItem[],
    parent: string | undefined,
    path: string[],
    depth: number,
    shown: boolean,
    prefix = "menu",
  ) =>
    nodes.forEach((item, index) => {
      const key = normalizeKey(item.key, `${prefix}-${index}`);
      const entry = { key, item, parent, path: [key, ...path], depth };
      entries.push(entry);
      if (
        shown &&
        item.type !== "divider" &&
        item.type !== "group" &&
        !item.disabled &&
        (inline || depth === 0)
      )
        visible.push(key);
      if (item.children)
        collect(
          item.children,
          item.type === "group" ? parent : key,
          item.type === "group" ? path : [key, ...path],
          depth + (item.type === "group" ? 0 : 1),
          shown && (item.type === "group" || open.includes(key)),
          key,
        );
    });
  collect(items, undefined, [], 0, true);
  const current =
    active && visible.includes(active) && !overflowKeys.includes(active)
      ? active
      : visible.find((key) => !overflowKeys.includes(key));
  useLayoutEffect(() => {
    const element =
      rootElement.current?.querySelector<HTMLElement>(":scope > ul");
    if (!element || mode !== "horizontal") {
      setOverflowKeys((old) => (old.length ? [] : old));
      return;
    }
    const measure = () => {
      const available = element.clientWidth;
      if (!available) return;
      const widths = Array.from(element.children)
        .slice(0, items.length)
        .map((item) => (item as HTMLElement).offsetWidth);
      const allWidth = widths.reduce((sum, width) => sum + width, 0);
      let used = 0;
      const hidden: string[] = [];
      items.forEach((item, index) => {
        used += widths[index] ?? 0;
        if (allWidth > available && used > available - 64)
          hidden.push(normalizeKey(item.key, `menu-${index}`));
      });
      setOverflowKeys((old) =>
        old.join("\0") === hidden.join("\0") ? old : hidden,
      );
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    observer?.observe(element);
    for (const child of element.children) observer?.observe(child);
    return () => observer?.disconnect();
  }, [items, mode]);
  useLayoutEffect(() => {
    if (pending.current) {
      const parent = entries.find(
        (entry) => entry.key === pending.current,
      )?.parent;
      const popupId = parent
        ? elements.current.get(parent)?.getAttribute("aria-controls")
        : undefined;
      const popup = popupId ? document.getElementById(popupId) : null;
      const target =
        elements.current.get(pending.current) ??
        Array.from(
          popup?.querySelectorAll<HTMLElement>("[data-menu-key]") ?? [],
        ).find((button) => button.dataset.menuKey === pending.current);
      if (target) {
        target.focus();
        pending.current = undefined;
      }
    }
  }, [open.join("|"), items]);
  const toggle = (key: string, next: boolean) => {
    const keys = next
      ? [...new Set([...open, key])]
      : open.filter((v) => v !== key);
    if (openKeys === undefined) setOpened(keys);
    onOpenChange?.(keys);
  };
  const activate = (entry: Entry, event: MouseEvent | KeyboardEvent) => {
    if (entry.item.disabled) {
      event.preventDefault();
      return;
    }
    if (entry.item.children) {
      entry.item.onTitleClick?.({ key: entry.key, domEvent: event });
      if (inline || triggerSubMenuAction === "click")
        toggle(entry.key, !open.includes(entry.key));
      return;
    }
    const has = selection.includes(entry.key);
    const keys = selectable
      ? multiple
        ? has
          ? selection.filter((key) => key !== entry.key)
          : [...selection, entry.key]
        : [entry.key]
      : selection;
    const info = {
      key: entry.key,
      keyPath: entry.path,
      selectedKeys: keys,
      domEvent: event,
      item:
        elements.current.get(entry.key) ??
        (event.currentTarget instanceof HTMLElement
          ? event.currentTarget
          : null),
    };
    if (selectable) {
      if (selectedKeys === undefined) setSelected(keys);
      if (multiple && has) onDeselect?.(info);
      else onSelect?.(info);
    }
    onClick?.(info);
    if (!inline && open.length) {
      if (openKeys === undefined) setOpened([]);
      onOpenChange?.([]);
    }
  };
  const focus = (key: string | undefined) => {
    if (key) {
      setActive(key);
      elements.current.get(key)?.focus();
    }
  };
  const keydown = (event: KeyboardEvent, entry: Entry) => {
    if (entry.item.disabled) return;
    const at = visible.indexOf(entry.key);
    if (
      mode === "horizontal" &&
      entry.item.children &&
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      pending.current = entries.find(
        (child) => child.parent === entry.key && !child.item.disabled,
      )?.key;
      toggle(entry.key, true);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focus(event.key === "Home" ? visible[0] : visible[visible.length - 1]);
    } else if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      (mode === "horizontal" &&
        !entry.parent &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight"))
    ) {
      event.preventDefault();
      const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
      focus(
        visible[(at + (forward ? 1 : -1) + visible.length) % visible.length],
      );
    } else if (event.key === "ArrowRight" && entry.item.children) {
      event.preventDefault();
      if (!open.includes(entry.key)) toggle(entry.key, true);
      const child = entries.find(
        (e) =>
          e.parent === entry.key &&
          !e.item.disabled &&
          e.item.type !== "divider" &&
          e.item.type !== "group",
      );
      pending.current = child?.key;
      if (open.includes(entry.key)) focus(child?.key);
    } else if (event.key === "ArrowLeft" && entry.parent) {
      event.preventDefault();
      toggle(entry.parent, false);
      focus(entry.parent);
    } else if (event.key === "Escape" && entry.parent) {
      event.preventDefault();
      toggle(entry.parent, false);
      focus(entry.parent);
    } else if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      event.key !== " "
    ) {
      const target = [
        ...visible.slice(at + 1),
        ...visible.slice(0, at + 1),
      ].find((key) =>
        elements.current
          .get(key)
          ?.textContent?.trim()
          .toLowerCase()
          .startsWith(event.key.toLowerCase()),
      );
      focus(target);
    }
  };
  const renderItems = (
    nodes: MenuItem[],
    parent?: string,
    depth = 0,
    prefix = "menu",
  ): OctaneNode =>
    nodes.map((item, index) => {
      const key = normalizeKey(item.key, `${prefix}-${index}`);
      const entry = entries.find((e) => e.key === key);
      if (!entry) return null;
      if (item.type === "divider")
        return (
          <li key={key} role="presentation">
            <hr
              className={[
                cls("-item-divider"),
                item.dashed && cls("-item-divider-dashed"),
              ]}
            />
          </li>
        );
      if (item.type === "group")
        return (
          <li key={key} role="presentation" className="ant-menu-item-group">
            <div className="ant-menu-item-group-title">{item.label}</div>
            {/* biome-ignore lint/a11y/useSemanticElements: ARIA menu group contains menu items, not form controls. */}
            <ul role="group" className={cls("-item-group-list")}>
              {renderItems(item.children ?? [], parent, depth, key)}
            </ul>
          </li>
        );
      const expanded = open.includes(key);
      const interactiveLabel =
        !item.children &&
        isValidElement<HTMLAttributes<HTMLElement>>(item.label) &&
        (item.label.type === "a" || item.label.type === "button");
      const Control = interactiveLabel ? "div" : "button";
      const label =
        interactiveLabel &&
        isValidElement<HTMLAttributes<HTMLElement>>(item.label)
          ? cloneElement(item.label, { tabIndex: -1 })
          : item.label;
      const button = (
        <Control
          ref={(node: HTMLElement | null) => {
            if (node) elements.current.set(key, node);
            else elements.current.delete(key);
          }}
          type={Control === "button" ? "button" : undefined}
          data-menu-key={key}
          role={multiple && !item.children ? "menuitemcheckbox" : "menuitem"}
          aria-checked={
            multiple && !item.children ? selection.includes(key) : undefined
          }
          aria-current={
            !multiple && selection.includes(key) ? "page" : undefined
          }
          aria-haspopup={item.children ? "menu" : undefined}
          aria-expanded={item.children ? expanded : undefined}
          disabled={Control === "button" ? item.disabled : undefined}
          aria-disabled={item.disabled || undefined}
          tabIndex={current === key ? 0 : -1}
          title={
            item.title ??
            (inlineCollapsed && typeof item.label === "string"
              ? item.label
              : undefined)
          }
          className={[
            item.children ? cls("-submenu-title") : cls("-item"),
            selection.includes(key) && cls("-item-selected"),
            item.danger && cls("-item-danger"),
          ]}
          style={{
            paddingInlineStart: inline
              ? (depth + 1) * inlineIndent
              : inlineCollapsed
                ? undefined
                : typeof className === "string" &&
                    className.split(" ").includes("ant-dropdown-menu")
                  ? "var(--ao-dropdown-item-padding)"
                  : t.padding,
          }}
          onFocus={() => setActive(key)}
          onKeyDown={(event) => keydown(event, entry)}
          onClick={(event) => activate(entry, event)}
        >
          {item.icon !== undefined && (
            <span className={cls("-item-icon")}>{item.icon}</span>
          )}
          <span className={cls("-title-content")}>
            {inlineCollapsed &&
            item.icon === undefined &&
            typeof item.label === "string"
              ? item.label.slice(0, 1)
              : label}
          </span>
          {item.extra !== undefined && (
            <span className={cls("-item-extra")}>{item.extra}</span>
          )}
          {item.children && (
            <span className={cls("-submenu-arrow")} aria-hidden="true">
              {typeof expandIcon === "function" ? (
                expandIcon({
                  isOpen: expanded,
                  isSubMenu: true,
                  disabled: item.disabled,
                })
              ) : expandIcon !== undefined ? (
                expandIcon
              ) : inline ? (
                <DownOutlined
                  style={{ transform: expanded ? "rotate(180deg)" : undefined }}
                />
              ) : config.direction === "rtl" ? (
                <LeftOutlined />
              ) : (
                <RightOutlined />
              )}
            </span>
          )}
        </Control>
      );
      return (
        <li
          key={key}
          role="presentation"
          className={item.children ? cls("-submenu") : undefined}
          style={
            depth === 0 && mode === "horizontal" && overflowKeys.includes(key)
              ? {
                  position: "absolute",
                  visibility: "hidden",
                  pointerEvents: "none",
                }
              : undefined
          }
          aria-hidden={
            (depth === 0 &&
              mode === "horizontal" &&
              overflowKeys.includes(key)) ||
            undefined
          }
        >
          {item.children && !inline ? (
            <DropdownPopup
              getPopupContainer={getPopupContainer}
              open={expanded}
              autoFocus={
                pending.current !== undefined &&
                entries.some(
                  (entry) =>
                    entry.key === pending.current && entry.parent === key,
                )
              }
              disabled={item.disabled}
              trigger={triggerSubMenuAction === "hover" ? ["hover"] : []}
              mouseEnterDelay={subMenuOpenDelay}
              mouseLeaveDelay={subMenuCloseDelay}
              forceRender={forceSubMenuRender}
              placement={
                mode === "horizontal" && depth === 0
                  ? "bottomLeft"
                  : config.direction === "rtl"
                    ? "leftTop"
                    : "rightTop"
              }
              align={
                item.popupOffset ? { offset: item.popupOffset } : undefined
              }
              overlayClassName={["ant-menu-submenu-popup", item.popupClassName]
                .filter(Boolean)
                .join(" ")}
              overlayStyle={{ minWidth: 160, paddingInline: 4 }}
              onOpenChange={(next, info) => {
                if (info.source !== "menu") toggle(key, next);
              }}
              renderMenu={(close) => (
                <Menu
                  className="ant-menu-popup-menu"
                  inlineCollapsed={false}
                  {...{
                    items: item.children,
                    selectedKeys: selection,
                    openKeys: open,
                    selectable: false,
                    multiple,
                    theme: item.theme ?? theme,
                    expandIcon,
                    forceSubMenuRender,
                    triggerSubMenuAction,
                    subMenuOpenDelay,
                    subMenuCloseDelay,
                    getPopupContainer,
                    onFocus: (event) => {
                      if (
                        event.target instanceof HTMLElement &&
                        event.target.dataset.menuKey === pending.current
                      )
                        pending.current = undefined;
                    },
                    onOpenChange: (keys) => {
                      if (keys.length) {
                        if (openKeys === undefined) setOpened(keys);
                        onOpenChange?.(keys);
                      }
                    },
                    onClick: (info) => {
                      const childEntry = entries.find(
                        (e) => e.key === info.key,
                      );
                      if (childEntry) activate(childEntry, info.domEvent);
                      close();
                    },
                  }}
                />
              )}
            >
              {button}
            </DropdownPopup>
          ) : (
            button
          )}
          {item.children && inline && (expanded || forceSubMenuRender) && (
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: Menu items provide the managed keyboard focus.
            <ul role="menu" hidden={!expanded} className="ant-menu-sub">
              {renderItems(item.children, key, depth + 1, key)}
            </ul>
          )}
        </li>
      );
    });
  return (
    <div
      {...rest}
      ref={rootElement}
      className={[
        cls("-root"),
        cls(`-${theme}`),
        inlineCollapsed && cls("-inline-collapsed"),
        config.menu?.className,
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        "--ao-menu-color":
          theme === "dark"
            ? (c?.darkItemColor ?? "rgba(255,255,255,0.65)")
            : (c?.itemColor ?? t.colorText),
        "--ao-menu-bg":
          theme === "dark"
            ? className === "ant-menu-popup-menu"
              ? (c?.darkPopupBg ?? "#001529")
              : (c?.darkItemBg ?? "#001529")
            : className === "ant-menu-popup-menu"
              ? (c?.popupBg ?? t.colorBgElevated)
              : (c?.itemBg ?? t.colorBgContainer),
        "--ao-menu-hover":
          theme === "dark"
            ? (c?.darkItemHoverBg ?? "transparent")
            : (c?.itemHoverBg ?? t.colorBgTextHover),
        "--ao-menu-hover-color":
          theme === "dark"
            ? (c?.darkItemHoverColor ?? "#fff")
            : (c?.itemHoverColor ?? t.colorText),
        "--ao-menu-selected-bg":
          theme === "dark"
            ? (c?.darkItemSelectedBg ?? t.colorPrimary)
            : (c?.itemSelectedBg ?? t.colorPrimaryBg),
        "--ao-menu-selected":
          theme === "dark"
            ? (c?.darkItemSelectedColor ?? "#fff")
            : (c?.itemSelectedColor ?? t.colorPrimary),
        "--ao-menu-disabled":
          theme === "dark"
            ? (c?.darkItemDisabledColor ?? "rgba(255,255,255,0.25)")
            : (c?.itemDisabledColor ?? t.colorTextDisabled),
        "--ao-menu-padding": `${t.padding}px`,
        "--ao-menu-height": `${c?.itemHeight ?? t.controlHeightLG}px`,
        "--ao-menu-horizontal-height": `${t.controlHeightLG * 1.15}px`,
        "--ao-menu-icon-gap": `${t.controlHeightSM - t.fontSize}px`,
        "--ao-menu-group-padding": `${t.paddingXS}px`,
        "--ao-menu-inline-margin": `${c?.itemMarginInline ?? 4}px`,
        "--ao-menu-block-margin": `${c?.itemMarginBlock ?? 4}px`,
        "--ao-menu-radius": `${c?.itemBorderRadius ?? t.borderRadiusLG}px`,
        "--ao-menu-sub-bg":
          theme === "dark"
            ? (c?.darkSubMenuItemBg ?? "#000c17")
            : (c?.subMenuItemBg ?? t.colorFillAlter),
        "--ao-menu-group":
          theme === "dark"
            ? (c?.darkGroupTitleColor ?? "rgba(255,255,255,0.65)")
            : (c?.groupTitleColor ?? t.colorTextDescription),
        "--ao-menu-icon-size": `${c?.iconSize ?? t.fontSize}px`,
        "--ao-menu-collapsed-icon-size": `${c?.collapsedIconSize ?? t.fontSizeLG}px`,
        "--ao-menu-danger": c?.dangerItemColor ?? t.colorError,
        "--ao-menu-collapsed-width": `${c?.collapsedWidth ?? t.controlHeightLG * 2}px`,
        direction: config.direction,
        ...config.menu?.style,
        ...style,
      }}
    >
      <ul
        role={mode === "horizontal" ? "menubar" : "menu"}
        aria-label={rest["aria-label"] ?? "菜单"}
        className={[cls(), cls(`-${mode}`)]}
      >
        {renderItems(items)}
        {overflowKeys.length > 0 && mode === "horizontal" && (
          <li role="presentation">
            <DropdownPopup
              getPopupContainer={getPopupContainer}
              renderMenu={(close) => (
                <Menu
                  className="ant-dropdown-menu"
                  {...{
                    items: items.filter((item, index) =>
                      overflowKeys.includes(
                        normalizeKey(item.key, `menu-${index}`),
                      ),
                    ),
                    inlineCollapsed: false,
                    selectable,
                    multiple,
                    selectedKeys: selection,
                    getPopupContainer,
                    onClick: (info) => {
                      const entry = entries.find(
                        (entry) => entry.key === info.key,
                      );
                      if (entry) activate(entry, info.domEvent);
                      close();
                    },
                  }}
                />
              )}
            >
              <button
                type="button"
                className="ant-menu-submenu-title"
                aria-label="更多菜单"
              >
                {overflowedIndicator ?? "•••"}
              </button>
            </DropdownPopup>
          </li>
        )}
      </ul>
    </div>
  );
}
