import { ConfigProvider, Flex, InputNumber, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Flex vertical gap={16}>
      <Space wrap>
        <InputNumber
          size="large"
          min={1}
          max={10}
          defaultValue={3}
          aria-label="大号数量"
        />
        <InputNumber min={1} max={10} defaultValue={3} aria-label="数量" />
        <InputNumber
          size="small"
          min={1}
          max={10}
          defaultValue={3}
          aria-label="小号数量"
        />
      </Space>
      <Space wrap>
        <InputNumber disabled defaultValue={3} aria-label="禁用数量" />
        <InputNumber readOnly defaultValue={3} aria-label="只读数量" />
        <InputNumber status="error" defaultValue={12} aria-label="错误数量" />
      </Space>
    </Flex>
  );
}
export function MoreDemo() {
  const [value, setValue] = useState<number | null>(2.5);
  return (
    <Flex vertical gap={16}>
      <Space wrap>
        <InputNumber
          value={value}
          onChange={setValue}
          min={0}
          max={10}
          step={0.1}
          precision={2}
          aria-label="单价"
        />
        <span aria-live="polite">
          当前数值：{value === null ? "空" : value}
        </span>
      </Space>
      <InputNumber
        defaultValue={1000}
        style={{ width: 160 }}
        aria-label="金额"
        formatter={(amount, info) =>
          info.userTyping ? info.input : `¥ ${amount ?? ""}`
        }
        parser={(text) => text?.replace(/[¥,\s]/g, "") ?? ""}
      />
      <ConfigProvider
        theme={{
          components: {
            InputNumber: { handleVisible: true, controlWidth: 140 },
          },
        }}
      >
        <InputNumber
          min={0}
          max={100}
          defaultValue={25}
          aria-label="常显步进按钮"
        />
      </ConfigProvider>
    </Flex>
  );
}
