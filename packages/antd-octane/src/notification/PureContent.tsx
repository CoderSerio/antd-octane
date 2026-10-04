// Ant Design 5.29.3 components/notification/PurePanel.tsx (MIT), adapted to Octane.
import type { OctaneNode } from "octane";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from "../_util/feedback-icons";
import type { NotificationArgs } from "./interface";

const typeToIcon = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
};
export default function PureContent({
  prefixCls,
  icon,
  type,
  message,
  description,
  actions,
  role = "alert",
}: Pick<
  NotificationArgs,
  "icon" | "type" | "message" | "description" | "actions" | "role"
> & {
  prefixCls: string;
}) {
  const cls = (suffix: string) => [
    `ant-notification-notice-${suffix}`,
    prefixCls !== "ant-notification-notice" && `${prefixCls}-${suffix}`,
  ];
  let iconNode: OctaneNode = null;
  if (icon) iconNode = <span className={cls("icon")}>{icon}</span>;
  else if (type) {
    const Icon = typeToIcon[type];
    iconNode = (
      <Icon
        aria-label={
          {
            success: "check-circle",
            info: "info-circle",
            error: "close-circle",
            warning: "exclamation-circle",
          }[type]
        }
        className={[...cls("icon"), ...cls(`icon-${type}`)]}
        style={{ lineHeight: 1, textAlign: "center" }}
      />
    );
  }
  return (
    <div className={iconNode ? cls("with-icon") : undefined} role={role}>
      {iconNode}
      <div className={cls("message")}>{message}</div>
      {description && <div className={cls("description")}>{description}</div>}
      {actions && <div className={cls("actions")}>{actions}</div>}
    </div>
  );
}
