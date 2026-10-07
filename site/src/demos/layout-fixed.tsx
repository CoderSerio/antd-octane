import { Breadcrumb, Layout, Menu } from "antd-octane";

const items = ["1", "2", "3"].map((key) => ({ key, label: `nav ${key}` }));

export default function App() {
  return (
    <Layout>
      <Layout.Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: "#001529",
        }}
      >
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            color: "#fff",
          }}
        />
      </Layout.Header>
      <Layout.Content style={{ padding: "0 24px" }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
        />
        <div style={{ padding: 24, minHeight: 360, borderRadius: 8 }}>
          Content
        </div>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Layout.Footer>
    </Layout>
  );
}
