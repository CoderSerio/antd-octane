// Adapted from Ant Design 5.29.3 demos (MIT).

import type { NotificationArgsProps } from "antd-octane";
import { Button, Divider, notification, Space } from "antd-octane";
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from "antd-octane/icons";
import type * as Octane from "octane";
import { createContext, useContext, useMemo } from "octane";

type NotificationPlacement = NotificationArgsProps["placement"];

const Context = createContext({ name: "Default" });

function Greeting() {
  return <>Hello, {useContext(Context).name}!</>;
}

const App: Octane.FC = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: `Notification ${placement}`,
      description: <Greeting />,
      placement,
    });
  };

  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);

  return (
    <Context value={contextValue}>
      {contextHolder}
      <Space>
        <Button
          type="primary"
          onClick={() => openNotification("topLeft")}
          icon={<RadiusUpleftOutlined />}
        >
          topLeft
        </Button>
        <Button
          type="primary"
          onClick={() => openNotification("topRight")}
          icon={<RadiusUprightOutlined />}
        >
          topRight
        </Button>
      </Space>
      <Divider />
      <Space>
        <Button
          type="primary"
          onClick={() => openNotification("bottomLeft")}
          icon={<RadiusBottomleftOutlined />}
        >
          bottomLeft
        </Button>
        <Button
          type="primary"
          onClick={() => openNotification("bottomRight")}
          icon={<RadiusBottomrightOutlined />}
        >
          bottomRight
        </Button>
      </Space>
    </Context>
  );
};

export default App;
