// Adapted from Ant Design 5.29.3 (MIT), components/steps/demo/progress.tsx.
import { Steps } from "antd-octane";

const description = "This is a description.";
const App = () => (
  <Steps
    current={1}
    percent={60}
    items={[
      {
        title: "Finished",
        description,
      },
      {
        title: "In Progress",
        subTitle: "Left 00:00:08",
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
