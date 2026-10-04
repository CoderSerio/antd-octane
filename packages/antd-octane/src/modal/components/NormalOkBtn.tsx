// Adapted from Ant Design 5.29.3 components/modal/components/NormalOkBtn.tsx (MIT).
import { useContext } from "octane";
import { Button } from "../../button";
import { ModalContext } from "../context";
export default function NormalOkBtn() {
  const { okButtonProps, okTextLocale, okType, confirmLoading, onOk } =
    useContext(ModalContext);
  return (
    <Button
      type={okType === "danger" ? undefined : okType}
      danger={okType === "danger" || undefined}
      loading={confirmLoading}
      onClick={onOk}
      {...okButtonProps}
    >
      {okTextLocale}
    </Button>
  );
}
