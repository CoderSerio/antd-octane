import { Button, Space, Spin } from "antd-octane";
import { useEffect, useRef, useState } from "octane";

export function FullscreenDemo() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("尚未刷新");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <Space wrap>
      <Button
        type="primary"
        onClick={() => {
          clearTimeout(timer.current);
          setLoading(true);
          setStatus("正在刷新");
          timer.current = setTimeout(() => {
            setLoading(false);
            setStatus("刷新完成");
          }, 1200);
        }}
      >
        刷新整个工作区
      </Button>
      <span aria-live="polite">{status}</span>
      {loading && <Spin fullscreen tip="正在刷新工作区…" />}
    </Space>
  );
}
