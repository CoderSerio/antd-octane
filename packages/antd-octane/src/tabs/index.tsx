/** @jsxImportSource octane */
import {
  Children,
  createElement,
  isValidElement,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { componentClassName } from "../_util/componentClassName";
import { CloseOutlined, PlusOutlined } from "../_util/feedback-icons";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { TabsNavContext } from "./context";
import type {
  TabItem,
  TabPaneProps,
  TabsProps,
  TabsTabBarProps,
} from "./interface";
import TabNavList from "./TabNavList";

export type {
  TabItem,
  TabPaneProps,
  TabsAnimatedConfig,
  TabsEditableConfig,
  TabsMoreProps,
  TabsProps,
  TabsRenderTabBar,
  TabsTabBarProps,
} from "./interface";

function TabPane(_props: TabPaneProps) {
  return null;
}
function TabPanel({
  item,
  active,
  destroy,
  id,
  labelId,
  prefixCls,
  animated,
  duration,
}: {
  item: TabItem;
  active: boolean;
  destroy: boolean;
  id: string;
  labelId: string;
  prefixCls: string;
  animated: boolean;
  duration: string;
}) {
  const [visited, setVisited] = useState(active);
  const [shown, setShown] = useState(active);
  const [phase, setPhase] = useState<
    "enter-start" | "enter-active" | "leave-start" | "leave-active"
  >();
  const previous = useRef(active);
  useLayoutEffect(() => {
    if (previous.current === active) {
      if (!animated || phase) {
        setShown(active);
        setPhase(undefined);
      }
      return;
    }
    previous.current = active;
    if (active) setVisited(true);
    if (!animated) {
      setShown(active);
      setPhase(undefined);
      return;
    }
    setShown(true);
    setPhase(active ? "enter-start" : "leave-start");
    let secondFrame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setPhase(active ? "enter-active" : "leave-active");
        const ms =
          Number.parseFloat(duration) * (duration.endsWith("ms") ? 1 : 1000);
        timer = setTimeout(
          () => {
            setShown(active);
            setPhase(undefined);
          },
          Math.max(0, ms),
        );
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      clearTimeout(timer);
    };
  }, [active, animated, duration]);
  const shouldDestroy =
    destroy || (item.destroyOnHidden ?? item.destroyInactiveTabPane ?? false);
  if (!item.forceRender && !active && !shown && (!visited || shouldDestroy))
    return null;
  const cls = (suffix: string) =>
    componentClassName("ant-tabs", prefixCls, suffix);
  const hidden = !active && (!animated || !shown);
  return (
    <div
      className={[
        cls("-tabpane"),
        active && cls("-tabpane-active"),
        hidden && cls("-tabpane-hidden"),
        phase &&
          cls(`-switch-${phase.startsWith("enter") ? "enter" : "leave"}`),
        phase && cls(`-switch-${phase}`),
        item.className,
      ]}
      style={item.style}
      role="tabpanel"
      id={id}
      aria-labelledby={labelId}
      aria-hidden={!active}
      hidden={hidden}
      tabIndex={active ? 0 : -1}
      onTransitionEnd={(event) => {
        if (
          event.target === event.currentTarget &&
          event.propertyName === "opacity"
        ) {
          setShown(active);
          setPhase(undefined);
        }
      }}
    >
      {item.children}
    </div>
  );
}
export function Tabs({
  items: customItems,
  children,
  renderTabBar,
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
  animated = { inkBar: true, tabPane: false },
  popupClassName,
  getPopupContainer,
  prefixCls: customPrefix,
  ref,
  onTabScroll,
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
  const renderedItems = customItems ?? legacyItems;
  const config = useConfig();
  const size = customSize ?? config.componentSize ?? "middle";
  const prefixCls = config.getPrefixCls("tabs", customPrefix);
  const cls = (suffix = "") =>
    componentClassName("ant-tabs", prefixCls, suffix);
  const mergedIndicator = {
    ...config.tabs?.indicator,
    ...indicator,
    size:
      indicator?.size ??
      indicatorSize ??
      config.tabs?.indicator?.size ??
      config.tabs?.indicatorSize,
  };
  const [inner, setInner] = useState(defaultActiveKey ?? renderedItems[0]?.key);
  const requested = activeKey ?? inner;
  const active = renderedItems.some((item) => item.key === requested)
    ? requested
    : renderedItems[0]?.key;
  const id = useId();
  const [indicatorPixels, setIndicatorPixels] = useState<number>();
  const node = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => ({ nativeElement: node.current }), []);
  const { token: t, base } = useComponentTokens("Tabs");
  const c = config.theme.components?.Tabs;
  const select = (key: string) => {
    if (key !== active) {
      if (activeKey === undefined) setInner(key);
      onChange?.(key);
    }
  };
  const mergedAnimated =
    typeof animated === "boolean"
      ? { inkBar: animated, tabPane: animated }
      : { inkBar: true, tabPane: false, ...animated };
  const barProps: TabsTabBarProps = {
    id,
    activeKey: active,
    tabPosition,
    rtl: config.direction === "rtl",
    mobile:
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent),
    animated: mergedAnimated,
    extra: tabBarExtraContent,
    more: {
      icon: moreIcon ?? config.tabs?.moreIcon,
      ...config.tabs?.more,
      ...more,
    },
    tabBarGutter,
    onTabScroll,
    onTabClick: (key, event) => {
      onTabClick?.(key, event);
      select(key);
    },
    getPopupContainer: getPopupContainer ?? config.getPopupContainer,
    popupClassName,
    indicator: mergedIndicator,
    style: tabBarStyle,
    editable:
      type === "editable-card"
        ? {
            showAdd: !hideAdd,
            addIcon: (addIcon ?? config.tabs?.addIcon) || <PlusOutlined />,
            removeIcon: removeIcon ?? config.tabs?.removeIcon ?? (
              <CloseOutlined />
            ),
            onEdit: (action, { key, event }) => {
              if (action === "add") onEdit?.(event, action);
              else if (key !== undefined) onEdit?.(key, action);
            },
          }
        : undefined,
    panes: renderedItems.map((item) =>
      createElement(TabPane, { ...item, tab: item.label, key: item.key }),
    ),
  };
  return (
    <div
      {...rest}
      ref={node}
      className={[
        cls(),
        `ant-tabs-${type}`,
        `ant-tabs-${tabPosition}`,
        `ant-tabs-${size}`,
        centered && "ant-tabs-centered",
        mergedIndicator.size !== undefined && "ant-tabs-indicator-custom",
        mergedIndicator.align && `ant-tabs-indicator-${mergedIndicator.align}`,
        mergedAnimated.inkBar && "ant-tabs-ink-animated",
        mergedAnimated.tabPane && "ant-tabs-pane-animated",
        config.direction === "rtl" && cls("-rtl"),
        config.tabs?.className,
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        "--ao-tabs-margin": `${t.margin}px`,
        "--ao-tabs-vertical-padding": `${t.paddingXS}px ${t.paddingLG}px`,
        "--ao-tabs-vertical-content-padding": `${t.paddingLG}px`,
        "--ao-tabs-horizontal-margin":
          c?.horizontalMargin ?? `0 0 ${t.margin}px 0`,
        "--ao-tabs-gap": `${tabBarGutter ?? c?.horizontalItemGutter ?? 32}px`,
        "--ao-tabs-color": c?.itemColor ?? t.colorText,
        "--ao-tabs-selected": c?.itemSelectedColor ?? t.colorPrimary,
        "--ao-tabs-hover": c?.itemHoverColor ?? t.colorPrimaryHover,
        "--ao-tabs-active": c?.itemActiveColor ?? t.colorPrimaryActive,
        "--ao-tabs-ink": c?.inkBarColor ?? t.colorPrimary,
        "--ao-tabs-indicator-size":
          indicatorPixels === undefined ? undefined : `${indicatorPixels}px`,
        "--ao-tabs-font-size": `${size === "small" ? (c?.titleFontSizeSM ?? t.fontSize) : size === "large" ? (c?.titleFontSizeLG ?? t.fontSizeLG) : (c?.titleFontSize ?? t.fontSize)}px`,
        "--ao-tabs-title-line":
          size === "large" ? t.lineHeightLG : t.lineHeight,
        "--ao-tabs-padding":
          size === "small"
            ? (c?.horizontalItemPaddingSM ?? `${t.paddingXS}px 0`)
            : size === "large"
              ? (c?.horizontalItemPaddingLG ?? `${t.padding}px 0`)
              : (c?.horizontalItemPadding ?? `${t.paddingSM}px 0`),
        "--ao-tabs-card-bg": c?.cardBg ?? t.colorFillAlter,
        "--ao-tabs-remove-size": `${t.fontSizeSM}px`,
        "--ao-tabs-remove-margin": `${t.marginXS}px`,
        "--ao-tabs-card-height": `${size === "small" ? (c?.cardHeightSM ?? t.controlHeight) : size === "large" ? (c?.cardHeightLG ?? t.controlHeightLG + 8) : (c?.cardHeight ?? t.controlHeightLG)}px`,
        "--ao-tabs-card-padding":
          size === "small"
            ? (c?.cardPaddingSM ??
              `${((c?.cardHeightSM ?? t.controlHeight) - (t.fontHeight ?? t.fontSize * t.lineHeight)) / 2 - t.lineWidth}px ${t.paddingXS}px`)
            : size === "large"
              ? (c?.cardPaddingLG ??
                `${((c?.cardHeightLG ?? t.controlHeightLG + 8) - (t.fontHeightLG ?? t.fontSizeLG * t.lineHeightLG)) / 2 - t.lineWidth}px ${t.padding}px`)
              : (c?.cardPadding ??
                `${((c?.cardHeight ?? t.controlHeightLG) - (t.fontHeight ?? t.fontSize * t.lineHeight)) / 2 - t.lineWidth}px ${t.padding}px`),
        "--ao-tabs-disabled": t.colorTextDisabled,
        "--ao-tabs-motion-duration": t.motion ? t.motionDurationSlow : "0s",
        direction: config.direction,
        ...config.tabs?.style,
        ...style,
      }}
    >
      <TabsNavContext
        value={{
          tabs: renderedItems,
          prefixCls,
          onIndicatorSize: setIndicatorPixels,
        }}
      >
        {renderTabBar ? (
          renderTabBar(barProps, TabNavList)
        ) : (
          <TabNavList {...barProps} />
        )}
      </TabsNavContext>
      <div className={cls("-content-holder")}>
        <div
          className={[
            cls("-content"),
            cls(`-content-${tabPosition}`),
            mergedAnimated.tabPane && cls("-content-animated"),
          ]}
        >
          {renderedItems.map((item) => (
            <TabPanel
              key={item.key}
              item={item}
              active={active === item.key}
              destroy={destroyOnHidden ?? destroyInactiveTabPane ?? false}
              id={`${id}-${encodeURIComponent(item.key)}-panel`}
              labelId={`${id}-${encodeURIComponent(item.key)}-tab`}
              prefixCls={prefixCls}
              animated={!!mergedAnimated.tabPane && t.motion}
              duration={t.motionDurationSlow}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

Tabs.TabPane = TabPane;
