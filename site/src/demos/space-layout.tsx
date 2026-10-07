import { Button, Space } from "antd-octane";

export function LayoutDemo() {
  return (
    <Space size={[8, 16]} wrap style={{ width: 250, maxWidth: "100%" }}>
      <Button>短按钮</Button>
      <Button>较长的操作按钮</Button>
      <Button>第三个操作</Button>
      <Button>更多选项</Button>
    </Space>
  );
}
