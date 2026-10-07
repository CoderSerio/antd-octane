// Adapted from Ant Design 5.29.3 (MIT), components/breadcrumb/demo/withParams.tsx.
import { Breadcrumb } from "antd-octane";

const App = () => (
  <Breadcrumb
    items={[
      {
        title: "Users",
      },
      {
        title: ":id",
        href: "",
      },
    ]}
    params={{ id: 1 }}
  />
);

export default App;
