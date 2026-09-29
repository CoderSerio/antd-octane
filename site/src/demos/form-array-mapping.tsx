import { Button, Checkbox, Form, Space } from "antd-octane";
import { useState } from "octane";

function MemberPicker({
  targetKeys = [],
  onChange,
}: {
  targetKeys?: string[];
  onChange?: (keys: string[]) => void;
}) {
  return (
    <fieldset
      aria-label="协作成员"
      style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
    >
      <Space wrap>
        {["Alice", "Bob", "Carol"].map((name) => (
          <Checkbox
            key={name}
            checked={targetKeys.includes(name)}
            onChange={(event) =>
              onChange?.(
                event.target.checked
                  ? [...targetKeys, name]
                  : targetKeys.filter((key) => key !== name),
              )
            }
          >
            {name}
          </Checkbox>
        ))}
      </Space>
    </fieldset>
  );
}

export function ArrayMappingDemo() {
  const [form] = Form.useForm();
  const [result, setResult] = useState("初始选中 Alice");
  return (
    <Form
      form={form}
      initialValues={{ members: ["Alice"] }}
      layout="vertical"
      onFinish={(values) =>
        setResult(`成员：${JSON.stringify(values.members)}`)
      }
    >
      <Form.Item
        name="members"
        label="协作成员"
        valuePropName="targetKeys"
        rules={[{ required: true, message: "至少选择一名成员" }]}
        extra="自定义控件使用 targetKeys 接收数组，onChange 返回整个新数组。"
      >
        <MemberPicker />
      </Form.Item>
      <Space>
        <Button type="primary" htmlType="submit">
          保存成员
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
            setResult("已恢复 Alice");
          }}
        >
          重置
        </Button>
      </Space>
      <p role="status">{result}</p>
    </Form>
  );
}
