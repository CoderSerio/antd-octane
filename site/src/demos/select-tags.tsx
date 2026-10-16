import type { LabeledSelectValue, SelectValue } from "antd-octane";
import { Button, Form, Select, Space } from "antd-octane";
import { useState } from "octane";

export function TagsDemo() {
  const [value, setValue] = useState<SelectValue[]>(["设计"]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Select
        mode="tags"
        aria-label="项目标签"
        value={value}
        onChange={setValue}
        options={[{ value: "设计" }, { value: "开发" }]}
        tokenSeparators={[",", ";"]}
        allowClear
        placeholder="输入标签，按 Enter 确认"
        style={{ width: "100%" }}
      />
      <span role="status">当前值：{JSON.stringify(value)}</span>
    </Space>
  );
}

export function LabeledTagsFormDemo() {
  const [form] = Form.useForm();
  const [result, setResult] = useState("尚未提交");
  const initialValue: LabeledSelectValue[] = [{ value: "ada", label: "Ada" }];
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => setResult(JSON.stringify(values))}
    >
      <Form.Item name="owners" label="负责人" initialValue={initialValue}>
        <Select
          mode="tags"
          labelInValue
          tokenSeparators={[",", ";"]}
          options={[
            { value: "ada", label: "Ada" },
            { value: "lin", label: "Lin" },
          ]}
          allowClear
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Space>
        <Button htmlType="submit" type="primary">
          提交标签
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
            setResult("尚未提交");
          }}
        >
          重置标签
        </Button>
      </Space>
      <p role="status">提交结果：{result}</p>
    </Form>
  );
}
