import { Button, Drawer, Form, Input, Space } from "antd-octane";
import { useState } from "octane";

export default function FormInDrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        New account
      </Button>
      <Drawer
        title="Create a new account"
        width={520}
        open={open}
        onClose={() => setOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setOpen(false)}>
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical">
          <Form.Item name="name" label="Name">
            <Input placeholder="Please enter user name" />
          </Form.Item>
          <Form.Item name="url" label="Url">
            <Input placeholder="Please enter url" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Please enter description" />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}
