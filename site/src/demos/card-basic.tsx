import { Avatar, Button, Card, Space, Switch } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Card
      title="项目概览"
      extra={<a href="#overview">更多</a>}
      style={{ width: "100%" }}
      actions={[
        <Button type="link" key="docs">
          查看文档
        </Button>,
        <Button type="link" key="star">
          收藏
        </Button>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>O</Avatar>}
        title="Ant Design for Octane"
        description="组件、交互与主题配置。"
      />
    </Card>
  );
}
export function MoreDemo() {
  const [loading, set] = useState(true);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        <Switch checked={loading} onChange={set} aria-label="卡片加载" />
        <span>加载状态</span>
      </Space>
      <Card
        size="small"
        title="小尺寸卡片"
        loading={loading}
        style={{ width: "100%" }}
        hoverable
      >
        内容已就绪，可以继续操作。
      </Card>
    </Space>
  );
}
