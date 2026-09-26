import { Layout } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Layout style={{ width: "100%" }}>
      <Layout.Header style={{ color: "#fff" }}>Header</Layout.Header>
      <Layout.Content style={{ padding: 24, minHeight: 100 }}>
        Content
      </Layout.Content>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  );
}
export function MoreDemo() {
  const [collapsed, set] = useState(false);
  return (
    <Layout style={{ minHeight: 240, width: "100%" }}>
      <Layout.Sider
        width={140}
        collapsedWidth={64}
        collapsible
        collapsed={collapsed}
        onCollapse={set}
        breakpoint="md"
      >
        <div style={{ padding: 16 }}>{collapsed ? "O" : "Octane"}</div>
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ paddingInline: 20, color: "#fff" }}>
          应用布局
        </Layout.Header>
        <Layout.Content style={{ padding: 20 }}>
          点击侧栏按钮或调整窗口宽度。
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
