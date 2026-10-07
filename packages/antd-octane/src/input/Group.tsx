/** @jsxImportSource octane */
// Ant Design 5.29.3 components/input/Group.tsx (MIT), adapted to Octane.
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { componentClassName } from "../_util/componentClassName";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import { inputVariables } from "./tokens";

export interface GroupProps {
  className?: string;
  size?: "large" | "small" | "default";
  children?: OctaneNode;
  style?: CSSProperties;
  onMouseEnter?: HTMLAttributes<HTMLSpanElement>["onMouseEnter"];
  onMouseLeave?: HTMLAttributes<HTMLSpanElement>["onMouseLeave"];
  onFocus?: HTMLAttributes<HTMLSpanElement>["onFocus"];
  onBlur?: HTMLAttributes<HTMLSpanElement>["onBlur"];
  prefixCls?: string;
  compact?: boolean;
}

/** @deprecated Please use Space.Compact. */
export default function Group(props: GroupProps) {
  const config = useConfig();
  const prefixCls = config.getPrefixCls("input-group", props.prefixCls);
  const warning = devUseWarning("Input.Group");
  warning.deprecated(false, "Input.Group", "Space.Compact");
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Group forwards bubbling focus and mouse events without becoming a focus target.
    <span
      className={[
        componentClassName("ant-input-group", prefixCls),
        props.size === "large" &&
          componentClassName("ant-input-group", prefixCls, "-lg"),
        props.size === "small" &&
          componentClassName("ant-input-group", prefixCls, "-sm"),
        props.compact &&
          componentClassName("ant-input-group", prefixCls, "-compact"),
        config.direction === "rtl" &&
          componentClassName("ant-input-group", prefixCls, "-rtl"),
        props.className,
      ]}
      style={{ ...inputVariables(config.theme, config.token), ...props.style }}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      {props.children}
    </span>
  );
}
