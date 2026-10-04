// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, message } from "antd-octane";
import type * as Octane from "octane";

const info = () => {
  message.info("This is a normal message");
};

const App: Octane.FC = () => (
  <Button type="primary" onClick={info}>
    Static Method
  </Button>
);

export default App;
