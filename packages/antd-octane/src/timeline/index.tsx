import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
export interface TimelineItem {
  key?: string | number;
  color?: string;
  dot?: OctaneNode;
  label?: OctaneNode;
  children?: OctaneNode;
  position?: "left" | "right";
}
export interface TimelineProps extends HTMLAttributes<HTMLUListElement> {
  items?: TimelineItem[];
  mode?: "left" | "right" | "alternate";
  pending?: boolean | OctaneNode;
  pendingDot?: OctaneNode;
  reverse?: boolean;
  style?: CSSProperties;
}
export function Timeline({
  items = [],
  mode = "left",
  pending = false,
  pendingDot,
  reverse = false,
  className,
  style,
  ...rest
}: TimelineProps) {
  const { token: t, base } = useComponentTokens("Timeline");
  const c = useConfig().theme.components?.Timeline;
  const all = [...items];
  if (pending)
    all.push({
      key: "__pending",
      dot: pendingDot ?? (
        <span
          className="ant-timeline-pending-dot"
          role="status"
          aria-label="加载中"
        />
      ),
      children: pending === true ? null : pending,
    });
  if (reverse) all.reverse();
  const hasLabel = all.some((item) => item.label !== undefined);
  return (
    <ul
      {...rest}
      className={[
        "ant-timeline",
        mode === "right" && "ant-timeline-right",
        (hasLabel || mode !== "left") && "ant-timeline-label",
        className,
      ]}
      style={{
        ...base,
        "--ao-timeline-center-offset": `${t.marginXXS}px`,
        "--ao-timeline-label-gap": `${t.marginSM}px`,
        "--ao-timeline-right-offset": `${(10 + (c?.tailWidth ?? t.lineWidthBold)) / 2}px`,
        "--ao-timeline-right-gap": `${10 + t.marginXS}px`,
        "--ao-timeline-last-height": `${t.controlHeightLG * 1.2}px`,
        "--ao-timeline-tail": c?.tailColor ?? t.colorSplit,
        "--ao-timeline-tail-width": `${c?.tailWidth ?? t.lineWidthBold}px`,
        "--ao-timeline-dot-border": `${c?.dotBorderWidth ?? t.lineWidth * 3}px`,
        "--ao-timeline-dot-bg": c?.dotBg ?? t.colorBgContainer,
        "--ao-timeline-bottom": `${c?.itemPaddingBottom ?? t.padding * 1.25}px`,
        ...style,
      }}
    >
      {all.map((item, index) => {
        const position =
          item.position ??
          (mode === "alternate" ? (index % 2 ? "right" : "left") : mode);
        const color =
          item.color === "green"
            ? t.colorSuccess
            : item.color === "red"
              ? t.colorError
              : item.color === "gray"
                ? t.colorTextDisabled
                : !item.color || item.color === "blue"
                  ? t.colorPrimary
                  : item.color;
        return (
          <li
            key={item.key ?? index}
            className={[
              "ant-timeline-item",
              position === "right" && "ant-timeline-item-right",
            ]}
          >
            <div className="ant-timeline-item-tail" />
            <div
              className={[
                "ant-timeline-item-head",
                item.dot !== undefined && "ant-timeline-item-head-custom",
              ]}
              style={{ color, borderColor: color }}
            >
              {item.dot}
            </div>
            {item.label !== undefined && (
              <div className="ant-timeline-item-label">{item.label}</div>
            )}
            <div className="ant-timeline-item-content">{item.children}</div>
          </li>
        );
      })}
    </ul>
  );
}
