import { Splitter } from "antd-octane";

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
  return (
    <Splitter
      layout="vertical"
      style={{
        height: 300,
        width: "100%",
        boxShadow: "0 0 0 1px var(--line)",
      }}
    >
      <Splitter.Panel defaultSize="50%" min="20%" style={panelStyle}>
        First
      </Splitter.Panel>
      <Splitter.Panel min="20%" style={panelStyle}>
        Second
      </Splitter.Panel>
    </Splitter>
  );
}
