import { Checkbox, Space, Splitter } from "antd-octane";
import { useState } from "octane";

export function ResizableDemo() {
  const [resizable, setResizable] = useState(true);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Checkbox
        checked={resizable}
        onChange={(event) => setResizable(event.target.checked)}
      >
        允许调整
      </Checkbox>
      <Splitter
        style={{
          height: 180,
          width: "100%",
          boxShadow: "0 0 0 1px var(--line)",
        }}
      >
        <Splitter.Panel resizable={resizable} min="20%" style={{ padding: 16 }}>
          First
        </Splitter.Panel>
        <Splitter.Panel min="20%" style={{ padding: 16 }}>
          Second
        </Splitter.Panel>
      </Splitter>
      <p>相邻任一面板禁用后，分隔线不能拖动或获得键盘焦点。</p>
    </Space>
  );
}
