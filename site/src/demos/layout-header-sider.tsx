import { Layout } from "antd-octane";

export function HeaderSiderDemo() {
  return (
    <Layout style={{ width: "100%", minHeight: 260 }}>
      <Layout.Header style={{ paddingInline: 20, color: "#fff" }}>
        Header
      </Layout.Header>
      <Layout hasSider>
        <Layout.Sider width={100} theme="light">
          <div style={{ padding: 16 }}>Sider</div>
        </Layout.Sider>
        <Layout.Content style={{ padding: 20 }}>Content</Layout.Content>
      </Layout>
      <Layout.Footer style={{ padding: 16, textAlign: "center" }}>
        Footer
      </Layout.Footer>
    </Layout>
  );
}
