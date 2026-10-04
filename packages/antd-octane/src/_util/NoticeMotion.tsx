// Native counterpart of rc-notification NoticeList's CSSMotion wrapper (MIT).
import type { CSSProperties } from "octane";
import { useRef } from "octane";
import NoticeItem from "./NoticeItem";
import type { NoticeConfig, NoticeRecord, NoticeStore } from "./notice";
import { useMotion } from "./useMotion";

export default function NoticeMotion({
  record,
  visible,
  onRemoved,
  store,
  kind,
  config,
  prefixCls,
  hovering,
  wrapperStyle,
  motionEnabled,
  onMouseEnter,
  onMouseLeave,
}: {
  record: NoticeRecord;
  visible: boolean;
  onRemoved: (key: string | number) => void;
  store: NoticeStore;
  kind: "message" | "notification";
  config: NoticeConfig;
  prefixCls: string;
  hovering: boolean;
  wrapperStyle?: CSSProperties;
  motionEnabled: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const node = useRef<HTMLDivElement | null>(null);
  const motion = useMotion(visible, node, {
    enabled: motionEnabled,
    onVisibleChanged: (next) => {
      if (!next) onRemoved(record.key);
    },
  });
  const basePrefix = `ant-${kind}`;
  const motionSuffix = kind === "message" ? "move-up" : "fade";
  const customMotion =
    kind === "message" && config.transitionName !== undefined;
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Hover controls the notice group's pause and expansion; notice actions remain keyboard accessible.
    <div
      ref={node}
      data-notice-key={String(record.key)}
      data-motion-visible={visible}
      data-motion-disabled={!motionEnabled || undefined}
      className={[
        `${basePrefix}-notice-wrapper`,
        prefixCls !== basePrefix && `${prefixCls}-notice-wrapper`,
        motion.className(
          customMotion
            ? (config.transitionName ?? "")
            : `${basePrefix}-${motionSuffix}`,
        ),
        !customMotion &&
          prefixCls !== basePrefix &&
          motion.className(`${prefixCls}-${motionSuffix}`),
      ]}
      style={wrapperStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <NoticeItem
        record={record}
        visible={visible}
        store={store}
        kind={kind}
        config={config}
        prefixCls={prefixCls}
        hovering={hovering}
      />
    </div>
  );
}
