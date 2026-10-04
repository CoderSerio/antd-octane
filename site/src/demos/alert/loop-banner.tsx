// Adapted from Ant Design 5.29.3 demos (MIT).

import { Alert } from "antd-octane";
import type * as Octane from "octane";
import Marquee from "../native-marquee";

const App: Octane.FC = () => (
  <Alert
    banner
    message={
      <Marquee pauseOnHover gradient={false}>
        I can be a React component, multiple React components, or just some
        text.
      </Marquee>
    }
  />
);

export default App;
