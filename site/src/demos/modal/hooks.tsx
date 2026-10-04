// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Modal, Space } from "antd-octane";
import type * as Octane from "octane";
import { createContext, useContext } from "octane";

const ReachableContext = createContext<string | null>(null);
const UnreachableContext = createContext<string | null>(null);

function ContextContents() {
  return (
    <>
      Reachable: {String(useContext(ReachableContext))}!<br />
      Unreachable: {String(useContext(UnreachableContext))}!
    </>
  );
}

const config = {
  title: "Use Hook!",
  content: <ContextContents />,
};

const App: Octane.FC = () => {
  const [modal, contextHolder] = Modal.useModal();

  return (
    <ReachableContext value="Light">
      <Space>
        <Button
          onClick={async () => {
            const confirmed = await modal.confirm(config);
            console.log("Confirmed: ", confirmed);
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            modal.warning(config);
          }}
        >
          Warning
        </Button>
        <Button
          onClick={async () => {
            modal.info(config);
          }}
        >
          Info
        </Button>
        <Button
          onClick={async () => {
            modal.error(config);
          }}
        >
          Error
        </Button>
      </Space>
      {/* `contextHolder` should always be placed under the context you want to access */}
      {contextHolder}

      {/* Can not access this context since `contextHolder` is not in it */}
      <UnreachableContext value="Bamboo" />
    </ReachableContext>
  );
};

export default App;
