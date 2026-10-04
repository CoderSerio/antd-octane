// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, notification } from "antd-octane";
import type * as Octane from "octane";

const key = "updatable";

const App: Octane.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      key,
      message: "Notification Title",
      description: "description.",
    });

    setTimeout(() => {
      api.open({
        key,
        message: "New Title",
        description: "New description.",
      });
    }, 1000);
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={openNotification}>
        Open the notification box
      </Button>
    </>
  );
};

export default App;
