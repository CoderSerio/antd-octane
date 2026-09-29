import { Radio, Space, Switch } from "antd-octane";
import { useState } from "octane";

export function RadioDisabledDemo() {
  const [disabled, setDisabled] = useState(true);
  return (
    <Space direction="vertical">
      <Space>
        <Switch
          aria-label="禁用整组单选"
          checked={disabled}
          onChange={setDisabled}
        />
        <span>禁用整组</span>
      </Space>
      <Radio.Group
        aria-label="部署策略"
        disabled={disabled}
        defaultValue="rolling"
        options={[
          { value: "rolling", label: "滚动发布" },
          { value: "blue-green", label: "蓝绿发布" },
          { value: "canary", label: "灰度发布", disabled: true },
        ]}
      />
      <span>解除组禁用后，灰度发布仍保持单项禁用。</span>
    </Space>
  );
}
