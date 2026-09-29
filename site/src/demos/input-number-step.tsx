import { InputNumber, Space } from "antd-octane";
import { useState } from "octane";

export function InputNumberStepDemo() {
  const [value, setValue] = useState<number | null>(1);
  const [lastStep, setLastStep] = useState("尚未步进");
  return (
    <Space direction="vertical">
      <InputNumber
        aria-label="每步四分之一"
        min={0}
        max={5}
        step="0.25"
        precision={2}
        value={value}
        onChange={setValue}
        onStep={(next, info) =>
          setLastStep(
            `${info.type === "up" ? "增加" : "减少"} ${Math.abs(info.offset)}，结果 ${next}`,
          )
        }
      />
      <span role="status">
        当前值：{value ?? "空"}；{lastStep}
      </span>
    </Space>
  );
}
