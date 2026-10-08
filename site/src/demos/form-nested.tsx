import { Button, Form, Input, Space } from "antd-octane";
import { useState } from "octane";

export function NestedDemo() {
  const [form] = Form.useForm();
  const [saved, setSaved] = useState("");
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ account: { email: "", confirmation: "" } }}
      onFinish={(values) => setSaved(JSON.stringify(values))}
      style={{ width: "100%", maxWidth: 360 }}
    >
      <Form.Item
        name={["account", "email"]}
        label="联系邮箱"
        rules={[{ required: true, message: "请输入邮箱" }]}
      >
        <Input required />
      </Form.Item>
      <Form.Item
        name={["account", "confirmation"]}
        label="再次输入邮箱"
        dependencies={[["account", "email"]]}
        rules={[
          { required: true, message: "请再次输入邮箱" },
          {
            validator: (_, value) => {
              if (value !== form.getFieldValue(["account", "email"]))
                throw Error("两次邮箱不一致");
            },
          },
        ]}
      >
        <Input required />
      </Form.Item>
      <Space wrap>
        <Button type="primary" htmlType="submit">
          保存联系信息
        </Button>
        <Button
          onClick={() =>
            form.setFieldValue(["account", "email"], "ada@example.com")
          }
        >
          填入邮箱
        </Button>
        <Button
          onClick={() => {
            form.resetFields([["account"]]);
            setSaved("");
          }}
        >
          重置联系信息
        </Button>
      </Space>
      <p role="status" style={{ overflowWrap: "anywhere" }}>
        {saved || "尚未提交"}
      </p>
    </Form>
  );
}
