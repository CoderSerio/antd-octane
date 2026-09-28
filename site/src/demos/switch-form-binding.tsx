import { Button, Form, Switch } from "antd-octane";
import { useState } from "octane";

export function SwitchFormBindingDemo() {
  const [result, setResult] = useState("");
  return (
    <Form
      layout="vertical"
      initialValues={{ digest: true }}
      onFinish={(values) =>
        setResult(`已提交：每周摘要${values.digest ? "开启" : "关闭"}`)
      }
    >
      <Form.Item name="digest" label="每周摘要" valuePropName="checked">
        <Switch
          aria-label="每周摘要"
          checkedChildren="开"
          unCheckedChildren="关"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        保存设置
      </Button>
      <p role="status">{result}</p>
    </Form>
  );
}
