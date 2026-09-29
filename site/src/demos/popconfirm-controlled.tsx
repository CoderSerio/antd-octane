import { Button, Popconfirm, Space } from "antd-octane";
import { useState } from "octane";

export function ControlledDemo() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("尚未执行");
  return (
    <Space wrap>
      <Button onClick={() => setOpen(true)}>从其他入口打开确认框</Button>
      <Popconfirm
        open={open}
        onOpenChange={setOpen}
        title="立即执行？"
        description="受控模式下，应用必须同步更新 open。"
        placement="bottom"
        okText="执行"
        cancelText="返回"
        onConfirm={() => setStatus("已执行")}
        onCancel={() => setStatus("已返回")}
      >
        <Button type="primary">确认入口</Button>
      </Popconfirm>
      <span aria-live="polite">{status}</span>
    </Space>
  );
}
