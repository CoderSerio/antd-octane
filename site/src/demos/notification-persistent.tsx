import { Button, notification, Space } from "antd-octane";
import { useState } from "octane";

export function PersistentDemo() {
  const [api, holder] = notification.useNotification({ maxCount: 2 });
  const [status, setStatus] = useState("尚未提醒");
  return (
    <>
      {holder}
      <Space wrap>
        <Button
          onClick={() => {
            setStatus("等待确认");
            api.info({
              key: "review",
              message: "需要人工复核",
              description: "这条通知不会自动关闭；可以稍后从通知内完成操作。",
              duration: 0,
              role: "status",
              actions: (
                <Button type="primary" onClick={() => api.destroy("review")}>
                  已了解
                </Button>
              ),
              onClose: () => setStatus("已关闭提醒"),
            });
          }}
        >
          显示持续通知
        </Button>
        <Button onClick={() => api.destroy("review")}>从页面关闭</Button>
        <span aria-live="polite">{status}</span>
      </Space>
    </>
  );
}
