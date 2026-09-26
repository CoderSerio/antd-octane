import { Button, Flex, Progress, Space } from "antd-octane";
import { useState } from "octane";

export function BasicDemo() {
  return (
    <Flex vertical gap={16} style={{ width: "100%" }}>
      <Progress percent={30} />
      <Progress percent={70} status="active" />
      <Progress percent={50} status="exception" />
      <Progress percent={100} />
      <Progress percent={60} success={{ percent: 30 }} />
    </Flex>
  );
}

export function MoreDemo() {
  const [percent, setPercent] = useState(60);
  return (
    <Flex vertical gap={24} style={{ width: "100%" }}>
      <Flex gap={24} wrap="wrap" justify="center">
        <Progress type="circle" percent={percent} size={120} />
        <Progress type="dashboard" percent={percent} size={120} />
      </Flex>
      <Space>
        <Button
          disabled={percent === 0}
          onClick={() => setPercent(Math.max(0, percent - 10))}
        >
          减少进度
        </Button>
        <Button
          disabled={percent === 100}
          onClick={() => setPercent(Math.min(100, percent + 10))}
        >
          增加进度
        </Button>
      </Space>
      <Progress percent={percent} steps={10} />
    </Flex>
  );
}
