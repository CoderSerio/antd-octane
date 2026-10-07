// Adapted from Ant Design 5.29.3 (MIT), components/steps/demo/customized-progress-dot.tsx.
import type { StepsProps } from "antd-octane";
import { Popover, Steps } from "antd-octane";

const customDot: StepsProps["progressDot"] = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);
const description = "You can hover on the dot.";
const App = () => (
  <Steps
    current={1}
    progressDot={customDot}
    items={[
      {
        title: "Finished",
        description,
      },
      {
        title: "In Progress",
        description,
      },
      {
        title: "Waiting",
        description,
      },
      {
        title: "Waiting",
        description,
      },
    ]}
  />
);

export default App;
