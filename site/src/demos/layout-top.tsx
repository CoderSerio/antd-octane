import { Breadcrumb, Layout, Menu } from "antd-octane";

const items = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
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
        <div
          style={{
            background: "var(--ao-color-bg-container, #fff)",
            minHeight: 180,
            padding: 24,
            borderRadius: 8,
          }}
        >
          Content
        </div>
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Layout.Footer>
    </Layout>
  );
}
