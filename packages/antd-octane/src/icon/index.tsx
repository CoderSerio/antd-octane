/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { createElement } from "octane";
import { useConfig } from "../config-provider";
export interface IconNode {
  tag: string;
  attrs: Record<string, string | undefined>;
  children?: IconNode[];
}
export interface IconDefinition {
  name: string;
  theme: "outlined" | "filled" | "twotone";
  icon: IconNode | ((primaryColor: string, secondaryColor: string) => IconNode);
}
export interface IconProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  icon?: IconDefinition;
  component?: () => OctaneNode;
  children?: OctaneNode;
  viewBox?: string;
  spin?: boolean;
  rotate?: number;
  twoToneColor?: string | [string, string];
  style?: CSSProperties;
}
function draw(node: IconNode, index: number): OctaneNode {
  return createElement(
    node.tag,
    { ...node.attrs, key: `${node.tag}-${index}` },
    ...(node.children ?? []).map(draw),
  );
}
export function Icon({
  icon,
  component: Component,
  children,
  viewBox = "0 0 1024 1024",
  spin = false,
  rotate,
  twoToneColor,
  className,
  style,
  ...rest
}: IconProps) {
  const { token, iconPrefixCls = "anticon" } = useConfig();
  const colors = Array.isArray(twoToneColor)
    ? twoToneColor
    : [twoToneColor ?? token.colorPrimary, token.colorPrimaryBg];
  const definition = icon
    ? typeof icon.icon === "function"
      ? icon.icon(colors[0], colors[1])
      : icon.icon
    : undefined;
  const labelled = !!(rest["aria-label"] || rest["aria-labelledby"]);
  return (
    <span
      {...rest}
      role={labelled ? "img" : rest.role}
      aria-hidden={labelled ? undefined : true}
      className={[
        ...new Set([
          "anticon",
          iconPrefixCls,
          icon && `${iconPrefixCls}-${icon.name}`,
          className,
        ]),
      ]}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontStyle: "normal",
        lineHeight: 0,
        textAlign: "center",
        verticalAlign: "-0.125em",
        ...style,
      }}
    >
      <span
        className={spin && token.motion ? "ao-icon-spin" : undefined}
        style={{
          display: "inline-flex",
          transform: rotate ? `rotate(${rotate}deg)` : undefined,
        }}
      >
        {Component ? (
          <Component />
        ) : (
          <svg
            {...definition?.attrs}
            aria-hidden="true"
            width="1em"
            height="1em"
            viewBox={definition?.attrs.viewBox ?? viewBox}
            fill={definition?.attrs.fill ?? "currentColor"}
            focusable="false"
          >
            {definition ? (definition.children ?? []).map(draw) : children}
          </svg>
        )}
      </span>
    </span>
  );
}
export function createIcon(icon: IconDefinition) {
  return function DefinedIcon(props: Omit<IconProps, "icon">) {
    return <Icon aria-label={icon.name} {...props} icon={icon} />;
  };
}
