// Ant Design 5.29.3 components/notification/useNotification.tsx (MIT), adapted to Octane.
import type { OctaneNode } from "octane";
import { useMemo, useRef } from "octane";
import {
  createNoticeStore,
  NoticeHolder,
  type NoticeStore,
} from "../_util/notice";
import { devUseWarning, type TypeWarning } from "../_util/warning";
import type {
  NotificationArgs,
  NotificationConfig,
  NotificationInstance,
} from "./interface";
import { getCloseIcon, getCloseIconConfig } from "./util";

type Task =
  | { type: "open"; args: NotificationArgs }
  | { type: "destroy"; key?: string | number };

function createNotificationApi(
  store: NoticeStore,
  getWarning: () => TypeWarning,
  initialConfig: NotificationConfig,
): NotificationInstance {
  let pending: Task[] = [];
  const enqueue = (task: Task) => {
    pending.push(task);
    if (pending.length !== 1) return;
    queueMicrotask(() => {
      const tasks = pending;
      pending = [];
      if (!store.isMounted()) return;
      // rc-notification flushes hook API tasks after the current event/render.
      // Close callbacks belong to displayed notices, rather than pending opens.
      const displayed = store.snapshot();
      for (const entry of tasks) {
        if (entry.type === "open") store.open(entry.args, () => {});
        else
          store.destroy(
            entry.key,
            displayed.find((record) => record.key === entry.key) ?? null,
          );
      }
    });
  };
  const open = (args: NotificationArgs) => {
    const warning = getWarning();
    if (!store.isMounted()) {
      warning(
        false,
        "usage",
        "You are calling notice before contextHolder is mounted. Please trigger in effect instead.",
      );
      return;
    }
    warning.deprecated(!args.btn, "btn", "actions");
    const { notification, prefixCls } = store.getNotificationConfig();
    const closeIcon = getCloseIcon(
      `${prefixCls}-notice`,
      getCloseIconConfig(args.closeIcon, initialConfig, notification),
    );
    enqueue({
      type: "open",
      args: {
        placement: initialConfig.placement ?? "topRight",
        ...args,
        actions: args.actions ?? args.btn,
        className: [args.className, notification?.className]
          .filter(Boolean)
          .join(" "),
        style: { ...notification?.style, ...args.style },
        closeIcon,
        closable: args.closable ?? !!closeIcon,
      },
    });
  };
  const typed = (type: NotificationArgs["type"]) => (args: NotificationArgs) =>
    open({ ...args, type });
  return {
    open,
    destroy: (key) => {
      if (store.isMounted()) enqueue({ type: "destroy", key });
    },
    success: typed("success"),
    error: typed("error"),
    info: typed("info"),
    warning: typed("warning"),
  };
}
export function useNotification(
  config: NotificationConfig = {},
): readonly [NotificationInstance, OctaneNode] {
  const store = useMemo(() => createNoticeStore(), []);
  const warning = devUseWarning("Notification");
  const warningRef = useRef(warning);
  warningRef.current = warning;
  store.configure({ ...config, placement: undefined });
  const api = useMemo(
    () => createNotificationApi(store, () => warningRef.current, config),
    [store],
  );
  return [
    api,
    <NoticeHolder store={store} kind="notification" config={config} />,
  ];
}

export default useNotification;
