import { Button, Space } from "antd-octane";
import { useState } from "octane";

export function DelayedLoadingDemo() {
  const [loading, setLoading] = useState(false);
  const [custom, setCustom] = useState(false);
  return (
    <Space direction="vertical">
      <Space wrap>
        <Button
          type="primary"
          loading={loading ? { delay: 500 } : false}
          onClick={() => setLoading(true)}
        >
          延迟 500ms 显示加载
        </Button>
        <Button
          loading={custom ? { icon: <span aria-hidden="true">◌</span> } : false}
          onClick={() => setCustom(true)}
        >
          自定义加载图标
        </Button>
        <Button
          disabled={!loading && !custom}
          onClick={() => {
            setLoading(false);
            setCustom(false);
          }}
        >
          结束加载
        </Button>
      </Space>
      <p aria-live="polite">
        延迟结束后才进入加载态并阻止重复点击；可手动结束。
      </p>
    </Space>
  );
}
