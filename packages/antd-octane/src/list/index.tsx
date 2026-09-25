import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { Fragment, useState } from "octane";
import type { Breakpoint } from "../_util/responsive";
import { responsiveValue, useBreakpoint } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { Empty } from "../empty";
import { Pagination, type PaginationProps } from "../pagination";
import { Spin, type SpinProps } from "../spin";
export interface ListProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: OctaneNode;
  dataSource?: T[];
  renderItem?: (item: T, index: number) => OctaneNode;
  rowKey?: keyof T | ((item: T) => string | number);
  header?: OctaneNode;
  footer?: OctaneNode;
  loadMore?: OctaneNode;
  pagination?:
    | false
    | (PaginationProps & { position?: "top" | "bottom" | "both" });
  bordered?: boolean;
  split?: boolean;
  size?: "small" | "default" | "large";
  itemLayout?: "horizontal" | "vertical";
  loading?: boolean | SpinProps;
  locale?: { emptyText?: OctaneNode };
  grid?: { gutter?: number; column?: number } & Partial<
    Record<Breakpoint, number>
  >;
  style?: CSSProperties;
}
function InternalList<T>({
  dataSource,
  renderItem,
  rowKey,
  children,
  header,
  footer,
  loadMore,
  pagination = false,
  bordered = false,
  split = true,
  size = "default",
  itemLayout = "horizontal",
  loading = false,
  locale,
  grid,
  className,
  style,
  ...rest
}: ListProps<T>) {
  const { token: t, component: c, base } = useComponentTokens("List");
  const screens = useBreakpoint(!!grid);
  const options = pagination || {};
  const [page, setPage] = useState(options.defaultCurrent ?? 1);
  const [pageSize, setPageSize] = useState(options.defaultPageSize ?? 10);
  const positive = (value: number, fallback: number) =>
    Number.isFinite(value) && value >= 1 ? Math.floor(value) : fallback;
  const sizeValue = positive(options.pageSize ?? pageSize, 10);
  const total = options.total ?? dataSource?.length ?? 0;
  const currentPage = Math.min(
    positive(options.current ?? page, 1),
    Math.max(1, Math.ceil(total / sizeValue)),
  );
  const visibleData =
    pagination && dataSource && dataSource.length > sizeValue
      ? dataSource.slice((currentPage - 1) * sizeValue, currentPage * sizeValue)
      : dataSource;
  const { position: paginationPosition = "bottom", ...paginationOptions } =
    options;
  const pager = () => (
    <div className="ant-list-pagination">
      <Pagination
        {...paginationOptions}
        total={total}
        current={currentPage}
        pageSize={sizeValue}
        onChange={(next, nextSize) => {
          if (options.current === undefined) setPage(next);
          if (options.pageSize === undefined) setPageSize(nextSize);
          options.onChange?.(next, nextSize);
        }}
      />
    </div>
  );

  const columns = Math.max(
    1,
    grid
      ? responsiveValue<number>(
          Object.fromEntries(
            Object.entries(grid).filter(
              ([key]) => key !== "gutter" && key !== "column",
            ),
          ),
          screens,
          grid.column ?? 1,
        )
      : 1,
  );
  const padding =
    size === "small"
      ? (c?.itemPaddingSM ??
        `${t.paddingContentVerticalSM}px ${t.paddingContentHorizontal}px`)
      : size === "large"
        ? (c?.itemPaddingLG ??
          `${t.paddingContentVerticalLG}px ${t.paddingContentHorizontalLG}px`)
        : (c?.itemPadding ?? `${t.paddingContentVertical}px 0`);
  const spinProps =
    typeof loading === "object"
      ? { spinning: true, ...loading }
      : { spinning: loading };
  const empty = dataSource
    ? dataSource.length === 0
    : children === undefined || children === null;
  return (
    <div
      {...rest}
      aria-busy={spinProps.spinning}
      className={[
        "ant-list",
        spinProps.spinning && "ant-list-loading",
        size !== "default" && "ant-list-sized",
        footer !== undefined && "ant-list-has-footer",
        bordered && "ant-list-bordered",
        split && "ant-list-split",
        itemLayout === "vertical" && "ant-list-vertical",
        grid && "ant-list-grid",
        className,
      ]}
      style={{
        ...base,
        "--ao-list-padding": padding,
        "--ao-list-loading-height": `${t.controlHeight}px`,
        "--ao-list-head-padding":
          size === "default" ? `${t.paddingSM}px 0` : padding,
        "--ao-list-inner-radius": `${Math.max(0, t.borderRadiusLG - t.lineWidth)}px`,
        "--ao-list-inline": `${t.paddingLG}px`,
        "--ao-list-header": c?.headerBg ?? "transparent",
        "--ao-list-footer": c?.footerBg ?? "transparent",
        "--ao-list-empty": `${c?.emptyTextPadding ?? t.padding}px`,
        "--ao-list-avatar": `${c?.avatarMarginRight ?? t.padding}px`,
        "--ao-list-meta": `${c?.metaMarginBottom ?? t.padding}px`,
        "--ao-list-title": `${c?.titleMarginBottom ?? t.paddingSM}px`,
        "--ao-list-description": `${c?.descriptionFontSize ?? t.fontSize}px`,
        "--ao-list-heading": t.colorTextHeading,
        "--ao-list-content-width": `${c?.contentWidth ?? 220}px`,
        "--ao-list-heading-size": `${t.fontSizeLG}px`,
        "--ao-list-border": t.colorBorder,
        "--ao-list-gutter": `${grid?.gutter ?? 0}px`,
        "--ao-list-columns": columns,
        ...style,
      }}
    >
      {header !== undefined && <div className="ant-list-header">{header}</div>}
      {pagination && paginationPosition !== "bottom" && pager()}
      <Spin {...spinProps}>
        {empty ? (
          !spinProps.spinning && (
            <div className="ant-list-empty-text">
              {locale?.emptyText ?? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          )
        ) : (
          <ul className="ant-list-items">
            {visibleData
              ? visibleData.map((item, index) => (
                  <Fragment
                    key={
                      typeof rowKey === "function"
                        ? rowKey(item)
                        : rowKey
                          ? String(item[rowKey])
                          : index
                    }
                  >
                    {renderItem ? (
                      renderItem(item, index)
                    ) : (
                      <Item>{String(item)}</Item>
                    )}
                  </Fragment>
                ))
              : children}
          </ul>
        )}
      </Spin>
      {loadMore}
      {pagination && paginationPosition !== "top" && pager()}
      {footer !== undefined && <div className="ant-list-footer">{footer}</div>}
    </div>
  );
}
export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  actions?: OctaneNode[];
  extra?: OctaneNode;
  style?: CSSProperties;
}
function Item({ actions, extra, children, className, ...rest }: ListItemProps) {
  return (
    <li {...rest} className={["ant-list-item", className]}>
      <div className="ant-list-item-main">{children}</div>
      {actions?.length ? (
        <ul className="ant-list-item-action">
          {actions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ul>
      ) : null}
      {extra !== undefined && (
        <div className="ant-list-item-extra">{extra}</div>
      )}
    </li>
  );
}
export interface ListItemMetaProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  avatar?: OctaneNode;
  title?: OctaneNode;
  description?: OctaneNode;
}
function Meta({
  avatar,
  title,
  description,
  className,
  ...rest
}: ListItemMetaProps) {
  return (
    <div {...rest} className={["ant-list-item-meta", className]}>
      {avatar !== undefined && (
        <div className="ant-list-item-meta-avatar">{avatar}</div>
      )}
      <div className="ant-list-item-meta-content">
        {title !== undefined && (
          <h4 className="ant-list-item-meta-title">{title}</h4>
        )}
        {description !== undefined && (
          <div className="ant-list-item-meta-description">{description}</div>
        )}
      </div>
    </div>
  );
}
export const List = Object.assign(InternalList, {
  Item: Object.assign(Item, { Meta }),
});
