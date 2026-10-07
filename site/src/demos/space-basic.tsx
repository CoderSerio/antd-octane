import { Button, Popconfirm, Space } from "antd-octane";
export function BasicDemo() {
  return (
    <Space>
      Space
      <Button type="primary">Button</Button>
      <Popconfirm
        title="Are you sure delete this task?"
        okText="Yes"
        cancelText="No"
      >
        <Button>Confirm</Button>
      </Popconfirm>
    </Space>
  );
}
