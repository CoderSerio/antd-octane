import { Col, Input, Row, Space, Statistic } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Row gutter={32} style={{ width: "100%" }}>
      <Col span={12}>
        <Statistic title="活跃用户" value={112893} />
      </Col>
      <Col span={12}>
        <Statistic
          title="账户余额"
          value="112893.129"
          precision={2}
          prefix="¥"
        />
      </Col>
    </Row>
  );
}
export function MoreDemo() {
  const [value, set] = useState("12345678901234567890.12");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        aria-label="统计数值"
        value={value}
        onChange={(event) => set(event.target.value)}
      />
      <Statistic title="保留字符串精度" value={value} precision={2} />
    </Space>
  );
}
