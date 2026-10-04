// Adapted from Ant Design 5.29.3 demos (MIT).

import { Flex, Progress } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Flex vertical gap="small" style={{ width: 180 }}>
    <Progress percent={30} size="small" />
    <Progress percent={50} size="small" status="active" />
    <Progress percent={70} size="small" status="exception" />
    <Progress percent={100} size="small" />
  </Flex>
);

export default App;
