/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
} from "octane";
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
/** Compatibility child API retained by antd 5 alongside `items`. */
export interface TabPaneProps
  extends Omit<TabItem, "key" | "label" | "children"> {
  key?: string | number;
  tab?: OctaneNode;
  label?: OctaneNode;
  children?: OctaneNode;
}
function TabPane(_props: TabPaneProps) {
  return null;
}
export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: TabItem[];
  children?: OctaneNode;
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
  tabBarExtraContent?: OctaneNode | { left?: OctaneNode; right?: OctaneNode };
  destroyOnHidden?: boolean;
  destroyInactiveTabPane?: boolean;
  hideAdd?: boolean;
  addIcon?: OctaneNode;
  moreIcon?: OctaneNode;
  more?: { icon?: OctaneNode; trigger?: "hover" | "click" };
  indicatorSize?: number | ((origin: number) => number);
  indicator?: {
    size?: number | ((origin: number) => number);
    align?: "start" | "center" | "end";
  };
  removeIcon?: OctaneNode;
  rootClassName?: string;
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
  children,
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
  moreIcon,
  more,
  indicatorSize,
  indicator,
  removeIcon,
  onEdit,
  className,
  rootClassName,
  style,
  ...rest
}: TabsProps) {
  const legacyItems: TabItem[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<TabPaneProps>(child) || child.type !== TabPane) return;
    const props = child.props;
    const key = props.key ?? child.key;
    if (key === undefined || key === null) return;
    legacyItems.push({
      ...props,
      key: String(key),
      label: props.tab ?? props.label ?? String(key),
      children: child.children ?? props.children,
    });
  });
  const renderedItems = items.length > 0 ? items : legacyItems;
  const config = useConfig();
  const size = customSize ?? config.componentSize ?? "middle";
  const [inner, setInner] = useState(
    defaultActiveKey ?? renderedItems.find((item) => !item.disabled)?.key,
  );
  const requested = activeKey ?? inner;
  const active = renderedItems.some((item) => item.key === requested)
    ? requested
    : renderedItems.find((item) => !item.disabled)?.key;
  const id = useId();
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<string | null>(null);
  useEffect(() => {
    if (
      pendingFocus.current &&
      !renderedItems.some((item) => item.key === pendingFocus.current)
    ) {
      if (active) buttons.current.get(active)?.focus();
      pendingFocus.current = null;
    }
  }, [renderedItems, active]);
  const { token: t, base } = useComponentTokens("Tabs");
  const c = config.theme.components?.Tabs;
  const vertical = tabPosition === "left" || tabPosition === "right";
  const extra =
    tabBarExtraContent &&
    typeof tabBarExtraContent === "object" &&
    !isValidElement(tabBarExtraContent) &&
    ("left" in tabBarExtraContent || "right" in tabBarExtraContent)
      ? (tabBarExtraContent as { left?: OctaneNode; right?: OctaneNode })
      : { right: tabBarExtraContent as OctaneNode };
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
        (indicator?.size ?? indicatorSize) !== undefined &&
          "ant-tabs-indicator-custom",
        indicator?.align && `ant-tabs-indicator-${indicator.align}`,
        className,
        rootClassName,
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
        "--ao-tabs-indicator-size":
          typeof (indicator?.size ?? indicatorSize) === "number"
            ? `${indicator?.size ?? indicatorSize}px`
            : undefined,
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
        {extra.left && (
          <div className="ant-tabs-extra-content">{extra.left}</div>
        )}
        <div
          className="ant-tabs-nav-list"
          role="tablist"
          aria-orientation={vertical ? "vertical" : "horizontal"}
          onKeyDown={(event) => {
            const current = (
              event.target as HTMLElement
            ).closest<HTMLButtonElement>('[role="tab"]');
            if (!current) return;
            const enabled = renderedItems.filter((item) => !item.disabled);
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
          {renderedItems.map((item) => {
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
                    {item.closeIcon ?? removeIcon ?? "×"}
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
        {extra.right && (
          <div className="ant-tabs-extra-content">{extra.right}</div>
        )}
        {(moreIcon !== undefined || more?.icon !== undefined) &&
          renderedItems.length > 0 && (
            <button
              className="ant-tabs-nav-more"
              type="button"
              aria-label="更多"
              title={more?.trigger === "click" ? "更多" : undefined}
            >
              {moreIcon ?? more?.icon}
            </button>
          )}
      </div>
      <div className="ant-tabs-content-holder">
        {renderedItems.map((item) => (
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

Tabs.TabPane = TabPane;
