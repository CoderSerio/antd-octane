// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, Modal } from "antd-octane";
import type * as Octane from "octane";

const App: Octane.FC = () => {
  const [modal, contextHolder] = Modal.useModal();

  const countDown = () => {
    let secondsToGo = 5;

    const instance = modal.success({
      title: "This is a notification message",
      content: `This modal will be destroyed after ${secondsToGo} second.`,
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({
        content: `This modal will be destroyed after ${secondsToGo} second.`,
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
    }, secondsToGo * 1000);
  };

  return (
    <>
      <Button onClick={countDown}>Open modal to close in 5s</Button>
      {contextHolder}
    </>
  );
};

export default App;
