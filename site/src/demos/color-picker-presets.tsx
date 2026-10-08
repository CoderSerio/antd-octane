import { ColorPicker, Space } from "antd-octane";
import { useState } from "octane";
export function PresetsDemo() {
  const [result, setResult] = useState("完成调整后显示颜色");
  return (
    <Space direction="vertical">
      <ColorPicker
        aria-label="选择不透明预设色"
        defaultValue="#722ed1"
        defaultFormat="rgb"
        disabledAlpha
        showText
        presets={[
          { label: "品牌色", colors: ["#1677ff", "#722ed1", "#13a8a8"] },
        ]}
        onChangeComplete={(color) => setResult(color.toRgbString())}
      />
      <p aria-live="polite">{result}</p>
    </Space>
  );
}
