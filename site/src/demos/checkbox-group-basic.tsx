import type { CheckboxValue } from "antd-octane";
import { Button, Checkbox, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [values, set] = useState<CheckboxValue[]>(["docs"]);
  return (
    <Space direction="vertical">
      <Checkbox.Group
        aria-label="订阅内容"
        options={[
          { label: "文档", value: "docs" },
          { label: "发布", value: "releases" },
          { label: "内部消息", value: "internal", disabled: true },
        ]}
        value={values}
        onChange={set}
      />
      <span>已选：{values.join("、") || "无"}</span>
      <Button onClick={() => set([])}>清空订阅</Button>
    </Space>
  );
}
