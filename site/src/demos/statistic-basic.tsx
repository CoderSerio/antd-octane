import { Button, Card, Col, Row, Space, Statistic } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Row gutter={16} style={{ width: "100%" }}>
      <Col span={12}>
        <Statistic title="Active Users" value={112893} />
      </Col>
      <Col span={12}>
        <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
        <Button style={{ marginTop: 16 }} type="primary">
          Recharge
        </Button>
      </Col>
      <Col span={12}>
        <Statistic title="Active Users" value={112893} loading />
      </Col>
    </Row>
  );
}
export function AnimatedDemo() {
  const formatter = (value: string | number) =>
    String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (
    <Row gutter={16} style={{ width: "100%" }}>
      <Col span={12}>
        <Statistic title="Active Users" value={112893} formatter={formatter} />
      </Col>
      <Col span={12}>
        <Statistic
          title="Account Balance (CNY)"
          value={112893}
          precision={2}
          formatter={formatter}
        />
      </Col>
    </Row>
  );
}

export function TimerDemo() {
  const [deadline] = useState(() => Date.now() + 60 * 60 * 1000);
  const [finished, setFinished] = useState(false);
  return (
    <Space size="large">
      <Statistic.Countdown
        title="剩余时间"
        value={deadline}
        format="HH:mm:ss"
        onFinish={() => setFinished(true)}
      />
      <Statistic.Timer
        title="已运行"
        value={deadline - 60 * 60 * 1000}
        type="countup"
        format="mm:ss"
      />
      {finished && <span>已结束</span>}
    </Space>
  );
}

export function UnitDemo() {
  return (
    <Row gutter={32} style={{ width: "100%" }}>
      <Col span={12}>
        <Statistic title="下载量" value={1128} suffix="次" />
      </Col>
      <Col span={12}>
        <Statistic title="完成率" value={93.2} precision={1} suffix="%" />
      </Col>
    </Row>
  );
}

export function CardDemo() {
  return (
    <Card style={{ width: "100%" }}>
      <Statistic title="活跃用户" value={112893} suffix="人" />
    </Card>
  );
}
