// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Popconfirm } from "antd-octane";
import { QuestionCircleOutlined } from "antd-octane/icons";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);

export default App;
