/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { cloneElement, isValidElement } from "octane";
import SingleNumber from "./SingleNumber";

export interface ScrollNumberProps {
  prefixCls?: string;
  className?: string;
  motionClassName?: string;
  count?: OctaneNode;
  children?: OctaneNode;
  style?: CSSProperties;
  title?: string | number | null;
  show: boolean;
  motion?: boolean;
}

/** Only integer counts scroll; arbitrary count nodes retain their own styles. */
export default function ScrollNumber({
  prefixCls = "ant-scroll-number",
  className,
  motionClassName,
  count,
  children,
  style,
  title,
  show,
  motion = true,
}: ScrollNumberProps) {
  if (isValidElement<{ className?: string; style?: CSSProperties }>(children)) {
    return cloneElement(children, {
      className: [
        `${prefixCls}-custom-component`,
        "ant-scroll-number-custom-component",
        children.props.className,
        motionClassName,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }
  const digits =
    (typeof count === "string" || typeof count === "number") &&
    count &&
    Number(count) % 1 === 0
      ? String(count).split("")
      : undefined;
  return (
    <sup
      data-show={show}
      className={[prefixCls, "ant-scroll-number", className, motionClassName]}
      title={title === null || title === undefined ? undefined : String(title)}
      style={
        style?.borderColor
          ? { ...style, boxShadow: `0 0 0 1px ${style.borderColor} inset` }
          : style
      }
    >
      {digits ? (
        <bdi>
          {digits.map((digit, index) => (
            <SingleNumber
              key={digits.length - index}
              prefixCls={prefixCls}
              value={digit}
              count={Number(count)}
              motion={motion}
            />
          ))}
        </bdi>
      ) : (
        count
      )}
    </sup>
  );
}
