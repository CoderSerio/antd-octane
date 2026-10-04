// Adapted from Ant Design 5.29.3 demos (MIT).

import { Button, message, Popconfirm, Switch } from "antd-octane";
import type * as Octane from "octane";
import { useState } from "octane";

const App: Octane.FC = () => {
  const [open, setOpen] = useState(false);
  const [condition, setCondition] = useState(true);

  const changeCondition = (checked: boolean) => {
    setCondition(checked);
  };

  const confirm = () => {
    setOpen(false);
    message.success("Next step.");
  };

  const cancel = () => {
    setOpen(false);
    message.error("Click on cancel.");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOpen(newOpen);
      return;
    }
    // Determining condition before show the popconfirm.
    console.log(condition);
    if (condition) {
      confirm(); // next step
    } else {
      setOpen(newOpen);
    }
  };

  return (
    <div>
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this task?"
        open={open}
        onOpenChange={handleOpenChange}
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Button danger>Delete a task</Button>
      </Popconfirm>
      <br />
      <br />
      Whether directly execute：
      <Switch defaultChecked onChange={changeCondition} />
    </div>
  );
};

export default App;
