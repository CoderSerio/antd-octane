// Adapted from Ant Design 5.29.3 demos (MIT).

import { Affix, Button } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const containerStyle: Octane.CSSProperties = {
  width: "100%",
  height: 100,
  overflow: "auto",
  boxShadow: "0 0 0 1px #1677ff",
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const style: Octane.CSSProperties = {
  width: "100%",
  height: 1000,
};

const App: Octane.FC = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div style={containerStyle} ref={setContainer}>
      <div style={style}>
        <Affix target={() => container}>
          <Button type="primary">Fixed at the top of container</Button>
        </Affix>
      </div>
    </div>
  );
};

export default App;
