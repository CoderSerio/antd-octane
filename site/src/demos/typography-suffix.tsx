import { Space, Typography } from "antd-octane";
export function SuffixDemo() {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography.Paragraph
        style={{ maxWidth: 280 }}
        ellipsis={{ rows: 1, suffix: ".pdf" }}
      >
        {"Ant Design for Octane 组件设计与交互规范说明文档".repeat(3)}
      </Typography.Paragraph>
      <Typography.Paragraph
        ellipsis={{ rows: 2, suffix: "（节选）", expandable: "collapsible" }}
      >
        {"在内容较长时保留必要的后缀信息，让读者能够判断文件类型或内容来源。".repeat(
          6,
        )}
      </Typography.Paragraph>
    </Space>
  );
}
