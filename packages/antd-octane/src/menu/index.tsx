/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useLayoutEffect, useRef, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
export interface MenuItem {
  key?: string;
  label?: OctaneNode;
  icon?: OctaneNode;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItem[];
  type?: "group" | "divider";
  title?: string;
}
export interface MenuInfo {
  key: string;
  keyPath: string[];
  selectedKeys: string[];
  domEvent: MouseEvent | KeyboardEvent;
}
export interface MenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "onSelect"> {
  items?: MenuItem[];
  mode?: "inline" | "vertical" | "horizontal";
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
export function Menu({
  items = [],
  mode = "vertical",
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
  const { token: t, component: c, base } = useComponentTokens("Menu");
  const [selected, setSelected] = useState(defaultSelectedKeys),
    [opened, setOpened] = useState(defaultOpenKeys),
    [active, setActive] = useState<string>();
  const selection = selectedKeys ?? selected,
    open = openKeys ?? opened;
  const elements = useRef(new Map<string, HTMLButtonElement>());
  const pending = useRef<string>();
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
      const key = item.key ?? `${prefix}-${index}`;
      const entry = { key, item, parent, path: [key, ...path], depth };
      entries.push(entry);
      if (
        shown &&
        item.type !== "divider" &&
        item.type !== "group" &&
        !item.disabled
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
  const current = active && visible.includes(active) ? active : visible[0];
  useLayoutEffect(() => {
    if (pending.current && elements.current.has(pending.current)) {
      elements.current.get(pending.current)?.focus();
      pending.current = undefined;
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
    if (entry.item.disabled) return;
    if (entry.item.children) {
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
    };
    if (selectable) {
      if (selectedKeys === undefined) setSelected(keys);
      if (multiple && has) onDeselect?.(info);
      else onSelect?.(info);
    }
    onClick?.(info);
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
    if (event.key === "Home" || event.key === "End") {
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
      const key = item.key ?? `${prefix}-${index}`;
      const entry = entries.find((e) => e.key === key);
      if (!entry) return null;
      if (item.type === "divider")
        return (
          <li key={key} role="presentation">
            <hr className="ant-menu-item-divider" />
          </li>
        );
      if (item.type === "group")
        return (
          <li key={key} role="presentation" className="ant-menu-item-group">
            <div className="ant-menu-item-group-title">{item.label}</div>
            {/* biome-ignore lint/a11y/useSemanticElements: ARIA menu group contains menu items, not form controls. */}
            <ul role="group">
              {renderItems(item.children ?? [], parent, depth, key)}
            </ul>
          </li>
        );
      const expanded = open.includes(key);
      return (
        <li
          key={key}
          role="presentation"
          className={item.children ? "ant-menu-submenu" : undefined}
        >
          {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-checked is only set with the conditional menuitemcheckbox role. */}
          <button
            ref={(node) => {
              if (node) elements.current.set(key, node);
              else elements.current.delete(key);
            }}
            type="button"
            role={multiple && !item.children ? "menuitemcheckbox" : "menuitem"}
            aria-checked={
              multiple && !item.children ? selection.includes(key) : undefined
            }
            aria-current={
              !multiple && selection.includes(key) ? "page" : undefined
            }
            aria-haspopup={item.children ? "menu" : undefined}
            aria-expanded={item.children ? expanded : undefined}
            disabled={item.disabled}
            tabIndex={current === key ? 0 : -1}
            title={item.title}
            className={[
              item.children ? "ant-menu-submenu-title" : "ant-menu-item",
              selection.includes(key) && "ant-menu-item-selected",
              item.danger && "ant-menu-item-danger",
            ]}
            style={{ paddingInlineStart: t.padding + depth * inlineIndent }}
            onFocus={() => setActive(key)}
            onKeyDown={(event) => keydown(event, entry)}
            onClick={(event) => activate(entry, event)}
          >
            {item.icon !== undefined && (
              <span className="ant-menu-item-icon">{item.icon}</span>
            )}
            <span className="ant-menu-title-content">{item.label}</span>
            {item.children && (
              <span className="ant-menu-submenu-arrow" aria-hidden="true">
                {expanded ? "⌃" : "⌄"}
              </span>
            )}
          </button>
          {item.children && expanded && (
            // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: Menu items provide the managed keyboard focus.
            <ul role="menu" className="ant-menu-sub">
              {renderItems(item.children, key, depth + 1, key)}
            </ul>
          )}
        </li>
      );
    });
  return (
    <div
      {...rest}
      className={["ant-menu-root", className]}
      style={{
        ...base,
        "--ao-menu-color": c?.itemColor ?? t.colorText,
        "--ao-menu-bg": c?.itemBg ?? t.colorBgContainer,
        "--ao-menu-hover": c?.itemHoverBg ?? t.colorBgTextHover,
        "--ao-menu-hover-color": c?.itemHoverColor ?? t.colorText,
        "--ao-menu-selected-bg": c?.itemSelectedBg ?? t.colorPrimaryBg,
        "--ao-menu-selected": c?.itemSelectedColor ?? t.colorPrimary,
        "--ao-menu-disabled": c?.itemDisabledColor ?? t.colorTextDisabled,
        "--ao-menu-padding": `${t.padding}px`,
        "--ao-menu-height": `${c?.itemHeight ?? t.controlHeightLG}px`,
        "--ao-menu-inline-margin": `${c?.itemMarginInline ?? 4}px`,
        "--ao-menu-block-margin": `${c?.itemMarginBlock ?? 4}px`,
        "--ao-menu-radius": `${c?.itemBorderRadius ?? t.borderRadiusLG}px`,
        "--ao-menu-sub-bg": c?.subMenuItemBg ?? t.colorFillAlter,
        "--ao-menu-group": c?.groupTitleColor ?? t.colorTextDescription,
        "--ao-menu-icon-size": `${c?.iconSize ?? t.fontSize}px`,
        "--ao-menu-danger": c?.dangerItemColor ?? t.colorError,
        ...style,
      }}
    >
      <ul
        role={mode === "horizontal" ? "menubar" : "menu"}
        aria-label={rest["aria-label"] ?? "菜单"}
        className={["ant-menu", `ant-menu-${mode}`]}
      >
        {renderItems(items)}
      </ul>
    </div>
  );
}
