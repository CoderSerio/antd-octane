import { Tabs } from "antd-octane";
import { AndroidOutlined, AppleOutlined } from "./layout-navigation-icons";

export function IconDemo() {
  return (
    <Tabs
      defaultActiveKey="2"
      items={[AppleOutlined, AndroidOutlined].map((Icon, i) => {
        const id = String(i + 1);
        return {
          key: id,
          label: `Tab ${id}`,
          children: `Tab ${id}`,
          icon: <Icon />,
        };
      })}
    />
  );
}
