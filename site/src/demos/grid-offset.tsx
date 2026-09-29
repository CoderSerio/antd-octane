import { Col, Row, Space } from "antd-octane";

export function OffsetDemo() {
  const box = {
    padding: 12,
    textAlign: "center" as const,
    color: "#fff",
    background: "#1677ff",
  };
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Row>
        <Col span={8}>
          <div style={box}>8</div>
        </Col>
        <Col span={8} offset={8}>
          <div style={box}>8 / offset 8</div>
        </Col>
      </Row>
      <Row>
        <Col span={6} offset={6}>
          <div style={box}>6 / offset 6</div>
        </Col>
        <Col span={6} offset={6}>
          <div style={box}>6 / offset 6</div>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <div style={box}>12 / offset 6</div>
        </Col>
      </Row>
    </Space>
  );
}
