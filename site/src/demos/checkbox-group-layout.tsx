import { Checkbox, type CheckboxValue, Space } from "antd-octane";
import { useState } from "octane";

export function CheckboxGroupLayoutDemo() {
  const [selected, setSelected] = useState<CheckboxValue[]>(["email"]);
  const [preview, setPreview] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Checkbox.Group
        aria-label="通知渠道"
        value={selected}
        onChange={setSelected}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <Checkbox value="email">邮件通知</Checkbox>
          <Checkbox value="sms">短信通知</Checkbox>
          <Checkbox value="app">应用内通知</Checkbox>
          <Checkbox
            skipGroup
            checked={preview}
            onChange={(event) => setPreview(event.target.checked)}
          >
            仅预览
          </Checkbox>
        </div>
      </Checkbox.Group>
      <span role="status">
        渠道：{selected.join("、") || "无"}；预览：{preview ? "是" : "否"}
      </span>
    </Space>
  );
}
