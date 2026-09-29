import { Button, Form, InputNumber, Space } from "antd-octane";
import { useState } from "octane";

export function ValuePropsDemo() {
  const [form] = Form.useForm();
  const [result, setResult] = useState("存储 1250 分，显示 12.5 元");
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ priceCents: 1250 }}
      onFinish={(values) => setResult(`实际提交：${values.priceCents} 分`)}
    >
      <Form.Item
        name="priceCents"
        label="单价（元）"
        getValueProps={(value) => ({ value: Number(value ?? 0) / 100 })}
        getValueFromEvent={(yuan: number | null) =>
          Math.round((yuan ?? 0) * 100)
        }
        extra="getValueProps 把存储值映射为控件属性；启用后由它负责属性名与默认值。"
      >
        <InputNumber min={0} step={0.01} aria-label="单价（元）" />
      </Form.Item>
      <Space>
        <Button type="primary" htmlType="submit">
          保存价格
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
            setResult("已恢复 1250 分");
          }}
        >
          重置
        </Button>
      </Space>
      <p role="status">{result}</p>
    </Form>
  );
}
