// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Result } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Button type="primary">Back Home</Button>}
  />
);

export default App;
