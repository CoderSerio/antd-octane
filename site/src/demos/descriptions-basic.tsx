import { Descriptions, Tag } from "antd-octane";
export function BasicDemo() {
  return (
    <Descriptions
      style={{ width: "100%" }}
      title="项目信息"
      column={2}
      items={[
        { key: "name", label: "名称", children: "antd-octane" },
        {
          key: "status",
          label: "状态",
          children: <Tag color="processing">开发中</Tag>,
        },
        { key: "version", label: "版本", children: "0.1.0-alpha.0" },
        { key: "framework", label: "框架", children: "Octane" },
        {
          key: "notes",
          label: "说明",
          span: 2,
          children: "沿用熟悉的 API 与主题配置。",
        },
      ]}
    />
  );
}
export function MoreDemo() {
  return (
    <Descriptions
      style={{ width: "100%" }}
      bordered
      size="small"
      column={{ xs: 1, md: 2 }}
      items={[
        { key: "a", label: "环境", children: "开发预览" },
        { key: "b", label: "语言", children: "中文" },
        {
          key: "c",
          label: "主题",
          span: "filled",
          children: "支持默认、暗色与紧凑算法",
        },
      ]}
    />
  );
}
