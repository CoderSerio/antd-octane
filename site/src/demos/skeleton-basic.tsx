import { Flex, Skeleton, Space, Switch, Typography } from "antd-octane";
import { useState } from "octane";

export function BasicDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <Flex vertical gap={24} style={{ width: "100%" }}>
      <Space>
        <Switch
          checked={loading}
          onChange={setLoading}
          aria-label="切换骨架屏"
        />
        显示骨架屏
      </Space>
      <Skeleton loading={loading} avatar active paragraph={{ rows: 3 }}>
        <div>
          <Typography.Title level={4}>让等待更清晰</Typography.Title>
          <Typography.Paragraph>
            骨架屏在首次加载时提示内容的结构。已有内容的刷新更适合使用
            Spin，避免反复隐藏用户正在阅读的信息。
          </Typography.Paragraph>
        </div>
      </Skeleton>
    </Flex>
  );
}

export function MoreDemo() {
  return (
    <Flex vertical gap={24} style={{ width: "100%" }}>
      <Space wrap size={16}>
        <Skeleton.Avatar active size="large" />
        <Skeleton.Button active />
        <Skeleton.Button active shape="round" />
      </Space>
      <Skeleton.Input active block />
      <Space wrap size={16}>
        <Skeleton.Image active />
        <Skeleton.Node active>
          <span>图表</span>
        </Skeleton.Node>
      </Space>
    </Flex>
  );
}
