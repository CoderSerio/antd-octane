/** @jsxImportSource octane */
// Ant Design 5.29.3 List/index.tsx (MIT), adapted to Octane.
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import { Fragment, useState } from "octane";
import cssSize from "../_util/css-size";
import { breakpoints, useBreakpoint, useMediaQuery } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { Empty } from "../empty";
import { Row, type RowProps } from "../grid";
import { Pagination, type PaginationProps } from "../pagination";
import { Spin, type SpinProps } from "../spin";
import { ListContext } from "./context";
import { ListItem } from "./Item";

export type { ListConsumerProps } from "./context";
export type { ListItemMetaProps, ListItemProps } from "./Item";

export type ColumnCount = number;
export type ColumnType =
  | "gutter"
  | "column"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl";
export type ListSize = "small" | "default" | "large";
export type ListItemLayout = "horizontal" | "vertical";
export interface ListGridType {
  gutter?: RowProps["gutter"];
  column?: ColumnCount;
  xs?: ColumnCount;
  sm?: ColumnCount;
  md?: ColumnCount;
  lg?: ColumnCount;
  xl?: ColumnCount;
  xxl?: ColumnCount;
}
export interface ListLocale {
  emptyText: OctaneNode;
}

export type ListPaginationPosition = "top" | "bottom" | "both";
export type ListPaginationAlign = "start" | "center" | "end";
export type ListPaginationConfig = PaginationProps & {
  position?: ListPaginationPosition;
  align?: ListPaginationAlign;
};

export interface ListProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "ref"> {
  ref?: Ref<HTMLDivElement>;
  prefixCls?: string;
  children?: OctaneNode;
  dataSource?: T[];
  renderItem?: (item: T, index: number) => OctaneNode;
  rowKey?: keyof T | ((item: T) => string | number);
  header?: OctaneNode;
  footer?: OctaneNode;
  extra?: OctaneNode;
  loadMore?: OctaneNode;
  rootClassName?: string;
  pagination?: false | ListPaginationConfig;
  bordered?: boolean;
  split?: boolean;
  size?: ListSize;
  itemLayout?: ListItemLayout;
  loading?: boolean | SpinProps;
  locale?: ListLocale;
  grid?: ListGridType;
  style?: CSSProperties;
}

