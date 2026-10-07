import { Divider, Space } from "antd-octane";

export function SplitDemo() {
  return (
    <Space split={<Divider type="vertical" />}>
      <a href="#start">快速开始</a>
      <a href="#theme">主题定制</a>
      <a href="#compatibility">支持范围</a>
    </Space>
  );
}
