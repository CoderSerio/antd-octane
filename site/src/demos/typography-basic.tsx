import { Space, Typography } from "antd-octane";
export function BasicDemo() {
  return (
    <div>
      <Typography.Title level={3}>设计与内容</Typography.Title>
      <Typography.Paragraph>
        通过清晰的层级组织信息，让用户快速找到需要的内容。
      </Typography.Paragraph>
      <Space wrap>
        <Typography.Text strong>强调</Typography.Text>
        <Typography.Text type="secondary">辅助说明</Typography.Text>
        <Typography.Text type="success">已完成</Typography.Text>
        <Typography.Text code>antd-octane</Typography.Text>
        <Typography.Text keyboard>Enter</Typography.Text>
        <Typography.Link href="#start">快速开始</Typography.Link>
      </Space>
    </div>
  );
}
