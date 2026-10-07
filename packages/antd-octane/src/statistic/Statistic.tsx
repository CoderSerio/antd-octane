/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import { useImperativeHandle, useRef } from "octane";
import cssSize from "../_util/css-size";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { Skeleton } from "../skeleton";
import { StatisticNumber } from "./Number";
import type { FormatConfig } from "./utils";

export interface StatisticRef {
  nativeElement: HTMLDivElement;
}

export interface StatisticProps
  extends Omit<
      HTMLAttributes<HTMLDivElement>,
      "title" | "prefix" | "ref" | "onChange"
    >,
    FormatConfig {
  ref?: Ref<StatisticRef>;
  prefixCls?: string;
  title?: OctaneNode;
  value?: string | number;
  prefix?: OctaneNode;
  suffix?: OctaneNode;
  valueRender?: (value: OctaneNode) => OctaneNode;
  loading?: boolean;
  valueStyle?: CSSProperties;
  rootClassName?: string;
  style?: CSSProperties;
}

export function Statistic({
  ref,
  title,
  value = 0,
  precision,
  decimalSeparator = ".",
  groupSeparator = ",",
  prefix,
  suffix,
  formatter,
  valueRender,
  loading = false,
  valueStyle,
  className,
  rootClassName,
  prefixCls: customPrefixCls,
  style,
  ...rest
}: StatisticProps) {
  const { token: t, component: c, base } = useComponentTokens("Statistic");
  const config = useConfig();
  const prefixCls = config.getPrefixCls("statistic", customPrefixCls);
  const componentConfig = config.statistic;
  const nativeRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => ({
    get nativeElement() {
      return nativeRef.current as HTMLDivElement;
    },
  }));
  const valueNode = (
    <StatisticNumber
      prefixCls={prefixCls}
      value={value}
      formatter={formatter}
      precision={precision}
      decimalSeparator={decimalSeparator}
      groupSeparator={groupSeparator}
    />
  );

  return (
    <div
      {...rest}
      ref={nativeRef}
      className={[
        prefixCls !== "ant-statistic" && prefixCls,
        "ant-statistic",
        componentConfig?.className,
        config.direction === "rtl" && `${prefixCls}-rtl`,
        config.direction === "rtl" && "ant-statistic-rtl",
        className,
        rootClassName,
      ]}
      style={{
        ...base,
        "--ao-statistic-title-size":
          cssSize(c?.titleFontSize) ?? `${t.fontSize}px`,
        "--ao-statistic-content-size":
          cssSize(c?.contentFontSize) ?? `${t.fontSizeHeading3}px`,
        "--ao-statistic-gap": `${t.marginXXS}px`,
        "--ao-statistic-content-color": t.colorTextHeading,
        "--ao-statistic-skeleton-padding": `${t.padding}px`,
        ...componentConfig?.style,
        ...style,
      }}
    >
      {title && (
        <div
          className={[
            prefixCls !== "ant-statistic" && `${prefixCls}-title`,
            "ant-statistic-title",
          ]}
        >
          {title}
        </div>
      )}
      <Skeleton
        paragraph={false}
        loading={loading}
        className={`${prefixCls}-skeleton`}
        active
      >
        <div
          className={[
            prefixCls !== "ant-statistic" && `${prefixCls}-content`,
            "ant-statistic-content",
          ]}
          style={valueStyle}
        >
          {prefix && (
            <span
              className={[
                prefixCls !== "ant-statistic" && `${prefixCls}-content-prefix`,
                "ant-statistic-content-prefix",
              ]}
            >
              {prefix}
            </span>
          )}
          {valueRender ? valueRender(valueNode) : valueNode}
          {suffix && (
            <span
              className={[
                prefixCls !== "ant-statistic" && `${prefixCls}-content-suffix`,
                "ant-statistic-content-suffix",
              ]}
            >
              {suffix}
            </span>
          )}
        </div>
      </Skeleton>
    </div>
  );
}
