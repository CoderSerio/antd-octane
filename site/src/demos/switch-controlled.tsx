import { Button, Space, Switch } from "antd-octane";
import { useState } from "octane";

export function ControlledDemo() {
  const [enabled, setEnabled] = useState(false);
  return (
    <Space direction="vertical" size="middle">
      <Space>
        <Switch
          aria-label="自动保存"
          checked={enabled}
          onChange={setEnabled}
          checkedChildren="开"
          unCheckedChildren="关"
        />
        <span role="status">自动保存：{enabled ? "开启" : "关闭"}</span>
      </Space>
      <Button onClick={() => setEnabled(!enabled)}>
        从外部{enabled ? "关闭" : "开启"}
      </Button>
    </Space>
  );
}
