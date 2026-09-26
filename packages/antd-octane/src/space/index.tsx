import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { Children, Fragment } from "octane";
import { useConfig } from "../config-provider";
export type SpaceSize = "small" | "middle" | "large" | number;
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  style?: CSSProperties;
  direction?: "horizontal" | "vertical";
  size?: SpaceSize | [SpaceSize, SpaceSize];
  align?: "start" | "end" | "center" | "baseline";
  wrap?: boolean;
  split?: OctaneNode;
}
export function Space({
  direction = "horizontal",
  size = "small",
  align,
  wrap = false,
  split,
  className,
  style,
  children,
  ...rest
}: SpaceProps) {
  const { token } = useConfig();
  const pixels = (value: SpaceSize) =>
    typeof value === "number"
      ? value
      : value === "small"
        ? token.paddingXS
        : value === "middle"
          ? token.padding
          : token.paddingLG;
  const sizes = Array.isArray(size) ? size : [size, size];
  const items = Children.toArray(children).filter(
    (item) => item !== null && item !== undefined && typeof item !== "boolean",
  );
  return (
    <div
      {...rest}
      className={["ant-space", `ant-space-${direction}`, className]}
      style={{
        display: "inline-flex",
        flexDirection: direction === "vertical" ? "column" : "row",
        alignItems:
          align ?? (direction === "horizontal" ? "center" : undefined),
        flexWrap: wrap ? "wrap" : undefined,
        columnGap: pixels(sizes[0]),
        rowGap: pixels(sizes[1]),
        ...style,
      }}
    >
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && split !== undefined && (
            <span className="ant-space-split">{split}</span>
          )}
          <div className="ant-space-item">{child}</div>
        </Fragment>
      ))}
    </div>
  );
}
