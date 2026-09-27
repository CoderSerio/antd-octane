import { Button, Space } from "antd-octane";
import { useState } from "octane";

const sizes = ["small", "middle", "large"] as const;

export function SizesDemo() {
  const [size, setSize] = useState<(typeof sizes)[number]>("middle");
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Space size="small" wrap>
        {sizes.map((option) => (
          <Button
            key={option}
            size="small"
            type={size === option ? "primary" : "default"}
            onClick={() => setSize(option)}
          >
            {option}
          </Button>
        ))}
      </Space>
      <Space size={size} wrap>
        <Button>保存</Button>
        <Button>预览</Button>
        <Button>取消</Button>
      </Space>
    </Space>
  );
}
