// Adapted from Ant Design 5.29.3 demos (MIT).

import { Watermark } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Watermark
    height={30}
    width={130}
    image="https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original"
  >
    <div style={{ height: 500 }} />
  </Watermark>
);

export default App;
