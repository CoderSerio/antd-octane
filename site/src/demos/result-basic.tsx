import { Button, Result, Space } from "antd-octane";
import { useState } from "octane";

export function BasicDemo() {
  const [submitted, setSubmitted] = useState(true);
  return (
    <Result
      style={{ width: "100%" }}
      status={submitted ? "success" : "info"}
      title={submitted ? "项目创建成功" : "准备创建新项目"}
      subTitle={
        submitted
          ? "现在可以继续配置项目，或创建下一个项目。"
          : "点击下方按钮，体验结果状态的切换。"
      }
      extra={
        <Space wrap>
          <Button
            type="primary"
            onClick={() => {
              window.location.hash = "start";
            }}
          >
            查看接入指南
          </Button>
          <Button onClick={() => setSubmitted(!submitted)}>
            {submitted ? "再建一个" : "确认创建"}
          </Button>
        </Space>
      }
    />
  );
}

export function MoreDemo() {
  const [status, setStatus] = useState<"403" | "404" | "500">("404");
  const descriptions = {
    "403": "当前账号没有访问此页面的权限。",
    "404": "你访问的页面不存在，或已被移动。",
    "500": "服务暂时不可用，请稍后再试。",
  };
  return (
    <div style={{ width: "100%" }}>
      <Space wrap>
        {(["403", "404", "500"] as const).map((code) => (
          <Button
            key={code}
            type={status === code ? "primary" : "default"}
            onClick={() => setStatus(code)}
          >
            {code}
          </Button>
        ))}
      </Space>
      <Result
        status={status}
        title={status}
        subTitle={descriptions[status]}
        extra={
          <Button
            type="primary"
            onClick={() => {
              window.location.hash = "overview";
            }}
          >
            返回项目介绍
          </Button>
        }
      />
    </div>
  );
}
