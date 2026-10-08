import { Col, Row, Slider, Space } from "antd-octane";
import { useState } from "octane";

export function SpacingDemo() {
  const [gutter, setGutter] = useState(16);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div style={{ width: "100%" }}>
        <div>区块间隔：{gutter}px</div>
        <Slider
          aria-label="区块间隔"
          min={0}
          max={32}
          step={8}
          value={gutter}
          onChange={(value) => {
            if (typeof value === "number") setGutter(value);
          }}
        />
      </div>
      <Row gutter={[gutter, gutter]}>
        {[1, 2, 3, 4, 5, 6].map((number) => (
          <Col key={number} span={8}>
            <div
              style={{
                padding: 12,
                textAlign: "center",
                color: "#fff",
                background: "#1677ff",
              }}
            >
              col-8
            </div>
          </Col>
        ))}
      </Row>
    </Space>
  );
}
