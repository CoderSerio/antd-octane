// Native adaptation of rc-notification NoticeList + Ant Design 5.29.3 stack styles (MIT).
import type { CSSProperties } from "octane";
import { useLayoutEffect, useRef, useState } from "octane";
import NoticeMotion from "./NoticeMotion";
import type {
  NoticeConfig,
  NoticePlacement,
  NoticeRecord,
  NoticeStore,
} from "./notice";
import useMotionList from "./useMotionList";

const getNoticeKey = (record: NoticeRecord) => record.key;

export default function NoticeList({
  items,
  store,
  kind,
  config,
  placement,
  prefixCls,
  rtl,
  style,
  motionEnabled,
  stackGap,
}: {
  items: NoticeRecord[];
  store: NoticeStore;
  kind: "message" | "notification";
  config: NoticeConfig;
  placement: NoticePlacement;
  prefixCls: string;
  rtl: boolean;
  style: CSSProperties;
  motionEnabled: boolean;
  stackGap: number;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const [hoverKeys, setHoverKeys] = useState<string[]>([]);
  const [entries, remove] = useMotionList(items, getNoticeKey);
  const hovering = hoverKeys.some((key) =>
    items.some((item) => String(item.key) === key),
  );
  const [sizes, setSizes] = useState<
    Record<string, { height: number; width: number }>
  >({});
  const stack = kind === "notification" && config.stack !== false;
  const threshold =
    typeof config.stack === "object" ? (config.stack.threshold ?? 3) : 3;
  const expanded = stack && (hovering || items.length <= threshold);
  const bottom = placement.startsWith("bottom");
  useLayoutEffect(() => {
    if (!stack || !root.current) return;
    const nodes = Array.from(
      root.current.querySelectorAll<HTMLElement>(
        ":scope > .ant-notification-notice-wrapper > .ant-notification-notice",
      ),
    );
    const measure = () => {
      const next: typeof sizes = {};
      nodes.forEach((node) => {
        const key = node.parentElement?.dataset.noticeKey;
        const item = items.find((entry) => String(entry.key) === key);
        if (item)
          next[item.key] = {
            height: node.offsetHeight,
            width: node.offsetWidth,
          };
      });
      setSizes((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [stack, items]);
  useLayoutEffect(() => {
    setHoverKeys((previous) => {
      const next = previous.filter((key) =>
        items.some((item) => String(item.key) === key),
      );
      return next.length === previous.length ? previous : next;
    });
  }, [items]);
  const latest = sizes[items.at(-1)?.key ?? ""];
  if (!entries.length) return null;
  return (
    <div
      ref={root}
      className={[
        `ant-${kind}`,
        prefixCls,
        `ant-${kind}-${placement}`,
        rtl && `ant-${kind}-rtl`,
        stack && "ant-notification-stack",
        expanded && "ant-notification-stack-expanded",
      ]}
      style={style}
    >
      {entries.map(({ item: record, visible, key }, motionIndex) => {
        const dataIndex = items.findIndex((item) => String(item.key) === key);
        // A leaving notice remains in the motion list but not the live item list.
        const distance = Math.max(
          0,
          items.length - 1 - (dataIndex >= 0 ? dataIndex : motionIndex - 1),
        );
        let offset = distance * 8;
        if (expanded) {
          offset = items
            .slice(Math.max(0, items.length - distance))
            .reduce(
              (total, item) =>
                total + (sizes[item.key]?.height ?? 0) + stackGap,
              0,
            );
        }
        const width = sizes[record.key]?.width;
        const scale =
          !expanded && latest?.width && width
            ? (latest.width - 16 * Math.min(distance, 3)) / width
            : 1;
        return (
          <NoticeMotion
            key={key}
            record={record}
            visible={visible}
            onRemoved={remove}
            store={store}
            kind={kind}
            config={config}
            prefixCls={prefixCls}
            motionEnabled={motionEnabled}
            hovering={stack && hovering}
            onMouseEnter={() =>
              setHoverKeys((previous) =>
                previous.includes(key) ? previous : [...previous, key],
              )
            }
            onMouseLeave={() =>
              setHoverKeys((previous) =>
                previous.filter((item) => item !== key),
              )
            }
            wrapperStyle={
              stack
                ? {
                    [bottom ? "bottom" : "top"]: 0,
                    width: "100%",
                    height:
                      distance > 0
                        ? expanded
                          ? sizes[record.key]?.height
                          : latest?.height
                        : undefined,
                    transform: `translate3d(0, ${bottom ? -offset : offset}px, 0) scaleX(${scale})`,
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
