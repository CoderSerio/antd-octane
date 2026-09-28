import { App, Button, ConfigProvider, Space } from "antd-octane";

function ConfigActions({ label }: { label: string }) {
  const { message, notification } = App.useApp();
  return (
    <Space wrap>
      <Button onClick={() => message.info(`${label}：新消息替换旧消息`)}>
        {label}消息
      </Button>
      <Button
        onClick={() =>
          notification.info({
            key: label,
            message: `${label}通知`,
            description: "使用 App 的默认位置与时长。",
          })
        }
      >
        {label}通知
      </Button>
      <Button
        onClick={() => {
          message.destroy();
          notification.destroy();
        }}
      >
        清空{label}实例
      </Button>
    </Space>
  );
}

export function ConfigDemo() {
  return (
    <App
      message={{ maxCount: 1, duration: 2 }}
      notification={{ placement: "bottomLeft", duration: 3 }}
    >
      <ConfigActions label="共享" />
    </App>
  );
}

export function NestedDemo() {
  return (
    <App message={{ duration: 0 }}>
      <Space direction="vertical">
        <ConfigActions label="外层" />
        <ConfigProvider
          theme={{
            components: { Message: { contentBg: "#e6f4ff" } },
            token: { colorText: "#003a8c" },
          }}
        >
          <App
            message={{ duration: 0, top: 64 }}
            notification={{ placement: "bottomRight" }}
          >
            <ConfigActions label="内层" />
          </App>
        </ConfigProvider>
      </Space>
    </App>
  );
}
