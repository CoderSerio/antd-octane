// Ant Design 5.29.3 components/message/index.tsx (MIT), adapted to Octane.
import { useContext, useLayoutEffect } from "octane";
import { mountStaticHolder } from "../_util/static-holder";
import { AppConfigContext } from "../app/context";
import { useConfig } from "../config-provider";
import { getGlobalConfig, warnContext } from "../config-provider/global";
import type {
  MessageArgs,
  MessageConfig,
  MessageInstance,
  MessageNoticeType,
  MessageOpen,
  MessageType,
} from "./interface";
import { useMessage } from "./useMessage";
import { wrapPromiseFn } from "./util";

export type {
  MessageArgs,
  MessageConfig,
  MessageInstance,
  MessageType,
} from "./interface";
export { useMessage } from "./useMessage";

interface OpenTask {
  type: "open";
  args: MessageArgs;
  resolve: () => void;
  setClose: (close: () => void) => void;
  skipped?: boolean;
}
interface TypeTask extends Omit<OpenTask, "type" | "args"> {
  type: MessageNoticeType;
  args: Parameters<MessageOpen>;
}
type Task = OpenTask | TypeTask | { type: "destroy"; key?: string | number };
let staticConfig: MessageConfig = {};
let staticApi: MessageInstance | undefined;
let staticHolder: ReturnType<typeof mountStaticHolder> | undefined;
let taskQueue: Task[] = [];
function flush() {
  if (!staticApi) return;
  const tasks = taskQueue;
  taskQueue = [];
  for (const task of tasks) {
    if (task.type === "destroy") staticApi.destroy(task.key);
    else if (!task.skipped) {
      const close =
        task.type === "open"
          ? staticApi.open({ ...staticConfig, ...task.args })
          : staticApi[task.type](...task.args);
      close.then(task.resolve);
      task.setClose(close);
    }
  }
}
function GlobalHolder({ config }: { config: MessageConfig }) {
  const { getPrefixCls } = useConfig();
  const appConfig = useContext(AppConfigContext);
  // Like upstream, static calls select their own container and holder options.
  const { getContainer, duration, rtl, maxCount, top } = config;
  const container = getContainer?.() || document.body;
  const [api, holder] = useMessage({
    getContainer: () => container,
    duration,
    rtl,
    maxCount,
    top,
    prefixCls: config.prefixCls || getPrefixCls("message"),
    ...appConfig.message,
  });
  useLayoutEffect(() => {
    // Delay the first instance so an immediate cold-call cancellation skips its task.
    queueMicrotask(() => {
      staticApi = api;
      flush();
    });
  });
  return holder;
}
function ensure() {
  if (!staticHolder)
    staticHolder = mountStaticHolder(<GlobalHolder config={staticConfig} />);
  else staticHolder.render(<GlobalHolder config={staticConfig} />);
  flush();
}
function enqueue(
  task:
    | Omit<OpenTask, "resolve" | "setClose">
    | Omit<TypeTask, "resolve" | "setClose">,
): MessageType {
  const result = wrapPromiseFn((resolve) => {
    let close: (() => void) | undefined;
    const pending = {
      ...task,
      resolve,
      setClose: (value: () => void) => {
        close = value;
      },
    } as OpenTask | TypeTask;
    taskQueue.push(pending);
    return () => {
      if (close) close();
      else pending.skipped = true;
    };
  });
  ensure();
  return result;
}
const typed =
  (type: MessageNoticeType): MessageOpen =>
  (...args) => {
    if (!getGlobalConfig().holderRender) warnContext("message");
    return enqueue({ type, args });
  };
export const message = {
  open: (args: MessageArgs) => enqueue({ type: "open", args }),
  info: typed("info"),
  success: typed("success"),
  error: typed("error"),
  warning: typed("warning"),
  loading: typed("loading"),
  destroy(key?: string | number) {
    taskQueue.push({ type: "destroy", key });
    ensure();
  },
  useMessage,
  config(value: MessageConfig) {
    staticConfig = { ...staticConfig, ...value };
    staticHolder?.render(<GlobalHolder config={staticConfig} />);
  },
};
