import { App, Button, ConfigProvider } from "antd-octane";

function NotifyAction() {
  const { notification } = App.useApp();
  return (
    <Button
      onClick={() =>
        notification.info({
          message: "来自 App 的通知",
          description: "子组件直接取用共享实例，无需自己放置 contextHolder。",
          icon: <span aria-hidden="true">✦</span>,
          duration: 3,
        })
      }
    >
      使用 App 通知实例
    </Button>
  );
}

export function AppContextDemo() {
  return (
    <ConfigProvider
      theme={{
        components: { Notification: { width: 320 } },
        token: { colorText: "#003a8c" },
      }}
    >
      <App notification={{ placement: "bottomRight", maxCount: 2 }}>
        <NotifyAction />
      </App>
    </ConfigProvider>
  );
}
