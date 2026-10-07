// Adapted from Ant Design 5.29.3 (MIT), components/steps/demo/progress-dot.tsx.
import { Divider, Steps } from "antd-octane";

const App = () => (
  <>
    <Steps
      progressDot
      current={1}
      items={[
        {
          title: "Finished",
          description: "This is a description.",
        },
        {
          title: "In Progress",
          description: "This is a description.",
        },
        {
          title: "Waiting",
          description: "This is a description.",
        },
      ]}
    />
    <Divider />
    <Steps
      progressDot
      current={1}
      direction="vertical"
      items={[
        {
          title: "Finished",
          description: "This is a description. This is a description.",
        },
        {
          title: "Finished",
          description: "This is a description. This is a description.",
        },
        {
          title: "In Progress",
          description: "This is a description. This is a description.",
        },
        {
          title: "Waiting",
          description: "This is a description.",
        },
        {
          title: "Waiting",
          description: "This is a description.",
        },
      ]}
    />
  </>
);

export default App;
