import { Button, Flex, Slider } from "antd-octane";
import { useState } from "octane";

export function GapControlDemo() {
  const [gap, setGap] = useState(16);
  return (
    <Flex vertical gap="middle" style={{ width: "100%" }}>
      <div style={{ width: "100%" }}>
        <div>自定义 gap：{gap}px</div>
        <Slider
          aria-label="自定义 gap"
          min={0}
          max={40}
          step={1}
          value={gap}
          onChange={(value) => {
            if (typeof value === "number") setGap(value);
          }}
        />
      </div>
      <Flex gap={gap} wrap>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
      </Flex>
    </Flex>
  );
}
