import { Space, Typography } from "antd-octane";
export function TextDemo() {
  return (
    <Space direction="vertical">
      <Typography.Text>默认文本</Typography.Text>
      <Typography.Text type="secondary">辅助文本</Typography.Text>
      <Typography.Text type="success">成功文本</Typography.Text>
      <Typography.Text type="warning">警告文本</Typography.Text>
      <Typography.Text type="danger">危险文本</Typography.Text>
      <Typography.Text disabled>禁用文本</Typography.Text>
      <Typography.Text mark>高亮标记</Typography.Text>
      <Typography.Text code>pnpm add antd-octane</Typography.Text>
      <Typography.Text keyboard>Enter</Typography.Text>
      <Typography.Text underline>下划线</Typography.Text>
      <Typography.Text delete>已删除内容</Typography.Text>
      <Typography.Text strong>加粗内容</Typography.Text>
      <Typography.Text italic>斜体内容</Typography.Text>
      <Typography.Link
        href="https://5x.ant.design/components/typography-cn/"
        target="_blank"
        rel="noreferrer"
      >
        Ant Design 排版参考
      </Typography.Link>
    </Space>
  );
}
