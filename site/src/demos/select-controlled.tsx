import { Flex, Select, type SelectValue } from "antd-octane";
import { useState } from "octane";

const options = [
  { value: "apple", label: "苹果" },
  { value: "banana", label: "香蕉" },
  { value: "cherry", label: "樱桃", disabled: true },
];

export function ControlledDemo() {
  const [value, setValue] = useState<SelectValue | null>("apple");
  return (
    <Flex vertical gap={12} style={{ alignItems: "flex-start" }}>
      <Select
        options={options}
        value={value}
        showSearch
        allowClear
        aria-label="搜索并选择水果"
        style={{ width: 220 }}
        onChange={(next) => setValue(next ?? null)}
      />
      <p>当前值：{value ?? "未选择"}</p>
    </Flex>
  );
}
