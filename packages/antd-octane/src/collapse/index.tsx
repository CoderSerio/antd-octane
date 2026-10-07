/** @jsxImportSource octane */

import type { OctaneNode } from "octane";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useId,
  useState,
} from "octane";
import { useComponentTokens } from "../_util/tokens";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import InternalPanel, {
  CollapsePanel,
  type LegacyPanelProps,
} from "./CollapsePanel";
import type { CollapseProps } from "./interface";
import { collapseClass } from "./util";

export type {
  CollapseExpandIconProps,
  CollapseItem,
  CollapsePanelProps,
  CollapseProps,
  CollapsibleType,
  ExpandIconPosition,
} from "./interface";

const keys = (value: CollapseProps["activeKey"]) =>
  value === undefined
    ? []
    : (Array.isArray(value) ? value : [value]).map(String);
export function Collapse(props: CollapseProps) {
  const {
    items,
    children,
    activeKey,
    defaultActiveKey,
    accordion = false,
    bordered = true,
    ghost = false,
    size: customSize,
    collapsible,
    destroyOnHidden,
    destroyInactivePanel,
    expandIcon,
    expandIconPosition = "start",
    onChange,
    className,
    rootClassName,
    prefixCls,
    style,
    ...rest
  } = props;
  const warning = devUseWarning("Collapse");
  warning(
    expandIconPosition !== "left" && expandIconPosition !== "right",
    "deprecated",
    "`expandIconPosition` with `left` or `right` is deprecated. Please use `start` or `end` instead.",
  );
  warning.deprecated(
    !("destroyInactivePanel" in props),
    "destroyInactivePanel",
    "destroyOnHidden",
  );
  const config = useConfig();
  const mergedPrefixCls = config.getPrefixCls("collapse", prefixCls);
  const componentConfig = config.collapse;
  const mergedExpandIcon = expandIcon ?? componentConfig?.expandIcon;
  const size = customSize ?? config.componentSize ?? "middle";
  const legacyChildren: OctaneNode[] = [];
  const collectChildren = (nodes: OctaneNode) =>
    Children.forEach(nodes, (child) => {
      if (isValidElement(child) && child.type === Fragment) {
        collectChildren(child.children ?? child.props.children);
        return;
      }
      legacyChildren.push(child);
    });
  collectChildren(children);
  const [inner, setInner] = useState(keys(defaultActiveKey));
  const active = activeKey === undefined ? inner : keys(activeKey);
  const selected = accordion ? active.slice(0, 1) : active;
  const id = useId();
  const { token: t, base } = useComponentTokens("Collapse");
  const c = config.theme.components?.Collapse;
  const mergedExpandIconPosition =
    expandIconPosition === "left"
      ? "start"
      : expandIconPosition === "right"
        ? "end"
        : expandIconPosition;
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
      role={accordion ? "tablist" : undefined}
      className={[
        mergedPrefixCls,
        mergedPrefixCls !== "ant-collapse" && "ant-collapse",
        collapseClass(
          mergedPrefixCls,
          `icon-position-${mergedExpandIconPosition}`,
        ),
        !bordered && collapseClass(mergedPrefixCls, "borderless"),
        ghost && collapseClass(mergedPrefixCls, "ghost"),
        size !== "middle" && collapseClass(mergedPrefixCls, size),
        config.direction === "rtl" && collapseClass(mergedPrefixCls, "rtl"),
        componentConfig?.className,
        className,
        rootClassName,
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
        "--ao-collapse-content-padding-sm": `${t.paddingSM}px`,
        "--ao-collapse-content-padding-lg": `${t.paddingLG}px`,
        "--ao-collapse-header-padding-sm": `${t.paddingXS}px ${t.paddingSM}px`,
        "--ao-collapse-header-padding-lg": `${t.padding}px ${t.paddingLG}px`,
        "--ao-collapse-header-start-sm": `${t.paddingXS}px`,
        "--ao-collapse-header-start-lg": `${t.padding}px`,
        "--ao-collapse-icon-height": `${t.fontHeight ?? Math.round(t.fontSize * t.lineHeight)}px`,
        "--ao-collapse-icon-height-lg": `${t.fontHeightLG ?? Math.round(t.fontSizeLG * t.lineHeightLG)}px`,
        "--ao-collapse-icon-gap": `${t.marginSM}px`,
        "--ao-collapse-icon-offset-sm": `${t.paddingSM - t.paddingXS}px`,
        "--ao-collapse-icon-offset-lg": `${t.paddingLG - t.padding}px`,
        "--ao-collapse-icon-size": `${t.fontSizeIcon}px`,
        "--ao-collapse-large-font-size": `${t.fontSizeLG}px`,
        "--ao-collapse-large-line-height": t.lineHeightLG,
        "--ao-collapse-motion": t.motion ? t.motionDurationSlow : "0s",
        "--ao-collapse-disabled": t.colorTextDisabled,
        "--ao-collapse-header-color": t.colorTextHeading,
        "--ao-collapse-content-color": t.colorText,
        "--ao-collapse-ghost-content-padding": `${t.paddingSM}px`,
        "--ao-collapse-line-width": `${t.lineWidth}px`,
        "--ao-collapse-line-type": t.lineType,
        "--ao-collapse-ease": t.motionEaseInOut,
        "--ao-collapse-open-motion": t.motion ? t.motionDurationMid : "0s",
        "--ao-collapse-focus-width": `${t.lineWidthFocus}px`,
        ...componentConfig?.style,
        ...style,
      }}
    >
      {items === undefined
        ? legacyChildren.map((child, index) => {
            if (
              !isValidElement<LegacyPanelProps>(child) ||
              typeof child.type === "string"
            )
              return child;
            const key = String(child.key ?? child.props.key ?? index);
            const mergedCollapsible = child.props.collapsible ?? collapsible;
            return cloneElement(child, {
              key,
              panelKey: key,
              isActive: selected.includes(key),
              prefixCls: mergedPrefixCls,
              accordion,
              expandIcon: mergedExpandIcon,
              collapsible: mergedCollapsible,
              destroyInactivePanel:
                child.props.destroyInactivePanel ??
                destroyOnHidden ??
                destroyInactivePanel ??
                false,
              onItemClick: (value: string) => {
                if (mergedCollapsible === "disabled") return;
                toggle(value);
                child.props.onItemClick?.(value);
              },
            });
          })
        : items.map((item, index) => {
            const key = String(item.key ?? index);
            return (
              <InternalPanel
                key={key}
                item={item}
                panelKey={key}
                panelId={`${id}-${encodeURIComponent(key)}`}
                prefixCls={mergedPrefixCls}
                active={selected.includes(key)}
                accordion={accordion}
                collapsible={item.collapsible ?? collapsible}
                destroy={destroyOnHidden ?? destroyInactivePanel ?? false}
                motionEnabled={t.motion}
                direction={config.direction}
                expandIcon={mergedExpandIcon}
                onItemClick={toggle}
              />
            );
          })}
    </div>
  );
}
Collapse.Panel = CollapsePanel;
