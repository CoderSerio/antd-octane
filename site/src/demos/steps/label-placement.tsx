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
  </>
);

export default App;
