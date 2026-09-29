import { Button, Space } from "antd-octane";

export function AlignmentDemo() {
  return (
    <Space direction="vertical" size="large">
      {(["start", "center", "end", "baseline"] as const).map((align) => (
        <div key={align}>
          <p>
            <code>align="{align}"</code>
          </p>
          <Space align={align}>
            <span style={{ fontSize: 12 }}>文字</span>
            <Button>按钮</Button>
            <div style={{ padding: "20px 12px", background: "var(--subtle)" }}>
              高区块
            </div>
          </Space>
        </div>
      ))}
    </Space>
  );
}
