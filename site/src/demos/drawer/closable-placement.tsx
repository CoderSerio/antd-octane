// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Drawer } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const App: Octane.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer
        title="Drawer Closable Placement"
        closable={{ placement: "end" }}
        onClose={onClose}
        open={open}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Take a look at the top-right corner...</p>
      </Drawer>
    </>
  );
};

export default App;
