/** @jsxImportSource octane */
import type { MouseEventHandler } from "octane";
import MessageContent from "../message/PureContent";
import PureContent from "../notification/PureContent";
import type { NoticeConfig, NoticeRecord, NoticeStore } from "./notice";
import { useComponentTokens } from "./tokens";
import useNoticeTimer from "./useNoticeTimer";

export default function NoticeItem({
  record,
  store,
  kind,
  prefixCls,
  visible,
  hovering = false,
}: {
  record: NoticeRecord;
  prefixCls: string;
  visible: boolean;
  hovering?: boolean;
  store: NoticeStore;
  kind: "message" | "notification";
  config: NoticeConfig;
}) {
  const progress = useNoticeTimer({
    duration:
      record.duration ??
      (record.duration === null ? 0 : kind === "message" ? 3 : 4.5),
    times: record.revision,
    visible,
    forcedHovering: hovering,
    pauseOnHover: record.pauseOnHover,
    showProgress: kind === "notification" && record.showProgress,
    onClose: () => store.destroy(record.key),
  });
  const { component: nt } = useComponentTokens("Notification");
  const cls = (suffix: string) => [
    `ant-${kind}-${suffix}`,
    prefixCls !== `ant-${kind}` && `${prefixCls}-${suffix}`,
  ];
  const closable = kind === "notification" && record.closable;
  const closableObject =
    typeof closable === "object" && closable !== null
      ? closable
      : { closeIcon: record.closeIcon };
  // rc-notification forwards only role/aria attributes from the closable object.
  const closeAria = Object.fromEntries(
    Object.entries(closableObject).filter(
      ([key]) => key === "role" || key.startsWith("aria-"),
    ),
  );
  const closeEvents: { onClick: MouseEventHandler<HTMLAnchorElement> } = {
    onClick: (event) => {
      event.preventDefault();
      event.stopPropagation();
      store.destroy(record.key);
    },
  };
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: The upstream notice exposes optional click handling; keyboard actions are rendered in its content/close control.
    <div
      {...record.props}
      className={[
        ...cls("notice"),
        ...(record.type ? cls(`notice-${record.type}`) : []),
        ...(closable ? cls("notice-closable") : []),
        record.className,
      ]}
      style={{
        ...(kind === "notification" && record.type
          ? {
              background: nt?.[
                `color${{ success: "Success", info: "Info", error: "Error", warning: "Warning", loading: "Info" }[record.type]}Bg` as keyof typeof nt
              ] as string | undefined,
            }
          : {}),
        ...record.style,
      }}
      onClick={record.onClick}
      onMouseEnter={(event) => {
        progress.setHovering(true);
        record.props?.onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        progress.setHovering(false);
        record.props?.onMouseLeave?.(event);
      }}
      role={record.props?.role}
    >
      <div className={cls("notice-content")}>
        {kind === "message" ? (
          <MessageContent
            prefixCls={prefixCls}
            type={record.type}
            icon={record.icon}
          >
            {record.content}
          </MessageContent>
        ) : (
          <PureContent
            prefixCls={`${prefixCls}-notice`}
            message={record.message}
            description={record.description}
            actions={record.actions}
            icon={record.icon}
            type={
              record.type as
                | "success"
                | "error"
                | "info"
                | "warning"
                | undefined
            }
            role={record.role}
          />
        )}
      </div>
      {closable && (
        // biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useAriaPropsSupportedByRole: Preserve the rc-notification focusable anchor and its Enter-to-close/aria contract.
        <a
          tabIndex={0}
          className={cls("notice-close")}
          aria-label="Close"
          {...closeAria}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.code === "Enter" ||
              event.keyCode === 13
            )
              store.destroy(record.key);
          }}
          {...closeEvents}
        >
          {closableObject.closeIcon}
        </a>
      )}
      {progress.showProgress && (
        <progress
          className={cls("notice-progress")}
          max="100"
          value={progress.percent}
        >
          {`${progress.percent}%`}
        </progress>
      )}
    </div>
  );
}
