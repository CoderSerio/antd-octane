import { InputNumber, Slider, Space } from "antd-octane";
import { useState } from "octane";

export function SliderInputNumberDemo() {
  const [value, setValue] = useState(0.5);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Slider
        aria-label="透明度滑块"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(next) => {
          if (typeof next === "number") setValue(next);
        }}
        tooltip={{ formatter: (next) => `${Math.round(next * 100)}%` }}
      />
      <Space wrap>
        <InputNumber
          aria-label="透明度数值"
          min={0}
          max={1}
          step={0.01}
          precision={2}
          value={value}
          onChange={(next) => setValue(next ?? 0)}
        />
        <span>两种输入共用一份受控值</span>
      </Space>
    </Space>
  );
}
