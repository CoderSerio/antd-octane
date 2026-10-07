import { Layout, Menu } from "antd-octane";

const items = Array.from({ length: 8 }, (_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));

export default function App() {
  return (
    <Layout hasSider style={{ minHeight: 360 }}>
      <Layout.Sider
        style={{
          overflow: "auto",
          height: 360,
          position: "sticky",
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          scrollbarWidth: "thin",
        }}
      >
        <Menu mode="inline" defaultSelectedKeys={["4"]} items={items} />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ padding: 0 }} />
        <Layout.Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div style={{ padding: 24, textAlign: "center", borderRadius: 8 }}>
            <p>long content</p>
            {Array.from({ length: 24 }, (_, index) => (
              <span key={index}>
                {index % 8 === 0 && index ? "more" : "..."}
                <br />
              </span>
            ))}
          </div>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Layout.Footer>
      </Layout>
    </Layout>
  );
}
