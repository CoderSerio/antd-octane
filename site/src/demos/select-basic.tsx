import { Flex, Select } from "antd-octane";

const options = [
  { value: "apple", label: "苹果" },
  { value: "banana", label: "香蕉" },
  { value: "cherry", label: "樱桃", disabled: true },
];

export function BasicDemo() {
  return (
    <Flex vertical gap={16} style={{ alignItems: "flex-start" }}>
      <Select
        options={options}
        placeholder="请选择水果"
        allowClear
        aria-label="水果"
        style={{ width: 220 }}
      />
      <Select
        options={options}
        defaultValue="banana"
        size="small"
        aria-label="小尺寸水果选择器"
        style={{ width: 220 }}
      />
      <Select
        options={options}
        disabled
        placeholder="不可选择"
        aria-label="禁用的水果选择器"
        style={{ width: 220 }}
      />
    </Flex>
  );
}
