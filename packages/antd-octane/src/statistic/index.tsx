/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface StatisticProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "prefix"> {
  title?: OctaneNode;
  value?: string | number;
  precision?: number;
  decimalSeparator?: string;
  groupSeparator?: string;
  prefix?: OctaneNode;
  suffix?: OctaneNode;
  formatter?: (value: string | number) => OctaneNode;
  loading?: boolean;
  valueStyle?: CSSProperties;
  style?: CSSProperties;
}
export function Statistic({
  title,
  value = 0,
  precision,
  decimalSeparator = ".",
  groupSeparator = ",",
  prefix,
  suffix,
  formatter,
  loading = false,
  valueStyle,
  className,
  style,
  ...rest
}: StatisticProps) {
  const { token: t, base } = useComponentTokens("Statistic");
  const c = useConfig().theme.components?.Statistic;
  let formatted: OctaneNode = value;
  if (formatter) formatted = formatter(value);
  else {
    const match = String(value).match(/^(-?)(\d*)(?:\.(\d+))?$/);
    if (match && String(value) !== "-") {
      const integer = (match[2] || "0").replace(
        /\B(?=(\d{3})+(?!\d))/g,
        () => groupSeparator,
      );
      let decimal = match[3] ?? "";
      if (precision !== undefined) {
        const digits = Math.min(100, Math.max(0, Math.trunc(precision) || 0));
        decimal = decimal.padEnd(digits, "0").slice(0, digits);
      }
      formatted = (
        <>
          <span className="ant-statistic-content-value-int">
            {match[1]}
            {integer}
          </span>
          {decimal && (
            <span className="ant-statistic-content-value-decimal">
              {decimalSeparator}
              {decimal}
            </span>
          )}
        </>
      );
    }
  }
  return (
    <div
      {...rest}
      className={["ant-statistic", className]}
      style={{
        ...base,
        "--ao-statistic-title-size": `${c?.titleFontSize ?? t.fontSize}px`,
        "--ao-statistic-content-size": `${c?.contentFontSize ?? t.fontSizeHeading3}px`,
        "--ao-statistic-gap": `${t.marginXXS}px`,
        ...style,
      }}
    >
      {title !== undefined && (
        <div className="ant-statistic-title">{title}</div>
      )}
      <div className="ant-statistic-content" style={valueStyle}>
        {loading ? (
          <span
            className="ant-statistic-loading"
            role="status"
            aria-label="正在加载"
          />
        ) : (
          <>
            {prefix !== undefined && (
              <span className="ant-statistic-content-prefix">{prefix}</span>
            )}
            <span className="ant-statistic-content-value">{formatted}</span>
            {suffix !== undefined && (
              <span className="ant-statistic-content-suffix">{suffix}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
