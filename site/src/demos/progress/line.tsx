// Adapted from Ant Design 5.29.3 demos (MIT).

import { Flex, Progress } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Flex gap="small" vertical>
    <Progress percent={30} />
    <Progress percent={50} status="active" />
    <Progress percent={70} status="exception" />
    <Progress percent={100} />
    <Progress percent={50} showInfo={false} />
  </Flex>
);

export default App;
