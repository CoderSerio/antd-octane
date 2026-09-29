import { Button, Form, InputNumber, Space } from "antd-octane";
import { useState } from "octane";

function IntervalInput({
  range = [0, 10],
  onRangeChange,
}: {
  range?: number[];
  onRangeChange?: (start: number, end: number) => void;
}) {
  return (
    <fieldset
      aria-label="数量范围"
      style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
    >
      <Space wrap>
        <InputNumber
          aria-label="最小数量"
          value={range[0]}
          min={0}
          onChange={(value) => onRangeChange?.(value ?? 0, range[1] ?? 10)}
        />
        <span>至</span>
        <InputNumber
          aria-label="最大数量"
          value={range[1]}
          min={0}
          onChange={(value) => onRangeChange?.(range[0] ?? 0, value ?? 0)}
        />
      </Space>
    </fieldset>
  );
}

export function CustomTriggerDemo() {
  const [result, setResult] = useState("设置可接受的数量范围");
  return (
    <Form
      layout="vertical"
      initialValues={{ quantityRange: [1, 10] }}
      onFinish={(values) =>
        setResult(`提交范围：${JSON.stringify(values.quantityRange)}`)
      }
    >
      <Form.Item
        name="quantityRange"
        label="数量范围"
        valuePropName="range"
        trigger="onRangeChange"
        getValueFromEvent={(start: number, end: number) => [start, end]}
        rules={[
          {
            validator: (_rule, value) => {
              const range = value as number[];
              if (range[0] > range[1])
                throw new Error("最小数量不能超过最大数量");
            },
          },
        ]}
        extra="onRangeChange 的两个参数被合并成数组；收集事件不必叫 onChange。"
      >
        <IntervalInput />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        保存范围
      </Button>
      <p role="status">{result}</p>
    </Form>
  );
}
