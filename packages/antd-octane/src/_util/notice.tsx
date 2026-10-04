/** @jsxImportSource octane */
import type {
  CSSProperties,
  HTMLAttributes,
  MouseEventHandler,
  OctaneNode,
} from "octane";
import {
  createPortal,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "octane";
import { useConfig } from "../config-provider";
import type { ConfigComponentProps } from "../config-provider/context";
import type { ClosableType } from "./closable";

import NoticeList from "./NoticeList";
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
  onClick?: MouseEventHandler<HTMLDivElement>;
  placement?: NoticePlacement;
  className?: string;
  style?: CSSProperties;
  closeIcon?: OctaneNode;
  closable?: ClosableType;
  showProgress?: boolean;
  props?: Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: CSSProperties;
  };
  actions?: OctaneNode;
  /** @deprecated Please use `actions` instead. */
  btn?: OctaneNode;
  role?: "status" | "alert";
  pauseOnHover?: boolean;
}
export interface NoticeConfig {
  duration?: number;
  prefixCls?: string;
  rtl?: boolean;
  showProgress?: boolean;
  stack?: boolean | { threshold?: number };
  maxCount?: number;
  top?: number | string;
  bottom?: number;
  getContainer?: () => HTMLElement | ShadowRoot;
  placement?: NoticePlacement;
  pauseOnHover?: boolean;
  closeIcon?: OctaneNode;
  transitionName?: string;
}
export interface NoticeRecord extends NoticeArgs {
  key: string | number;
  revision: number;
  done: () => void;
}
export function createNoticeStore() {
  let records: NoticeRecord[] = [];
  let seq = 0;
  let config: NoticeConfig = {};
  let disposed = false;
  let mounted = false;
  let notificationConfig: ConfigComponentProps["notification"];
  let messageConfig: ConfigComponentProps["message"];
  let prefixCls = "ant-notification";
  const listeners = new Set<() => void>();
  const emit = () => {
    for (const fn of listeners) fn();
  };
  const finish = (record: NoticeRecord) => {
    record.onClose?.();
    record.done();
  };
  const store = {
    configure(value: NoticeConfig) {
      config = value;
    },
    configureNotification(
      value: ConfigComponentProps["notification"],
      prefix: string,
    ) {
      notificationConfig = value;
      prefixCls = prefix;
    },
    getNotificationConfig: () => ({
      notification: notificationConfig,
      prefixCls,
    }),
    configureMessage(value: ConfigComponentProps["message"]) {
      messageConfig = value;
    },
    getMessageConfig: () => ({ message: messageConfig }),
    isMounted: () => mounted,
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    snapshot: () => records,
    activate() {
      disposed = false;
      mounted = true;
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
        showProgress: args.showProgress ?? config.showProgress,
        revision: (old?.revision ?? 0) + 1,
        done,
      };
      records = old
        ? records.map((item) => (item.key === key ? record : item))
        : [...records, record];
      const max = config.maxCount;
      // rc-notification drops overflow entries without calling their onClose.
      if (max !== undefined && max > 0 && records.length > max)
        records = records.slice(-max);
      emit();
      return key;
    },
    destroy(key?: string | number, displayedRecord?: NoticeRecord | null) {
      if (key !== undefined) {
        const record =
          displayedRecord === undefined
            ? records.find((item) => item.key === key)
            : displayedRecord;
        if (record) finish(record);
      }
      // Closing one key invokes its latest callback. Clearing all is silent.
      records =
        key === undefined ? [] : records.filter((item) => item.key !== key);
      emit();
    },
    dispose() {
      disposed = true;
      mounted = false;
      store.destroy();
    },
  };
  return store;
}
export type NoticeStore = ReturnType<typeof createNoticeStore>;
export function NoticeHolder({
  store,
  kind,
  config,
}: {
  store: NoticeStore;
  kind: "message" | "notification";
  config: NoticeConfig;
}) {
  store.configure(
    kind === "notification" ? { ...config, placement: undefined } : config,
  );
  const context = useConfig();
  const prefixCls = context.getPrefixCls(kind, config.prefixCls);
  if (kind === "notification")
    store.configureNotification(context.notification, prefixCls);
  else store.configureMessage(context.message);
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
  const [target, setTarget] = useState<HTMLElement | ShadowRoot | null>(null);
  useLayoutEffect(() => {
    store.activate();
    return () => store.dispose();
  }, [store]);
  useEffect(() => {
    setTarget(
      config.getContainer?.() || context.getPopupContainer?.() || document.body,
    );
  }, [config.getContainer, context.getPopupContainer]);
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
    "--ao-notice-action-gap": `${t.marginSM}px`,
    "--ao-notice-icon-offset": `${t.marginSM + t.fontSizeLG * t.lineHeightLG}px`,
    "--ao-notice-title-line": t.lineHeightLG,
    "--ao-notice-message-icon": `${t.fontSizeLG}px`,
    "--ao-notice-icon-size": `${t.fontSizeLG * t.lineHeightLG}px`,
    "--ao-notice-title-size": `${t.fontSizeLG}px`,
    "--ao-notice-heading": t.colorTextHeading,
    "--ao-notice-padding-lg": `${t.paddingMD}px ${t.paddingContentHorizontalLG}px`,
    "--ao-notice-width":
      typeof nc?.width === "string" ? nc.width : `${nc?.width ?? 384}px`,
    "--ao-notice-edge": `${t.marginLG}px`,
    "--ao-notice-close-size": `${t.controlHeightLG * 0.55}px`,
    "--ao-notice-close-top": `${t.paddingMD}px`,
    "--ao-notice-close-end": `${t.paddingLG}px`,
    "--ao-notice-close-radius": `${t.borderRadiusSM}px`,
    "--ao-notice-close-color": t.colorIcon,
    "--ao-notice-close-hover": t.colorIconHover,
    "--ao-notice-hover-bg": t.colorBgTextHover,
    "--ao-notice-active-bg": t.colorBgTextActive,
    "--ao-notice-focus-width": `${t.lineWidthFocus}px`,
    "--ao-notice-focus-color": t.colorPrimaryBorder,
    "--ao-notice-progress-bg": `linear-gradient(90deg, ${t.colorPrimaryBorderHover}, ${t.colorPrimary})`,
    "--ao-notice-blur-bg": t.colorBgBlur,
    "--ao-motion-slow": t.motionDurationSlow,
    "--ao-motion-mid": t.motionDurationMid,
    "--ao-motion-ease-in-out": t.motionEaseInOut,
    "--ao-motion-ease-in-out-circ": t.motionEaseInOutCirc,
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
          return (
            <NoticeList
              key={placement}
              items={items}
              store={store}
              kind={kind}
              config={config}
              placement={placement}
              prefixCls={prefixCls}
              motionEnabled={t.motion}
              stackGap={t.margin}
              rtl={config.rtl ?? context.direction === "rtl"}
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
            />
          );
        }),
        target,
      )
    : null;
}
