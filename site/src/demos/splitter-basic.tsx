import { Button, Space, Splitter } from "antd-octane";
import { useState } from "octane";

const panelStyle = { padding: 16 };
export function BasicDemo() {
  return (
    <Splitter
      style={{
        height: 220,
        width: "100%",
        boxShadow: "0 0 0 1px var(--line)",
      }}
    >
      <Splitter.Panel defaultSize="35%" min="20%" max="70%" style={panelStyle}>
        目录区域
      </Splitter.Panel>
      <Splitter.Panel style={panelStyle}>
        拖动中间分隔线，调整编辑区域。分隔线也可以通过方向键调整。
      </Splitter.Panel>
    </Splitter>
  );
}
export function MoreDemo() {
  const [sizes, setSizes] = useState<number[]>([100, 100, 100]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button onClick={() => setSizes([100, 100, 100])}>重置面板</Button>
      <Splitter
        layout="vertical"
        style={{
          height: 300,
          width: "100%",
          boxShadow: "0 0 0 1px var(--line)",
        }}
        onResize={setSizes}
      >
        {sizes.map((size, index) => (
          <Splitter.Panel key={index} size={size} min={40} style={panelStyle}>
            受控区域 {index + 1}：{Math.round(size)}px
          </Splitter.Panel>
        ))}
      </Splitter>
    </Space>
  );
}
