// Adapted from Ant Design 5.29.3 demos (MIT).

import { Alert } from "antd-octane";
import { CloseSquareOutlined } from "antd-octane/icons";
import type * as Octane from "octane";

const onClose = (e: MouseEvent) => {
  console.log(e, "I was closed.");
};

const App: Octane.FC = () => (
  <>
    <Alert
      message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
      type="warning"
      closable
      onClose={onClose}
    />
    <br />
    <Alert
      message="Error Text"
      description="Error Description Error Description Error Description Error Description Error Description Error Description"
      type="error"
      closable
      onClose={onClose}
    />
    <br />
    <Alert
      message="Error Text"
      description="Error Description Error Description Error Description Error Description Error Description Error Description"
      type="error"
      onClose={onClose}
      closable={{
        "aria-label": "close",
        closeIcon: <CloseSquareOutlined />,
      }}
    />
  </>
);

export default App;
