/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import type { FormatConfig, valueType } from "./utils";

interface NumberProps extends FormatConfig {
  value: valueType;
  prefixCls: string;
}

export function StatisticNumber({
  value,
  formatter,
  precision,
  decimalSeparator = ".",
  groupSeparator = "",
  prefixCls,
}: NumberProps) {
  let valueNode: OctaneNode;
  if (typeof formatter === "function") {
    // Upstream calls custom formatters with the value only.
    valueNode = formatter(value);
  } else {
    const text = String(value);
    const cells = text.match(/^(-?)(\d*)(\.(\d+))?$/);
    if (!cells || text === "-") {
      valueNode = text;
    } else {
      const negative = cells[1];
      const integer = (cells[2] || "0").replace(
        /\B(?=(\d{3})+(?!\d))/g,
        groupSeparator,
      );
      let decimal = cells[4] || "";
      if (typeof precision === "number") {
        decimal = decimal
          .padEnd(precision, "0")
          .slice(0, precision > 0 ? precision : 0);
      }
      valueNode = (
        <>
          <span className={`${prefixCls}-content-value-int`}>
            {negative}
            {integer}
          </span>
          {decimal && (
            <span className={`${prefixCls}-content-value-decimal`}>
              {decimalSeparator}
              {decimal}
            </span>
          )}
        </>
      );
    }
  }

  return <span className={`${prefixCls}-content-value`}>{valueNode}</span>;
}
