import { Layout, Menu } from "antd-octane";

const items = ["1", "2", "3", "4"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

export default function App() {
  return (
    <Layout style={{ minHeight: 320 }}>
      <Layout.Sider
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => console.log("breakpoint", broken)}
        onCollapse={(collapsed, type) =>
          console.log("collapse", collapsed, type)
        }
      >
        <Menu mode="inline" defaultSelectedKeys={["4"]} items={items} />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ padding: 0 }} />
        <Layout.Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 240, borderRadius: 8 }}>
            content
          </div>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
