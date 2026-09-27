/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useEffect, useId, useRef, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface TabItem {
  key: string;
  label: OctaneNode;
  children?: OctaneNode;
  disabled?: boolean;
  closable?: boolean;
  closeIcon?: OctaneNode;
  forceRender?: boolean;
  destroyOnHidden?: boolean;
  icon?: OctaneNode;
}
export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  onTabClick?: (key: string, event: MouseEvent) => void;
  type?: "line" | "card" | "editable-card";
  size?: "small" | "middle" | "large";
  tabPosition?: "top" | "bottom" | "left" | "right";
  centered?: boolean;
  tabBarGutter?: number;
  tabBarStyle?: CSSProperties;
  tabBarExtraContent?: OctaneNode;
  destroyOnHidden?: boolean;
  destroyInactiveTabPane?: boolean;
  hideAdd?: boolean;
  addIcon?: OctaneNode;
  onEdit?: (keyOrEvent: string | MouseEvent, action: "add" | "remove") => void;
  style?: CSSProperties;
}
function TabPanel({
  item,
  active,
  destroy,
  id,
  labelId,
}: {
  item: TabItem;
  active: boolean;
  destroy: boolean;
  id: string;
  labelId: string;
}) {
  const [visited, setVisited] = useState(active);
  useEffect(() => {
    if (active) setVisited(true);
  }, [active]);
  return (
    <div
      className="ant-tabs-tabpane"
      role="tabpanel"
      id={id}
      aria-labelledby={labelId}
      hidden={!active}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: Tab panels need a keyboard entry point when their content has no focusable controls.
      tabIndex={0}
    >
      {(active ||
        item.forceRender ||
        (!(item.destroyOnHidden ?? destroy) && visited)) &&
        item.children}
    </div>
  );
}
export function Tabs({
  items = [],
  activeKey,
  defaultActiveKey,
  onChange,
  onTabClick,
  type = "line",
  size: customSize,
  tabPosition = "top",
  centered = false,
  tabBarGutter,
  tabBarStyle,
  tabBarExtraContent,
  destroyOnHidden,
  destroyInactiveTabPane,
  hideAdd = false,
  addIcon,
  onEdit,
  className,
  style,
  ...rest
}: TabsProps) {
  const config = useConfig();
  const size = customSize ?? config.componentSize ?? "middle";
  const [inner, setInner] = useState(
    defaultActiveKey ?? items.find((item) => !item.disabled)?.key,
  );
  const requested = activeKey ?? inner;
  const active = items.some((item) => item.key === requested)
    ? requested
    : items.find((item) => !item.disabled)?.key;
  const id = useId();
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<string | null>(null);
  useEffect(() => {
    if (
      pendingFocus.current &&
      !items.some((item) => item.key === pendingFocus.current)
    ) {
      if (active) buttons.current.get(active)?.focus();
      pendingFocus.current = null;
    }
  }, [items, active]);
  const { token: t, base } = useComponentTokens("Tabs");
  const c = config.theme.components?.Tabs;
  const vertical = tabPosition === "left" || tabPosition === "right";
  const select = (key: string) => {
    if (key !== active) {
      if (activeKey === undefined) setInner(key);
      onChange?.(key);
    }
  };
  return (
    <div
      {...rest}
      className={[
        "ant-tabs",
        `ant-tabs-${type}`,
        `ant-tabs-${tabPosition}`,
        `ant-tabs-${size}`,
        centered && "ant-tabs-centered",
        className,
      ]}
      style={{
        ...base,
        "--ao-tabs-margin": `${t.margin}px`,
        "--ao-tabs-horizontal-margin":
          c?.horizontalMargin ?? `0 0 ${t.margin}px 0`,
        "--ao-tabs-gap": `${tabBarGutter ?? c?.horizontalItemGutter ?? 32}px`,
        "--ao-tabs-color": c?.itemColor ?? t.colorText,
        "--ao-tabs-selected": c?.itemSelectedColor ?? t.colorPrimary,
        "--ao-tabs-hover": c?.itemHoverColor ?? t.colorPrimaryHover,
        "--ao-tabs-active": c?.itemActiveColor ?? t.colorPrimaryActive,
        "--ao-tabs-ink": c?.inkBarColor ?? t.colorPrimary,
        "--ao-tabs-font-size": `${size === "small" ? (c?.titleFontSizeSM ?? t.fontSize) : size === "large" ? (c?.titleFontSizeLG ?? t.fontSizeLG) : (c?.titleFontSize ?? t.fontSize)}px`,
        "--ao-tabs-padding":
          size === "small"
            ? (c?.horizontalItemPaddingSM ?? `${t.paddingXS}px 0`)
            : size === "large"
              ? (c?.horizontalItemPaddingLG ?? `${t.padding}px 0`)
              : (c?.horizontalItemPadding ?? `${t.paddingSM}px 0`),
        "--ao-tabs-card-bg": c?.cardBg ?? t.colorFillAlter,
        "--ao-tabs-card-padding":
          c?.cardPadding ?? `${t.paddingXS - 1}px ${t.padding}px`,
        "--ao-tabs-disabled": t.colorTextDisabled,
        ...style,
      }}
    >
      <div className="ant-tabs-nav" style={tabBarStyle}>
        <div
          className="ant-tabs-nav-list"
          role="tablist"
          aria-orientation={vertical ? "vertical" : "horizontal"}
          onKeyDown={(event) => {
            const current = (
              event.target as HTMLElement
            ).closest<HTMLButtonElement>('[role="tab"]');
            if (!current) return;
            const enabled = items.filter((item) => !item.disabled);
            const index = enabled.findIndex(
              (item) => buttons.current.get(item.key) === current,
            );
            const previous = vertical ? "ArrowUp" : "ArrowLeft";
            const next = vertical ? "ArrowDown" : "ArrowRight";
            let target: number | undefined;
            if (event.key === previous)
              target = (index - 1 + enabled.length) % enabled.length;
            if (event.key === next) target = (index + 1) % enabled.length;
            if (event.key === "Home") target = 0;
            if (event.key === "End") target = enabled.length - 1;
            if (target !== undefined && enabled[target]) {
              event.preventDefault();
              buttons.current.get(enabled[target].key)?.focus();
            }
          }}
        >
          {items.map((item) => {
            const keyId = `${id}-${encodeURIComponent(item.key)}`;
            return (
              <div
                className={[
                  "ant-tabs-tab",
                  active === item.key && "ant-tabs-tab-active",
                  item.disabled && "ant-tabs-tab-disabled",
                ]}
                key={item.key}
              >
                <button
                  ref={(node) => {
                    if (node) buttons.current.set(item.key, node);
                    else buttons.current.delete(item.key);
                  }}
                  className="ant-tabs-tab-btn"
                  type="button"
                  role="tab"
                  id={`${keyId}-tab`}
                  aria-controls={`${keyId}-panel`}
                  aria-selected={active === item.key}
                  tabIndex={active === item.key ? 0 : -1}
                  disabled={item.disabled}
                  onClick={(event) => {
                    onTabClick?.(item.key, event);
                    select(item.key);
                  }}
                >
                  {item.icon && (
                    <span className="ant-tabs-tab-icon">{item.icon}</span>
                  )}
                  {item.label}
                </button>
                {type === "editable-card" && item.closable !== false && (
                  <button
                    className="ant-tabs-tab-remove"
                    type="button"
                    disabled={item.disabled}
                    aria-label={`关闭 ${typeof item.label === "string" ? item.label : item.key}`}
                    onClick={() => {
                      pendingFocus.current = item.key;
                      onEdit?.(item.key, "remove");
                    }}
                  >
                    {item.closeIcon ?? "×"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {type === "editable-card" && !hideAdd && (
          <button
            className="ant-tabs-nav-add"
            type="button"
            aria-label="新增标签页"
            onClick={(event) => onEdit?.(event, "add")}
          >
            {addIcon ?? "+"}
          </button>
        )}
        {tabBarExtraContent !== undefined && (
          <div className="ant-tabs-extra-content">{tabBarExtraContent}</div>
        )}
      </div>
      <div className="ant-tabs-content-holder">
        {items.map((item) => (
          <TabPanel
            key={item.key}
            item={item}
            active={active === item.key}
            destroy={destroyOnHidden ?? destroyInactiveTabPane ?? false}
            id={`${id}-${encodeURIComponent(item.key)}-panel`}
            labelId={`${id}-${encodeURIComponent(item.key)}-tab`}
          />
        ))}
      </div>
    </div>
  );
}
