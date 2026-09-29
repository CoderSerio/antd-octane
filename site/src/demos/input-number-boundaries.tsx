import { Button, InputNumber, Space } from "antd-octane";
import { useState } from "octane";

export function InputNumberBoundariesDemo() {
  const [value, setValue] = useState<number | null>(8);
  const [max, setMax] = useState(10);
  return (
    <Space direction="vertical">
      <InputNumber
        aria-label="受控库存"
        min={1}
        max={max}
        value={value}
        onChange={setValue}
      />
      <Space wrap>
        <Button onClick={() => setMax(max === 10 ? 5 : 10)}>
          上限改为 {max === 10 ? 5 : 10}
        </Button>
        <Button onClick={() => setValue(99)}>从外部设为 99</Button>
        <Button
          onClick={() =>
            setValue(value === null ? 1 : Math.max(1, Math.min(max, value)))
          }
        >
          主动校正范围
        </Button>
      </Space>
      <span role="status">
        当前值：{value ?? "空"}；范围：1–{max}
      </span>
    </Space>
  );
}
