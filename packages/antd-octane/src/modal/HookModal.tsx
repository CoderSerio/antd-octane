// Native adaptation of Ant Design 5.29.3 modal/useModal/HookModal.tsx (MIT).
import { useConfig } from "../config-provider";
import ConfirmDialog from "./ConfirmDialog";
import type { ModalClose, ModalFuncProps } from "./interface";

export interface HookModalProps {
  config: ModalFuncProps;
  open: boolean;
  close: ModalClose;
  afterClose: () => void;
  onConfirm: (confirmed: boolean) => void;
  isSilent: () => boolean;
}
export default function HookModal({
  config,
  open,
  close,
  afterClose,
  onConfirm,
  isSilent,
}: HookModalProps) {
  const context = useConfig();
  return (
    <ConfirmDialog
      prefixCls={context.getPrefixCls("modal")}
      rootPrefixCls={context.getPrefixCls()}
      {...config}
      open={open}
      close={close}
      afterClose={afterClose}
      direction={config.direction || context.direction}
      isSilent={isSilent}
      onConfirm={onConfirm}
    />
  );
}
