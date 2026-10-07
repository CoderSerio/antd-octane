// Adapted from Ant Design 5.29.3 modal/components/ConfirmCancelBtn.tsx (MIT).
import { useContext } from "octane";
import ActionButton from "../../_util/ActionButton";
import { ModalContext } from "../context";
export default function ConfirmCancelBtn() {
  const {
    autoFocusButton,
    cancelButtonProps,
    cancelTextLocale,
    isSilent,
    mergedOkCancel,
    rootPrefixCls,
    close,
    onCancel,
    onConfirm,
  } = useContext(ModalContext);
  return mergedOkCancel ? (
    <ActionButton
      isSilent={isSilent}
      actionFn={onCancel}
      close={(...args) => {
        close?.(...args);
        onConfirm?.(false);
      }}
      autoFocus={autoFocusButton === "cancel"}
      buttonProps={cancelButtonProps}
      prefixCls={`${rootPrefixCls}-btn`}
    >
      {cancelTextLocale}
    </ActionButton>
  ) : null;
}
