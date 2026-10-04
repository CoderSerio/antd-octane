// Adapted from Ant Design 5.29.3 demos (MIT).

import type { NotificationArgsProps } from "antd-octane";
import { Button, Divider, notification, Space } from "antd-octane";
import {
  BorderBottomOutlined,
  BorderTopOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from "antd-octane/icons";
import type * as Octane from "octane";

type NotificationPlacement = NotificationArgsProps["placement"];

const App: Octane.FC = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: `Notification ${placement}`,
      description:
        "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
      placement,
    });
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button
          type="primary"
          onClick={() => openNotification("top")}
          icon={<BorderTopOutlined />}
        >
          top
        </Button>
        <Button
          type="primary"
          onClick={() => openNotification("bottom")}
          icon={<BorderBottomOutlined />}
        >
          bottom
        </Button>
      </Space>
      <Divider />
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
    </>
  );
};

export default App;
