// Native adaptation of Ant Design 5.29.3 modal/confirm.tsx (MIT).
import { mountStaticHolder } from "../_util/static-holder";
import warning from "../_util/warning";
import { useConfig } from "../config-provider";
import { getGlobalConfig, warnContext } from "../config-provider/global";
import ConfirmDialog from "./ConfirmDialog";
import destroyFns from "./destroyFns";
import type {
  ModalClose,
  ModalFuncProps,
  ModalResult,
  ModalStaticFunctions,
} from "./interface";

type StaticConfig = ModalFuncProps & { close?: ModalClose };
function StaticDialog(props: StaticConfig) {
  const context = useConfig();
  let getContainer = props.getContainer;
  if (getContainer === false) {
    warning(
      false,
      "Modal",
      "Static method not support `getContainer` to be `false` since it do not have context env.",
    );
    getContainer = undefined;
  }
  const rootPrefixCls = context.getPrefixCls();
  return (
    <ConfirmDialog
      {...props}
      rootPrefixCls={rootPrefixCls}
      prefixCls={props.prefixCls || `${rootPrefixCls}-modal`}
      iconPrefixCls={context.iconPrefixCls}
      theme={context.theme}
      direction={props.direction ?? context.direction}
      getContainer={getContainer}
    />
  );
}
export default function confirm(config: ModalFuncProps): ModalResult {
  const global = getGlobalConfig();
  if (!global.holderRender) warnContext("Modal");
  let currentConfig: StaticConfig = { ...config, close, open: true };
  let timer: ReturnType<typeof setTimeout>;
  let holder: ReturnType<typeof mountStaticHolder> | undefined;
  const scheduleRender = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const node = <StaticDialog {...currentConfig} />;
      const nextGlobal = {
        ...getGlobalConfig(),
        holderRender: global.holderRender,
      };
      if (holder) holder.render(node, nextGlobal);
      else holder = mountStaticHolder(node, nextGlobal);
    });
  };
  function destroy(...args: unknown[]) {
    if (
      args.some(
        (arg) => (arg as { triggerCancel?: boolean } | null)?.triggerCancel,
      )
    ) {
      config.onCancel?.(() => {}, ...args.slice(1));
    }
    destroyFns.delete(close);
    // rc-util's modern renderer also defers unmount beyond the current commit.
    void Promise.resolve().then(() => holder?.unmount());
  }
  function close(...args: unknown[]) {
    currentConfig = {
      ...currentConfig,
      open: false,
      afterClose() {
        config.afterClose?.();
        destroy(...args);
      },
    };
    if (currentConfig.visible) delete currentConfig.visible;
    scheduleRender();
  }
  scheduleRender();
  destroyFns.add(close);
  return {
    destroy: close,
    update(next) {
      currentConfig =
        typeof next === "function"
          ? next(currentConfig)
          : { ...currentConfig, ...next };
      scheduleRender();
    },
  };
}
export const staticMethods = Object.fromEntries(
  (["confirm", "info", "success", "error", "warning"] as const).map((type) => [
    type,
    (config: ModalFuncProps) => confirm({ ...config, type }),
  ]),
) as ModalStaticFunctions;
export const destroyAll = () => {
  for (const destroy of [...destroyFns]) destroy();
};
