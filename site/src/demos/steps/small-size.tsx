import { Steps } from "antd-octane";

const App = () => (
  <Steps
    size="small"
    current={1}
    items={[
      {
        title: "Finished",
      },
      {
        title: "In Progress",
      },
      {
        title: "Waiting",
      },
    ]}
  />
);

export default App;
