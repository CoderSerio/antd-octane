import { Button, Space } from "antd-octane";
import { useState } from "octane";

export function GhostActionsDemo() {
  const [action, setAction] = useState("尚未选择");
  return (
    <Space direction="vertical" style={{ width: 280, maxWidth: "100%" }}>
      <div style={{ background: "#1f2937", padding: 16, borderRadius: 8 }}>
        <Space wrap>
          <Button
            type="primary"
            ghost
            onClick={() => setAction("主要幽灵操作")}
          >
            幽灵主按钮
          </Button>
          <Button danger ghost onClick={() => setAction("危险幽灵操作")}>
            危险操作
          </Button>
        </Space>
      </div>
      <Button block onClick={() => setAction("块级操作")}>
        宽度跟随容器
      </Button>
      <p aria-live="polite">本地演示：{action}</p>
    </Space>
  );
}
