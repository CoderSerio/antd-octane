// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Result, Typography } from "antd-octane";
import { CloseCircleOutlined } from "antd-octane/icons";
import type * as Octane from "octane";

const { Paragraph, Text } = Typography;

const App: Octane.FC = () => (
  <Result
    status="error"
    title="Submission Failed"
    subTitle="Please check and modify the following information before resubmitting."
    extra={[
      <Button type="primary" key="console">
        Go Console
      </Button>,
      <Button key="buy">Buy Again</Button>,
    ]}
  >
    <div className="desc">
      <Paragraph>
        <Text
          strong
          style={{
            fontSize: 16,
          }}
        >
          The content you submitted has the following error:
        </Text>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon" /> Your
        account has been frozen.{" "}
        {/* biome-ignore lint/a11y/useValidAnchor: Matches the upstream example's placeholder link. */}
        <a>Thaw immediately &gt;</a>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon" /> Your
        account is not yet eligible to apply.{" "}
        {/* biome-ignore lint/a11y/useValidAnchor: Matches the upstream example's placeholder link. */}
        <a>Apply Unlock &gt;</a>
      </Paragraph>
    </div>
  </Result>
);

export default App;
