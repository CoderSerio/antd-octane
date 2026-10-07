import { Col, Grid, Row, Space, theme } from "antd-octane";
import type { OctaneNode } from "octane";

function Cell({ children }: { children: OctaneNode }) {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        background: token.colorPrimary,
        color: token.colorTextLightSolid,
        textAlign: "center",
        padding: "12px 0",
      }}
    >
      {children}
    </div>
  );
}
export function BasicDemo() {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Cell>12</Cell>
        </Col>
        <Col span={12}>
          <Cell>12</Cell>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Cell>8</Cell>
        </Col>
        <Col span={8}>
          <Cell>8</Cell>
        </Col>
        <Col span={8}>
          <Cell>8</Cell>
        </Col>
      </Row>
    </Space>
  );
}
export function MoreDemo() {
  const screens = Grid.useBreakpoint();
  return (
    <div style={{ width: "100%" }}>
      <Row gutter={{ xs: 8, md: 24 }}>
        <Col xs={24} md={12}>
          <Cell>xs: 24 / md: 12</Cell>
        </Col>
        <Col xs={24} md={12}>
          <Cell>响应式列</Cell>
        </Col>
      </Row>
      <p>
        当前断点：
        {Object.entries(screens)
          .filter(([, active]) => active)
          .map(([name]) => name)
          .join("、")}
      </p>
    </div>
  );
}
