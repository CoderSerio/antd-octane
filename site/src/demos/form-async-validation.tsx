import { Button, Form, Input, Space } from "antd-octane";
import { useState } from "octane";

async function checkUsername(_rule: unknown, value: unknown) {
  if (!value) return;
  await new Promise<void>((resolve) => setTimeout(resolve, 600));
  if (["admin", "taken"].includes(String(value).toLowerCase()))
    throw new Error("该用户名已被占用");
}

export function AsyncValidationDemo() {
  const [form] = Form.useForm();
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState("试试 admin，再改为自己的用户名");
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ username: "admin" }}
      style={{ maxWidth: 360 }}
      onFinish={(values) => {
        setPending(false);
        setResult(`可以注册：${values.username}`);
      }}
      onFinishFailed={(error) => {
        setPending(false);
        setResult(
          error.outOfDate
            ? "校验期间输入已变化，请再次提交最新值"
            : "请修改用户名后重试",
        );
      }}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: "请输入用户名" },
          { validator: checkUsername },
        ]}
        extra="模拟 600ms 检查；admin、taken 已占用。等待时仍可修改输入。"
      >
        <Input required />
      </Form.Item>
      <Space>
        <Button
          type="primary"
          htmlType="submit"
          loading={pending}
          onClick={() => setPending(true)}
        >
          注册
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
            setPending(false);
            setResult("已恢复 admin");
          }}
        >
          重置
        </Button>
      </Space>
      <p role="status">{result}</p>
    </Form>
  );
}
