/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, Ref } from "octane";
import { createContext, useContext } from "octane";
import type { Responsive, Screens } from "../_util/responsive";
import {
  breakpoints,
  responsiveValue,
  useBreakpoint,
} from "../_util/responsive";
import { useConfig } from "../config-provider";
export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gutter?:
    | number
    | Responsive<number>
    | [number | Responsive<number>, number | Responsive<number>];
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
  gutter: number;
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
  ...rest
}: RowProps) {
  const { token } = useConfig();
  const screens = useBreakpoint();
  const gutters = Array.isArray(gutter) ? gutter : [gutter, 0];
  const x = responsiveValue(gutters[0], screens, 0);
  const y = responsiveValue(gutters[1], screens, 0);
  const alignment = responsiveValue(align, screens, "top");
  return (
    <div
      {...rest}
      className={["ant-row", className]}
      style={{
        fontFamily: token.fontFamily,
        fontSize: token.fontSize,
        display: "flex",
        flexFlow: wrap ? "row wrap" : "row nowrap",
        minWidth: 0,
        marginInline: x ? -x / 2 : undefined,
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
        ...style,
      }}
    >
      <RowContext value={{ gutter: x, screens, wrap }}>{children}</RowContext>
    </div>
  );
}
export interface ColSize {
  span?: number;
  offset?: number;
  order?: number;
  push?: number;
  pull?: number;
  flex?: CSSProperties["flex"];
}
export interface ColProps extends HTMLAttributes<HTMLDivElement>, ColSize {
  ref?: Ref<HTMLDivElement>;
  xs?: number | ColSize;
  sm?: number | ColSize;
  md?: number | ColSize;
  lg?: number | ColSize;
  xl?: number | ColSize;
  xxl?: number | ColSize;
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
  ...rest
}: ColProps) {
  const row = useContext(RowContext);
  const standalone = useBreakpoint(!row);
  const screens = row?.screens ?? standalone;
  const responsive = { xs, sm, md, lg, xl, xxl };
  let size: ColSize = { span, offset, order, push, pull, flex };
  for (const bp of breakpoints) {
    const value = responsive[bp];
    if (screens[bp] && value !== undefined)
      size = {
        ...size,
        ...(typeof value === "number" ? { span: value } : value),
      };
  }
  const percentage =
    size.span === undefined ? undefined : `${(size.span / 24) * 100}%`;
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
      className={["ant-col", className]}
      style={{
        boxSizing: "border-box",
        position: "relative",
        display: size.span === 0 ? "none" : undefined,
        maxWidth: percentage,
        minHeight: 1,
        paddingInline: row?.gutter ? row.gutter / 2 : undefined,
        flex: flexValue ?? (percentage ? `0 0 ${percentage}` : undefined),
        minWidth: row?.wrap === false ? 0 : undefined,
        marginInlineStart: size.offset
          ? `${(size.offset / 24) * 100}%`
          : undefined,
        insetInlineStart: size.push
          ? `${(size.push / 24) * 100}%`
          : size.pull
            ? `${(-size.pull / 24) * 100}%`
            : undefined,
        order: size.order,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
export const Grid = { useBreakpoint };
export type { Breakpoint, Responsive, Screens } from "../_util/responsive";
