// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Modal } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const App: Octane.FC = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = (e: MouseEvent | KeyboardEvent) => {
    console.log(e);
    setOpen(false);
  };

  const handleCancel = (e: MouseEvent | KeyboardEvent) => {
    console.log(e);
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal with customized button props
      </Button>
      <Modal
        title="Basic Modal"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ disabled: true }}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default App;
