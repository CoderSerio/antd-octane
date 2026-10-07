import { Breadcrumb, Layout, Menu } from "antd-octane";
import { useState } from "octane";

const items = [
  { key: "1", label: "Option 1" },
  { key: "2", label: "Option 2" },
  {
    key: "sub1",
    label: "User",
    children: [
      { key: "3", label: "Tom" },
      { key: "4", label: "Bill" },
      { key: "5", label: "Alex" },
    ],
  },
  {
    key: "sub2",
    label: "Team",
    children: [
      { key: "6", label: "Team 1" },
      { key: "8", label: "Team 2" },
    ],
  },
  { key: "9", label: "Files" },
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout style={{ minHeight: 360 }}>
      <Layout.Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu mode="inline" defaultSelectedKeys={["1"]} items={items} />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ padding: 0 }} />
        <Layout.Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "User" }, { title: "Bill" }]}
          />
          <div style={{ padding: 24, minHeight: 240, borderRadius: 8 }}>
            Bill is a cat.
          </div>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
