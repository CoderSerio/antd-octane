/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useState } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { type Locale, useLocale } from "../locale";
export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "defaultValue"> {
  total?: number;
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  disabled?: boolean;
  size?: "default" | "small";
  simple?: boolean;
  hideOnSinglePage?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: (number | string)[];
  showQuickJumper?: boolean;
  showLessItems?: boolean;
  showTotal?: (total: number, range: [number, number]) => OctaneNode;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  itemRender?: (
    page: number,
    type: "page" | "prev" | "next" | "jump-prev" | "jump-next",
    originalElement: OctaneNode,
  ) => OctaneNode;
  style?: CSSProperties;
  locale?: Locale["Pagination"];
}
const positive = (n: number | undefined, fallback: number) =>
  Number.isFinite(n) && (n as number) > 0
    ? Math.floor(n as number) || fallback
    : fallback;
export function Pagination({
  total = 0,
  current,
  defaultCurrent = 1,
  pageSize,
  defaultPageSize = 10,
  disabled: customDisabled,
  size = "default",
  simple = false,
  hideOnSinglePage = false,
  showSizeChanger,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showLessItems = false,
  showTotal,
  onChange,
  onShowSizeChange,
  itemRender,
  className,
  style,
  locale: customLocale,
  ...rest
}: PaginationProps) {
  const { token: t, component: c, base } = useComponentTokens("Pagination");
  const config = useConfig();
  const disabled = customDisabled ?? config.componentDisabled ?? false;
  const [contextLocale] = useLocale("Pagination");
  const locale = { ...contextLocale, ...customLocale };
  const [inner, setInner] = useState(defaultCurrent);
  const [innerSize, setInnerSize] = useState(defaultPageSize);
  const [jump, setJump] = useState<string>();
  const count = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const perPage = positive(pageSize ?? innerSize, 10);
  const pages = Math.max(1, Math.ceil(count / perPage));
  const page = Math.min(pages, positive(current ?? inner, 1));
  const change = (next: number) => {
    if (disabled) return;
    const nextPage = Math.max(1, Math.min(pages, positive(next, page)));
    if (nextPage === page) return;
    if (current === undefined) setInner(nextPage);
    onChange?.(nextPage, perPage);
  };
  const changeSize = (next: number) => {
    if (disabled) return;
    const nextSize = positive(next, perPage);
    const nextPage = Math.min(page, Math.max(1, Math.ceil(count / nextSize)));
    if (pageSize === undefined) setInnerSize(nextSize);
    if (current === undefined) setInner(nextPage);
    onShowSizeChange?.(nextPage, nextSize);
    onChange?.(nextPage, nextSize);
  };
  const submitJump = () => {
    if (/^\d+$/.test(jump ?? "")) change(Number(jump));
    setJump(undefined);
  };
  const radius = showLessItems ? 1 : 2;
  const start = Math.max(2, Math.min(page - radius, pages - 2 * radius));
  const end = Math.min(pages - 1, Math.max(page + radius, 2 * radius + 1));
  const visible = [
    1,
    ...Array.from(
      { length: Math.max(0, end - start + 1) },
      (_, i) => start + i,
    ),
    ...(pages > 1 ? [pages] : []),
  ];
  const renderButton = (
    number: number,
    kind: "page" | "prev" | "next" | "jump-prev" | "jump-next",
    label: OctaneNode,
    isDisabled = false,
  ) => (
    <button
      type="button"
      disabled={disabled || isDisabled}
      aria-current={kind === "page" && number === page ? "page" : undefined}
      aria-label={
        kind === "page"
          ? `第 ${number} 页`
          : kind === "prev"
            ? locale.prev_page
            : kind === "next"
              ? locale.next_page
              : kind === "jump-prev"
                ? locale.prev_5
                : locale.next_5
      }
      onClick={() => change(number)}
    >
      {itemRender ? itemRender(number, kind, <span>{label}</span>) : label}
    </button>
  );
  if (hideOnSinglePage && pages <= 1) return null;
  const options = [
    ...new Set([
      ...pageSizeOptions.map((n) => positive(Number(n), 10)),
      perPage,
    ]),
  ].sort((a, b) => a - b);
  return (
    <nav
      {...rest}
      aria-label={rest["aria-label"] ?? "分页"}
      className={[
        "ant-pagination",
        size === "small" && "ant-pagination-mini",
        disabled && "ant-pagination-disabled",
        className,
      ]}
      style={{
        ...base,
        "--ao-pagination-radius": `${t.borderRadius}px`,
        "--ao-pagination-size": `${size === "small" ? (c?.itemSizeSM ?? t.controlHeightSM) : (c?.itemSize ?? t.controlHeight)}px`,
        "--ao-pagination-bg": c?.itemBg ?? t.colorBgContainer,
        "--ao-pagination-active-bg": c?.itemActiveBg ?? t.colorBgContainer,
        "--ao-pagination-disabled": t.colorTextDisabled,
        "--ao-pagination-disabled-bg": t.colorBgContainerDisabled,
        "--ao-pagination-hover": t.colorBgTextHover,
        "--ao-pagination-gap": `${t.marginXS}px`,
        "--ao-pagination-item-padding": `${t.marginXXS * 1.5}px`,
        ...style,
      }}
    >
      <ul>
        {showTotal && (
          <li className="ant-pagination-total-text">
            {showTotal(count, [
              count ? (page - 1) * perPage + 1 : 0,
              Math.min(page * perPage, count),
            ])}
          </li>
        )}
        <li className="ant-pagination-prev">
          {renderButton(page - 1, "prev", "‹", page === 1)}
        </li>
        {simple ? (
          <li className="ant-pagination-simple-pager">
            <input
              aria-label="页码"
              disabled={disabled}
              value={jump ?? String(page)}
              inputMode="numeric"
              onInput={(event) =>
                setJump((event.target as HTMLInputElement).value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") submitJump();
              }}
              onBlur={submitJump}
            />
            <span>/ {pages}</span>
          </li>
        ) : (
          visible.map((number, index) => (
            <li key={number} className="ant-pagination-entry">
              {index > 0 && number - visible[index - 1] > 1 && (
                <span className="ant-pagination-jump">
                  {renderButton(
                    number === pages
                      ? page + radius * 2 + 1
                      : page - radius * 2 - 1,
                    number === pages ? "jump-next" : "jump-prev",
                    "•••",
                  )}
                </span>
              )}
              <span
                className={[
                  "ant-pagination-item",
                  number === page && "ant-pagination-item-active",
                ]}
              >
                {renderButton(number, "page", number)}
              </span>
            </li>
          ))
        )}
        <li className="ant-pagination-next">
          {renderButton(page + 1, "next", "›", page === pages)}
        </li>
        {(showSizeChanger ?? count > 50) && (
          <li className="ant-pagination-options">
            <select
              disabled={disabled}
              aria-label="每页条数"
              value={perPage}
              onChange={(event) =>
                changeSize(Number((event.target as HTMLSelectElement).value))
              }
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                  {locale.items_per_page}
                </option>
              ))}
            </select>
          </li>
        )}
        {showQuickJumper && !simple && (
          <li className="ant-pagination-options-quick-jumper">
            {locale.jump_to}{" "}
            <input
              aria-label="跳转页码"
              disabled={disabled}
              value={jump ?? ""}
              inputMode="numeric"
              onInput={(event) =>
                setJump((event.target as HTMLInputElement).value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") submitJump();
              }}
              onBlur={submitJump}
            />{" "}
            {locale.page}
          </li>
        )}
      </ul>
    </nav>
  );
}
