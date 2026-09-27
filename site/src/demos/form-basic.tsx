import { Button, Checkbox, Form, Input, Select } from "antd-octane";
import { useState } from "octane";

export function BasicDemo() {
  const [result, setResult] = useState("");
  return (
    <Form
      layout="vertical"
      initialValues={{ fruit: "apple", agree: false }}
      onFinish={(values) =>
        setResult(`已提交：${values.email} · ${values.fruit}`)
      }
      onFinishFailed={() => setResult("请先修正表单错误")}
      style={{ maxWidth: 360 }}
    >
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: "请输入邮箱" },
          { pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "邮箱格式不正确" },
        ]}
      >
        <Input
          required
          placeholder="name@example.com"
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item name="fruit" label="喜欢的水果">
        <Select
          style={{ width: "100%" }}
          options={[
            { value: "apple", label: "苹果" },
            { value: "pear", label: "梨" },
          ]}
        />
      </Form.Item>
      <Form.Item name="agree" valuePropName="checked">
        <Checkbox>同意接收更新</Checkbox>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        提交
      </Button>{" "}
      <Button htmlType="reset" onClick={() => setResult("")}>
        重置
      </Button>
      <p role="status">{result}</p>
    </Form>
  );
}
