// Adapted from Ant Design 5.29.3 demos (MIT).

import { Flex, Progress } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Flex gap="small" wrap>
    <Progress type="dashboard" percent={75} />
    <Progress type="dashboard" percent={75} gapDegree={30} />
  </Flex>
);

export default App;
