import { Button, Timeline } from "antd-octane";
import { ClockCircleOutlined } from "antd-octane/icons";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Timeline
      items={[
        { children: "Create a services site 2015-09-01" },
        { children: "Solve initial network problems 2015-09-01" },
        { children: "Technical testing 2015-09-01" },
        { children: "Network problems being solved 2015-09-01" },
      ]}
    />
  );
}
export function PendingDemo() {
  const [reverse, setReverse] = useState(false);
  return (
    <div>
      <Timeline
        pending="Recording..."
        reverse={reverse}
        items={[
          { children: "Create a services site 2015-09-01" },
          { children: "Solve initial network problems 2015-09-01" },
          { children: "Technical testing 2015-09-01" },
        ]}
      />
      <Button
        type="primary"
        style={{ marginTop: 16 }}
        onClick={() => setReverse(!reverse)}
      >
        Toggle Reverse
      </Button>
    </div>
  );
}

export function AlternateDemo() {
  return (
    <Timeline
      mode="alternate"
      items={[
        { children: "Create a services site 2015-09-01" },
        {
          children: "Solve initial network problems 2015-09-01",
          color: "green",
        },
        {
          dot: <ClockCircleOutlined style={{ fontSize: 16 }} />,
          children: "Technical testing 2015-09-01",
        },
        { color: "red", children: "Network problems being solved 2015-09-01" },
      ]}
    />
  );
}

export function ColorDemo() {
  return (
    <Timeline
      style={{ width: "100%" }}
      items={[
        { key: 1, color: "green", children: "成功" },
        { key: 2, color: "blue", children: "进行中" },
        { key: 3, color: "red", children: "失败" },
        { key: 4, color: "gray", children: "未开始" },
      ]}
    />
  );
}

export function ReverseDemo() {
  return (
    <Timeline reverse style={{ width: "100%" }}>
      <Timeline.Item>第一条记录</Timeline.Item>
      <Timeline.Item>第二条记录</Timeline.Item>
      <Timeline.Item>第三条记录</Timeline.Item>
    </Timeline>
  );
}

export function DotDemo() {
  return (
    <Timeline style={{ width: "100%" }}>
      <Timeline.Item> Create a services site 2015-09-01 </Timeline.Item>
      <Timeline.Item> Solve initial network problems 2015-09-01 </Timeline.Item>
      <Timeline.Item dot={<ClockCircleOutlined />} color="red">
        Technical testing 2015-09-01
      </Timeline.Item>
      <Timeline.Item> Network problems being solved 2015-09-01 </Timeline.Item>
    </Timeline>
  );
}

export function RightDemo() {
  return (
    <Timeline mode="right" style={{ width: "100%" }}>
      <Timeline.Item label="09:00">开始构建</Timeline.Item>
      <Timeline.Item label="09:10">完成测试</Timeline.Item>
      <Timeline.Item label="09:30">发布预览</Timeline.Item>
    </Timeline>
  );
}

export function LabelDemo() {
  return (
    <Timeline mode="alternate" style={{ width: "100%" }}>
      <Timeline.Item label="2025-12-01">初始化项目</Timeline.Item>
      <Timeline.Item label="2025-12-05">完成组件迁移</Timeline.Item>
      <Timeline.Item label="2025-12-10">发布 Alpha</Timeline.Item>
    </Timeline>
  );
}
