import { Avatar, Button, Card, Col, Row, Space, Switch } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Space direction="vertical" size={16}>
      <Card
        title="Default size card"
        extra={<a href="#card">More</a>}
        style={{ width: 300 }}
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
      <Card
        size="small"
        title="Small size card"
        extra={<a href="#card">More</a>}
        style={{ width: 300 }}
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </Space>
  );
}
export function MoreDemo() {
  const [loading, set] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        <Switch checked={loading} onChange={set} aria-label="卡片加载" />
        <span>加载状态</span>
      </Space>
      <Card
        size="small"
        title="小尺寸卡片"
        loading={loading}
        style={{ width: "100%" }}
        hoverable
      >
        内容已就绪，可以继续操作。
      </Card>
      <Card
        size="small"
        title="工作区"
        variant="outlined"
        tabList={[
          { key: "overview", tab: "概览" },
          { key: "activity", tab: "动态" },
          { key: "members", tab: "成员" },
        ]}
        activeTabKey={activeTab}
        onTabChange={setActiveTab}
        tabBarExtraContent={{ right: <a href="#members">管理</a> }}
      >
        <Card.Grid style={{ width: "50%" }}>项目数 12</Card.Grid>
        <Card.Grid hoverable={false} style={{ width: "50%" }}>
          进行中 4
        </Card.Grid>
      </Card>
    </Space>
  );
}

export function BasicSizeDemo() {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card title="Default size card" extra={<a href="#more">更多</a>}>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
      <Card
        size="small"
        title="Small size card"
        extra={<a href="#more">更多</a>}
      >
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </Space>
  );
}

export function BorderlessDemo() {
  return (
    <Card variant="borderless" title="Card title" style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
}

export function SimpleDemo() {
  return (
    <Card style={{ width: 300 }}>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
}

export function FlexibleDemo() {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={
        <img
          draggable={false}
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      }
    >
      <Card.Meta title="Europe Street beat" description="www.instagram.com" />
    </Card>
  );
}

export function GridDemo() {
  return (
    <Card title="栅格卡片">
      {["1", "2", "3", "4", "5", "6", "7"].map((item, index) => (
        <Card.Grid
          key={item}
          hoverable={index !== 1}
          style={{ width: "25%", textAlign: "center" }}
        >
          Content
        </Card.Grid>
      ))}
    </Card>
  );
}

export function LoadingDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button onClick={() => setLoading(!loading)}>
        {loading ? "显示内容" : "显示加载"}
      </Button>
      <Card
        loading={loading}
        title="Card title"
        actions={["编辑", "设置", "更多"]}
      >
        <Card.Meta title="Card title" description="This is the description" />
      </Card>
    </Space>
  );
}

export function InnerDemo() {
  return (
    <Card title="Card title">
      <Card
        type="inner"
        title="Inner Card title"
        extra={<a href="#card">More</a>}
      >
        Inner Card content
      </Card>
      <Card
        type="inner"
        title="Inner Card title"
        extra={<a href="#card">More</a>}
        style={{ marginTop: 16 }}
      >
        Inner Card content
      </Card>
    </Card>
  );
}

export function TabsDemo() {
  const [activeKey, setActiveKey] = useState("tab1");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card
        style={{ width: "100%" }}
        title="Card title"
        extra={<a href="#card">More</a>}
        tabList={[
          { key: "tab1", tab: "tab1" },
          { key: "tab2", tab: "tab2" },
        ]}
        activeTabKey={activeKey}
        onTabChange={setActiveKey}
      >
        {activeKey === "tab1" ? <p>content1</p> : <p>content2</p>}
      </Card>
      <Card
        style={{ width: "100%" }}
        tabList={[
          { key: "article", tab: "article" },
          { key: "app", tab: "app" },
          { key: "project", tab: "project" },
        ]}
        activeTabKey={activeKey === "tab1" ? "article" : "app"}
        tabBarExtraContent={<a href="#card">More</a>}
        onTabChange={(key) => setActiveKey(key === "article" ? "tab1" : "tab2")}
      >
        {activeKey === "tab1" ? <p>article content</p> : <p>app content</p>}
      </Card>
    </Space>
  );
}

export function InColumnDemo() {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Card title" variant="borderless">
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" variant="borderless">
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" variant="borderless">
          Card content
        </Card>
      </Col>
    </Row>
  );
}

export function MetaDemo() {
  return (
    <Card
      style={{ width: 300 }}
      cover={
        <img
          draggable={false}
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
      actions={[
        <span key="setting">⚙</span>,
        <span key="edit">✎</span>,
        <span key="more">•••</span>,
      ]}
    >
      <Card.Meta
        avatar={
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
        }
        title="Card title"
        description="This is the description"
      />
    </Card>
  );
}
