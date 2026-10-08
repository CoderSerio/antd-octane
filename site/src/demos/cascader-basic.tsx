import { Cascader, type CascaderValue, Space } from "antd-octane";
import { useState } from "octane";

const options = [
  {
    value: "zhejiang",
    label: "浙江",
    children: [
      { value: "hangzhou", label: "杭州" },
      { value: "ningbo", label: "宁波" },
    ],
  },
  {
    value: "jiangsu",
    label: "江苏",
    children: [{ value: "nanjing", label: "南京" }],
  },
];
export function BasicDemo() {
  const [value, setValue] = useState<CascaderValue[]>([]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Cascader
        aria-label="选择地区"
        options={options}
        value={value}
        onChange={setValue}
        allowClear
        placeholder="请选择地区"
      />
      <p aria-live="polite">路径：{value.join(" / ") || "未选择"}</p>
    </Space>
  );
}
