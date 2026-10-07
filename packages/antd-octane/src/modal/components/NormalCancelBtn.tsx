// Adapted from Ant Design 5.29.3 components/modal/components/NormalCancelBtn.tsx (MIT).
import { useContext } from "octane";
import { Button } from "../../button";
import { ModalContext } from "../context";
export default function NormalCancelBtn() {
  const { cancelButtonProps, cancelTextLocale, onCancel } =
    useContext(ModalContext);
  return (
    <Button onClick={onCancel} {...cancelButtonProps}>
      {cancelTextLocale}
    </Button>
  );
}
