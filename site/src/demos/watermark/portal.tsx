// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Drawer, Flex, Modal, Watermark } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const style: Octane.CSSProperties = {
  height: 300,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(150, 150, 150, 0.2)",
};

const placeholder = <div style={style}>A mock height</div>;

const App: Octane.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDrawer2, setShowDrawer2] = useState(false);

  const closeModal = () => setShowModal(false);
  const closeDrawer = () => setShowDrawer(false);
  const closeDrawer2 = () => setShowDrawer2(false);

  return (
    <>
      <Flex gap="middle">
        <Button type="primary" onClick={() => setShowModal(true)}>
          Show in Modal
        </Button>
        <Button type="primary" onClick={() => setShowDrawer(true)}>
          Show in Drawer
        </Button>
        <Button type="primary" onClick={() => setShowDrawer2(true)}>
          Not Show in Drawer
        </Button>
      </Flex>
      <Watermark content="Ant Design">
        <Modal
          destroyOnHidden
          open={showModal}
          title="Modal"
          onCancel={closeModal}
          onOk={closeModal}
        >
          {placeholder}
        </Modal>
        <Drawer
          destroyOnHidden
          open={showDrawer}
          title="Drawer"
          onClose={closeDrawer}
        >
          {placeholder}
        </Drawer>
      </Watermark>
      <Watermark content="Ant Design" inherit={false}>
        <Drawer
          destroyOnHidden
          open={showDrawer2}
          title="Drawer"
          onClose={closeDrawer2}
        >
          {placeholder}
        </Drawer>
      </Watermark>
    </>
  );
};

export default App;
