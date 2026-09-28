import { Radio, Space } from "antd-octane";

const options = ["日", "周", "月"];
export function RadioButtonSizesDemo() {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Radio.Group
        aria-label="大号周期"
        size="large"
        optionType="button"
        defaultValue="周"
        options={options}
      />
      <Radio.Group
        aria-label="默认周期"
        optionType="button"
        defaultValue="周"
        options={options}
      />
      <Radio.Group
        aria-label="小号周期"
        size="small"
        optionType="button"
        buttonStyle="solid"
        defaultValue="周"
        options={options}
      />
      <Radio.Group
        aria-label="整行周期"
        block
        optionType="button"
        buttonStyle="solid"
        defaultValue="周"
        options={options}
      />
    </Space>
  );
}
