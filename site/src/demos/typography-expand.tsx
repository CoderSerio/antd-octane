import { Button, Space, Typography } from "antd-octane";
import { useState } from "octane";
export function ExpandDemo() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography.Paragraph
        ellipsis={{
          rows: 2,
          expandable: "collapsible",
          expanded,
          onExpand: (_event, info) => setExpanded(info.expanded),
        }}
      >
        {"组件文档既要展示默认效果，也应说明状态变化、边界条件以及可组合的使用方式。".repeat(
          8,
        )}
      </Typography.Paragraph>
      <Button onClick={() => setExpanded(!expanded)}>
        {expanded ? "从外部收起" : "从外部展开"}
      </Button>
      <span role="status">当前状态：{expanded ? "展开" : "收起"}</span>
    </Space>
  );
}
