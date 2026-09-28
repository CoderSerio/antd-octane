import { Layout } from "antd-octane";

export function StickyHeaderDemo() {
  return (
    <div
      style={{
        height: 240,
        width: "100%",
        overflow: "auto",
        border: "1px solid var(--line)",
      }}
    >
      <Layout style={{ minHeight: 480 }}>
        <Layout.Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            paddingInline: 20,
            color: "#fff",
          }}
        >
          固定在滚动区域顶部
        </Layout.Header>
        <Layout.Content style={{ padding: 20 }}>
          {[1, 2, 3, 4, 5, 6].map((number) => (
            <p key={number} style={{ marginBlock: 32 }}>
              向下滚动查看内容 {number}
            </p>
          ))}
        </Layout.Content>
        <Layout.Footer style={{ padding: 20 }}>Footer</Layout.Footer>
      </Layout>
    </div>
  );
}
