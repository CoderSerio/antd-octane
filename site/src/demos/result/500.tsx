// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Result } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Result
    status="500"
    title="500"
    subTitle="Sorry, something went wrong."
    extra={<Button type="primary">Back Home</Button>}
  />
);

export default App;
