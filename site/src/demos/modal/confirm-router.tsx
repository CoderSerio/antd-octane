// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Modal } from "antd-octane";
import { ExclamationCircleOutlined } from "antd-octane/icons";
import type * as Octane from "octane";

const { confirm } = Modal;

const destroyAll = () => {
  Modal.destroyAll();
};

const showConfirm = () => {
  for (let i = 0; i < 3; i += 1) {
    setTimeout(() => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: <Button onClick={destroyAll}>Click to destroy all</Button>,
        onOk() {
          console.log("OK");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }, i * 500);
  }
};

const App: Octane.FC = () => <Button onClick={showConfirm}>Confirm</Button>;

export default App;
