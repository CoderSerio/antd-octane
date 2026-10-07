import { Steps } from "antd-octane";

const description = "This is a description.";
const App = () => (
  <Steps
    direction="vertical"
    current={1}
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
    ]}
  />
);

export default App;
