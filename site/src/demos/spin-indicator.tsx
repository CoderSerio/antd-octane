import { Button, Space, Spin } from "antd-octane";
import { useState } from "octane";

export function IndicatorDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button onClick={() => setLoading(!loading)}>
        {loading ? "结束加载" : "重新加载"}
      </Button>
      <Spin
        spinning={loading}
        tip="等待同步结果…"
        indicator={
          <span aria-hidden="true" style={{ fontSize: 24 }}>
            ◌
          </span>
        }
      >
        <p style={{ padding: 16 }}>这是保留在加载容器内的内容。</p>
      </Spin>
    </Space>
  );
}
