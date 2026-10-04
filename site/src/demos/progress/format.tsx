// Adapted from Ant Design 5.29.3 demos (MIT).

import { Flex, Progress } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Flex gap="small" wrap>
    <Progress
      type="circle"
      percent={75}
      format={(percent) => `${percent} Days`}
    />
    <Progress type="circle" percent={100} format={() => "Done"} />
  </Flex>
);

export default App;
