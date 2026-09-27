import { Button, Input, Space } from "antd-octane";
import { useState } from "octane";

export function InputPasswordControlledDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input.Password
        aria-label="访问口令"
        defaultValue="octane-demo"
        visibilityToggle={{ visible, onVisibleChange: setVisible }}
        iconRender={(shown) => (shown ? "隐藏" : "显示")}
      />
      <Button onClick={() => setVisible(!visible)}>
        {visible ? "从外部隐藏" : "从外部显示"}
      </Button>
      <span aria-live="polite">当前状态：{visible ? "可见" : "隐藏"}</span>
    </Space>
  );
}
