// Adapted from Ant Design 5.29.3 demos (MIT).

import type { ModalFooterRender } from "antd-octane";
import { Button, Modal, Space } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const App: Octane.FC = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Space>
        <Button type="primary" onClick={showModal}>
          Open Modal
        </Button>
        <Button
          type="primary"
          onClick={() => {
            Modal.confirm({
              title: "Confirm",
              content: "Bla bla ...",
              footer: (
                _: Parameters<ModalFooterRender>[0],
                { OkBtn, CancelBtn }: Parameters<ModalFooterRender>[1],
              ) => (
                <>
                  <Button>Custom Button</Button>
                  <CancelBtn />
                  <OkBtn />
                </>
              ),
            });
          }}
        >
          Open Modal Confirm
        </Button>
      </Space>
      <Modal
        open={open}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(
          _: Parameters<ModalFooterRender>[0],
          { OkBtn, CancelBtn }: Parameters<ModalFooterRender>[1],
        ) => (
          <>
            <Button>Custom Button</Button>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default App;
