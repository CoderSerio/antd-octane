// Adapted from Ant Design 5.29.3 demos (MIT).

import { Alert } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => (
  <>
    <Alert message="Success Tips" type="success" showIcon />
    <br />
    <Alert message="Informational Notes" type="info" showIcon />
    <br />
    <Alert message="Warning" type="warning" showIcon closable />
    <br />
    <Alert message="Error" type="error" showIcon />
    <br />
    <Alert
      message="Success Tips"
      description="Detailed description and advice about successful copywriting."
      type="success"
      showIcon
    />
    <br />
    <Alert
      message="Informational Notes"
      description="Additional description and information about copywriting."
      type="info"
      showIcon
    />
    <br />
    <Alert
      message="Warning"
      description="This is a warning notice about copywriting."
      type="warning"
      showIcon
      closable
    />
    <br />
    <Alert
      message="Error"
      description="This is an error message about copywriting."
      type="error"
      showIcon
    />
  </>
);

export default App;
