import { Radio, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [value, set] = useState<string | number | boolean>(1);
  return (
    <Space direction="vertical" size="middle">
      <Radio.Group
        aria-label="发布环境"
        value={value}
        onChange={(event) => set(event.target.value ?? 1)}
        options={[
          { label: "开发", value: 1 },
          { label: "测试", value: 2 },
          { label: "生产", value: 3, disabled: true },
        ]}
      />
      <span>当前环境：{value}</span>
    </Space>
  );
}
export function MoreDemo() {
  return (
    <Space direction="vertical" size="middle">
      <Radio.Group
        aria-label="展示方式"
        defaultValue="list"
        optionType="button"
        buttonStyle="solid"
        options={[
          { label: "列表", value: "list" },
          { label: "卡片", value: "cards" },
        ]}
      />
      <Radio.Group aria-label="城市" name="city" defaultValue="sh">
        <Radio value="sh">上海</Radio>
        <Radio value="hz">杭州</Radio>
      </Radio.Group>
    </Space>
  );
}
