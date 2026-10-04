/** @jsxImportSource octane */
import type {
  CSSProperties,
  ElementDescriptor,
  HTMLAttributes,
  OctaneNode,
  Ref,
} from "octane";
import { Children, isValidElement } from "octane";
import cssSize from "../_util/css-size";
import { useComponentTokens } from "../_util/tokens";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import useVariant from "../form/hooks/useVariants";
import { Skeleton } from "../skeleton";
import { Tabs, type TabsProps } from "../tabs";
import { type CardGridProps, Grid } from "./grid";
import type { CardMetaProps } from "./meta";

export interface CardTabListType {
  key: string;
  /** @deprecated Use `label` instead. */
  tab?: OctaneNode;
  label?: OctaneNode;
  disabled?: boolean;
  closable?: boolean;
  closeIcon?: OctaneNode;
  forceRender?: boolean;
  destroyOnHidden?: boolean;
  icon?: OctaneNode;
  className?: string;
  children?: OctaneNode;
}

export type { CardGridProps, CardMetaProps };

type CardStyleName =
  | "header"
  | "body"
  | "extra"
  | "actions"
  | "title"
  | "cover";

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  ref?: Ref<HTMLDivElement>;
  prefixCls?: string;
  title?: OctaneNode;
  extra?: OctaneNode;
  cover?: OctaneNode;
  actions?: OctaneNode[];
  /** @deprecated Please use `variant` instead. */
  bordered?: boolean;
  hoverable?: boolean;
  size?: "default" | "small";
  loading?: boolean;
  type?: "inner";
  rootClassName?: string;
  tabList?: CardTabListType[];
  tabBarExtraContent?: OctaneNode | { left?: OctaneNode; right?: OctaneNode };
  onTabChange?: (key: string) => void;
  activeTabKey?: string;
  defaultActiveTabKey?: string;
  tabProps?: TabsProps;
  variant?: "borderless" | "outlined";
  style?: CSSProperties;
  /** @deprecated Please use `styles.header` instead. */
  headStyle?: CSSProperties;
  /** @deprecated Please use `styles.body` instead. */
  bodyStyle?: CSSProperties;
  styles?: {
    [name in CardStyleName]?: CSSProperties;
  };
  classNames?: Partial<Record<CardStyleName, string>>;
}
function InternalCard(props: CardProps) {
  const {
    ref,
    prefixCls,
    title,
    extra,
    cover,
    actions,
    bordered,
    hoverable = false,
    size: sizeProp,
    loading = false,
    type,
    tabList,
    tabBarExtraContent,
    onTabChange,
    activeTabKey,
    defaultActiveTabKey,
    tabProps,
    variant,
    children,
    style,
    className,
    headStyle,
    bodyStyle,
    styles,
    classNames,
    rootClassName,
    ...rest
  } = props;
  const warning = devUseWarning("Card");
  for (const [oldProp, newProp] of [
    ["headStyle", "styles.header"],
    ["bodyStyle", "styles.body"],
    ["bordered", "variant"],
  ]) {
    warning.deprecated(!(oldProp in props), oldProp, newProp);
  }
  const { token: t, base } = useComponentTokens("Card");
  const config = useConfig();
  const size = sizeProp ?? config.componentSize ?? "default";
  const c = config.theme.components?.Card;
  const prefix = config.getPrefixCls("card", prefixCls);
  const componentConfig = config.card;
  const moduleClass = (name: CardStyleName) => [
    componentConfig?.classNames?.[name],
    classNames?.[name],
  ];
  const moduleStyle = (name: CardStyleName): CSSProperties => ({
    ...componentConfig?.styles?.[name],
    ...styles?.[name],
  });
  const part = (name: string) => [
    `${prefix}-${name}`,
    prefix !== "ant-card" && `ant-card-${name}`,
  ];
  const small = size === "small";
  const hasGrid = Children.toArray(children).some(
    (child): child is ElementDescriptor<CardGridProps> =>
      isValidElement(child) && child.type === Grid,
  );
  const [mergedVariant] = useVariant("card", variant, bordered);
  const borderedCard = mergedVariant !== "borderless";
  const headerHeight = small
    ? (c?.headerHeightSM ?? t.fontSize * t.lineHeight + t.paddingXS * 2)
    : (c?.headerHeight ?? t.fontSizeLG * t.lineHeightLG + t.padding * 2);
  const headerFontSize = small
    ? (c?.headerFontSizeSM ?? t.fontSize)
    : (c?.headerFontSize ?? t.fontSizeLG);
  const extraTabProps: TabsProps = {
    ...tabProps,
    ...(activeTabKey !== undefined
      ? { activeKey: activeTabKey }
      : { defaultActiveKey: defaultActiveTabKey }),
    tabBarExtraContent,
  };
  return (
    <div
      {...rest}
      className={[
        prefix,
        prefix !== "ant-card" && "ant-card",
        componentConfig?.className,
        loading && part("loading"),
        borderedCard && part("bordered"),
        !borderedCard && part("borderless"),
        hoverable && part("hoverable"),
        hasGrid && part("contain-grid"),
        tabList?.length && part("contain-tabs"),
        part(size),
        type && part(`type-${type}`),
        config.direction === "rtl" && part("rtl"),
        className,
        rootClassName,
      ]}
      ref={ref}
      aria-busy={loading || undefined}
      style={{
        ...base,
        "--ao-card-body-padding": `${small ? (c?.bodyPaddingSM ?? 12) : (c?.bodyPadding ?? t.paddingLG)}px`,
        "--ao-card-grid-padding": `${t.paddingLG}px`,
        "--ao-card-inner-padding": `${t.padding}px`,
        "--ao-card-tabs-margin-bottom": `${c?.tabsMarginBottom ?? -t.padding - t.lineWidth}px`,
        "--ao-card-actions-li-margin":
          c?.actionsLiMargin ?? `${t.paddingSM}px 0`,
        "--ao-card-header-padding": `${small ? (c?.headerPaddingSM ?? 12) : (c?.headerPadding ?? t.paddingLG)}px`,
        "--ao-card-header-height": cssSize(headerHeight),
        "--ao-card-header-size": cssSize(headerFontSize),
        "--ao-card-header-bg": c?.headerBg ?? "transparent",
        "--ao-card-actions-bg": c?.actionsBg ?? t.colorBgContainer,
        "--ao-card-extra": c?.extraColor ?? t.colorText,
        "--ao-card-shadow": t.boxShadowCard,
        "--ao-card-weight": t.fontWeightStrong,
        "--ao-card-inner-bg": t.colorFillAlter,
        "--ao-card-borderless-shadow": t.boxShadowTertiary,
        "--ao-card-head-padding-top": `${t.padding}px`,
        "--ao-card-motion": t.motionDurationMid,
        "--ao-card-meta-gap": `${t.marginXS}px`,
        "--ao-card-meta-margin": `${-t.marginXXS}px 0`,
        "--ao-card-meta-avatar-padding": `${t.padding}px`,
        "--ao-card-meta-title-size": `${t.fontSizeLG}px`,
        "--ao-card-heading-color": t.colorTextHeading,
        "--ao-card-action-width": `${t.fontSize * 2}px`,
        "--ao-card-action-icon-size": `${t.fontSize}px`,
        "--ao-card-action-icon-color": t.colorIcon,
        "--ao-card-font-height": `${t.fontHeight}px`,
        "--ao-card-line-width": `${t.lineWidth}px`,
        "--ao-card-line-type": t.lineType,
        "--ao-card-link": t.colorLink,
        "--ao-card-link-hover": t.colorLinkHover,
        "--ao-card-link-active": t.colorLinkActive,
        "--ao-card-link-disabled": t.colorTextDisabled,
        "--ao-card-link-decoration": t.linkDecoration,
        "--ao-card-link-hover-decoration": t.linkHoverDecoration,
        "--ao-card-link-focus-decoration": t.linkFocusDecoration,
        "--ao-card-link-motion": t.motionDurationSlow,
        ...componentConfig?.style,
        ...style,
      }}
    >
      {(title || extra || tabList) && (
        <div
          className={[part("head"), moduleClass("header")]}
          style={{ ...headStyle, ...moduleStyle("header") }}
        >
          <div className={part("head-wrapper")}>
            {title && (
              <div
                className={[part("head-title"), moduleClass("title")]}
                style={moduleStyle("title")}
              >
                {title}
              </div>
            )}
            {extra && (
              <div
                className={[part("extra"), moduleClass("extra")]}
                style={moduleStyle("extra")}
              >
                {extra}
              </div>
            )}
          </div>
          {tabList ? (
            <Tabs
              size={size === "default" ? "large" : size}
              {...extraTabProps}
              className={[part("head-tabs")]}
              items={tabList.map(({ tab, ...item }) => ({
                label: tab,
                ...item,
              }))}
              onChange={(key) => onTabChange?.(key)}
            />
          ) : null}
        </div>
      )}
      {cover && (
        <div
          className={[part("cover"), moduleClass("cover")]}
          style={moduleStyle("cover")}
        >
          {cover}
        </div>
      )}
      <div
        className={[part("body"), moduleClass("body")]}
        style={{ ...bodyStyle, ...moduleStyle("body") }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        ) : (
          children
        )}
      </div>
      {Boolean(actions?.length) && (
        <ul
          className={[part("actions"), moduleClass("actions")]}
          style={moduleStyle("actions")}
        >
          {actions?.map((item, index) => (
            <li
              key={`action-${index}`}
              style={{ width: `${100 / (actions?.length ?? 1)}%` }}
            >
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default InternalCard;
