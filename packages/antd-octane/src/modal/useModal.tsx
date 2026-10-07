// Native adaptation of Ant Design 5.29.3 modal/useModal (MIT).
import {
  type OctaneNode,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "octane";
import destroyFns from "./destroyFns";
import HookModal from "./HookModal";
import type {
  HookModalResult,
  ModalConfirmType,
  ModalFuncProps,
  ModalInstance,
} from "./interface";

interface RecordItem {
  key: number;
  config: ModalFuncProps;
  resolve: (confirmed: boolean) => void;
  isSilent: () => boolean;
  cleanup: () => void;
  closing?: boolean;
}
function createStore() {
  let records: RecordItem[] = [],
    sequence = 0;
  const listeners = new Set<() => void>();
  const emit = () => {
    for (const listener of listeners) listener();
  };
  const close = (key: number, ...args: unknown[]) => {
    const record = records.find((item) => item.key === key);
    if (!record) return;
    records = records.map((item) =>
      item.key === key ? { ...item, closing: true } : item,
    );
    emit();
    if (
      args.some(
        (arg) => (arg as { triggerCancel?: boolean } | null)?.triggerCancel,
      )
    ) {
      record.config.onCancel?.(() => {}, ...args.slice(1));
    }
  };
  const remove = (key: number, invokeAfterClose = true) => {
    const record = records.find((item) => item.key === key);
    records = records.filter((item) => item.key !== key);
    if (record) destroyFns.delete(record.cleanup);
    emit();
    if (invokeAfterClose) record?.config.afterClose?.();
  };
  const open = (config: ModalFuncProps): HookModalResult => {
    const key = ++sequence;
    let silent = false;
    const cleanup = () => remove(key, false);
    const promise = new Promise<boolean>((resolve) => {
      records = [
        ...records,
        { key, config, resolve, cleanup, isSilent: () => silent },
      ];
    });
    destroyFns.add(cleanup);
    emit();
    return {
      destroy: (...args) => close(key, ...args),
      update(next) {
        records = records.map((item) =>
          item.key === key
            ? {
                ...item,
                config: {
                  ...item.config,
                  ...(typeof next === "function" ? next(item.config) : next),
                },
              }
            : item,
        );
        emit();
      },
      // biome-ignore lint/suspicious/noThenProperty: Only hook/App confirmations expose the upstream awaitable result.
      then(resolve) {
        silent = true;
        return promise.then(resolve);
      },
    };
  };
  const typed = (type: ModalConfirmType) => (config: ModalFuncProps) =>
    open({ ...config, type });
  return {
    snapshot: () => records,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    close,
    remove,
    dispose() {
      for (const record of records) destroyFns.delete(record.cleanup);
      records = [];
    },
    api: {
      confirm: typed("confirm"),
      info: typed("info"),
      success: typed("success"),
      error: typed("error"),
      warning: typed("warning"),
    } satisfies ModalInstance,
  };
}
type Store = ReturnType<typeof createStore>;
function Holder({ store }: { store: Store }) {
  const records = useSyncExternalStore(
    store.subscribe,
    store.snapshot,
    store.snapshot,
  );
  useEffect(() => () => store.dispose(), [store]);
  return (
    <>
      {records.map((record) => (
        <HookModal
          key={record.key}
          config={record.config}
          open={!record.closing}
          close={(...args) => store.close(record.key, ...args)}
          afterClose={() => store.remove(record.key)}
          isSilent={record.isSilent}
          onConfirm={record.resolve}
        />
      ))}
    </>
  );
}
export default function useModal(): readonly [ModalInstance, OctaneNode] {
  const store = useMemo(createStore, []);
  return [store.api, <Holder store={store} />] as const;
}
