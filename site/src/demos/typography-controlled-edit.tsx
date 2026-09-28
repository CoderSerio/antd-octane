import { Button, Space, Typography } from "antd-octane";
import { useState } from "octane";
export function ControlledEditDemo() {
  const [text, setText] = useState("文档站点名称");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("尚未修改");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button
        disabled={editing}
        onClick={() => {
          setEditing(true);
          setStatus("编辑中");
        }}
      >
        开始编辑
      </Button>
      <Typography.Paragraph
        editable={{
          editing,
          text,
          maxLength: 40,
          onStart: () => {
            setEditing(true);
            setStatus("编辑中");
          },
          onChange: setText,
          onEnd: () => {
            setEditing(false);
            setStatus("已保存");
          },
          onCancel: () => {
            setEditing(false);
            setStatus("已取消");
          },
        }}
      >
        {text}
      </Typography.Paragraph>
      <span role="status">{status}</span>
    </Space>
  );
}
