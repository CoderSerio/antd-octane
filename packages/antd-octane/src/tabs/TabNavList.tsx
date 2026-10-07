/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import {
  isValidElement,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { componentClassName } from "../_util/componentClassName";
import { CloseOutlined, PlusOutlined } from "../_util/feedback-icons";
import { EllipsisOutlined } from "../_util/layout-icons";
import { useComponentTokens } from "../_util/tokens";
import { Dropdown } from "../dropdown";
import { TabsNavContext } from "./context";
import type { TabsTabBarProps } from "./interface";

function offsetWithin(tab: HTMLElement, list: HTMLElement, vertical: boolean) {
  let offset = 0;
  let node: HTMLElement | null = tab;
  while (node && node !== list) {
    offset += vertical ? node.offsetTop : node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }
  return offset;
}
export default function TabNavList({
  id,
  activeKey: active,
  tabPosition,
  rtl,
  animated,
  extra: customExtra,
  editable,
  more,
  tabBarGutter,
  onTabClick,
  onTabScroll,
  getPopupContainer,
  popupClassName,
  indicator,
  className,
  style,
  children,
  ref,
  locale,
}: TabsTabBarProps) {
  const context = useContext(TabsNavContext);
  if (!context) return null;
  const { tabs: renderedItems, prefixCls, onIndicatorSize } = context;
  const cls = (suffix = "") =>
    componentClassName("ant-tabs", prefixCls, suffix);
  const { token: t, component: c } = useComponentTokens("Tabs");
  const vertical = tabPosition === "left" || tabPosition === "right";
  const node = useRef<HTMLDivElement | null>(null);
  const list = useRef<HTMLDivElement | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const [overflow, setOverflow] = useState<string[]>([]);
  const [ink, setInk] = useState<CSSProperties>({ opacity: 0 });
  const pendingFocus = useRef<string | null>(null);
  useImperativeHandle<HTMLDivElement | null>(ref, () => node.current, []);
  useEffect(() => {
    if (
      pendingFocus.current &&
      !renderedItems.some((item) => item.key === pendingFocus.current)
    ) {
      if (active) buttons.current.get(active)?.focus();
      pendingFocus.current = null;
    }
  }, [renderedItems, active]);
  useLayoutEffect(() => {
    const element = list.current;
    if (!element) return;
    const measure = () => {
      const tab = buttons.current
        .get(active ?? "")
        ?.closest<HTMLElement>(".ant-tabs-tab");
      if (tab) {
        const origin = vertical ? tab.offsetHeight : tab.offsetWidth;
        const size =
          typeof indicator?.size === "function"
            ? indicator.size(origin)
            : (indicator?.size ?? origin);
        onIndicatorSize(indicator?.size === undefined ? undefined : size);
        const align = indicator?.align ?? "center";
        const end = align === "end";
        const start = align === "start";
        const shift = (vertical ? end : rtl ? start : end)
          ? origin - size
          : start || end
            ? 0
            : (origin - size) / 2;
        const next: CSSProperties = vertical
          ? {
              top: offsetWithin(tab, element, true) + shift,
              height: size,
              width: 2,
              [tabPosition === "left"
                ? rtl
                  ? "left"
                  : "right"
                : rtl
                  ? "right"
                  : "left"]: 0,
            }
          : {
              left: offsetWithin(tab, element, false) + shift,
              width: size,
              height: 2,
              [tabPosition === "bottom" ? "top" : "bottom"]: 0,
            };
        setInk((old) =>
          JSON.stringify(old) === JSON.stringify(next) ? old : next,
        );
      } else {
        setInk((old) => (old.opacity === 0 ? old : { opacity: 0 }));
      }
      const boundary = element.getBoundingClientRect();
      const hiddenKeys = renderedItems
        .filter((item) => {
          const rect = buttons.current
            .get(item.key)
            ?.closest<HTMLElement>(".ant-tabs-tab")
            ?.getBoundingClientRect();
          return (
            !!rect &&
            (vertical
              ? rect.top < boundary.top - 1 || rect.bottom > boundary.bottom + 1
              : rect.left < boundary.left - 1 ||
                rect.right > boundary.right + 1)
          );
        })
        .map((item) => item.key);
      setOverflow((old) =>
        old.join("\0") === hiddenKeys.join("\0") ? old : hiddenKeys,
      );
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    observer?.observe(element);
    for (const button of buttons.current.values())
      if (button.parentElement) observer?.observe(button.parentElement);
    element.addEventListener("scroll", measure);
    return () => {
      observer?.disconnect();
      element.removeEventListener("scroll", measure);
    };
  }, [
    active,
    renderedItems,
    vertical,
    rtl,
    indicator?.size,
    indicator?.align,
    onIndicatorSize,
  ]);
  const previousScroll = useRef(0);
  const extra =
    customExtra &&
    typeof customExtra === "object" &&
    !isValidElement(customExtra) &&
    ("left" in customExtra || "right" in customExtra)
      ? (customExtra as { left?: OctaneNode; right?: OctaneNode })
      : { right: customExtra };
  const morePopupStyle = {
    "--ao-dropdown-bg": t.colorBgContainer,
    zIndex: c?.zIndexPopup ?? t.zIndexPopupBase + 50,
  };
  return (
    <div
      ref={node}
      className={[cls("-nav"), className]}
      style={{
        "--ao-tabs-gap":
          tabBarGutter === undefined ? undefined : `${tabBarGutter}px`,
        ...style,
      }}
    >
      {extra.left && <div className={cls("-extra-content")}>{extra.left}</div>}
      <div
        ref={list}
        className={cls("-nav-list")}
        role="tablist"
        aria-orientation={vertical ? "vertical" : "horizontal"}
        onScroll={() => {
          const offset = vertical
            ? (list.current?.scrollTop ?? 0)
            : (list.current?.scrollLeft ?? 0);
          if (offset !== previousScroll.current)
            onTabScroll?.({
              direction: vertical
                ? offset > previousScroll.current
                  ? "bottom"
                  : "top"
                : offset > previousScroll.current
                  ? "right"
                  : "left",
            });
          previousScroll.current = offset;
        }}
        onKeyDown={(event) => {
          const current = (
            event.target as HTMLElement
          ).closest<HTMLButtonElement>('[role="tab"]');
          if (!current) return;
          const enabled = renderedItems.filter((item) => !item.disabled);
          const index = enabled.findIndex(
            (item) => buttons.current.get(item.key) === current,
          );
          const previous = vertical
            ? "ArrowUp"
            : rtl
              ? "ArrowRight"
              : "ArrowLeft";
          const next = vertical
            ? "ArrowDown"
            : rtl
              ? "ArrowLeft"
              : "ArrowRight";
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
          const tabNode = (
            <div
              className={[
                cls("-tab"),
                active === item.key && cls("-tab-active"),
                item.disabled && cls("-tab-disabled"),
              ]}
              key={item.key}
              data-node-key={item.key}
            >
              <button
                ref={(node) => {
                  if (node) buttons.current.set(item.key, node);
                  else buttons.current.delete(item.key);
                }}
                className={cls("-tab-btn")}
                type="button"
                role="tab"
                id={`${keyId}-tab`}
                aria-controls={`${keyId}-panel`}
                aria-selected={active === item.key}
                tabIndex={active === item.key ? 0 : -1}
                disabled={item.disabled}
                onClick={(event) => {
                  onTabClick(item.key, event);
                  event.currentTarget.scrollIntoView?.({
                    block: "nearest",
                    inline: "nearest",
                  });
                }}
              >
                {item.icon && (
                  <span className={cls("-tab-icon")}>{item.icon}</span>
                )}
                {item.label}
              </button>
              {editable &&
                !item.disabled &&
                item.closable !== false &&
                item.closeIcon !== null &&
                item.closeIcon !== false && (
                  <button
                    className={cls("-tab-remove")}
                    type="button"
                    disabled={item.disabled}
                    aria-label={
                      locale?.removeAriaLabel ??
                      `关闭 ${typeof item.label === "string" ? item.label : item.key}`
                    }
                    onClick={(event) => {
                      pendingFocus.current = item.key;
                      editable.onEdit("remove", { key: item.key, event });
                    }}
                  >
                    {item.closeIcon ?? editable.removeIcon ?? <CloseOutlined />}
                  </button>
                )}
            </div>
          );
          return children ? children(tabNode) : tabNode;
        })}
        <div
          className={[
            cls("-ink-bar"),
            animated?.inkBar && cls("-ink-bar-animated"),
          ]}
          style={ink}
          aria-hidden="true"
        />
      </div>
      {editable?.showAdd && (
        <button
          className={cls("-nav-add")}
          type="button"
          aria-label={locale?.addAriaLabel ?? "新增标签页"}
          onClick={(event) => editable.onEdit("add", { event })}
        >
          {editable.addIcon ?? <PlusOutlined />}
        </button>
      )}
      {extra.right && (
        <div className={cls("-extra-content")}>{extra.right}</div>
      )}
      {overflow.length > 0 && (
        <Dropdown
          getPopupContainer={getPopupContainer}
          {...more}
          trigger={
            typeof more?.trigger === "string"
              ? [more.trigger]
              : (more?.trigger ?? ["hover"])
          }
          overlayStyle={{
            ...morePopupStyle,
            ...more?.overlayStyle,
          }}
          overlayClassName={[
            "ant-tabs-dropdown",
            popupClassName,
            more?.overlayClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          menu={{
            items: renderedItems
              .filter((item) => overflow.includes(item.key))
              .map((item) => ({
                key: item.key,
                label: item.label,
                disabled: item.disabled,
              })),
            onClick: ({ key, domEvent }) => {
              onTabClick(key, domEvent);
              buttons.current
                .get(key)
                ?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
            },
          }}
        >
          <button
            className={cls("-nav-more")}
            type="button"
            aria-label={locale?.dropdownAriaLabel ?? "更多"}
          >
            {more?.icon ?? <EllipsisOutlined />}
          </button>
        </Dropdown>
      )}
    </div>
  );
}
