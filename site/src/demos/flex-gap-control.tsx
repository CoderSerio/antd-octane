import { Button, Flex, Radio, Slider } from "antd-octane";
import { useState } from "octane";

export function GapControlDemo() {
  const [gapSize, setGapSize] = useState("small");
  const [customGapSize, setCustomGapSize] = useState(0);
  return (
    <Flex gap="middle" vertical style={{ width: "100%" }}>
      <Radio.Group
        value={gapSize}
        onChange={(event) => setGapSize(String(event.target.value))}
      >
        {["small", "middle", "large", "customize"].map((size) => (
          <Radio key={size} value={size}>
            {size}
          </Radio>
        ))}
      </Radio.Group>
      {gapSize === "customize" && (
        <Slider
          value={customGapSize}
          onChange={(value) => setCustomGapSize(Number(value))}
        />
      )}
      <Flex gap={gapSize !== "customize" ? gapSize : customGapSize}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="link">Link</Button>
      </Flex>
    </Flex>
  );
}
