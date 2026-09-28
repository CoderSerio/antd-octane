import { Space, Typography } from "antd-octane";
import { useState } from "octane";
export function EditableDemo() {
  const [text, setText] = useState("点击右侧图标编辑这段文字");
  const [title, setTitle] = useState("可编辑标题");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography.Paragraph editable={{ onChange: setText }}>
        {text}
      </Typography.Paragraph>
      <Typography.Title
        level={4}
        editable={{ text: title, maxLength: 24, onChange: setTitle }}
      >
        {title}
      </Typography.Title>
      <Typography.Text type="secondary">
        标题最多输入 24 个字符。
      </Typography.Text>
    </Space>
  );
}
