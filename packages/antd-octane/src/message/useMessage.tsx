// Ant Design 5.29.3 components/message/useMessage.tsx (MIT), adapted to Octane.
import type { OctaneNode } from "octane";
import { useMemo, useRef } from "octane";
import {
  createNoticeStore,
  NoticeHolder,
  type NoticeStore,
} from "../_util/notice";
import { devUseWarning, type TypeWarning } from "../_util/warning";
import type {
  MessageArgs,
  MessageConfig,
  MessageInstance,
  MessageNoticeType,
  MessageOpen,
  MessageType,
} from "./interface";
import { wrapPromiseFn } from "./util";

type Task =
  | { type: "open"; args: MessageArgs; resolve: () => void }
  | { type: "destroy"; key?: string | number };
let keyIndex = 0;
function createMessageApi(
  store: NoticeStore,
  getWarning: () => TypeWarning,
): MessageInstance {
  let pending: Task[] = [];
  const enqueue = (task: Task) => {
    pending.push(task);
    if (pending.length !== 1) return;
    queueMicrotask(() => {
      const tasks = pending;
      pending = [];
      if (!store.isMounted()) return;
      // rc-notification closes records from the displayed render, not pending opens.
      const displayed = store.snapshot();
      for (const entry of tasks) {
        if (entry.type === "open") store.open(entry.args, entry.resolve);
        else
          store.destroy(
            entry.key,
            displayed.find((record) => record.key === entry.key) ?? null,
          );
      }
    });
  };
  const destroy = (key?: string | number) => {
    if (store.isMounted()) enqueue({ type: "destroy", key });
  };
  const open = (args: MessageArgs): MessageType => {
    if (!store.isMounted()) {
      getWarning()(
        false,
        "usage",
        "You are calling notice before contextHolder is mounted. Please trigger in effect instead.",
      );
      // Upstream's unmounted-holder result is inert and never resolves.
      return Object.assign(() => {}, {
        // biome-ignore lint/suspicious/noThenProperty: Preserve the upstream inert thenable for invalid hook calls.
        then: () => undefined,
      }) as unknown as MessageType;
    }
    const { message } = store.getMessageConfig();
    const key = args.key ?? `antd-message-${++keyIndex}`;
    return wrapPromiseFn((resolve) => {
      enqueue({
        type: "open",
        args: {
          ...args,
          key,
          className: [args.className, message?.className]
            .filter(Boolean)
            .join(" "),
          style: { ...message?.style, ...args.style },
        },
        resolve,
      });
      return () => destroy(key);
    });
  };
  const typed =
    (type: MessageNoticeType): MessageOpen =>
    (content, duration, onClose) => {
      const args =
        typeof content === "object" && content !== null && "content" in content
          ? (content as MessageArgs)
          : { content };
      return open({
        onClose: typeof duration === "function" ? duration : onClose,
        duration: typeof duration === "function" ? undefined : duration,
        ...args,
        type,
      });
    };
  return {
    open,
    destroy,
    info: typed("info"),
    success: typed("success"),
    warning: typed("warning"),
    error: typed("error"),
    loading: typed("loading"),
  };
}
export function useMessage(
  config: MessageConfig = {},
): readonly [MessageInstance, OctaneNode] {
  const store = useMemo(() => createNoticeStore(), []);
  const warning = devUseWarning("Message");
  const warningRef = useRef(warning);
  warningRef.current = warning;
  store.configure(config);
  const api = useMemo(
    () => createMessageApi(store, () => warningRef.current),
    [store],
  );
  return [api, <NoticeHolder store={store} kind="message" config={config} />];
}
