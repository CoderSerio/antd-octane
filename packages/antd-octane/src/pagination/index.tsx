/** @jsxImportSource octane */
import type {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  OctaneNode,
} from "octane";
import { cloneElement, isValidElement, useState } from "octane";
import { componentClassName } from "../_util/componentClassName";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "../_util/layout-icons";
import { useBreakpoint } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { type Locale, useLocale } from "../locale";
import { Select, type SelectProps } from "../select";
export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "defaultValue"> {
  total?: number;
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  disabled?: boolean;
  size?: "default" | "small";
  align?: "start" | "center" | "end";
  prefixCls?: string;
  rootClassName?: string;
  responsive?: boolean;
  showTitle?: boolean;
  totalBoundaryShowSizeChanger?: number;
  simple?: boolean | { readOnly?: boolean };
  hideOnSinglePage?: boolean;
  showSizeChanger?: boolean | SelectProps;
  pageSizeOptions?: (number | string)[];
  showQuickJumper?: boolean | { goButton?: OctaneNode };
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
  size: customSize,
  align,
  prefixCls: customPrefix,
  rootClassName,
  responsive = false,
  showTitle = true,
  totalBoundaryShowSizeChanger = 50,
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
  const screens = useBreakpoint(responsive);
  const mergedSize = customSize ?? config.componentSize;
  const small =
    mergedSize === "small" ||
    (!mergedSize && responsive && screens.xs === true);
  const prefixCls = config.getPrefixCls("pagination", customPrefix);
  const cls = (suffix = "") =>
    componentClassName("ant-pagination", prefixCls, suffix);
  const disabled = customDisabled ?? config.componentDisabled ?? false;
  const [contextLocale] = useLocale("Pagination");
  const locale = { ...contextLocale, ...customLocale };
  const sizeChanger = showSizeChanger ?? config.pagination?.showSizeChanger;
  const selectProps = typeof sizeChanger === "object" ? sizeChanger : undefined;
  const goButton =
    typeof showQuickJumper === "object" && showQuickJumper.goButton;
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
    onShowSizeChange?.(page, nextSize);
    onChange?.(nextPage, nextSize);
  };
  const submitJump = () => {
    if (/^\d+$/.test(jump ?? "")) change(Number(jump));
    setJump(undefined);
  };
  const radius = showLessItems ? 1 : 2;
  let start = Math.max(1, page - radius);
  let end = Math.min(page + radius, pages);
  if (page - 1 <= radius) end = Math.min(pages, 1 + radius * 2);
  if (pages - page <= radius) start = Math.max(1, pages - radius * 2);
  const jumpPrev =
    pages > radius * 2 + 3 && page - 1 >= radius * 2 && page !== 3;
  const jumpNext =
    pages > radius * 2 + 3 && pages - page >= radius * 2 && page !== pages - 2;
  const visible: (number | "jump-prev" | "jump-next")[] =
    pages <= radius * 2 + 3
      ? Array.from({ length: pages }, (_, index) => index + 1)
      : [
          ...(start !== 1 ? [1] : []),
          ...(jumpPrev ? ["jump-prev" as const] : []),
          ...Array.from(
            { length: end - start + 1 },
            (_, index) => start + index,
          ),
          ...(jumpNext ? ["jump-next" as const] : []),
          ...(end !== pages ? [pages] : []),
        ];
  const jumpLabel = (kind: "jump-prev" | "jump-next") =>
    kind === "jump-prev"
      ? showLessItems
        ? locale.prev_3
        : locale.prev_5
      : showLessItems
        ? locale.next_3
        : locale.next_5;
  const renderButton = (
    number: number,
    kind: "page" | "prev" | "next" | "jump-prev" | "jump-next",
    label: OctaneNode,
    isDisabled = false,
  ) => {
    const original = (
      <button
        type="button"
        className={cls("-item-link")}
        disabled={disabled || isDisabled}
        aria-current={kind === "page" && number === page ? "page" : undefined}
        aria-label={
          kind === "page"
            ? `第 ${number} 页`
            : kind === "prev"
              ? locale.prev_page
              : kind === "next"
                ? locale.next_page
                : jumpLabel(kind)
        }
        title={
          showTitle
            ? kind === "page"
              ? String(number)
              : kind === "prev"
                ? locale.prev_page
                : kind === "next"
                  ? locale.next_page
                  : jumpLabel(kind)
            : undefined
        }
        onClick={() => change(number)}
      >
        {label}
      </button>
    );
    if (!itemRender) return original;
    const rendered = itemRender(number, kind, original);
    if (rendered === original) return original;
    if (!isValidElement<HTMLAttributes<HTMLElement>>(rendered)) {
      return rendered == null || rendered === false
        ? rendered
        : cloneElement(original, { children: rendered });
    }
    const blocked = disabled || isDisabled;
    return cloneElement(rendered, {
      className: [cls("-item-link"), rendered.props.className],
      disabled: blocked,
      "aria-disabled": blocked || undefined,
      "aria-current": kind === "page" && number === page ? "page" : undefined,
      tabIndex: blocked ? -1 : (rendered.props.tabIndex ?? 0),
      onClick: (event: MouseEvent<HTMLElement>) => {
        if (blocked) {
          event.preventDefault();
          return;
        }
        if (rendered.props.onClick !== original.props.onClick)
          rendered.props.onClick?.(event);
        change(number);
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        rendered.props.onKeyDown?.(event);
        if (
          rendered.type !== "button" &&
          !event.defaultPrevented &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          if (!blocked) change(number);
        }
      },
    });
  };
  const renderGoButton = () => {
    if (isValidElement<HTMLAttributes<HTMLElement>>(goButton)) {
      return cloneElement(goButton, {
        disabled,
        onClick: (event: MouseEvent<HTMLElement>) => {
          goButton.props.onClick?.(event);
          if (!disabled) submitJump();
        },
      });
    }
    return (
      <button type="button" disabled={disabled} onClick={submitJump}>
        {goButton === true ? locale.jump_to_confirm : goButton}
      </button>
    );
  };
  if (hideOnSinglePage && pages <= 1) return null;
  const suppliedOptions = pageSizeOptions.map((n) => positive(Number(n), 10));
  const options = suppliedOptions.includes(perPage)
    ? suppliedOptions
    : [...suppliedOptions, perPage].sort((a, b) => a - b);
  return (
    <nav
      {...rest}
      aria-label={rest["aria-label"] ?? "分页"}
      className={[
        cls(),
        small && cls("-mini"),
        align && cls(`-${align}`),
        disabled && cls("-disabled"),
        config.direction === "rtl" && cls("-rtl"),
        !!simple && cls("-simple"),
        config.pagination?.className,
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        "--ao-pagination-radius": `${t.borderRadius}px`,
        "--ao-pagination-size": `${small ? (c?.itemSizeSM ?? t.controlHeightSM) : (c?.itemSize ?? t.controlHeight)}px`,
        "--ao-pagination-normal-size": `${c?.itemSize ?? t.controlHeight}px`,
        "--ao-pagination-measure-padding": `${(small ? (t.controlPaddingHorizontalSM ?? 8) : (t.controlPaddingHorizontal ?? 12)) - t.lineWidth}px`,
        "--ao-pagination-measure-arrow": `${small ? t.fontSize * 1.5 : Math.ceil(t.fontSize * 1.25)}px`,
        "--ao-pagination-slash-margin": `${t.marginSM}px`,
        "--ao-pagination-bg": c?.itemBg ?? t.colorBgContainer,
        "--ao-pagination-active-bg": c?.itemActiveBg ?? t.colorBgContainer,
        "--ao-pagination-disabled": t.colorTextDisabled,
        "--ao-pagination-disabled-bg": t.controlItemBgActiveDisabled,
        "--ao-pagination-hover": t.colorBgTextHover,
        "--ao-pagination-link": t.colorLink,
        "--ao-pagination-link-hover": t.colorLinkHover,
        "--ao-pagination-input-border": t.colorBorder,
        "--ao-pagination-gap": `${t.marginXS}px`,
        "--ao-pagination-item-padding": `${t.marginXXS * 1.5}px`,
        direction: config.direction,
        ...config.pagination?.style,
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
          {renderButton(
            page - 1,
            "prev",
            config.direction === "rtl" ? <RightOutlined /> : <LeftOutlined />,
            page === 1,
          )}
        </li>
        {simple ? (
          <li className="ant-pagination-simple-pager">
            {typeof simple === "object" && simple.readOnly ? (
              <span>{page}</span>
            ) : (
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
            )}
            <span className="ant-pagination-slash">/</span>
            {pages}
          </li>
        ) : (
          visible.map((number) =>
            typeof number === "string" ? (
              <li
                key={number}
                className={[cls(`-${number}`), "ant-pagination-jump"]}
              >
                {renderButton(
                  number === "jump-next"
                    ? Math.min(pages, page + radius * 2 + 1)
                    : Math.max(1, page - radius * 2 - 1),
                  number,
                  <span className="ant-pagination-item-container">
                    <span className="ant-pagination-item-ellipsis">•••</span>
                    <span className="ant-pagination-item-link-icon">
                      {(number === "jump-next") !==
                      (config.direction === "rtl") ? (
                        <DoubleRightOutlined />
                      ) : (
                        <DoubleLeftOutlined />
                      )}
                    </span>
                  </span>,
                )}
              </li>
            ) : (
              <li
                key={number}
                className={[
                  cls("-item"),
                  number === page && count > 0 && cls("-item-active"),
                  jumpPrev && number === start && cls("-item-after-jump-prev"),
                  jumpNext && number === end && cls("-item-before-jump-next"),
                  count === 0 && cls("-item-disabled"),
                ]}
              >
                {renderButton(number, "page", number, count === 0)}
              </li>
            ),
          )
        )}
        <li className="ant-pagination-next">
          {renderButton(
            page + 1,
            "next",
            config.direction === "rtl" ? <LeftOutlined /> : <RightOutlined />,
            page === pages,
          )}
        </li>
        {simple && goButton && (
          <li className={cls("-simple-pager")}>{renderGoButton()}</li>
        )}
        {(sizeChanger ?? count > totalBoundaryShowSizeChanger) && (
          <li className="ant-pagination-options">
            <span
              className="ant-pagination-size-changer-wrap"
              style={{ width: selectProps?.style?.width }}
            >
              <span
                aria-hidden="true"
                className="ant-pagination-size-changer-measure"
              >{`${perPage} ${locale.items_per_page}`}</span>
              <Select
                disabled={disabled}
                showSearch
                popupMatchSelectWidth={false}
                getPopupContainer={(trigger) =>
                  trigger.parentElement ?? document.body
                }
                aria-label="每页条数"
                options={options.map((option) => ({
                  value: option,
                  label: `${option} ${locale.items_per_page}`,
                }))}
                {...selectProps}
                value={perPage}
                onChange={(next, option) => {
                  if (next === undefined) return;
                  changeSize(Number(next));
                  selectProps?.onChange?.(next, option);
                }}
                size={small ? "small" : "middle"}
                className={[cls("-size-changer"), selectProps?.className]
                  .filter(Boolean)
                  .join(" ")}
                style={{ width: "100%", minWidth: 0, ...selectProps?.style }}
              />
            </span>
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
              onBlur={(event) => {
                if (goButton) return;
                const related = event.relatedTarget;
                if (
                  related instanceof Element &&
                  related.closest(`.${prefixCls}-item-link, .${prefixCls}-item`)
                ) {
                  setJump(undefined);
                  return;
                }
                submitJump();
              }}
            />{" "}
            {locale.page}
            {goButton && renderGoButton()}
          </li>
        )}
      </ul>
    </nav>
  );
}
