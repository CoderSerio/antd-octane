// Adapted from Ant Design 5.29.3 demos (MIT).

import { Alert } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <>
    <Alert message="Warning text" banner />
    <br />
    <Alert
      message="Very long warning text warning text text text text text text text"
      banner
      closable
    />
    <br />
    <Alert showIcon={false} message="Warning text without icon" banner />
    <br />
    <Alert type="error" message="Error text" banner />
  </>
);

export default App;
