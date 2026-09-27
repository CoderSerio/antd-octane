import { Button, Form, Input, Space } from "antd-octane";
import { useState } from "octane";

export function FormValidationDemo() {
  const [form] = Form.useForm();
  const [result, setResult] = useState("填写用户名后手动校验");
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ username: "" }}
      onValuesChange={(changed) =>
        setResult(`字段已变化：${Object.keys(changed).join(", ")}`)
      }
      style={{ maxWidth: 360 }}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: "请输入用户名" },
          { min: 3, message: "至少输入 3 个字符" },
          { max: 12, message: "最多输入 12 个字符" },
          { pattern: /^[a-zA-Z0-9]+$/, message: "只能输入英文字母和数字" },
        ]}
        extra="支持 3–12 个英文字母或数字"
      >
        <Input required aria-label="用户名" style={{ width: "100%" }} />
      </Form.Item>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            void form.validateFields().then(
              (values) => setResult(`校验通过：${values.username}`),
              (error) =>
                setResult(
                  `校验失败：${error.errorFields[0]?.errors[0] ?? "未知错误"}`,
                ),
            );
          }}
        >
          手动校验
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
            setResult("已恢复初始值");
          }}
        >
          重置
        </Button>
      </Space>
      <p role="status">{result}</p>
    </Form>
  );
}
