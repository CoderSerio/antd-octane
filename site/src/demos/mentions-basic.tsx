import { Mentions, Space } from "antd-octane";
import { useState } from "octane";

const options = [
  { value: "alice", label: "Alice" },
  { value: "bob", label: "Bob" },
  { value: "archived", label: "已停用", disabled: true },
];
export function BasicDemo() {
  const [value, setValue] = useState("");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Mentions
        aria-label="提及成员"
        placeholder="输入 @ 查找成员"
        options={options}
        value={value}
        onChange={setValue}
        allowClear
        autoSize={{ minRows: 2, maxRows: 4 }}
      />
      <p aria-live="polite">当前文本：{value || "空"}</p>
    </Space>
  );
}
