/** @jsxImportSource octane */
// Native counterpart of antd 5's DefaultLoadingIcon / IconWrapper (MIT).

import { componentClassName } from "../_util/componentClassName";
import { LoadingOutlined } from "../_util/feedback-icons";

export default function DefaultLoadingIcon({
  prefixCls,
}: {
  prefixCls: string;
}) {
  return (
    <span
      className={[
        componentClassName("ant-btn", prefixCls, "-icon"),
        componentClassName("ant-btn", prefixCls, "-loading-icon"),
      ]}
      aria-hidden="true"
    >
      <LoadingOutlined className="anticon-spin" />
    </span>
  );
}
