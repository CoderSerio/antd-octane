// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Modal, Space } from "antd-octane";
import type * as Octane from "octane";

const info = () => {
  Modal.info({
    title: "This is a notification message",
    content: (
      <div>
        <p>some messages...some messages...</p>
        <p>some messages...some messages...</p>
      </div>
    ),
    onOk() {},
  });
};

const success = () => {
  Modal.success({
    content: "some messages...some messages...",
  });
};

const error = () => {
  Modal.error({
    title: "This is an error message",
    content: "some messages...some messages...",
  });
};

const warning = () => {
  Modal.warning({
    title: "This is a warning message",
    content: "some messages...some messages...",
  });
};

const App: Octane.FC = () => (
  <Space wrap>
    <Button onClick={info}>Info</Button>
    <Button onClick={success}>Success</Button>
    <Button onClick={error}>Error</Button>
    <Button onClick={warning}>Warning</Button>
  </Space>
);

export default App;
