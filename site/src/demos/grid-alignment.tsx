import { Col, Row, Space } from "antd-octane";

export function AlignmentDemo() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {(["top", "middle", "bottom"] as const).map((align) => (
        <div key={align}>
          <p>align="{align}"，justify="space-around"</p>
          <Row
            align={align}
            justify="space-around"
            style={{ height: 120, background: "var(--subtle)" }}
          >
            {[40, 70, 100].map((height) => (
              <Col key={height} span={6}>
                <div
                  style={{
                    height,
                    padding: 8,
                    color: "#fff",
                    background: "#1677ff",
                  }}
                >
                  {height}px
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Space>
  );
}
