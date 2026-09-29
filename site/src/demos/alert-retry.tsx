import { Alert, Button, Space } from "antd-octane";
import { useState } from "octane";

export function RetryDemo() {
  const [visible, setVisible] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState("等待重试");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {visible ? (
        <Alert
          type="error"
          showIcon
          closable
          message="同步失败"
          description={`第 ${attempts + 1} 次尝试尚未成功，请检查网络后重试。`}
          action={
            <Button
              size="small"
              onClick={() => {
                setAttempts(attempts + 1);
                setStatus("已请求重试");
              }}
            >
              重试
            </Button>
          }
          onClose={() => setStatus("正在关闭提示")}
          afterClose={() => {
            setVisible(false);
            setStatus("提示已关闭");
          }}
        />
      ) : (
        <Button onClick={() => setVisible(true)}>重新显示提示</Button>
      )}
      <span aria-live="polite">{status}</span>
    </Space>
  );
}
