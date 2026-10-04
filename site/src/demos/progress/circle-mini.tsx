// Adapted from Ant Design 5.29.3 demos (MIT).

import { Flex, Progress } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Flex wrap gap="small">
    <Progress type="circle" percent={30} size={80} />
    <Progress type="circle" percent={70} size={80} status="exception" />
    <Progress type="circle" percent={100} size={80} />
  </Flex>
);

export default App;
