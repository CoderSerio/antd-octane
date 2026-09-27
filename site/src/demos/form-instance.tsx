import { Button, Form, Input } from "antd-octane";

export function InstanceDemo() {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      initialValues={{ name: "Octane" }}
      layout="vertical"
      style={{ maxWidth: 320 }}
    >
      <Form.Item name="name" label="项目名称" required>
        <Input style={{ width: "100%" }} />
      </Form.Item>
      <Button
        onClick={() => form.setFieldsValue({ name: "Ant Design for Octane" })}
      >
        填入示例
      </Button>{" "}
      <Button onClick={() => form.resetFields()}>恢复初始值</Button>
    </Form>
  );
}
