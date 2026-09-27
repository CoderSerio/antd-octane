import { Button, Progress, Space } from "antd-octane";
import { useState } from "octane";

export function VerificationDemo() {
  const [verified, setVerified] = useState(0);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <p>文件已全部传输，正在逐项校验 4 个部分。</p>
      <Progress
        percent={100}
        success={{ percent: verified * 25 }}
        format={(_, successPercent) => `${successPercent}% 已校验`}
        aria-label="文件校验进度"
      />
      <Space wrap>
        <Button
          type="primary"
          disabled={verified === 4}
          onClick={() => setVerified(Math.min(4, verified + 1))}
        >
          完成一项校验
        </Button>
        <Button disabled={verified === 0} onClick={() => setVerified(0)}>
          重新校验
        </Button>
      </Space>
    </Space>
  );
}
