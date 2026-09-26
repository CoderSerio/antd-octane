import { Alert, Flex, Space, Spin, Switch } from "antd-octane";
import { useState } from "octane";

export function BasicDemo() {
  return (
    <Space size={32}>
      <Spin size="small" />
      <Spin />
      <Spin size="large" />
    </Space>
  );
}

export function MoreDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <Flex vertical gap={24} style={{ width: "100%" }}>
      <Space>
        <Switch
          checked={loading}
          onChange={setLoading}
          aria-label="切换加载状态"
        />
        加载中
      </Space>
      <Spin spinning={loading} tip="正在读取项目…" delay={200}>
        <Alert
          type="info"
          message="项目概览"
          description="加载时保留内容的位置，避免页面布局跳动。"
        />
      </Spin>
    </Flex>
  );
}
