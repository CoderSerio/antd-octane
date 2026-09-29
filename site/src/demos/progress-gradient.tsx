import { Button, Progress, Space } from "antd-octane";
import { useState } from "octane";

export function GradientDemo() {
  const [warm, setWarm] = useState(false);
  const gradient = warm
    ? { "0%": "#fa8c16", "100%": "#ff4d4f" }
    : { "0%": "#1677ff", "100%": "#52c41a" };
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Progress percent={75} strokeColor={gradient} aria-label="渐变线形进度" />
      <Progress
        type="circle"
        percent={75}
        size={96}
        strokeColor={gradient}
        aria-label="渐变圆形进度"
      />
      <Button onClick={() => setWarm(!warm)}>切换渐变配色</Button>
    </Space>
  );
}
