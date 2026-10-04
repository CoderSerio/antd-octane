// Adapted from Ant Design 5.29.3 demos (MIT).

import { Alert, Switch } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const App: Octane.FC = () => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <Alert
          message="Alert Message Text"
          type="success"
          closable
          afterClose={handleClose}
        />
      )}
      <p>click the close button to see the effect</p>
      <Switch onChange={setVisible} checked={visible} disabled={visible} />
    </>
  );
};

export default App;
