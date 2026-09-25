import { Avatar, Button, Card, List, Switch, Typography } from "antd-octane";
import { useState } from "octane";

const entries = [
  {
    id: 1,
    title: "接入项目",
    description: "配置 Octane 编译器，并引入组件样式。",
  },
  {
    id: 2,
    title: "定制主题",
    description: "沿用品牌 token，验证暗色与紧凑主题。",
  },
  {
    id: 3,
    title: "验证交互",
    description: "检查键盘、输入状态和不同屏幕尺寸。",
  },
];
export function BasicDemo() {
  const [done, setDone] = useState<number[]>([]);
  return (
    <List
      style={{ width: "100%" }}
      header="迁移清单"
      bordered
      dataSource={entries}
      rowKey="id"
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button
              key="done"
              type="link"
              onClick={() =>
                setDone(
                  done.includes(item.id)
                    ? done.filter((id) => id !== item.id)
                    : [...done, item.id],
                )
              }
            >
              {done.includes(item.id) ? "已完成" : "标记完成"}
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar>{item.id}</Avatar>}
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
}
export function MoreDemo() {
  const [empty, setEmpty] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <Typography.Paragraph>
        <Switch checked={empty} onChange={setEmpty} aria-label="显示空列表" />{" "}
        显示空列表
      </Typography.Paragraph>
      <List
        dataSource={empty ? [] : entries}
        rowKey="id"
        grid={{ gutter: 16, xs: 1, md: 2 }}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" title={item.title}>
              {item.description}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
