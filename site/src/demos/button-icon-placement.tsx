import { Button, Space } from "antd-octane";
import { useState } from "octane";

export function IconPlacementDemo() {
  const [placement, setPlacement] = useState<"start" | "end">("start");
  return (
    <Space direction="vertical">
      <Space wrap>
        <Button
          type="primary"
          icon={<span aria-hidden="true">➜</span>}
          iconPlacement={placement}
          onClick={() => setPlacement(placement === "start" ? "end" : "start")}
        >
          切换图标位置
        </Button>
        <Button
          shape="circle"
          icon={<span aria-hidden="true">+</span>}
          aria-label="添加"
        />
      </Space>
      <p aria-live="polite">
        图标当前位于：{placement === "start" ? "文字前" : "文字后"}
      </p>
    </Space>
  );
}
