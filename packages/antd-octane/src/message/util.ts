// Ant Design 5.29.3 components/message/util.ts (MIT), adapted to Octane.
import type { MessageType } from "./interface";
export function wrapPromiseFn(
  open: (resolve: () => void) => () => void,
): MessageType {
  let close: (() => void) | undefined;
  const promise = new Promise<boolean>((resolve) => {
    close = open(() => resolve(true));
  });
  return Object.assign(() => close?.(), {
    // biome-ignore lint/suspicious/noThenProperty: Message intentionally returns a callable thenable, matching upstream.
    then: promise.then.bind(promise),
    promise,
  });
}
