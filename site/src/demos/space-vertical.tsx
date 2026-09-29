import { Button, Space } from "antd-octane";

export function VerticalDemo() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {["第一项", "第二项", "第三项"].map((label) => (
        <div
          key={label}
          style={{ padding: 12, border: "1px solid var(--line)" }}
        >
          {label} <Button size="small">操作</Button>
        </div>
      ))}
    </Space>
  );
}
