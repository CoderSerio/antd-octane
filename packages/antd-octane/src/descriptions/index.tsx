import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { Fragment } from "octane";
import type { Responsive } from "../_util/responsive";
import { responsiveValue, useBreakpoint } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface DescriptionsItem {
  key?: string | number;
  label?: OctaneNode;
  children?: OctaneNode;
  span?: number | "filled";
}
export interface DescriptionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  items?: DescriptionsItem[];
  title?: OctaneNode;
  extra?: OctaneNode;
  column?: number | Responsive<number>;
  bordered?: boolean;
  layout?: "horizontal" | "vertical";
  size?: "default" | "middle" | "small";
  colon?: boolean;
  labelStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  style?: CSSProperties;
}
export function Descriptions({
  items = [],
  title,
  extra,
  column = 3,
  bordered = false,
  layout = "horizontal",
  size = "default",
  colon = true,
  labelStyle,
  contentStyle,
  className,
  style,
  ...rest
}: DescriptionsProps) {
  const screens = useBreakpoint(typeof column === "object");
  const columns = Math.max(1, Math.floor(responsiveValue(column, screens, 3)));
  const rows: { item: DescriptionsItem; span: number; index: number }[][] = [];
  let row: (typeof rows)[number] = [];
  let occupied = 0;
  items.forEach((item, index) => {
    const requested =
      item.span === "filled" ? columns - occupied : Math.max(1, item.span ?? 1);
    const span = Math.min(columns - occupied, requested);
    row.push({ item, span, index });
    occupied += span;
    if (occupied >= columns || index === items.length - 1) {
      if (index === items.length - 1 && occupied < columns)
        row[row.length - 1].span += columns - occupied;
      rows.push(row);
      row = [];
      occupied = 0;
    }
  });
  const { token: t, base } = useComponentTokens("Descriptions");
  const c = useConfig().theme.components?.Descriptions;
  return (
    <div
      {...rest}
      className={[
        "ant-descriptions",
        bordered && "ant-descriptions-bordered",
        `ant-descriptions-${layout}`,
        className,
      ]}
      style={{
        ...base,
        "--ao-descriptions-title-size": `${t.fontSizeLG}px`,
        "--ao-descriptions-title-line": t.lineHeightLG,
        "--ao-descriptions-label": bordered
          ? t.colorTextSecondary
          : (c?.labelColor ?? t.colorTextTertiary),
        "--ao-descriptions-label-bg": c?.labelBg ?? t.colorFillAlter,
        "--ao-descriptions-content": c?.contentColor ?? t.colorText,
        "--ao-descriptions-title": c?.titleColor ?? t.colorText,
        "--ao-descriptions-title-margin": `${c?.titleMarginBottom ?? t.fontSizeSM * t.lineHeightSM}px`,
        "--ao-descriptions-bottom": `${c?.itemPaddingBottom ?? (size === "small" ? t.paddingXS : size === "middle" ? t.paddingSM : t.padding)}px`,
        "--ao-descriptions-end": `${c?.itemPaddingEnd ?? t.padding}px`,
        "--ao-descriptions-padding":
          size === "small"
            ? `${t.paddingXS}px ${t.padding}px`
            : size === "middle"
              ? `${t.paddingSM}px ${t.paddingLG}px`
              : `${t.padding}px ${t.paddingLG}px`,
        ...style,
      }}
    >
      {(title !== undefined || extra !== undefined) && (
        <div className="ant-descriptions-header">
          <div className="ant-descriptions-title">{title}</div>
          <div className="ant-descriptions-extra">{extra}</div>
        </div>
      )}
      <div className="ant-descriptions-view">
        <table>
          <tbody>
            {rows.map((cells, index) => (
              <Fragment key={cells[0].item.key ?? index}>
                {layout === "vertical" ? (
                  <>
                    <tr className="ant-descriptions-row">
                      {cells.map(({ item, span, index: cell }) => (
                        <th
                          key={item.key ?? cell}
                          className="ant-descriptions-item-label"
                          colSpan={span}
                          style={labelStyle}
                          scope="col"
                        >
                          {item.label}
                        </th>
                      ))}
                    </tr>
                    <tr className="ant-descriptions-row">
                      {cells.map(({ item, span, index: cell }) => (
                        <td
                          key={item.key ?? cell}
                          className="ant-descriptions-item-content"
                          colSpan={span}
                          style={contentStyle}
                        >
                          {item.children}
                        </td>
                      ))}
                    </tr>
                  </>
                ) : (
                  <tr className="ant-descriptions-row">
                    {cells.map(({ item, span, index: cell }) =>
                      bordered ? (
                        <Fragment key={item.key ?? cell}>
                          <th
                            scope="row"
                            className="ant-descriptions-item-label"
                            style={labelStyle}
                          >
                            {item.label}
                          </th>
                          <td
                            className="ant-descriptions-item-content"
                            colSpan={span * 2 - 1}
                            style={contentStyle}
                          >
                            {item.children}
                          </td>
                        </Fragment>
                      ) : (
                        <td
                          key={item.key ?? cell}
                          className="ant-descriptions-item"
                          colSpan={span}
                        >
                          <div className="ant-descriptions-item-container">
                            <span
                              className="ant-descriptions-item-label"
                              style={labelStyle}
                            >
                              {item.label}
                              {colon && item.label !== undefined && (
                                <span aria-hidden="true">：</span>
                              )}
                            </span>
                            <span
                              className="ant-descriptions-item-content"
                              style={contentStyle}
                            >
                              {item.children}
                            </span>
                          </div>
                        </td>
                      ),
                    )}
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
