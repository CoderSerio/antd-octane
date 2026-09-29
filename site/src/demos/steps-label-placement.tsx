import { Button, Space, Steps } from "antd-octane";
import { useState } from "octane";

export function LabelPlacementDemo() {
  const [vertical, setVertical] = useState(true);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button onClick={() => setVertical(!vertical)}>切换标签位置</Button>
      <Steps
        current={1}
        labelPlacement={vertical ? "vertical" : "horizontal"}
        items={[
          { title: "Finished", description: "已完成" },
          { title: "In Progress", description: "进行中" },
          { title: "Waiting", description: "等待" },
        ]}
      />
    </Space>
  );
}
