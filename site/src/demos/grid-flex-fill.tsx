import { Col, Row, Space } from "antd-octane";

export function FlexFillDemo() {
  const box = {
    padding: 12,
    textAlign: "center" as const,
    color: "#fff",
    background: "#1677ff",
  };
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Row gutter={8}>
        <Col flex="100px">
          <div style={box}>100px</div>
        </Col>
        <Col flex="auto">
          <div style={box}>auto</div>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col flex={1}>
          <div style={box}>1</div>
        </Col>
        <Col flex={2}>
          <div style={box}>2</div>
        </Col>
      </Row>
      <p>固定列与弹性列可组合；剩余空间按 flex 比例分配。</p>
    </Space>
  );
}
