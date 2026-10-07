import { Button, Space } from "antd-octane";
export function AlignmentDemo() {
  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}
    >
      {(["center", "start", "end", "baseline"] as const).map((align) => (
        <div
          key={align}
          style={{
            flex: "none",
            margin: "8px 4px",
            padding: 4,
            border: "1px solid #40a9ff",
          }}
        >
          <Space align={align}>
            {align}
            <Button type="primary">Primary</Button>
            <span
              style={{
                display: "inline-block",
                padding: "32px 8px 16px",
                background: "rgba(150,150,150,0.2)",
              }}
            >
              Block
            </span>
          </Space>
        </div>
      ))}
    </div>
  );
}
