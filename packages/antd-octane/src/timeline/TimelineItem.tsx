/** @jsxImportSource octane */
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import type { TimelineItem } from ".";

export default function TimelineItemComponent({
  prefixCls,
  className,
  color = "blue",
  dot,
  pending = false,
  position: _position,
  label,
  children,
  key: _key,
  ...rest
}: TimelineItem) {
  const config = useConfig();
  const { token: t } = useComponentTokens("Timeline");
  const prefix = config.getPrefixCls("timeline", prefixCls);
  const preset = ["blue", "red", "green", "gray"].includes(color);
  const resolvedColor =
    color === "green"
      ? t.colorSuccess
      : color === "red"
        ? t.colorError
        : color === "gray"
          ? t.colorTextDisabled
          : color === "blue"
            ? t.colorPrimary
            : color;
  return (
    <li
      {...rest}
      className={[
        `${prefix}-item`,
        "ant-timeline-item",
        pending && `${prefix}-item-pending`,
        pending && "ant-timeline-item-pending",
        className,
      ]}
    >
      {label && (
        <div className={[`${prefix}-item-label`, "ant-timeline-item-label"]}>
          {label}
        </div>
      )}
      <div className={[`${prefix}-item-tail`, "ant-timeline-item-tail"]} />
      <div
        className={[
          `${prefix}-item-head`,
          "ant-timeline-item-head",
          Boolean(dot) && `${prefix}-item-head-custom`,
          Boolean(dot) && "ant-timeline-item-head-custom",
          preset && `${prefix}-item-head-${color}`,
        ]}
        style={{ color: resolvedColor, borderColor: resolvedColor }}
      >
        {dot}
      </div>
      <div className={[`${prefix}-item-content`, "ant-timeline-item-content"]}>
        {children}
      </div>
    </li>
  );
}
