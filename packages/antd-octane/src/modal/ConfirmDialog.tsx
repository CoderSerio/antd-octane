// Native adaptation of Ant Design 5.29.3 modal/ConfirmDialog.tsx (MIT).
import { useMemo } from "octane";
import { componentClassName } from "../_util/componentClassName";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from "../_util/feedback-icons";
import { useComponentTokens } from "../_util/tokens";
import { devUseWarning } from "../_util/warning";
import { ConfigProvider } from "../config-provider";
import { useLocale } from "../locale";
import type { ThemeConfig } from "../theme/types";
import CancelBtn from "./components/ConfirmCancelBtn";
import OkBtn from "./components/ConfirmOkBtn";
import { ModalContext } from "./context";
import type { ModalClose, ModalFuncProps } from "./interface";
import Modal from "./Modal";

export interface ConfirmDialogProps extends ModalFuncProps {
  prefixCls: string;
  rootPrefixCls: string;
  iconPrefixCls?: string;
  theme?: ThemeConfig;
  close?: ModalClose;
  onConfirm?: (confirmed: boolean) => void;
  isSilent?: () => boolean;
}
export function ConfirmContent(props: ConfirmDialogProps) {
  const {
    icon,
    type,
    okCancel,
    okText,
    cancelText,
    footer,
    prefixCls,
    ...rest
  } = props;
  const warning = devUseWarning("Modal");
  warning(
    !(typeof icon === "string" && icon.length > 2),
    "breaking",
    `\`icon\` accepts OctaneNode instead of a string icon name. Please check \`${icon}\` at https://ant.design/components/icon`,
  );
  const cls = (suffix = "") =>
    componentClassName("ant-modal-confirm", `${prefixCls}-confirm`, suffix);
  const Icon =
    type === "info"
      ? InfoCircleFilled
      : type === "success"
        ? CheckCircleFilled
        : type === "error"
          ? CloseCircleFilled
          : ExclamationCircleFilled;
  const iconLabel =
    type === "info"
      ? "info-circle"
      : type === "success"
        ? "check-circle"
        : type === "error"
          ? "close-circle"
          : "exclamation-circle";
  const mergedOkCancel = okCancel ?? type === "confirm";
  const autoFocusButton: false | "ok" | "cancel" =
    props.autoFocusButton === null ? false : props.autoFocusButton || "ok";
  const [locale] = useLocale("Modal");
  const okTextLocale =
    okText || (mergedOkCancel ? locale.okText : locale.justOkText);
  const cancelTextLocale = cancelText || locale.cancelText;
  const context = useMemo(
    () => ({
      autoFocusButton,
      mergedOkCancel,
      okTextLocale,
      cancelTextLocale,
      ...rest,
    }),
    [autoFocusButton, mergedOkCancel, okTextLocale, cancelTextLocale, rest],
  );
  const originFooter = (
    <>
      <CancelBtn />
      <OkBtn />
    </>
  );
  const hasTitle = props.title !== undefined && props.title !== null;
  return (
    <div className={cls("-body-wrapper")}>
      <div className={[cls("-body"), hasTitle && cls("-body-has-title")]}>
        {!icon && icon !== null ? (
          <Icon aria-label={iconLabel} style={{ textAlign: "center" }} />
        ) : (
          icon
        )}
        <div className={cls("-paragraph")}>
          {hasTitle && <span className={cls("-title")}>{props.title}</span>}
          <div className={cls("-content")}>{props.content}</div>
        </div>
      </div>
      {footer === undefined || typeof footer === "function" ? (
        <ModalContext value={context}>
          <div className={cls("-btns")}>
            {typeof footer === "function"
              ? footer(originFooter, { OkBtn, CancelBtn })
              : originFooter}
          </div>
        </ModalContext>
      ) : (
        footer
      )}
    </div>
  );
}
function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    prefixCls,
    rootPrefixCls,
    direction,
    close,
    onConfirm,
    zIndex,
    closable = false,
    bodyStyle,
    maskStyle,
    styles,
  } = props;
  const { token } = useComponentTokens("Modal");
  const cls = (suffix = "") =>
    componentClassName("ant-modal-confirm", `${prefixCls}-confirm`, suffix);
  return (
    <Modal
      {...props}
      className={[
        cls(),
        prefixCls === `${rootPrefixCls}-modal` && "ao-confirm-hide-header",
        cls(`-${props.type}`),
        direction === "rtl" && cls("-rtl"),
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
      wrapClassName={[props.centered && cls("-centered"), props.wrapClassName]
        .filter(Boolean)
        .join(" ")}
      onCancel={() => {
        close?.({ triggerCancel: true });
        onConfirm?.(false);
      }}
      footer={null}
      transitionName={props.transitionName ?? `${rootPrefixCls}-zoom`}
      maskTransitionName={props.maskTransitionName ?? `${rootPrefixCls}-fade`}
      mask={props.mask === undefined ? true : props.mask}
      maskClosable={
        props.maskClosable === undefined ? false : props.maskClosable
      }
      style={props.style || {}}
      styles={{ body: bodyStyle, mask: maskStyle, ...styles }}
      width={props.width || 416}
      zIndex={zIndex === undefined ? token.zIndexPopupBase + 1000 : zIndex}
      closable={closable}
    >
      <ConfirmContent {...props} />
    </Modal>
  );
}
export default function ConfirmDialogWrapper(props: ConfirmDialogProps) {
  return (
    <ConfigProvider
      prefixCls={props.rootPrefixCls}
      iconPrefixCls={props.iconPrefixCls}
      direction={props.direction}
      theme={props.theme}
    >
      <ConfirmDialog {...props} />
    </ConfigProvider>
  );
}
