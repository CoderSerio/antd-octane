import { Button, Layout } from "antd-octane";
import { useState } from "octane";

export function CustomTriggerDemo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout hasSider style={{ width: "100%", minHeight: 220 }}>
      <Layout.Sider
        width={140}
        collapsedWidth={56}
        collapsed={collapsed}
        collapsible
        trigger={null}
      >
        <div style={{ padding: 16, color: "#fff" }}>
          {collapsed ? "O" : "Octane"}
        </div>
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ paddingInline: 16 }}>
          <Button
            aria-label={collapsed ? "展开侧栏" : "收起侧栏"}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "展开" : "收起"}
          </Button>
        </Layout.Header>
        <Layout.Content style={{ padding: 16 }}>
          trigger=null 隐藏内置触发器，由页头按钮维护 collapsed。
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
