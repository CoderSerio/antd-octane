import { Button, Result, Space } from "antd-octane";
import { useState } from "octane";

export function ErrorDetailsDemo() {
  const [retried, setRetried] = useState(false);
  return (
    <Result
      status={retried ? "success" : "error"}
      title={retried ? "检查完成" : "发布前检查未通过"}
      subTitle={
        retried
          ? "演示已标记问题修复，可以继续发布。"
          : "请先处理下列问题，再重新检查。"
      }
      extra={
        <Button
          type="primary"
          disabled={retried}
          onClick={() => setRetried(true)}
        >
          重新检查
        </Button>
      }
      style={{ width: "100%" }}
    >
      {!retried && (
        <ul>
          <li>项目名称尚未填写。</li>
          <li>默认入口尚未配置。</li>
        </ul>
      )}
    </Result>
  );
}

export function CustomIconDemo() {
  const [acknowledged, setAcknowledged] = useState(false);
  return (
    <Result
      status="warning"
      icon={<span aria-hidden="true">✦</span>}
      title={acknowledged ? "已记录提醒" : "配置将在下次启动生效"}
      subTitle="自定义图标不改变 status 对应的颜色与结果含义。"
      extra={
        <Space wrap>
          <Button onClick={() => setAcknowledged(!acknowledged)}>
            {acknowledged ? "重新查看" : "已了解"}
          </Button>
        </Space>
      }
      style={{ width: "100%" }}
    />
  );
}
