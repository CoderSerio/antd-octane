// Adapted from Ant Design 5.29.3 config-provider/demo/holderRender.tsx (MIT).
import {
  App,
  Button,
  ConfigProvider,
  Modal,
  message,
  notification,
  Space,
} from "antd-octane";
import { ExclamationCircleFilled } from "antd-octane/icons";
import { useContext, useLayoutEffect } from "octane";

export default function Demo() {
  const { locale, theme } = useContext(ConfigProvider.ConfigContext);
  useLayoutEffect(() => {
    ConfigProvider.config({
      holderRender: (children) => (
        <ConfigProvider
          prefixCls="static"
          iconPrefixCls="icon"
          locale={locale}
          theme={theme}
        >
          <App message={{ maxCount: 1 }} notification={{ maxCount: 1 }}>
            {children}
          </App>
        </ConfigProvider>
      ),
    });
    return () => ConfigProvider.config({ holderRender: undefined });
  }, [locale, theme]);
  return (
    <Space>
      <Button
        type="primary"
        onClick={() => {
          void message.info("This is a normal message");
        }}
      >
        message
      </Button>
      <Button
        type="primary"
        onClick={() => {
          notification.open({
            message: "Notification Title",
            description:
              "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
          });
        }}
      >
        notification
      </Button>
      <Button
        type="primary"
        onClick={() => {
          Modal.confirm({
            title: "Do you want to delete these items?",
            icon: <ExclamationCircleFilled />,
            content: "Some descriptions",
          });
        }}
      >
        Modal
      </Button>
    </Space>
  );
}
