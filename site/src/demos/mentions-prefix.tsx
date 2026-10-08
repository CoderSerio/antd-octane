import { Mentions, Space } from "antd-octane";
import { useState } from "octane";

const options = [
  { value: "octane", label: "Octane 原生组件" },
  { value: "design", label: "设计规范" },
  { value: "docs", label: "使用文档" },
];
export function PrefixDemo() {
  const [selected, setSelected] = useState("尚未选择");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Mentions
        aria-label="提及标签"
        prefix="#"
        defaultValue="主题："
        placeholder="输入 # 查找标签"
        options={options}
        filterOption={(query, option) =>
          `${option.value} ${String(option.label)}`
            .toLowerCase()
            .includes(query.toLowerCase())
        }
        notFoundContent="没有匹配标签"
        onSelect={(option, prefix) => setSelected(`${prefix}${option.value}`)}
      />
      <p aria-live="polite">选中：{selected}</p>
    </Space>
  );
}
