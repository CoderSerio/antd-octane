// Adapted from Ant Design 5.29.3 components/modal/shared.tsx (MIT).
import type { OctaneNode } from "octane";
import { createElement } from "octane";
import { componentClassName } from "../_util/componentClassName";
import { CloseOutlined } from "../_util/feedback-icons";
import { DisabledContextProvider } from "../config-provider/DisabledContext";
import { useLocale } from "../locale";
import NormalCancelBtn from "./components/NormalCancelBtn";
import NormalOkBtn from "./components/NormalOkBtn";
import { ModalContext } from "./context";
import type { ModalProps } from "./interface";

export function renderCloseIcon(prefixCls: string, closeIcon?: OctaneNode) {
  // A public element descriptor lets useClosable clone the wrapper's ARIA props.
  return createElement(
    "span",
    { className: componentClassName("ant-modal", prefixCls, "-close-x") },
    closeIcon ||
      createElement(CloseOutlined, {
        "aria-label": "close",
        className: componentClassName("ant-modal", prefixCls, "-close-icon"),
      }),
  );
}
export function Footer(
  props: Pick<
    ModalProps,
    | "onOk"
    | "onCancel"
    | "footer"
    | "okText"
    | "cancelText"
    | "okType"
    | "confirmLoading"
    | "okButtonProps"
    | "cancelButtonProps"
  >,
) {
  const [locale] = useLocale("Modal");
  const { footer, okText, cancelText, okType = "primary", ...rest } = props;
  let node: OctaneNode;
  if (footer === undefined || typeof footer === "function") {
    node = (
      <>
        <NormalCancelBtn />
        <NormalOkBtn />
      </>
    );
    if (typeof footer === "function")
      node = footer(node, { OkBtn: NormalOkBtn, CancelBtn: NormalCancelBtn });
    const footerNode = node;
    node = (
      <ModalContext
        value={{
          ...rest,
          okType,
          okTextLocale: okText || locale.okText,
          cancelTextLocale: cancelText || locale.cancelText,
        }}
      >
        {footerNode}
      </ModalContext>
    );
  } else node = footer;
  return (
    <DisabledContextProvider disabled={false}>{node}</DisabledContextProvider>
  );
}
