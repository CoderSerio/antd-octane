import { Button, Form, Input, message } from "antd-octane";

export function MigrationFormDemo() {
  const [api, holder] = message.useMessage();
  return (
    <>
      {holder}
      <Form
        layout="vertical"
        onFinish={(values) => api.success(`已保存：${values.name}`)}
      >
        <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
          <Input required />
        </Form.Item>
        <Button htmlType="submit" type="primary">
          保存
        </Button>
      </Form>
    </>
  );
}
