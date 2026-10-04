// Ant Design 5.29.3 components/message/PurePanel.tsx (MIT), adapted to Octane.
import type { OctaneNode } from "octane";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
  LoadingOutlined,
} from "../_util/feedback-icons";
import type { MessageNoticeType } from "./interface";

const TypeIcon = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
  loading: LoadingOutlined,
};
const TypeIconName = {
  info: "info-circle",
  success: "check-circle",
  error: "close-circle",
  warning: "exclamation-circle",
  loading: "loading",
};
export default function PureContent({
  prefixCls,
  type,
  icon,
  children,
}: {
  prefixCls: string;
  type?: MessageNoticeType;
  icon?: OctaneNode;
  children?: OctaneNode;
}) {
  const Icon = type && TypeIcon[type];
  return (
    <div
      className={[
        "ant-message-custom-content",
        `ant-message-${type}`,
        prefixCls !== "ant-message" && `${prefixCls}-custom-content`,
        prefixCls !== "ant-message" && `${prefixCls}-${type}`,
      ]}
    >
      {icon ||
        (Icon && type ? (
          <Icon
            aria-label={TypeIconName[type]}
            className={
              type === "loading"
                ? "ao-message-loading-icon anticon-spin"
                : undefined
            }
          />
        ) : null)}
      <span>{children}</span>
    </div>
  );
}
