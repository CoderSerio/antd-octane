import { Button, Flex } from "antd-octane";
import { useState } from "octane";

export function GapControlDemo() {
  const [gap, setGap] = useState(16);
  return (
    <Flex vertical gap="middle" style={{ width: "100%" }}>
      <label>
        自定义 gap：{gap}px
        <input
          type="range"
          min={0}
          max={40}
          value={gap}
          onInput={(event) =>
            setGap(Number((event.target as HTMLInputElement).value))
          }
        />
      </label>
      <Flex gap={gap} wrap>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
      </Flex>
    </Flex>
  );
}
