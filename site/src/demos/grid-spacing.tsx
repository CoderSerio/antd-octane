import { Col, Row, Space } from "antd-octane";
import { useState } from "octane";

export function SpacingDemo() {
  const [gutter, setGutter] = useState(16);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <label>
        区块间隔：{gutter}px{" "}
        <input
          type="range"
          min={0}
          max={32}
          step={8}
          value={gutter}
          onInput={(event) =>
            setGutter(Number((event.target as HTMLInputElement).value))
          }
        />
      </label>
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
