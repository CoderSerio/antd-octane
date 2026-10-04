// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, message } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const info = () => {
    messageApi.info("Hello, Ant Design!");
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={info}>
        Display normal message
      </Button>
    </>
  );
};

export default App;
