import { ColorPicker, type ColorValue, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [value, setValue] = useState<ColorValue>("#1677ff");
  const [css, setCss] = useState("#1677ff");
  return (
    <Space direction="vertical">
      <ColorPicker
        aria-label="选择品牌色"
        value={value}
        onChange={(color, text) => {
          setValue(color);
          setCss(text);
        }}
        allowClear
        showText
      />
      <code aria-live="polite">{css}</code>
    </Space>
  );
}
