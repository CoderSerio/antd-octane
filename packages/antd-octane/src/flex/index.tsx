import type { CSSProperties, HTMLAttributes } from "octane";
import { useConfig } from "../config-provider";
export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  style?: CSSProperties;
  vertical?: boolean;
  wrap?: boolean | CSSProperties["flexWrap"];
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  flex?: CSSProperties["flex"];
  gap?: number | string;
}
export function Flex({
  vertical = false,
  wrap = false,
  justify,
  align,
  flex,
  gap,
  className,
  style,
  children,
  ...rest
}: FlexProps) {
  const { token } = useConfig();
  const spacing =
    gap === "small"
      ? token.paddingXS
      : gap === "middle"
        ? token.padding
        : gap === "large"
          ? token.paddingLG
          : gap;
  return (
    <div
      {...rest}
      className={["ant-flex", className]}
      style={{
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        flexWrap: wrap === true ? "wrap" : wrap === false ? "nowrap" : wrap,
        justifyContent: justify,
        alignItems: align ?? (vertical ? "stretch" : "normal"),
        flex,
        gap: spacing,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
