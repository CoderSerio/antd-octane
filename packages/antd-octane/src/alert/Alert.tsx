/** @jsxImportSource octane */
// Adapted from Ant Design 5.29.3 components/alert/Alert.tsx (MIT).
import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import {
  cloneElement,
  isValidElement,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import type { ClosableType } from "../_util/closable";
import { componentClassName } from "../_util/componentClassName";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from "../_util/feedback-icons";
import { useMotion } from "../_util/useMotion";
import { devUseWarning } from "../_util/warning";
import { useConfig } from "../config-provider";
import useAlertStyle from "./useAlertStyle";

export interface AlertRef {
  nativeElement: HTMLDivElement;
}
export interface AlertProps {
  ref?: Ref<AlertRef>;
  type?: "success" | "info" | "warning" | "error";
  closable?: ClosableType;
  /** @deprecated Use closable.closeIcon instead. */
  closeText?: OctaneNode;
  message?: OctaneNode;
  description?: OctaneNode;
  onClose?: (event: MouseEvent) => void;
  afterClose?: () => void;
  showIcon?: boolean;
  role?: string;
  style?: CSSProperties;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  banner?: boolean;
  icon?: OctaneNode;
  closeIcon?: OctaneNode;
  action?: OctaneNode;
  onMouseEnter?: HTMLAttributes<HTMLDivElement>["onMouseEnter"];
  onMouseLeave?: HTMLAttributes<HTMLDivElement>["onMouseLeave"];
  onClick?: HTMLAttributes<HTMLDivElement>["onClick"];
  id?: string;
}
const iconMapFilled = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
};
const iconLabels = {
  success: "check-circle",
  info: "info-circle",
  error: "close-circle",
  warning: "exclamation-circle",
};
function IconNode({
  type,
  icon,
  prefixCls,
}: {
  type: NonNullable<AlertProps["type"]>;
  icon?: OctaneNode;
  prefixCls: string;
}) {
  const className = componentClassName("ant-alert", prefixCls, "-icon");
  if (icon) {
    return isValidElement<{ className?: string }>(icon) ? (
      cloneElement(icon, {
        className: [className, icon.props.className].filter(Boolean).join(" "),
      })
    ) : (
      <span className={className}>{icon}</span>
    );
  }
  const StatusIcon = iconMapFilled[type];
  return <StatusIcon className={className} aria-label={iconLabels[type]} />;
}
function CloseIconNode({
  isClosable,
  prefixCls,
  closeIcon,
  handleClose,
  ariaProps,
}: {
  isClosable: boolean;
  prefixCls: string;
  closeIcon?: OctaneNode;
  handleClose: AlertProps["onClose"];
  ariaProps: Exclude<ClosableType, boolean>;
}) {
  return isClosable ? (
    <button
      type="button"
      onClick={handleClose}
      className={componentClassName("ant-alert", prefixCls, "-close-icon")}
      tabIndex={0}
      {...ariaProps}
    >
      {closeIcon === true || closeIcon === undefined ? (
        <CloseOutlined aria-label="close" />
      ) : (
        closeIcon
      )}
    </button>
  ) : null;
}
export default function InternalAlert({
  prefixCls: customPrefix,
  rootClassName,
  closeText,
  ref,
  message,
  description,
  type: kind,
  banner,
  showIcon,
  icon,
  closable,
  closeIcon,
  onClose,
  afterClose,
  action,
  className,
  style,
  id,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...otherProps
}: AlertProps) {
  const config = useConfig();
  const warning = devUseWarning("Alert");
  warning.deprecated(!closeText, "closeText", "closable.closeIcon");
  const prefixCls = config.getPrefixCls("alert", customPrefix);
  const part = (suffix = "") =>
    componentClassName("ant-alert", prefixCls, suffix);
  const contextClosable = config.alert?.closable;
  const mergedClosable = closable ?? contextClosable;
  const isClosable =
    typeof closable === "object" && closable.closeIcon
      ? true
      : closeText
        ? true
        : typeof closable === "boolean"
          ? closable
          : closeIcon !== false && closeIcon !== null && closeIcon !== undefined
            ? true
            : !!contextClosable;
  const mergedCloseIcon =
    (typeof closable === "object" && closable.closeIcon) ||
    closeText ||
    (closeIcon !== undefined
      ? closeIcon
      : (typeof contextClosable === "object" && contextClosable.closeIcon) ||
        config.alert?.closeIcon);
  const { closeIcon: _closeIcon, ...closeAria } =
    typeof mergedClosable === "object" ? mergedClosable : {};
  const type = kind !== undefined ? kind : banner ? "warning" : "info";
  const isShowIcon = banner && showIcon === undefined ? true : showIcon;
  const element = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => ({
    nativeElement: element.current as HTMLDivElement,
  }));
  const [closed, setClosed] = useState(false);
  const { motion, style: tokenStyle } = useAlertStyle(type, !!description);
  const alertMotion = useMotion(!closed, element, {
    enabled: motion,
    appear: false,
    onLeaveEnd: afterClose,
  });
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    if (alertMotion.phase === "leave")
      setMaxHeight(element.current?.offsetHeight);
  }, [alertMotion.phase]);
  const restProps = Object.fromEntries(
    Object.entries(otherProps).filter(
      ([key]) =>
        key === "role" || key.startsWith("aria-") || key.startsWith("data-"),
    ),
  );
  if (!alertMotion.present) return null;
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Mirrors the upstream optional alert wrapper mouse handlers; it is not a button.
    <div
      id={id}
      ref={element}
      data-show={!closed}
      className={[
        part(),
        part(`-${type}`),
        !!description && part("-with-description"),
        !isShowIcon && part("-no-icon"),
        !!banner && part("-banner"),
        config.direction === "rtl" && part("-rtl"),
        config.alert?.className,
        className,
        rootClassName,
        alertMotion.className(`${prefixCls}-motion`),
      ]}
      style={{
        ...tokenStyle,
        ...config.alert?.style,
        ...style,
        ...(alertMotion.phase === "leave"
          ? { maxHeight: alertMotion.active ? 0 : maxHeight }
          : {}),
      }}
      data-motion-phase={alertMotion.phase}
      data-motion-active={alertMotion.active ? "true" : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      role="alert"
      {...restProps}
    >
      {isShowIcon ? (
        <IconNode type={type} icon={icon} prefixCls={prefixCls} />
      ) : null}
      <div className={part("-content")}>
        {message ? <div className={part("-message")}>{message}</div> : null}
        {description ? (
          <div className={part("-description")}>{description}</div>
        ) : null}
      </div>
      {action ? <div className={part("-action")}>{action}</div> : null}
      <CloseIconNode
        isClosable={isClosable}
        prefixCls={prefixCls}
        closeIcon={mergedCloseIcon}
        ariaProps={closeAria}
        handleClose={(event) => {
          setClosed(true);
          onClose?.(event);
        }}
      />
    </div>
  );
}
