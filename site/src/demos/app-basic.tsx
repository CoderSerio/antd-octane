import { App, Button, ConfigProvider, Space } from "antd-octane";

function Actions() {
  const { message, notification } = App.useApp();
  return (
    <Space>
      <Button
        onClick={() => {
          message.success("共享消息实例已就绪");
        }}
      >
        显示消息
      </Button>
      <Button
        onClick={() =>
          notification.info({
            message: "项目通知",
            description: "无需每个页面重复挂载 holder。",
          })
        }
      >
        显示通知
      </Button>
    </Space>
  );
}
export function BasicDemo() {
  return (
    <App>
      <Actions />
    </App>
  );
}
export function MoreDemo() {
  return (
    <ConfigProvider
      theme={{ components: { Message: { contentBg: "#e6f4ff" } } }}
    >
      <App component={false}>
        <Actions />
      </App>
    </ConfigProvider>
  );
}
