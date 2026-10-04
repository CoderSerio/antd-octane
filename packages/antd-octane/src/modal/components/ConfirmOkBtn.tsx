// Adapted from Ant Design 5.29.3 modal/components/ConfirmOkBtn.tsx (MIT).
import { useContext } from "octane";
import ActionButton from "../../_util/ActionButton";
import { ModalContext } from "../context";
export default function ConfirmOkBtn() {
  const {
    autoFocusButton,
    close,
    isSilent,
    okButtonProps,
    rootPrefixCls,
    okTextLocale,
    okType,
    onConfirm,
    onOk,
  } = useContext(ModalContext);
  return (
    <ActionButton
      isSilent={isSilent}
      type={okType || "primary"}
      actionFn={onOk}
      close={(...args) => {
        close?.(...args);
        onConfirm?.(true);
      }}
      autoFocus={autoFocusButton === "ok"}
      buttonProps={okButtonProps}
      prefixCls={`${rootPrefixCls}-btn`}
    >
      {okTextLocale}
    </ActionButton>
  );
}
