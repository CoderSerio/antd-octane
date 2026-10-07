import { Breadcrumb, Layout, Menu } from "antd-octane";

const topItems = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));
const sideItems = ["1", "2", "3"].map((key) => ({
  key: `sub${key}`,
  label: `subnav ${key}`,
  children: [1, 2, 3, 4].map((index) => ({
    key: `${key}-${index}`,
    label: `option${index}`,
  })),
}));

export default function App() {
  return (
    <Layout>
      <Layout.Header
        style={{ display: "flex", alignItems: "center", background: "#001529" }}
      >
        <div style={{ width: 32, height: 32, marginInlineEnd: 24 }} />
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={topItems}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            color: "#fff",
          }}
        />
      </Layout.Header>
      <div style={{ padding: "0 24px" }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
        />
        <Layout style={{ padding: "24px 0", borderRadius: 8 }}>
          <Layout.Sider theme="light" width={180}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["sub1-1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%" }}
              items={sideItems}
            />
          </Layout.Sider>
          <Layout.Content style={{ padding: "0 24px", minHeight: 180 }}>
            Content
          </Layout.Content>
        </Layout>
      </div>
      <Layout.Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Layout.Footer>
    </Layout>
  );
}
