import { Steps } from "antd-octane";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "../layout-navigation-icons";

const App = () => (
  <Steps
    items={[
      {
        title: "Login",
        status: "finish",
        icon: <UserOutlined />,
      },
      {
        title: "Verification",
        status: "finish",
        icon: <SolutionOutlined />,
      },
      {
        title: "Pay",
        status: "process",
        icon: <LoadingOutlined />,
      },
      {
        title: "Done",
        status: "wait",
        icon: <SmileOutlined />,
      },
    ]}
  />
);

export default App;