function InternalList<T>({
  ref,
  prefixCls,
  dataSource = [],
  renderItem,
  rowKey,
  children,
  header,
  footer,
  loadMore,
  pagination = false,
  bordered = false,
  split = true,
  size: customSize,
  itemLayout,
  loading = false,
  locale,
  grid,
  className,
  rootClassName,
  style,
  ...rest
}: ListProps<T>) {
  const config = useConfig();
  const configSize = config.componentSize;
  const size =
    customSize ??
    (configSize === "middle" ? "default" : configSize) ??
    "default";
  const { token: t, component: c, base } = useComponentTokens("List");
  const prefix = config.getPrefixCls("list", prefixCls);
  const cls = (suffix: string) =>
    prefix === "ant-list"
      ? `ant-list-${suffix}`
      : `${prefix}-${suffix} ant-list-${suffix}`;
  const smallScreen = useMediaQuery(`(max-width: ${t.screenSM}px)`);
  const mediumScreen = useMediaQuery(`(max-width: ${t.screenMD}px)`);
  const needResponsive = Object.keys(grid || {}).some((key) =>
    breakpoints.includes(key as (typeof breakpoints)[number]),
  );
  const screens = useBreakpoint(needResponsive);
  const options = pagination || {};
  const [page, setPage] = useState(options.defaultCurrent ?? 1);
  const [pageSize, setPageSize] = useState(options.defaultPageSize ?? 10);
  const positive = (value: number, fallback: number) =>
    Number.isFinite(value) && value >= 1 ? Math.floor(value) : fallback;
  const sizeValue = positive(options.pageSize ?? pageSize, 10);
  const total = options.total ?? dataSource?.length ?? 0;
  const currentPage = Math.min(
    options.current ?? page,
    Math.ceil(total / sizeValue),
  );
  const start = (currentPage - 1) * sizeValue;
  const visibleData =
    pagination && dataSource.length > start
      ? dataSource.slice(start, start + sizeValue)
      : dataSource;
  const {
    position: paginationPosition = "bottom",
    align: paginationAlign = "end",
    ...paginationOptions
  } = options;
  const pager = () => (
    <div
      className={[
        prefix !== "ant-list" && `${prefix}-pagination`,
        "ant-list-pagination",
      ]}
      style={{
        justifyContent:
          paginationAlign === "start"
            ? "flex-start"
            : paginationAlign === "center"
              ? "center"
              : "flex-end",
      }}
    >
      <Pagination
        {...paginationOptions}
        total={total}
        current={currentPage}
        pageSize={sizeValue}
        onChange={(next, nextSize) => {
          setPage(next);
          setPageSize(nextSize);
          options.onChange?.(next, nextSize);
        }}
        onShowSizeChange={(next, nextSize) => {
          setPage(next);
          setPageSize(nextSize);
          options.onShowSizeChange?.(next, nextSize);
        }}
      />
    </div>
  );

  // Upstream resolves only the highest active breakpoint, then falls back to column.
  const currentBreakpoint = [...breakpoints]
    .reverse()
    .find((breakpoint) => screens[breakpoint]);
  const columnCount =
    grid && ((currentBreakpoint && grid[currentBreakpoint]) || grid.column);
  const colStyle = columnCount
    ? { width: `${100 / columnCount}%`, maxWidth: `${100 / columnCount}%` }
    : undefined;
  const padding =
    size === "small"
      ? (c?.itemPaddingSM ??
        `${t.paddingContentVerticalSM}px ${t.paddingContentHorizontal}px`)
      : size === "large"
        ? (c?.itemPaddingLG ??
          `${t.paddingContentVerticalLG}px ${t.paddingContentHorizontalLG}px`)
        : (c?.itemPadding ?? `${t.paddingContentVertical}px 0`);
  const spinProps =
    typeof loading === "object" ? loading : { spinning: loading };
  const empty = !visibleData?.length && !children && !spinProps.spinning;
  const hasContentAfterItems = !!(loadMore || pagination || footer);
  const renderedItems = visibleData.map((item, index) => {
    const itemKey =
      typeof rowKey === "function"
        ? rowKey(item)
        : rowKey
          ? item[rowKey]
          : (item as { key?: string | number }).key;
    return (
      <Fragment
        key={
          typeof itemKey === "string" || typeof itemKey === "number"
            ? itemKey || `list-item-${index}`
            : `list-item-${index}`
        }
      >
        {renderItem?.(item, index) ?? null}
      </Fragment>
    );
  });
  return (
    <ListContext value={{ grid, itemLayout }}>
      <div
        {...rest}
        ref={ref}
        aria-busy={spinProps.spinning}
        className={[
          prefix !== "ant-list" && prefix,
          "ant-list",
          size === "large" && prefix !== "ant-list" && `${prefix}-lg`,
          size === "small" && prefix !== "ant-list" && `${prefix}-sm`,
          size === "large" && "ant-list-lg",
          size === "small" && "ant-list-sm",
          spinProps.spinning && cls("loading"),
          size !== "default" && "ant-list-sized",
          !!footer && "ant-list-has-footer",
          hasContentAfterItems && cls("something-after-last-item"),
          bordered && cls("bordered"),
          split && cls("split"),
          itemLayout === "vertical" && cls("vertical"),
          grid && cls("grid"),
          config.direction === "rtl" && cls("rtl"),
          smallScreen && "ant-list-screen-sm",
          mediumScreen && "ant-list-screen-md",
          config.list?.className,
          className,
          rootClassName,
        ]}
        style={{
          ...base,
          "--ao-list-padding": padding,
          "--ao-list-loading-height": `${t.controlHeight}px`,
          "--ao-list-head-padding":
            bordered && size !== "default" ? padding : `${t.paddingSM}px 0`,
          "--ao-list-inner-radius": `${Math.max(0, t.borderRadiusLG - t.lineWidth)}px`,
          "--ao-list-inline": `${t.paddingLG}px`,
          "--ao-list-header": c?.headerBg ?? "transparent",
          "--ao-list-footer": c?.footerBg ?? "transparent",
          "--ao-list-empty": cssSize(c?.emptyTextPadding) ?? `${t.padding}px`,
          "--ao-list-avatar": cssSize(c?.avatarMarginRight) ?? `${t.padding}px`,
          "--ao-list-action-start": `${t.marginXXL}px`,
          "--ao-list-action-padding": `${t.paddingXS}px`,
          "--ao-list-meta": cssSize(c?.metaMarginBottom) ?? `${t.padding}px`,
          "--ao-list-title":
            cssSize(c?.titleMarginBottom) ?? `${t.paddingSM}px`,
          "--ao-list-description":
            cssSize(c?.descriptionFontSize) ?? `${t.fontSize}px`,
          "--ao-list-heading": t.colorText,
          "--ao-list-text-description": t.colorTextDescription,
          "--ao-list-text-disabled": t.colorTextDisabled,
          "--ao-list-title-margin": `${t.marginXXS}px`,
          "--ao-list-action-split-height": `${(t.fontHeight ?? Math.round(t.fontSize * t.lineHeight)) - t.marginXXS * 2}px`,
          "--ao-list-action-vertical-padding": `${t.padding}px`,
          "--ao-list-margin-lg": `${t.marginLG}px`,
          "--ao-list-margin": `${t.margin}px`,
          "--ao-list-line-width": `${t.lineWidth}px`,
          "--ao-list-line-type": t.lineType,
          "--ao-list-border-radius": `${t.borderRadiusLG}px`,
          "--ao-list-line-lg": t.lineHeightLG,
          "--ao-list-content-width": cssSize(c?.contentWidth) ?? "220px",
          "--ao-list-heading-size": `${t.fontSizeLG}px`,
          "--ao-list-border": t.colorBorder,
          "--ao-list-split": t.colorSplit,
          ...config.list?.style,
          ...style,
        }}
      >
        {pagination && paginationPosition !== "bottom" && pager()}
        {!!header && (
          <div
            className={[
              prefix !== "ant-list" && `${prefix}-header`,
              "ant-list-header",
            ]}
          >
            {header}
          </div>
        )}
        <Spin {...spinProps}>
          {empty ? (
            <div
              className={[
                prefix !== "ant-list" && `${prefix}-empty-text`,
                "ant-list-empty-text",
              ]}
            >
              {locale?.emptyText || config.renderEmpty?.("List") || (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          ) : visibleData?.length ? (
            grid ? (
              <Row
                gutter={grid.gutter}
                style={{ fontFamily: "inherit", fontSize: "inherit" }}
              >
                {renderedItems.map((item, index) => (
                  <div key={item.key ?? `list-item-${index}`} style={colStyle}>
                    {item}
                  </div>
                ))}
              </Row>
            ) : (
              <ul
                className={[
                  prefix !== "ant-list" && `${prefix}-items`,
                  "ant-list-items",
                ]}
              >
                {renderedItems}
              </ul>
            )
          ) : spinProps.spinning ? (
            <div style={{ minHeight: 53 }} />
          ) : null}
          {children}
        </Spin>
        {!!footer && (
          <div
            className={[
              prefix !== "ant-list" && `${prefix}-footer`,
              "ant-list-footer",
            ]}
          >
            {footer}
          </div>
        )}
        {loadMore || (pagination && paginationPosition !== "top" && pager())}
      </div>
    </ListContext>
  );
}
export const List = Object.assign(InternalList, {
  Item: ListItem,
});
