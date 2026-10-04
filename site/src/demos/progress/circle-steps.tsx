// Adapted from Ant Design 5.29.3 demos (MIT).

import { Flex, Progress, Slider, Typography } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const App: Octane.FC = () => {
  const [stepsCount, setStepsCount] = useState<number>(5);
  const [stepsGap, setStepsGap] = useState<number>(7);
  return (
    <>
      <Typography.Title level={5}>Custom count:</Typography.Title>
      <Slider
        min={2}
        max={10}
        value={stepsCount}
        onChange={(value) => {
          if (typeof value === "number") setStepsCount(value);
        }}
      />
      <Typography.Title level={5}>Custom gap:</Typography.Title>
      <Slider
        step={4}
        min={0}
        max={40}
        value={stepsGap}
        onChange={(value) => {
          if (typeof value === "number") setStepsGap(value);
        }}
      />
      <Flex wrap gap="middle" style={{ marginTop: 16 }}>
        <Progress
          type="dashboard"
          steps={8}
          percent={50}
          trailColor="rgba(0, 0, 0, 0.06)"
          strokeWidth={20}
        />
        <Progress
          type="circle"
          percent={100}
          steps={{ count: stepsCount, gap: stepsGap }}
          trailColor="rgba(0, 0, 0, 0.06)"
          strokeWidth={20}
        />
      </Flex>
    </>
  );
};

export default App;
