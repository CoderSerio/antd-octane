/** @jsxImportSource octane */
import type { OctaneNode } from "octane";
import { useMemo } from "octane";
import {
  createNoticeStore,
  type NoticeArgs,
  type NoticeConfig,
  NoticeHolder,
} from "../_util/notice";
export interface MessageArgs
  extends Omit<
    NoticeArgs,
    | "message"
    | "description"
    | "placement"
    | "actions"
    | "btn"
    | "closable"
    | "closeIcon"
  > {
  content: OctaneNode;
}
export interface MessageConfig
  extends Pick<
    NoticeConfig,
    "duration" | "maxCount" | "top" | "getContainer"
  > {}
export interface MessageType extends PromiseLike<boolean> {
  (): void;
}
type MessageOpen = (
  content: OctaneNode | MessageArgs,
  duration?: number | (() => void),
  onClose?: () => void,
) => MessageType;
export interface MessageInstance {
  open: (args: MessageArgs) => MessageType;
  destroy: (key?: string | number) => void;
  info: MessageOpen;
  success: MessageOpen;
  warning: MessageOpen;
  error: MessageOpen;
  loading: MessageOpen;
}
export function useMessage(
  config: MessageConfig = {},
): [MessageInstance, OctaneNode] {
  const store = useMemo(() => createNoticeStore(), []);
  store.configure(config);
  const api = useMemo(() => {
    const open = (args: MessageArgs): MessageType => {
      let done: () => void = () => {};
      const promise = new Promise<boolean>((resolve) => {
        done = () => resolve(true);
      });
      const key = store.open(args, done);
      return Object.assign(() => store.destroy(key), {
        // biome-ignore lint/suspicious/noThenProperty: MessageType intentionally provides the upstream callable thenable contract.
        then: promise.then.bind(promise),
      });
    };
    const typed =
      (type: MessageArgs["type"]): MessageOpen =>
      (content, duration, onClose) => {
        const args =
          typeof content === "object" &&
          content !== null &&
          "content" in content
            ? (content as MessageArgs)
            : { content };
        return open({
          ...args,
          type,
          duration: typeof duration === "number" ? duration : args.duration,
          onClose:
            typeof duration === "function"
              ? duration
              : (onClose ?? args.onClose),
        });
      };
    return {
      open,
      destroy: store.destroy,
      info: typed("info"),
      success: typed("success"),
      warning: typed("warning"),
      error: typed("error"),
      loading: typed("loading"),
    };
  }, [store]);
  return [api, <NoticeHolder store={store} kind="message" config={config} />];
}
export const message = { useMessage };
