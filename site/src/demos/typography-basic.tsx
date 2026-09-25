import { Space, Typography } from "antd-octane";
import { useState } from "octane";
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
export function MoreDemo() {
  const [text, setText] = useState("点击编辑，输入你的项目名称");
  return (
    <div style={{ width: "100%" }}>
      <Typography.Paragraph editable={{ onChange: setText }} copyable>
        {text}
      </Typography.Paragraph>
      <Typography.Paragraph ellipsis={{ rows: 2, expandable: "collapsible" }}>
        {"组件库应帮助用户专注于业务。熟悉的交互与主题配置，可以降低迁移时的学习成本。".repeat(
          5,
        )}
      </Typography.Paragraph>
    </div>
  );
}
