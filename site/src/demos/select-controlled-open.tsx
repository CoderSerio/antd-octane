import { Button, Select, Space } from "antd-octane";
import { useState } from "octane";

const options = [
  { value: "draft", label: "草稿" },
  { value: "review", label: "审核中" },
  { value: "done", label: "完成", disabled: true },
];

export function SelectControlledOpenDemo() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("尚未选择");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        <Select
          options={options}
          open={open}
          onOpenChange={setOpen}
          onSelect={(_value, option) => setMessage(`选中了：${option.label}`)}
          placeholder="选择流程状态"
          aria-label="流程状态"
          style={{ width: 180 }}
        />
        <Button onClick={() => setOpen(!open)}>{open ? "收起" : "展开"}</Button>
      </Space>
      <span aria-live="polite">{message}</span>
    </Space>
  );
}
