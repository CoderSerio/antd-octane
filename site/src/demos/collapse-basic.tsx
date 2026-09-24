import { Button, Collapse, Input } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Collapse
      style={{ width: "100%" }}
      defaultActiveKey={["intro"]}
      items={[
        {
          key: "intro",
          label: "项目介绍",
          children: "保留熟悉的组件和主题配置。",
        },
        {
          key: "input",
          label: "输入内容",
          children: (
            <Input aria-label="折叠面板输入" defaultValue="关闭后仍保留" />
          ),
        },
        {
          key: "disabled",
          label: "暂不可用",
          collapsible: "disabled",
          children: "Disabled",
        },
      ]}
    />
  );
}
export function MoreDemo() {
  const [count, setCount] = useState(0);
  return (
    <Collapse
      style={{ width: "100%" }}
      accordion
      ghost
      items={[
        {
          key: "one",
          label: "第一项",
          extra: (
            <Button size="small" onClick={() => setCount(count + 1)}>
              独立操作 {count}
            </Button>
          ),
          children: "手风琴模式一次仅展开一项。",
        },
        {
          key: "two",
          label: "第二项",
          children: "使用 Enter 或 Space 展开面板。",
        },
      ]}
    />
  );
}
