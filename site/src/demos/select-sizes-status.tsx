import { Select, Space } from "antd-octane";

const options = [
  { value: "one", label: "选项一" },
  { value: "two", label: "选项二" },
];

export function SelectSizesStatusDemo() {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        options={options}
        size="large"
        placeholder="大尺寸"
        aria-label="大尺寸选择器"
        style={{ width: 200 }}
      />
      <Select
        options={options}
        status="error"
        placeholder="错误状态"
        aria-label="错误状态选择器"
        style={{ width: 200 }}
      />
      <Select
        options={options}
        size="small"
        status="warning"
        placeholder="小尺寸警告状态"
        aria-label="小尺寸警告状态选择器"
        style={{ width: 200 }}
      />
    </Space>
  );
}
