/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useEffect, useId, useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface CollapseItem {
  key: string | number;
  label?: OctaneNode;
  children?: OctaneNode;
  extra?: OctaneNode;
  showArrow?: boolean;
  collapsible?: "header" | "icon" | "disabled";
  forceRender?: boolean;
}
export interface CollapseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: CollapseItem[];
  activeKey?: string | number | (string | number)[];
  defaultActiveKey?: string | number | (string | number)[];
  accordion?: boolean;
  bordered?: boolean;
  ghost?: boolean;
  size?: "small" | "middle" | "large";
  collapsible?: "header" | "icon" | "disabled";
  destroyOnHidden?: boolean;
  destroyInactivePanel?: boolean;
  expandIcon?: (props: { isActive: boolean }) => OctaneNode;
  expandIconPosition?: "start" | "end";
  style?: CSSProperties;
  onChange?: (keys: string[]) => void;
}
function Content({
  active,
  forceRender,
  destroy,
  children,
  id,
  labelledBy,
}: {
  active: boolean;
  forceRender?: boolean;
  destroy: boolean;
  children?: OctaneNode;
  id: string;
  labelledBy: string;
}) {
  const [visited, setVisited] = useState(active);
  useEffect(() => {
    if (active) setVisited(true);
  }, [active]);
  return (
    <section
      className="ant-collapse-content"
      id={id}
      aria-labelledby={labelledBy}
      hidden={!active}
    >
      {(active || forceRender || (!destroy && visited)) && (
        <div className="ant-collapse-content-box">{children}</div>
      )}
    </section>
  );
}
const keys = (value: CollapseProps["activeKey"]) =>
  value === undefined
    ? []
    : (Array.isArray(value) ? value : [value]).map(String);
export function Collapse({
  items = [],
  activeKey,
  defaultActiveKey,
  accordion = false,
  bordered = true,
  ghost = false,
  size = "middle",
  collapsible = "header",
  destroyOnHidden,
  destroyInactivePanel,
  expandIcon,
  expandIconPosition = "start",
  onChange,
  className,
  style,
  ...rest
}: CollapseProps) {
  const [inner, setInner] = useState(keys(defaultActiveKey));
  const active = activeKey === undefined ? inner : keys(activeKey);
  const selected = accordion ? active.slice(0, 1) : active;
  const id = useId();
  const { token: t, base } = useComponentTokens("Collapse");
  const c = useConfig().theme.components?.Collapse;
  const toggle = (key: string) => {
    const next = selected.includes(key)
      ? selected.filter((item) => item !== key)
      : accordion
        ? [key]
        : [...selected, key];
    if (activeKey === undefined) setInner(next);
    onChange?.(next);
  };
  return (
    <div
      {...rest}
      className={[
        "ant-collapse",
        !bordered && "ant-collapse-borderless",
        ghost && "ant-collapse-ghost",
        className,
      ]}
      style={{
        ...base,
        "--ao-border": t.colorBorder,
        "--ao-collapse-header-bg": c?.headerBg ?? t.colorFillAlter,
        "--ao-collapse-header-padding":
          c?.headerPadding ??
          (size === "small"
            ? `${t.paddingXS}px ${t.paddingSM}px`
            : size === "large"
              ? `${t.padding}px ${t.paddingLG}px`
              : `${t.paddingSM}px ${t.padding}px`),
        "--ao-collapse-content-bg": c?.contentBg ?? t.colorBgContainer,
        "--ao-collapse-content-padding":
          c?.contentPadding ?? `${t.padding}px 16px`,
        "--ao-collapse-borderless-bg": c?.borderlessContentBg ?? "transparent",
        "--ao-collapse-borderless-padding":
          c?.borderlessContentPadding ??
          `${t.paddingXXS}px 16px ${t.padding}px`,
        ...style,
      }}
    >
      {items.map((item) => {
        const key = String(item.key);
        const open = selected.includes(key);
        const mode = item.collapsible ?? collapsible;
        const disabled = mode === "disabled";
        const panelId = `${id}-${encodeURIComponent(key)}`;
        return (
          <div
            key={key}
            className={[
              "ant-collapse-item",
              open && "ant-collapse-item-active",
              disabled && "ant-collapse-item-disabled",
            ]}
          >
            <div className="ant-collapse-header">
              <button
                id={`${panelId}-header`}
                type="button"
                className={[
                  "ant-collapse-header-button",
                  expandIconPosition === "end" && "ant-collapse-icon-end",
                ]}
                disabled={disabled}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={(event) => {
                  if (
                    mode === "icon" &&
                    event.detail !== 0 &&
                    !(event.target as Element).closest(
                      ".ant-collapse-expand-icon",
                    )
                  )
                    return;
                  toggle(key);
                }}
              >
                {item.showArrow !== false && (
                  <span className="ant-collapse-expand-icon" aria-hidden="true">
                    {expandIcon?.({ isActive: open }) ?? (
                      <span
                        style={{
                          display: "inline-block",
                          transform: open ? "rotate(90deg)" : undefined,
                        }}
                      >
                        ›
                      </span>
                    )}
                  </span>
                )}
                <span className="ant-collapse-header-text">{item.label}</span>
              </button>
              {item.extra !== undefined && (
                <div className="ant-collapse-extra">{item.extra}</div>
              )}
            </div>
            <Content
              active={open}
              forceRender={item.forceRender}
              destroy={destroyOnHidden ?? destroyInactivePanel ?? false}
              id={panelId}
              labelledBy={`${panelId}-header`}
            >
              {item.children}
            </Content>
          </div>
        );
      })}
    </div>
  );
}
