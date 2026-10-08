import { Space, TreeSelect, type TreeSelectValue } from "antd-octane";
import { useState } from "octane";

const treeData = [
  {
    value: "engineering",
    title: "工程",
    children: [
      { value: "frontend", title: "前端" },
      { value: "backend", title: "后端" },
    ],
  },
  { value: "design", title: "设计", disabled: true },
];
export function BasicDemo() {
  const [value, setValue] = useState<TreeSelectValue | null>(null);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <TreeSelect
        aria-label="选择团队"
        treeData={treeData}
        value={value}
        onChange={(next) => setValue(next ?? null)}
        treeDefaultExpandAll
        allowClear
      />
      <p aria-live="polite">团队：{value ?? "未选择"}</p>
    </Space>
  );
}
