import { Button, Space, Splitter } from "antd-octane";
import { useState } from "octane";

export function ControlledDemo() {
  const [sizes, setSizes] = useState<(number | string)[]>(["40%", "60%"]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button onClick={() => setSizes(["40%", "60%"])}>重置为 40% / 60%</Button>
      <Splitter
        style={{
          height: 200,
          width: "100%",
          boxShadow: "0 0 0 1px var(--line)",
        }}
        onResize={setSizes}
      >
        <Splitter.Panel size={sizes[0]} min="20%" style={{ padding: 16 }}>
          First：
          {typeof sizes[0] === "number"
            ? `${Math.round(sizes[0])}px`
            : sizes[0]}
        </Splitter.Panel>
        <Splitter.Panel size={sizes[1]} min="20%" style={{ padding: 16 }}>
          Second：
          {typeof sizes[1] === "number"
            ? `${Math.round(sizes[1])}px`
            : sizes[1]}
        </Splitter.Panel>
      </Splitter>
    </Space>
  );
}
