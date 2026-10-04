// Adapted from Ant Design 5.29.3 demos (MIT).

import {
  Button,
  Divider,
  InputNumber,
  notification,
  Space,
  Switch,
} from "antd-octane";
import type * as Octane from "octane";
import { createContext, useMemo, useState } from "octane";

const Context = createContext({ name: "Default" });

const App: Octane.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [threshold, setThreshold] = useState(3);
  const [api, contextHolder] = notification.useNotification({
    stack: enabled
      ? {
          threshold,
        }
      : false,
  });

  const openNotification = () => {
    api.open({
      message: "Notification Title",
      description: `${Array.from(
        { length: Math.round(Math.random() * 5) + 1 },
        () => "This is the content of the notification.",
      ).join("\n")}`,
      duration: null,
    });
  };

  const contextValue = useMemo(() => ({ name: "Ant Design" }), []);

  return (
    <Context value={contextValue}>
      {contextHolder}
      <div>
        <Space size="large">
          <Space style={{ width: "100%" }}>
            <span>Enabled: </span>
            <Switch checked={enabled} onChange={(v) => setEnabled(v)} />
          </Space>
          <Space style={{ width: "100%" }}>
            <span>Threshold: </span>
            <InputNumber
              disabled={!enabled}
              value={threshold}
              step={1}
              min={1}
              max={10}
              onChange={(v) => setThreshold(v || 0)}
            />
          </Space>
        </Space>
        <Divider />
        <Button type="primary" onClick={openNotification}>
          Open the notification box
        </Button>
      </div>
    </Context>
  );
};

export default App;
