import { Tabs } from "antd-octane";

export function CenteredDemo() {
  return (
    <Tabs
      defaultActiveKey="1"
      centered
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
