import { Space, TreeSelect, type TreeSelectValue } from "antd-octane";
import { useState } from "octane";

const treeData = [
  {
    value: "docs",
    title: "文档",
    children: [
      { value: "start", title: "开始使用" },
      { value: "api", title: "API" },
    ],
  },
  { value: "examples", title: "示例" },
];
export function MultipleDemo() {
  const [value, setValue] = useState<TreeSelectValue[]>([]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <TreeSelect
        aria-label="搜索并选择栏目"
        multiple
        showSearch
        treeData={treeData}
        value={value}
        onChange={setValue}
        treeDefaultExpandAll
        allowClear
      />
      <p aria-live="polite">
        独立节点多选，不做父子勾选联动：{value.join(", ") || "空"}
      </p>
    </Space>
  );
}
