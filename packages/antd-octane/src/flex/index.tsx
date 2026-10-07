/** @jsxImportSource octane */
import type { CSSProperties, ElementType, HTMLAttributes, Ref } from "octane";
import { componentClassName } from "../_util/componentClassName";
import { useConfig } from "../config-provider";
import { resolveComponentAlias } from "../theme/resolve";
export interface FlexProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  prefixCls?: string;
  rootClassName?: string;
  component?: ElementType;
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
  component: Component = "div",
  prefixCls: customPrefixCls,
  rootClassName,
  className,
  style,
  children,
  ...rest
}: FlexProps) {
  const config = useConfig();
  const token = resolveComponentAlias(config.theme, config.token, "Flex");
  const prefixCls = config.getPrefixCls("flex", customPrefixCls);
  const spacing =
    gap === "small"
      ? token.paddingXS
      : gap === "middle"
        ? token.padding
        : gap === "large"
          ? token.paddingLG
          : gap;
  return (
    <Component
      {...rest}
      className={[
        componentClassName("ant-flex", prefixCls),
        vertical && componentClassName("ant-flex", prefixCls, "-vertical"),
        config.direction === "rtl" &&
          componentClassName("ant-flex", prefixCls, "-rtl"),
        config.flex?.className,
        className,
        rootClassName,
      ]}
      style={{
        display: "flex",
        margin: 0,
        padding: 0,
        direction: config.direction,
        flexDirection: vertical ? "column" : "row",
        flexWrap: wrap === true ? "wrap" : wrap === false ? "nowrap" : wrap,
        justifyContent: justify,
        alignItems: align ?? (vertical ? "stretch" : "normal"),
        flex,
        gap: spacing,
        ...config.flex?.style,
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
