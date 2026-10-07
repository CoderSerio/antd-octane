// Ant Design 5.29.3 notification close-icon precedence (MIT), adapted to Octane.
import type { OctaneNode } from "octane";
import { CloseOutlined } from "../_util/feedback-icons";
import type { ConfigComponentProps } from "../config-provider/context";
import type { NotificationConfig } from "./interface";

export function getCloseIconConfig(
  closeIcon: OctaneNode,
  config?: NotificationConfig,
  notification?: ConfigComponentProps["notification"],
) {
  if (closeIcon !== undefined) return closeIcon;
  if (config?.closeIcon !== undefined) return config.closeIcon;
  return notification?.closeIcon;
}
export function getCloseIcon(prefixCls: string, closeIcon?: OctaneNode) {
  if (closeIcon === null || closeIcon === false) return null;
  return (
    closeIcon || (
      <CloseOutlined
        aria-label="close"
        className={`${prefixCls}-close-icon`}
        style={{ lineHeight: 1, textAlign: "center" }}
      />
    )
  );
}
