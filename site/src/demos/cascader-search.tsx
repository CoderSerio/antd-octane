import { Cascader, type CascaderValue, Space } from "antd-octane";
import { useState } from "octane";

const options = [
  {
    id: "docs",
    text: "文档",
    nodes: [
      { id: "start", text: "开始使用" },
      { id: "api", text: "API", disabled: true },
    ],
  },
  { id: "examples", text: "示例", nodes: [{ id: "form", text: "表单" }] },
];
export function SearchDemo() {
  const [value, setValue] = useState<CascaderValue[]>([]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Cascader
        aria-label="搜索文档路径"
        options={options}
        fieldNames={{ value: "id", label: "text", children: "nodes" }}
        showSearch
        changeOnSelect
        value={value}
        onChange={setValue}
        allowClear
      />
      <p aria-live="polite">
        允许选择中间节点：{value.join(" / ") || "未选择"}
      </p>
    </Space>
  );
}
