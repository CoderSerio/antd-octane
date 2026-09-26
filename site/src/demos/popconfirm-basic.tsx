import { Button, Popconfirm, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [status, setStatus] = useState("待确认");
  return (
    <Space>
      <Popconfirm
        title="删除这条记录？"
        description="这里只更新演示状态。"
        onConfirm={() => setStatus("已删除")}
        onCancel={() => setStatus("已取消")}
      >
        <Button danger>删除记录</Button>
      </Popconfirm>
      <span aria-live="polite">{status}</span>
    </Space>
  );
}
export function MoreDemo() {
  const [status, setStatus] = useState("待保存");
  return (
    <Space>
      <Popconfirm
        title="保存更改？"
        description="确认后等待一秒完成。"
        onConfirm={() =>
          new Promise<void>((resolve) => {
            setTimeout(() => {
              setStatus("已保存");
              resolve();
            }, 1000);
          })
        }
      >
        <Button>异步保存</Button>
      </Popconfirm>
      <span aria-live="polite">{status}</span>
    </Space>
  );
}
