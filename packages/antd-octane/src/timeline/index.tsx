/** @jsxImportSource octane */
import type { CSSProperties, HTMLAttributes, OctaneNode } from "octane";
import { Children, Fragment, isValidElement } from "octane";
import cssSize from "../_util/css-size";
import { useComponentTokens } from "../_util/tokens";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import TimelineItemComponent from "./TimelineItem";
export interface TimelineItem {
  key?: string | number;
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  color?: string;
  dot?: OctaneNode;
  label?: OctaneNode;
  children?: OctaneNode;
  position?: "left" | "right";
  pending?: boolean;
}
export type TimelineItemProps = TimelineItem;
/** @deprecated Use TimelineItemProps instead. */
export type TimeLineItemProps = TimelineItem;
export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  prefixCls?: string;
  rootClassName?: string;
  items?: TimelineItem[];
  children?: OctaneNode;
  mode?: "left" | "right" | "alternate";
  pending?: boolean | OctaneNode;
  pendingDot?: OctaneNode;
  reverse?: boolean;
  style?: CSSProperties;
}
export function Timeline({
  items,
  children,
  mode,
  pending = false,
  pendingDot,
  reverse = false,
  className,
  rootClassName,
  prefixCls: customPrefixCls,
  style,
  ...rest
}: TimelineProps) {
  const warning = devUseWarning("Timeline");
  warning.deprecated(!children, "Timeline.Item", "items");
  const { token: t, component: c, base } = useComponentTokens("Timeline");
  const config = useConfig();
  const prefixCls = config.getPrefixCls("timeline", customPrefixCls);
  const legacyItems: TimelineItem[] = [];
  const collect = (nodes: OctaneNode) =>
    Children.forEach(nodes, (child) => {
      if (!isValidElement<TimelineItem>(child)) return;
      if (child.type === Fragment) {
        collect(child.children ?? child.props.children);
        return;
      }
      legacyItems.push({
        ...child.props,
        key: child.props.key ?? child.key,
        children: child.children ?? child.props.children ?? "",
      });
    });
  collect(children);
  const all = [...(items ?? legacyItems)];
  if (pending)
    all.push({
      key: "__pending",
      pending: true,
      dot: pendingDot || (
        <span
          className="ant-timeline-pending-dot anticon anticon-loading"
          role="img"
          aria-label="loading"
        >
          <svg
            viewBox="0 0 1024 1024"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" />
          </svg>
        </span>
      ),
      children: pending === true ? null : pending,
    });
  if (reverse) all.reverse();
  const itemsCount = all.length;
  // Keep the same mode/label class split as Ant Design.  A mode class is
  // only useful for unlabeled timelines; labeled timelines use the centered
  // label layout regardless of their requested mode.
  const hasLabel = all.some((item) => Boolean(item?.label));
  const rootModeClass = mode && !hasLabel ? `ant-timeline-${mode}` : undefined;
  return (
    <ol
      {...rest}
      className={[
        prefixCls !== "ant-timeline" && prefixCls,
        "ant-timeline",
        rootModeClass,
        mode &&
          !hasLabel &&
          prefixCls !== "ant-timeline" &&
          `${prefixCls}-${mode}`,
        config.direction === "rtl" && `${prefixCls}-rtl`,
        config.direction === "rtl" && "ant-timeline-rtl",
        config.timeline?.className,
        hasLabel && "ant-timeline-label",
        pending && "ant-timeline-pending",
        reverse && "ant-timeline-reverse",
        className,
        rootClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...base,
        direction: config.direction,
        "--ao-timeline-tail-offset": `calc((10px - ${cssSize(c?.tailWidth ?? t.lineWidthBold)}) / 2)`,
        "--ao-timeline-content-top": `${-(t.fontSize * t.lineHeight - t.fontSize) + t.lineWidth}px`,
        "--ao-timeline-label-top": `calc(${-t.fontSize * t.lineHeight + t.fontSize}px + ${cssSize(c?.tailWidth ?? t.lineWidthBold)})`,
        "--ao-timeline-custom-padding": `${t.paddingXXS}px`,
        "--ao-timeline-custom-font": `${t.fontSize}px`,
        "--ao-timeline-pending-font": `${t.fontSizeSM}px`,
        "--ao-timeline-line-style": t.lineType,
        "--ao-timeline-animation": t.motion
          ? "ao-spin 1s linear infinite"
          : "none",
        "--ao-timeline-center-offset": `${t.marginXXS}px`,
        "--ao-timeline-content-gap": `${t.margin + 10}px`,
        "--ao-timeline-label-gap": `${t.marginSM}px`,
        "--ao-timeline-right-offset": `calc((10px + ${cssSize(c?.tailWidth ?? t.lineWidthBold)}) / 2)`,
        "--ao-timeline-right-gap": `${10 + t.marginXS}px`,
        "--ao-timeline-last-height": `${t.controlHeightLG * 1.2}px`,
        "--ao-timeline-tail": c?.tailColor ?? t.colorSplit,
        "--ao-timeline-tail-width": cssSize(c?.tailWidth ?? t.lineWidthBold),
        "--ao-timeline-dot-border": cssSize(
          c?.dotBorderWidth ??
            (t.wireframe ? t.lineWidthBold : t.lineWidth * 3),
        ),
        "--ao-timeline-dot-bg": c?.dotBg ?? t.colorBgContainer,
        "--ao-timeline-bottom": cssSize(
          c?.itemPaddingBottom ?? t.padding * 1.25,
        ),
        "--ao-timeline-margin": `${t.margin}px`,
        ...config.timeline?.style,
        ...style,
      }}
    >
      {all.filter(Boolean).map((item, index) => {
        const position =
          mode === "left" || mode === "right"
            ? mode
            : mode === "alternate"
              ? (item.position ?? (index % 2 ? "right" : "left"))
              : item.position === "right"
                ? "right"
                : undefined;
        const isLast =
          !reverse && pending
            ? index === itemsCount - 2
            : index === itemsCount - 1;
        return (
          <TimelineItemComponent
            {...item}
            key={item.key ?? index}
            prefixCls={prefixCls}
            className={[
              item.className,
              position && `ant-timeline-item-${position}`,
              position &&
                prefixCls !== "ant-timeline" &&
                `${prefixCls}-item-${position}`,
              isLast && "ant-timeline-item-last",
              isLast &&
                prefixCls !== "ant-timeline" &&
                `${prefixCls}-item-last`,
            ]
              .filter(Boolean)
              .join(" ")}
          />
        );
      })}
    </ol>
  );
}
Timeline.Item = TimelineItemComponent;
