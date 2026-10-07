import { Button, Radio, Slider, Space } from "antd-octane";
import { useState } from "octane";
export function SizesDemo() {
  const [size, setSize] = useState<"small" | "middle" | "large" | "customize">(
    "small",
  );
  const [customSize, setCustomSize] = useState(0);
  return (
    <>
      <Radio.Group
        value={size}
        onChange={(event) => setSize(event.target.value as typeof size)}
      >
        {["small", "middle", "large", "customize"].map((item) => (
          <Radio key={item} value={item}>
            {item}
          </Radio>
        ))}
      </Radio.Group>
      <br />
      <br />
      {size === "customize" && (
        <>
          <Slider
            value={customSize}
            onChange={(value) => setCustomSize(Number(value))}
          />
          <br />
        </>
      )}
      <Space size={size !== "customize" ? size : customSize}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="link">Link</Button>
      </Space>
    </>
  );
}
