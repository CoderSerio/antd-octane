// Adapted from Ant Design 5.29.3 (MIT), components/steps/demo/label-placement.tsx.
import { Steps } from "antd-octane";

const description = "This is a description.";
const items = [
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
];
const App = () => (
  <>
    <Steps current={1} labelPlacement="vertical" items={items} />
    <br />
    <Steps current={1} percent={60} labelPlacement="vertical" items={items} />
    <br />
    <Steps
      current={1}
      percent={80}
      size="small"
      labelPlacement="vertical"
      items={items}
    />
  </>
);

export default App;
