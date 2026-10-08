import { Space, Upload } from "antd-octane";
import { useState } from "octane";
export function DraggerDemo() {
  const [notice, setNotice] = useState("仅接收不超过 1 MiB 的 .txt 文件");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Upload.Dragger
        aria-label="拖入文本文件"
        multiple
        accept=".txt"
        maxCount={2}
        beforeUpload={async (file) => {
          if (file.size > 1024 * 1024) {
            setNotice(`${file.name} 超过 1 MiB，已忽略`);
            return Upload.LIST_IGNORE;
          }
          return true;
        }}
        onRemove={(file) => !file.name.startsWith("keep-")}
        customRequest={({ onSuccess }) => {
          const timer = setTimeout(() => onSuccess({ localOnly: true }), 400);
          return { abort: () => clearTimeout(timer) };
        }}
      >
        拖入文本文件，或按 Enter/Space 选择；列表最多保留两个。
      </Upload.Dragger>
      <p aria-live="polite">{notice}</p>
      <p>
        本地模拟，不访问上传服务。文件名以 keep-
        开头时，示例业务规则会否决移除。数量上限之外的文件不会发起模拟请求。
      </p>
    </Space>
  );
}
