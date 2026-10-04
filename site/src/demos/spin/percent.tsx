// Adapted from Ant Design 5.29.3 demos (MIT).

import { Flex, Spin, Switch } from "antd-octane";
import type * as Octane from "octane";
import { useEffect, useRef, useState } from "octane";

const App: Octane.FC = () => {
  const [auto, setAuto] = useState(false);
  const [percent, setPercent] = useState(-50);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setPercent((v) => {
        const nextPercent = v + 5;
        return nextPercent > 150 ? -50 : nextPercent;
      });
    }, 100);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [percent]);

  const mergedPercent = auto ? "auto" : percent;

  return (
    <Flex align="center" gap="middle">
      <Switch
        checkedChildren="Auto"
        unCheckedChildren="Auto"
        checked={auto}
        onChange={() => {
          setAuto(!auto);
          setPercent(-50);
        }}
      />
      <Spin percent={mergedPercent} size="small" />
      <Spin percent={mergedPercent} />
      <Spin percent={mergedPercent} size="large" />
    </Flex>
  );
};

export default App;
