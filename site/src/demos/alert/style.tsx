// Adapted from Ant Design 5.29.3 demos (MIT).

import { Alert } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <>
    <Alert message="Success Text" type="success" />
    <br />
    <Alert message="Info Text" type="info" />
    <br />
    <Alert message="Warning Text" type="warning" />
    <br />
    <Alert message="Error Text" type="error" />
  </>
);

export default App;
