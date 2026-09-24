import { Space, Tag } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Space wrap>
      <Tag>默认</Tag>
      <Tag color="success">已完成</Tag>
      <Tag color="processing">处理中</Tag>
      <Tag color="warning">待确认</Tag>
      <Tag color="error">失败</Tag>
      <Tag color="purple">Purple</Tag>
      <Tag color="#108ee9">自定义颜色</Tag>
    </Space>
  );
}
export function MoreDemo() {
  const [checked, set] = useState(false);
  return (
    <Space wrap>
      <Tag closable>可关闭</Tag>
      <Tag closable onClose={(event) => event.preventDefault()}>
        取消关闭
      </Tag>
      <Tag.CheckableTag checked={checked} onChange={set}>
        只看已读
      </Tag.CheckableTag>
    </Space>
  );
}
