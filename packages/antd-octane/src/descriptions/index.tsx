/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useMemo } from "octane";
import type { Responsive } from "../_util/responsive";
import { responsiveValue, useBreakpoint } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import { DescriptionsContext } from "./DescriptionsContext";
import useItems from "./hooks/useItems";
import useRow from "./hooks/useRow";
import { DescriptionsItemComponent, type DescriptionsItemType } from "./item";
import Row from "./Row";

export type { DescriptionsContextProps } from "./DescriptionsContext";
export { DescriptionsContext } from "./DescriptionsContext";
export type {
  DescriptionsItem,
  DescriptionsItemProps,
  DescriptionsItemType,
} from "./item";

const DEFAULT_COLUMN = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 } as const;
export interface DescriptionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  prefixCls?: string;
  rootClassName?: string;
  items?: DescriptionsItemType[];
  children?: OctaneNode;
  title?: OctaneNode;
  extra?: OctaneNode;
  column?: number | Responsive<number>;
  bordered?: boolean;
  layout?: "horizontal" | "vertical";
  size?: "default" | "middle" | "small";
  colon?: boolean;
  /** @deprecated Please use `styles.label` instead. */
  labelStyle?: CSSProperties;
  /** @deprecated Please use `styles.content` instead. */
  contentStyle?: CSSProperties;
  styles?: Partial<
    Record<
      "root" | "header" | "title" | "extra" | "label" | "content",
      CSSProperties
    >
  >;
  classNames?: Partial<
    Record<"root" | "header" | "title" | "extra" | "label" | "content", string>
  >;
  style?: CSSProperties;
}
function InternalDescriptions(props: DescriptionsProps) {
  const {
    prefixCls,
    items,
    children,
    title,
    extra,
    column,
    bordered = false,
    layout = "horizontal",
    size: sizeProp,
    colon = true,
    labelStyle,
    contentStyle,
    rootClassName,
    styles,
    classNames,
    className,
    style,
    ...rest
  } = props;
  const warning = devUseWarning("Descriptions");
  for (const [oldProp, newProp] of [
    ["labelStyle", "styles={{ label: {} }}"],
    ["contentStyle", "styles={{ content: {} }}"],
  ]) {
    warning.deprecated(!(oldProp in props), oldProp, newProp);
  }
  const screens = useBreakpoint();
  const columns =
    typeof column === "number"
      ? column
      : responsiveValue({ ...DEFAULT_COLUMN, ...column }, screens, 3);
  const renderedItems = useItems(screens, items, children);
  const rows = useRow(columns, renderedItems);
  const { token: t, base } = useComponentTokens("Descriptions");
  const config = useConfig();
  const size =
    sizeProp ??
    (config.componentSize === "large"
      ? "default"
      : (config.componentSize ?? "default"));
  const c = config.theme.components?.Descriptions;
  const prefix = config.getPrefixCls("descriptions", prefixCls);
  const componentConfig = config.descriptions;
  const moduleClass = (
    name: keyof NonNullable<DescriptionsProps["classNames"]>,
  ) => [componentConfig?.classNames?.[name] ?? "", classNames?.[name] ?? ""];
  const moduleStyle = (
    name: keyof NonNullable<DescriptionsProps["styles"]>,
  ) => ({ ...componentConfig?.styles?.[name], ...styles?.[name] });
  const part = (name: string) => [
    `${prefix}-${name}`,
    prefix !== "ant-descriptions" && `ant-descriptions-${name}`,
  ];
  const context = useMemo(
    () => ({
      labelStyle,
      contentStyle,
      styles: { label: moduleStyle("label"), content: moduleStyle("content") },
      classNames: {
        label: moduleClass("label").filter(Boolean).join(" "),
        content: moduleClass("content").filter(Boolean).join(" "),
      },
    }),
    [labelStyle, contentStyle, styles, classNames, componentConfig],
  );
  return (
    <DescriptionsContext value={context}>
      <div
        {...rest}
        className={[
          prefix,
          prefix !== "ant-descriptions" && "ant-descriptions",
          componentConfig?.className,
          bordered && part("bordered"),
          part(layout),
          size !== "default" && part(size),
          className,
          rootClassName,
          moduleClass("root"),
          config.direction === "rtl" && part("rtl"),
        ]}
        style={{
          ...base,
          "--ao-descriptions-title-size": `${t.fontSizeLG}px`,
          "--ao-descriptions-title-line": t.lineHeightLG,
          "--ao-descriptions-label": c?.labelColor ?? t.colorTextTertiary,
          "--ao-descriptions-bordered-label": t.colorTextSecondary,
          "--ao-descriptions-label-bg": c?.labelBg ?? t.colorFillAlter,
          "--ao-descriptions-content": c?.contentColor ?? t.colorText,
          "--ao-descriptions-title": c?.titleColor ?? t.colorText,
          "--ao-descriptions-extra": c?.extraColor ?? t.colorText,
          "--ao-descriptions-title-margin": `${c?.titleMarginBottom ?? t.fontSizeSM * t.lineHeightSM}px`,
          "--ao-descriptions-bottom": `${size === "small" ? t.paddingXS : size === "middle" ? t.paddingSM : (c?.itemPaddingBottom ?? t.padding)}px`,
          "--ao-descriptions-end": `${c?.itemPaddingEnd ?? t.padding}px`,
          "--ao-descriptions-padding":
            size === "small"
              ? `${t.paddingXS}px ${t.padding}px`
              : size === "middle"
                ? `${t.paddingSM}px ${t.paddingLG}px`
                : `${t.padding}px ${t.paddingLG}px`,
          "--ao-descriptions-colon-start": `${c?.colonMarginLeft ?? t.marginXXS / 2}px`,
          "--ao-descriptions-colon-end": `${c?.colonMarginRight ?? t.marginXS}px`,
          "--ao-descriptions-border": t.colorSplit,
          "--ao-descriptions-weight": t.fontWeightStrong,
          "--ao-descriptions-line-width": `${t.lineWidth}px`,
          "--ao-descriptions-line-type": t.lineType,
          "--ao-descriptions-bordered-end": `${size === "small" ? t.padding : t.paddingLG}px`,
          ...componentConfig?.style,
          ...moduleStyle("root"),
          ...style,
        }}
      >
        {(title || extra) && (
          <div
            className={[part("header"), moduleClass("header")]}
            style={moduleStyle("header")}
          >
            {title && (
              <div
                className={[part("title"), moduleClass("title")]}
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
        )}
        <div className={part("view")}>
          <table>
            <tbody>
              {rows.map((row, index) => (
                <Row
                  key={index}
                  prefixCls={prefix}
                  vertical={layout === "vertical"}
                  bordered={bordered}
                  colon={colon}
                  row={row}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DescriptionsContext>
  );
}
export const Descriptions = Object.assign(InternalDescriptions, {
  Item: DescriptionsItemComponent,
});
