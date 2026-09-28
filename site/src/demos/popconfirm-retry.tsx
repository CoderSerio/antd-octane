import { Button, Popconfirm, Space, Switch } from "antd-octane";
import { useState } from "octane";

export function RetryDemo() {
  const [fail, setFail] = useState(true);
  const [status, setStatus] = useState("等待确认");
  return (
    <Space wrap>
      <Switch checked={fail} onChange={setFail} aria-label="模拟请求失败" />
      <span>模拟失败</span>
      <Popconfirm
        title="提交当前修改？"
        description={status}
        okText="提交"
        onConfirm={() => {
          if (fail) {
            setStatus("提交失败，请关闭模拟失败后重试");
            return Promise.reject(new Error("演示失败"));
          }
          setStatus("提交成功");
          return Promise.resolve();
        }}
      >
        <Button>模拟提交</Button>
      </Popconfirm>
      <span aria-live="polite">{status}</span>
    </Space>
  );
}
