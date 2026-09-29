import { InputNumber, Space, Switch } from "antd-octane";
import { useState } from "octane";

export function InputNumberControlsDemo() {
  const [keyboard, setKeyboard] = useState(true);
  const [controls, setControls] = useState(true);
  return (
    <Space direction="vertical">
      <Space>
        <Switch
          aria-label="显示步进按钮"
          checked={controls}
          onChange={setControls}
        />
        <span>显示步进按钮</span>
      </Space>
      <Space>
        <Switch
          aria-label="允许方向键步进"
          checked={keyboard}
          onChange={setKeyboard}
        />
        <span>允许方向键步进</span>
      </Space>
      <InputNumber
        aria-label="数量设置"
        min={0}
        max={20}
        defaultValue={5}
        controls={controls}
        keyboard={keyboard}
      />
    </Space>
  );
}
