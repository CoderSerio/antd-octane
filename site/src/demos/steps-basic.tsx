import { Button, Space, Steps } from "antd-octane";
import { useState } from "octane";

const items = [
  { title: "填写信息", description: "确认基本资料" },
  { title: "检查内容", description: "核对后提交" },
  { title: "完成", description: "保存成功" },
];
export function BasicDemo() {
  const [current, setCurrent] = useState(0);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Steps current={current} items={items} />
      <Space>
        <Button
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          上一步
        </Button>
        <Button
          type="primary"
          disabled={current === 2}
          onClick={() => setCurrent(current + 1)}
        >
          下一步
        </Button>
      </Space>
    </Space>
  );
}
export function MoreDemo() {
  const [current, setCurrent] = useState(1);
  return (
    <Steps
      direction="vertical"
      size="small"
      current={current}
      onChange={setCurrent}
      items={[
        ...items,
        { title: "归档", description: "暂不可用", disabled: true },
      ]}
    />
  );
}
