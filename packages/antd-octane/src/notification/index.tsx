/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { useMemo } from "octane";
import {
  createNoticeStore,
  type NoticeArgs,
  type NoticeConfig,
  NoticeHolder,
  type NoticePlacement,
} from "../_util/notice";
export type NotificationPlacement = NoticePlacement;
export interface NotificationArgs extends Omit<NoticeArgs, "content" | "type"> {
  message: OctaneNode;
  type?: "success" | "error" | "info" | "warning";
}
export interface NotificationConfig extends NoticeConfig {}
export interface NotificationInstance {
  open: (args: NotificationArgs) => void;
  success: (args: NotificationArgs) => void;
  error: (args: NotificationArgs) => void;
  info: (args: NotificationArgs) => void;
  warning: (args: NotificationArgs) => void;
  destroy: (key?: string | number) => void;
}
export function useNotification(
  config: NotificationConfig = {},
): [NotificationInstance, OctaneNode] {
  const store = useMemo(() => createNoticeStore(), []);
  store.configure(config);
  const api = useMemo(() => {
    const open = (args: NotificationArgs) => {
      store.open(args, () => {});
    };
    const typed =
      (type: NotificationArgs["type"]) => (args: NotificationArgs) =>
        open({ ...args, type });
    return {
      open,
      destroy: store.destroy,
      success: typed("success"),
      error: typed("error"),
      info: typed("info"),
      warning: typed("warning"),
    };
  }, [store]);
  return [
    api,
    <NoticeHolder store={store} kind="notification" config={config} />,
  ];
}
export const notification = { useNotification };
