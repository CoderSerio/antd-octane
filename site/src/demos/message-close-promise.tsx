import { Button, message, Space } from "antd-octane";
import { useEffect, useRef, useState } from "octane";

export function ClosePromiseDemo() {
  const [api, holder] = message.useMessage();
  const [waiting, setWaiting] = useState(false);
  const [status, setStatus] = useState("等待展示");
  const alive = useRef(true);
  useEffect(
    () => () => {
      alive.current = false;
    },
    [],
  );
  return (
    <>
      {holder}
      <Space wrap>
        <Button
          disabled={waiting}
          onClick={async () => {
            setWaiting(true);
            setStatus("等待提示关闭");
            await api.success("操作成功，1 秒后关闭", 1);
            if (alive.current) {
              setWaiting(false);
              setStatus("关闭 Promise 已完成");
            }
          }}
        >
          等待关闭结果
        </Button>
        <Button disabled={!waiting} onClick={() => api.destroy()}>
          提前关闭
        </Button>
        <span aria-live="polite">{status}</span>
      </Space>
    </>
  );
}
