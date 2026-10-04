// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Result } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Result
    status="success"
    title="Successfully Purchased Cloud Server ECS!"
    subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
    extra={[
      <Button type="primary" key="console">
        Go Console
      </Button>,
      <Button key="buy">Buy Again</Button>,
    ]}
  />
);

export default App;
