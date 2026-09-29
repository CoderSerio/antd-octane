import { Button, message, Space } from "antd-octane";
import { useEffect, useRef, useState } from "octane";

export function LifecycleDemo() {
  const [api, holder] = message.useMessage();
  const [status, setStatus] = useState("尚未开始");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <>
      {holder}
      <Space wrap>
        <Button
          type="primary"
          onClick={() => {
            clearTimeout(timer.current);
            setStatus("正在处理");
            api.open({
              key: "operation",
              type: "loading",
              content: "正在处理请求…",
              duration: 0,
            });
            timer.current = setTimeout(() => {
              api.open({
                key: "operation",
                type: "success",
                content: "处理完成",
                duration: 2,
                onClose: () => setStatus("提示已关闭"),
              });
              setStatus("处理完成，等待提示关闭");
            }, 800);
          }}
        >
          模拟请求
        </Button>
        <Button
          onClick={() => {
            clearTimeout(timer.current);
            api.destroy("operation");
            setStatus("已取消");
          }}
        >
          取消提示
        </Button>
        <span aria-live="polite">{status}</span>
      </Space>
    </>
  );
}
