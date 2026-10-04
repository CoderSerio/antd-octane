// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Spin } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const App: Octane.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [percent, setPercent] = useState(0);

  const showLoader = () => {
    setSpinning(true);
    let ptg = -10;

    const interval = setInterval(() => {
      ptg += 5;
      setPercent(ptg);

      if (ptg > 120) {
        clearInterval(interval);
        setSpinning(false);
        setPercent(0);
      }
    }, 100);
  };

  return (
    <>
      <Button onClick={showLoader}>Show fullscreen</Button>
      <Spin spinning={spinning} percent={percent} fullscreen />
    </>
  );
};

export default App;
