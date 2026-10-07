// Adapted from Ant Design 5.29.3 (MIT), components/tabs/demo/custom-tab-bar.tsx.
import type { TabsProps } from "antd-octane";
import { Tabs, theme } from "antd-octane";

const items = Array.from({ length: 3 }, (_, index) => {
  const id = String(index + 1);
  return {
    label: `Tab ${id}`,
    key: id,
    children: `Content of Tab Pane ${id}`,
    style: index === 0 ? { height: 200 } : undefined,
  };
});

export default function App() {
  const { token } = theme.useToken();
  const renderTabBar: TabsProps["renderTabBar"] = (props, DefaultTabBar) => (
    <div style={{ position: "sticky", top: 64, bottom: 20, zIndex: 1 }}>
      <DefaultTabBar
        {...props}
        style={{ background: token.colorBgContainer }}
      />
    </div>
  );
  return (
    <Tabs defaultActiveKey="1" renderTabBar={renderTabBar} items={items} />
  );
}
