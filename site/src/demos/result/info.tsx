// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Result } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Result
    title="Your operation has been executed"
    extra={
      <Button type="primary" key="console">
        Go Console
      </Button>
    }
  />
);

export default App;
