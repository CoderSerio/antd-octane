import { Avatar, Badge, Button, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [count, set] = useState(5);
  return (
    <Space size="large" wrap>
      <Badge count={count} showZero>
        <Avatar shape="square">O</Avatar>
      </Badge>
      <Badge count={120}>
        <Avatar shape="square">A</Avatar>
      </Badge>
      <Badge dot>
        <Avatar shape="square">N</Avatar>
      </Badge>
      <Button size="small" onClick={() => set(Math.max(0, count - 1))}>
        减少
      </Button>
      <Button size="small" onClick={() => set(count + 1)}>
        增加
      </Button>
    </Space>
  );
}
export function MoreDemo() {
  return (
    <Space direction="vertical">
      <Badge status="success" text="已完成" />
      <Badge status="processing" text="进行中" />
      <Badge status="warning" text="等待处理" />
      <Badge status="error" text="失败" />
      <Badge count={0} showZero />
    </Space>
  );
}
