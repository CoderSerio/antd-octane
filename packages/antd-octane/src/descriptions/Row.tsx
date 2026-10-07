/** @jsxImportSource octane */
import { useContext } from "octane";
import Cell from "./Cell";
import { DescriptionsContext } from "./DescriptionsContext";
import type { InternalDescriptionsItemType } from "./hooks/useItems";

export interface RowProps {
  prefixCls: string;
  vertical: boolean;
  row: InternalDescriptionsItemType[];
  bordered?: boolean;
  colon: boolean;
}

export default function Row({
  prefixCls,
  vertical,
  row,
  bordered,
  colon,
}: RowProps) {
  const context = useContext(DescriptionsContext);
  const cells = (type: "label" | "content" | "item", component: "th" | "td") =>
    row.map((item, index) => {
      const span = item.span || 1;
      const labelStyle = {
        ...context.labelStyle,
        ...context.styles?.label,
        ...item.labelStyle,
        ...item.styles?.label,
      };
      const contentStyle = {
        ...context.contentStyle,
        ...context.styles?.content,
        ...item.contentStyle,
        ...item.styles?.content,
      };
      const common = {
        itemPrefixCls: item.prefixCls ?? prefixCls,
        className: item.className,
        colon,
        bordered,
        classNames: item.classNames,
      };
      if (!vertical && bordered) {
        return (
          <>
            <Cell
              key={`label-${item.key ?? index}`}
              {...common}
              component="th"
              type="label"
              span={1}
              style={{
                ...context.labelStyle,
                ...context.styles?.label,
                ...item.style,
                ...item.labelStyle,
                ...item.styles?.label,
              }}
              label={item.label}
            />
            <Cell
              key={`content-${item.key ?? index}`}
              {...common}
              component="td"
              type="content"
              span={span * 2 - 1}
              style={{
                ...context.contentStyle,
                ...context.styles?.content,
                ...item.style,
                ...item.contentStyle,
                ...item.styles?.content,
              }}
              content={item.children}
            />
          </>
        );
      }
      return (
        <Cell
          key={`${type}-${item.key ?? index}`}
          {...common}
          component={component}
          type={type}
          span={span}
          style={item.style}
          styles={{ label: labelStyle, content: contentStyle }}
          label={type !== "content" ? item.label : null}
          content={type !== "label" ? item.children : null}
        />
      );
    });
  const rowClass = [
    `${prefixCls}-row`,
    prefixCls !== "ant-descriptions" && "ant-descriptions-row",
  ];
  return vertical ? (
    <>
      <tr className={rowClass}>{cells("label", "th")}</tr>
      <tr className={rowClass}>{cells("content", "td")}</tr>
    </>
  ) : (
    <tr className={rowClass}>{cells("item", "td")}</tr>
  );
}
