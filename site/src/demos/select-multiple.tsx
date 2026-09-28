import type { SelectValue } from "antd-octane";
import { Button, Select, Space } from "antd-octane";
import { useState } from "octane";

const options = [
  { value: "design", label: "设计" },
  { value: "development", label: "开发" },
  { value: "testing", label: "测试" },
  { value: "archived", label: "已归档", disabled: true },
];

export function MultipleDemo() {
  return (
    <Select
      mode="multiple"
      aria-label="选择参与角色"
      defaultValue={["design"]}
      options={options}
      allowClear
      placeholder="选择参与角色"
      style={{ width: "100%" }}
    />
  );
}
export function ControlledMultipleDemo() {
  const [value, setValue] = useState<SelectValue[]>(["development"]);
  const [event, setEvent] = useState("尚未操作");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        mode="multiple"
        aria-label="受控参与角色"
        value={value}
        onChange={setValue}
        onSelect={(v) => setEvent(`选中 ${v}`)}
        onDeselect={(v) => setEvent(`移除 ${v}`)}
        options={options}
        allowClear
        style={{ width: "100%" }}
      />
      <Button onClick={() => setValue(["development"])}>恢复默认选择</Button>
      <span role="status">
        {event}；当前值：{JSON.stringify(value)}
      </span>
    </Space>
  );
}
