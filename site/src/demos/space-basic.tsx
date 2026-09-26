import { Button, Divider, Space } from "antd-octane";
export function BasicDemo() {
  return (
    <Space direction="vertical" size="large">
      <Space wrap size={[8, 16]}>
        <Button type="primary">保存</Button>
        <Button>取消</Button>
        <Button>更多</Button>
      </Space>
      <Space split={<Divider type="vertical" />}>
        <a href="#start">快速开始</a>
        <a href="#theme">定制主题</a>
      </Space>
    </Space>
  );
}
