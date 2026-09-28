import { Space, Switch, Typography } from "antd-octane";
import { useState } from "octane";

const content =
  "清晰的排版帮助读者在标题、段落和操作之间建立联系。长内容可以按需展开，保留阅读的连续性。".repeat(
    5,
  );
export function EllipsisDemo() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        <Switch checked={enabled} onChange={setEnabled} aria-label="启用省略" />
        启用省略
      </Space>
      <Typography.Paragraph ellipsis={enabled}>{content}</Typography.Paragraph>
      <Typography.Paragraph
        ellipsis={enabled ? { rows: 3, expandable: true } : false}
      >
        {content}
      </Typography.Paragraph>
    </Space>
  );
}
