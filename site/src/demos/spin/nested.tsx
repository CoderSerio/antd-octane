// Adapted from Ant Design 5.29.3 demos (MIT).

import { Alert, Flex, Spin, Switch } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const App: Octane.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Flex gap="middle" vertical>
      <Spin spinning={loading}>
        <Alert
          type="info"
          message="Alert message title"
          description="Further details about the context of this alert."
        />
      </Spin>
      <p>
        Loading state：
        <Switch checked={loading} onChange={setLoading} />
      </p>
    </Flex>
  );
};

export default App;
