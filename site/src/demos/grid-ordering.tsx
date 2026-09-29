import { Button, Col, Row, Space } from "antd-octane";
import { useState } from "octane";

export function OrderingDemo() {
  const [reverse, setReverse] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button onClick={() => setReverse(!reverse)}>切换视觉顺序</Button>
      <Row gutter={8}>
        {[1, 2, 3, 4].map((number) => (
          <Col key={number} span={6} order={reverse ? 5 - number : number}>
            <div
              style={{
                padding: 12,
                textAlign: "center",
                color: "#fff",
                background: "#1677ff",
              }}
            >
              {number}
            </div>
          </Col>
        ))}
      </Row>
      <p>order 只改变视觉位置，DOM 与键盘阅读顺序仍为 1、2、3、4。</p>
    </Space>
  );
}
