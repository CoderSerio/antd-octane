import { Input, Tabs } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Tabs
      style={{ width: "100%" }}
      items={[
        { key: "overview", label: "概览", children: "项目概览内容" },
        {
          key: "settings",
          label: "设置",
          children: (
            <Input aria-label="标签页输入" defaultValue="切换后仍保留" />
          ),
        },
        { key: "disabled", label: "暂不可用", disabled: true },
      ]}
    />
  );
}
export function MoreDemo() {
  const [items, set] = useState([
    { key: "1", label: "页面 1", children: "第一个页面" },
    { key: "2", label: "页面 2", children: "第二个页面" },
  ]);
  const [next, setNext] = useState(3);
  return (
    <Tabs
      style={{ width: "100%" }}
      type="editable-card"
      items={items}
      onEdit={(key, action) => {
        if (action === "remove") set(items.filter((item) => item.key !== key));
        else {
          set([
            ...items,
            {
              key: String(next),
              label: `页面 ${next}`,
              children: `新页面 ${next}`,
            },
          ]);
          setNext(next + 1);
        }
      }}
    />
  );
}
