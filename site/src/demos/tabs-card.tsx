import { Tabs } from "antd-octane";

const onChange = (key: string) => {
  console.log(key);
};

export function CardDemo() {
  return (
    <Tabs
      onChange={onChange}
      type="card"
      items={Array.from({ length: 3 }).map((_, i) => {
        const id = String(i + 1);
        return {
          label: `Tab ${id}`,
          key: id,
          children: `Content of Tab Pane ${id}`,
        };
      })}
    />
  );
}
