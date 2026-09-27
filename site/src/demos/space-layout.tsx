import { Button, Divider, Space } from "antd-octane";

export function LayoutDemo() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space size={[8, 16]} wrap>
        <Button>短按钮</Button>
        <Button>较长的操作按钮</Button>
        <Button>第三个操作</Button>
        <Button>更多选项</Button>
      </Space>
      <Space split={<Divider type="vertical" />}>
        <a href="#start">快速开始</a>
        <a href="#theme">主题</a>
        <a href="#compatibility">兼容说明</a>
      </Space>
    </Space>
  );
}
