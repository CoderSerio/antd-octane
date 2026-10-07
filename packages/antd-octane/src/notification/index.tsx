// Ant Design 5.29.3 notification static API/holder lifecycle (MIT), adapted to Octane.
import { useContext, useLayoutEffect } from "octane";
import { mountStaticHolder } from "../_util/static-holder";
import { AppConfigContext } from "../app/context";
import { useConfig } from "../config-provider";
import { getGlobalConfig, warnContext } from "../config-provider/global";
import type {
  NotificationArgs,
  NotificationGlobalConfig,
  NotificationInstance,
} from "./interface";
import useNotification from "./useNotification";

export type {
  NotificationArgs,
  NotificationArgsProps,
  NotificationConfig,
  NotificationGlobalConfig,
  NotificationInstance,
  NotificationPlacement,
} from "./interface";
export { useNotification };

type Task =
  | { type: "open"; args: NotificationArgs }
  | { type: "destroy"; key?: string | number };
let staticConfig: NotificationGlobalConfig = {};
let staticApi: NotificationInstance | undefined;
let staticHolder: ReturnType<typeof mountStaticHolder> | undefined;
let taskQueue: Task[] = [];
function flush() {
  if (!staticApi) return;
  const tasks = taskQueue;
  taskQueue = [];
  for (const task of tasks) {
    if (task.type === "open") staticApi.open({ ...staticConfig, ...task.args });
    else staticApi.destroy(task.key);
  }
}
function GlobalHolder({ config }: { config: NotificationGlobalConfig }) {
  const { getPrefixCls } = useConfig();
  const appConfig = useContext(AppConfigContext);
  // Static calls use their own body/container; hook holders inherit getPopupContainer.
  const {
    getContainer,
    rtl,
    maxCount,
    top,
    bottom,
    showProgress,
    pauseOnHover,
  } = config;
  const container = getContainer?.() || document.body;
  const [api, holder] = useNotification({
    getContainer: () => container,
    rtl,
    maxCount,
    top,
    bottom,
    showProgress,
    pauseOnHover,
    prefixCls: config.prefixCls || getPrefixCls("notification"),
    ...appConfig.notification,
  });
  useLayoutEffect(() => {
    staticApi = api;
    queueMicrotask(flush);
  });
  return holder;
}
function ensure() {
  if (!staticHolder)
    staticHolder = mountStaticHolder(<GlobalHolder config={staticConfig} />);
  else staticHolder.render(<GlobalHolder config={staticConfig} />);
  // Re-render applies the latest holder/App settings before processing the queue.
  // Repeated calls can reuse the same API without rerunning the holder effect.
  queueMicrotask(flush);
}
const open = (args: NotificationArgs) => {
  if (!getGlobalConfig().holderRender) warnContext("notification");
  taskQueue.push({ type: "open", args });
  ensure();
};
export const notification = {
  open,
  success: (args: NotificationArgs) => open({ ...args, type: "success" }),
  error: (args: NotificationArgs) => open({ ...args, type: "error" }),
  info: (args: NotificationArgs) => open({ ...args, type: "info" }),
  warning: (args: NotificationArgs) => open({ ...args, type: "warning" }),
  destroy(key?: string | number) {
    taskQueue.push({ type: "destroy", key });
    ensure();
  },
  useNotification,
  config(value: NotificationGlobalConfig) {
    staticConfig = { ...staticConfig, ...value };
    staticHolder?.render(<GlobalHolder config={staticConfig} />);
  },
};
