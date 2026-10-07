import { Timeline } from "antd-octane";
export function BasicDemo() {
  return (
    <Timeline
      style={{ width: "100%" }}
      items={[
        { key: 1, color: "green", children: "创建项目" },
        { key: 2, color: "green", children: "完成组件验证" },
        { key: 3, color: "red", children: "修复回归问题" },
        { key: 4, children: "继续扩展组件" },
      ]}
    />
  );
}
export function MoreDemo() {
  return (
    <Timeline
      style={{ width: "100%" }}
      mode="alternate"
      pending="等待发布"
      items={[
        { key: 1, label: "09:00", children: "开始构建" },
        { key: 2, label: "09:10", children: "行为测试通过" },
        { key: 3, label: "09:15", children: "准备预览包" },
      ]}
    />
  );
}
