// Adapted from Ant Design 5.29.3 demos (MIT).

import { Flex, Spin } from "antd-octane";
import { LoadingOutlined } from "antd-octane/icons";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Flex align="center" gap="middle">
    <Spin indicator={<LoadingOutlined spin />} size="small" />
    <Spin indicator={<LoadingOutlined spin />} />
    <Spin indicator={<LoadingOutlined spin />} size="large" />
    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  </Flex>
);

export default App;
