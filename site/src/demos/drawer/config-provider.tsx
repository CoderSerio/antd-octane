// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, ConfigProvider, Drawer } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const App: Octane.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <ConfigProvider>
      <Button type="primary" onClick={() => setOpen(true)}>
        Open
      </Button>
      <Drawer
        rootStyle={{ position: "absolute" }}
        title="ConfigProvider"
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </ConfigProvider>
  );
};

export default App;
