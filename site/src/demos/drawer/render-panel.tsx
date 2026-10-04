// Adapted from Ant Design 5.29.3 demos (MIT).

import { Drawer } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <div style={{ padding: 32, background: "#e6e6e6" }}>
    <Drawer open title="Hello Title" style={{ height: 300 }} footer="Footer!">
      Hello Content
    </Drawer>
  </div>
);

export default App;
