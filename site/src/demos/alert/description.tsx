// Adapted from Ant Design 5.29.3 demos (MIT).

import { Alert } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <>
    <Alert
      message="Success Text"
      description="Success Description Success Description Success Description"
      type="success"
    />
    <br />
    <Alert
      message="Info Text"
      description="Info Description Info Description Info Description Info Description"
      type="info"
    />
    <br />
    <Alert
      message="Warning Text"
      description="Warning Description Warning Description Warning Description Warning Description"
      type="warning"
    />
    <br />
    <Alert
      message="Error Text"
      description="Error Description Error Description Error Description Error Description"
      type="error"
    />
  </>
);

export default App;
