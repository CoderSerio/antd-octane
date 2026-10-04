// Adapted from Ant Design 5.29.3 demos (MIT).

import { Affix, Button } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Affix offsetTop={120} onChange={(affixed) => console.log(affixed)}>
    <Button>120px to affix top</Button>
  </Affix>
);

export default App;
