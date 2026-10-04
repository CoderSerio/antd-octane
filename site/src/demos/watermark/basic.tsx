// Adapted from Ant Design 5.29.3 demos (MIT).

import { Watermark } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Watermark content="Ant Design">
    <div style={{ height: 500 }} />
  </Watermark>
);

export default App;
