/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import {
  createPortal,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "octane";
import { useComponentTokens } from "./tokens";
export type NoticeKind = "success" | "info" | "warning" | "error" | "loading";
export type NoticePlacement =
  | "top"
  | "topLeft"
  | "topRight"
  | "bottom"
  | "bottomLeft"
  | "bottomRight";
export interface NoticeArgs {
  key?: string | number;
  content?: OctaneNode;
  message?: OctaneNode;
  description?: OctaneNode;
  type?: NoticeKind;
  icon?: OctaneNode;
  duration?: number | null;
  onClose?: () => void;
  onClick?: (event: MouseEvent) => void;
  placement?: NoticePlacement;
  className?: string;
  style?: CSSProperties;
  closeIcon?: OctaneNode;
  closable?: boolean;
  actions?: OctaneNode;
  btn?: OctaneNode;
  role?: "status" | "alert";
  pauseOnHover?: boolean;
}
export interface NoticeConfig {
  duration?: number;
  maxCount?: number;
  top?: number | string;
  bottom?: number;
  getContainer?: () => HTMLElement;
  placement?: NoticePlacement;
  pauseOnHover?: boolean;
  closeIcon?: OctaneNode;
}
export interface NoticeRecord extends NoticeArgs {
  key: string | number;
  revision: number;
  done: Array<() => void>;
}
export function createNoticeStore() {
  let records: NoticeRecord[] = [];
  let seq = 0;
  let config: NoticeConfig = {};
  let disposed = false;
  const listeners = new Set<() => void>();
  const emit = () => {
    for (const fn of listeners) fn();
  };
  const finish = (record: NoticeRecord) => {
    for (const resolve of record.done) resolve();
    record.onClose?.();
  };
  const store = {
    configure(value: NoticeConfig) {
      config = value;
    },
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    snapshot: () => records,
    activate() {
      disposed = false;
    },
    open(args: NoticeArgs, done: () => void) {
      if (disposed) {
        done();
        return args.key ?? `closed-${++seq}`;
      }
      const key = args.key ?? `notice-${++seq}`;
      const old = records.find((item) => item.key === key);
      const record = {
        ...args,
        key,
        duration: args.duration === undefined ? config.duration : args.duration,
        placement: args.placement ?? config.placement,
        pauseOnHover: args.pauseOnHover ?? config.pauseOnHover,
        revision: (old?.revision ?? 0) + 1,
        done: [...(old?.done ?? []), done],
      };
      records = old
        ? records.map((item) => (item.key === key ? record : item))
        : [...records, record];
      const max = Number.isFinite(config.maxCount)
        ? Math.max(1, Math.floor(config.maxCount as number))
        : Infinity;
      const evicted = records.slice(0, Math.max(0, records.length - max));
      records = records.slice(-max);
      emit();
      for (const item of evicted) finish(item);
      return key;
    },
    destroy(key?: string | number) {
      const removed =
        key === undefined
          ? records
          : records.filter((item) => item.key === key);
      records =
        key === undefined ? [] : records.filter((item) => item.key !== key);
      emit();
      for (const item of removed) finish(item);
    },
    dispose() {
      disposed = true;
      store.destroy();
    },
  };
  return store;
}
export type NoticeStore = ReturnType<typeof createNoticeStore>;
function NoticeIcon({ type }: { type: NoticeKind }) {
  return type === "loading" ? (
    <span className="ao-notice-loading" aria-hidden="true" />
  ) : (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <g
        fill="none"
        stroke="var(--ao-notice-bg)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === "success" ? (
          <path d="m6 12 4 4 8-8" />
        ) : type === "error" ? (
          <path d="m8 8 8 8m0-8-8 8" />
        ) : type === "info" ? (
          <path d="M12 10v7m0-11v.1" />
        ) : (
          <path d="M12 6v7m0 4v.1" />
        )}
      </g>
    </svg>
  );
}
function NoticeItem({
  record,
  store,
  kind,
  config,
}: {
  record: NoticeRecord;
  store: NoticeStore;
  kind: "message" | "notification";
  config: NoticeConfig;
}) {
  const node = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = node.current;
    const click = record.onClick;
    if (click) el?.addEventListener("click", click);
    return () => {
      if (click) el?.removeEventListener("click", click);
    };
  }, [record.onClick]);
  useEffect(() => {
    const duration =
      record.duration === null
        ? 0
        : (record.duration ?? (kind === "message" ? 3 : 4.5));
    if (!Number.isFinite(duration) || duration <= 0) return;
    let remaining = duration * 1000;
    let began = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      began = Date.now();
      timer = setTimeout(() => store.destroy(record.key), remaining);
    };
    const pause = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
        remaining = Math.max(0, remaining - (Date.now() - began));
      }
    };
    const el = node.current;
    let hovered = el?.matches(":hover") ?? false;
    let focused = el?.contains(document.activeElement) ?? false;
    const resume = () => {
      if (timer === undefined && !hovered && !focused) start();
    };
    const enter = () => {
      hovered = true;
      pause();
    };
    const leave = () => {
      hovered = false;
      resume();
    };
    const focus = () => {
      focused = true;
      pause();
    };
    const blur = (event: FocusEvent) => {
      focused = !!el?.contains(event.relatedTarget as Node | null);
      resume();
    };
    if (record.pauseOnHover === false || (!hovered && !focused)) start();
    if (record.pauseOnHover !== false) {
      el?.addEventListener("mouseenter", enter);
      el?.addEventListener("mouseleave", leave);
      el?.addEventListener("focusin", focus);
      el?.addEventListener("focusout", blur);
    }
    return () => {
      if (timer !== undefined) clearTimeout(timer);
      el?.removeEventListener("mouseenter", enter);
      el?.removeEventListener("mouseleave", leave);
      el?.removeEventListener("focusin", focus);
      el?.removeEventListener("focusout", blur);
    };
  }, [record, store, kind]);
  const icon =
    record.icon !== undefined ? (
      record.icon
    ) : record.type ? (
      <NoticeIcon type={record.type} />
    ) : null;
  const closeIcon =
    record.closeIcon === undefined ? config.closeIcon : record.closeIcon;
  const notice = (
    <div
      ref={node}
      className={[
        `ant-${kind}-notice`,
        record.type && `ant-${kind}-notice-${record.type}`,
        record.className,
      ]}
      style={record.style}
      role={record.role ?? (kind === "message" ? "status" : "alert")}
    >
      <div className={`ant-${kind}-notice-content`}>
        {icon !== null && <span className="ao-notice-icon">{icon}</span>}
        {kind === "message" ? (
          <span>{record.content}</span>
        ) : (
          <div className="ant-notification-notice-body">
            <div className="ant-notification-notice-message">
              {record.message}
            </div>
            {record.description !== undefined && (
              <div className="ant-notification-notice-description">
                {record.description}
              </div>
            )}
            {(record.actions ?? record.btn) !== undefined && (
              <div className="ant-notification-notice-actions">
                {record.actions ?? record.btn}
              </div>
            )}
          </div>
        )}
        {kind === "notification" &&
          record.closable !== false &&
          closeIcon !== null &&
          closeIcon !== false && (
            <button
              type="button"
              className="ant-notification-notice-close"
              aria-label="关闭通知"
              onClick={() => store.destroy(record.key)}
            >
              {closeIcon ?? "×"}
            </button>
          )}
      </div>
    </div>
  );
  return kind === "notification" ? (
    <div className="ant-notification-notice-wrapper">{notice}</div>
  ) : (
    notice
  );
}
export function NoticeHolder({
  store,
  kind,
  config,
}: {
  store: NoticeStore;
  kind: "message" | "notification";
  config: NoticeConfig;
}) {
  const messageTokens = useComponentTokens("Message");
  const notificationTokens = useComponentTokens("Notification");
  const { token: t, base } =
    kind === "message" ? messageTokens : notificationTokens;
  const mc = messageTokens.component;
  const nc = notificationTokens.component;
  const records = useSyncExternalStore(
    store.subscribe,
    store.snapshot,
    store.snapshot,
  );
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    store.activate();
    return () => store.dispose();
  }, [store]);
  useEffect(() => {
    setTarget(config.getContainer?.() ?? document.body);
  }, [config.getContainer]);
  const css = {
    ...base,
    "--ao-notice-animation": t.motion
      ? "ao-notice-spin .8s linear infinite"
      : "none",
    "--ao-notice-outer-padding": `${t.paddingXS}px`,
    "--ao-notice-bg":
      kind === "message"
        ? (mc?.contentBg ?? t.colorBgElevated)
        : t.colorBgElevated,
    "--ao-notice-padding":
      typeof mc?.contentPadding === "number"
        ? `${mc.contentPadding}px`
        : (mc?.contentPadding ??
          `${(t.controlHeightLG - t.fontSize * t.lineHeight) / 2}px ${t.paddingSM}px`),
    "--ao-notice-success": t.colorSuccess,
    "--ao-notice-error": t.colorError,
    "--ao-notice-warning": t.colorWarning,
    "--ao-notice-info": t.colorInfo,
    "--ao-notice-shadow": t.boxShadow,
    "--ao-notice-gap": `${t.marginXS}px`,
    "--ao-notice-large-gap": `${t.margin}px`,
    "--ao-notice-title-line": t.lineHeightLG,
    "--ao-notice-message-icon": `${t.fontSizeLG}px`,
    "--ao-notice-icon-size": `${t.fontSizeLG * t.lineHeightLG}px`,
    "--ao-notice-title-size": `${t.fontSizeLG}px`,
    "--ao-notice-heading": t.colorTextHeading,
    "--ao-notice-padding-lg": `${t.paddingMD}px ${t.paddingLG}px`,
    "--ao-notice-width": `${nc?.width ?? 384}px`,
  };
  const placements: NoticePlacement[] =
    kind === "message"
      ? ["top"]
      : ["top", "topLeft", "topRight", "bottom", "bottomLeft", "bottomRight"];
  return target
    ? createPortal(
        placements.map((placement) => {
          const items = records.filter(
            (record) =>
              kind === "message" ||
              (record.placement ?? "topRight") === placement,
          );
          return items.length ? (
            <div
              key={placement}
              className={[`ant-${kind}`, `ant-${kind}-${placement}`]}
              style={{
                ...css,
                zIndex:
                  kind === "message"
                    ? (mc?.zIndexPopup ?? t.zIndexPopupBase + 1010)
                    : (nc?.zIndexPopup ?? t.zIndexPopupBase + 1050),
                top: placement.startsWith("top")
                  ? (config.top ?? (kind === "message" ? 8 : 24))
                  : undefined,
                bottom: placement.startsWith("bottom")
                  ? (config.bottom ?? 24)
                  : undefined,
              }}
            >
              {items.map((record) => (
                <NoticeItem
                  key={record.key}
                  record={record}
                  store={store}
                  kind={kind}
                  config={config}
                />
              ))}
            </div>
          ) : null;
        }),
        target,
      )
    : null;
}
