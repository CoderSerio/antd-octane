// Adapted from Ant Design 5.29.3 demos (MIT).
import type * as Octane from "octane";

// The same preset palette values used by the upstream example.
const green = { 6: "#389e0d" };
const red = { 5: "#f5222d" };

import { Flex, Progress } from "antd-octane";

const App: Octane.FC = () => (
  <Flex gap="small" vertical>
    <Progress percent={50} steps={3} />
    <Progress percent={30} steps={5} />
    <Progress percent={100} steps={5} size="small" strokeColor={green[6]} />
    <Progress
      percent={60}
      steps={5}
      strokeColor={[green[6], green[6], red[5]]}
    />
  </Flex>
);

export default App;
