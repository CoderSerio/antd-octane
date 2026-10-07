/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, Ref } from "octane";
import { createContext, useContext } from "octane";
import { componentClassName } from "../_util/componentClassName";
import type { Responsive, Screens } from "../_util/responsive";
import {
  breakpoints,
  responsiveValue,
  useBreakpoint,
} from "../_util/responsive";
import { useConfig } from "../config-provider";

type Gutter = number | string | Responsive<number | string>;
const halfGutter = (value: number | string, negative = false) =>
  typeof value === "number"
    ? value / (negative ? -2 : 2)
    : `calc(${value} / ${negative ? -2 : 2})`;
export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  prefixCls?: string;
  rootClassName?: string;
  gutter?: Gutter | [Gutter, Gutter];
  align?:
    | "top"
    | "middle"
    | "bottom"
    | "stretch"
    | Responsive<"top" | "middle" | "bottom" | "stretch">;
  justify?:
    | "start"
    | "end"
    | "center"
    | "space-around"
    | "space-between"
    | "space-evenly"
    | Responsive<
        | "start"
        | "end"
        | "center"
        | "space-around"
        | "space-between"
        | "space-evenly"
      >;
  wrap?: boolean;
  style?: CSSProperties;
}
const RowContext = createContext<{
  gutter: number | string;
  screens: Screens;
  wrap: boolean;
} | null>(null);
export function Row({
  gutter = 0,
  align = "top",
  justify = "start",
  wrap = true,
  className,
  style,
  children,
  prefixCls: customPrefixCls,
  rootClassName,
  ...rest
}: RowProps) {
  const config = useConfig();
  const { token } = config;
  const prefixCls = config.getPrefixCls("row", customPrefixCls);
  const screens = useBreakpoint();
  const gutters = Array.isArray(gutter) ? gutter : [gutter, 0];
  const x = responsiveValue(gutters[0], screens, 0);
  const y = responsiveValue(gutters[1], screens, 0);
  const alignment = responsiveValue(align, screens, "top");
  return (
    <div
      {...rest}
      className={[
        componentClassName("ant-row", prefixCls),
        config.row?.className,
        className,
        rootClassName,
      ]}
      style={{
        fontFamily: token.fontFamily,
        fontSize: token.fontSize,
        direction: config.direction,
        display: "flex",
        flexFlow: wrap ? "row wrap" : "row nowrap",
        minWidth: 0,
        marginInline: x ? halfGutter(x, true) : undefined,
        rowGap: y,
        alignItems:
          alignment === "top"
            ? "flex-start"
            : alignment === "middle"
              ? "center"
              : alignment === "bottom"
                ? "flex-end"
                : "stretch",
        justifyContent:
          ({ start: "flex-start", end: "flex-end" } as Record<string, string>)[
            responsiveValue(justify, screens, "start")
          ] ?? responsiveValue(justify, screens, "start"),
        ...config.row?.style,
        ...style,
      }}
    >
      <RowContext value={{ gutter: x, screens, wrap }}>{children}</RowContext>
    </div>
  );
}
export interface ColSize {
  span?: number | string;
  offset?: number | string;
  order?: number | string;
  push?: number | string;
  pull?: number | string;
  flex?: CSSProperties["flex"];
}
export interface ColProps extends HTMLAttributes<HTMLDivElement>, ColSize {
  prefixCls?: string;
  rootClassName?: string;
  ref?: Ref<HTMLDivElement>;
  xs?: number | string | ColSize;
  sm?: number | string | ColSize;
  md?: number | string | ColSize;
  lg?: number | string | ColSize;
  xl?: number | string | ColSize;
  xxl?: number | string | ColSize;
  style?: CSSProperties;
}
export function Col({
  span,
  offset,
  order,
  push,
  pull,
  flex,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  className,
  style,
  children,
  prefixCls: customPrefixCls,
  rootClassName,
  ...rest
}: ColProps) {
  const row = useContext(RowContext);
  const config = useConfig();
  const prefixCls = config.getPrefixCls("col", customPrefixCls);
  const standalone = useBreakpoint(!row);
  const screens = row?.screens ?? standalone;
  const responsive = { xs, sm, md, lg, xl, xxl };
  let size: ColSize = { span, offset, order, push, pull, flex };
  for (const bp of breakpoints) {
    const value = responsive[bp];
    if (screens[bp] && value !== undefined)
      size = {
        ...size,
        ...(typeof value === "number" || typeof value === "string"
          ? { span: value }
          : value),
      };
  }
  const numeric = (value: number | string | undefined) => {
    const result = typeof value === "number" ? value : Number(value);
    return Number.isFinite(result) ? result : undefined;
  };
  const spanValue = numeric(size.span);
  const offsetValue = numeric(size.offset);
  const pushValue = numeric(size.push);
  const pullValue = numeric(size.pull);
  const percentage =
    spanValue === undefined ? undefined : `${(spanValue / 24) * 100}%`;
  const flexValue =
    typeof size.flex === "number"
      ? `${size.flex} ${size.flex} auto`
      : typeof size.flex === "string" &&
          /^\d+(\.\d+)?(px|em|rem|%)$/.test(size.flex)
        ? `0 0 ${size.flex}`
        : size.flex;
  return (
    <div
      {...rest}
      className={[
        componentClassName("ant-col", prefixCls),
        config.col?.className,
        className,
        rootClassName,
      ]}
      style={{
        boxSizing: "border-box",
        position: "relative",
        display: spanValue === 0 ? "none" : undefined,
        maxWidth: percentage,
        minHeight: 1,
        paddingInline: row?.gutter ? halfGutter(row.gutter) : undefined,
        flex: flexValue ?? (percentage ? `0 0 ${percentage}` : undefined),
        minWidth: row?.wrap === false ? 0 : undefined,
        marginInlineStart: offsetValue
          ? `${(offsetValue / 24) * 100}%`
          : undefined,
        insetInlineStart: pushValue
          ? `${(pushValue / 24) * 100}%`
          : pullValue
            ? `${(-pullValue / 24) * 100}%`
            : undefined,
        order: size.order,
        ...config.col?.style,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
export const Grid = { useBreakpoint };
export type { Breakpoint, Responsive, Screens } from "../_util/responsive";
