// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Popconfirm } from "antd-octane";
import type * as Octane from "octane";
import { useEffect } from "octane";

const style: Octane.CSSProperties = {
  width: "300vw",
  height: "300vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const App: Octane.FC = () => {
  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight;
    document.documentElement.scrollLeft = document.documentElement.clientWidth;
  }, []);
  return (
    <div style={style}>
      <Popconfirm title="Thanks for using antd. Have a nice day !" open>
        <Button type="primary">Scroll The Window</Button>
      </Popconfirm>
    </div>
  );
};

export default App;
