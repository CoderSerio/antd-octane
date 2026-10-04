// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Result } from "antd-octane";
import { SmileOutlined } from "antd-octane/icons";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Result
    icon={<SmileOutlined />}
    title="Great, we have done all the operations!"
    extra={<Button type="primary">Next</Button>}
  />
);

export default App;
