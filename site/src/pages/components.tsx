import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Input,
  Layout,
  Radio,
  Row,
  Space,
  Statistic,
  Switch,
  Tabs,
  Tag,
  Timeline,
} from "antd-octane";
import { usePageAnchor } from "../docs-ui";
import { nav } from "../navigation";

function Preview({ name }: { name: string }) {
  switch (name) {
    case "grid":
      return (
        <Row gutter={8} style={{ width: "100%" }}>
          <Col span={12}>
            <Button block size="small">
              12
            </Button>
          </Col>
          <Col span={12}>
            <Button block size="small">
              12
            </Button>
          </Col>
        </Row>
      );
    case "layout":
      return (
        <Layout style={{ width: 180 }}>
          <Layout.Header
            style={{
              height: 28,
              lineHeight: "28px",
              paddingInline: 8,
              color: "white",
            }}
          >
            Header
          </Layout.Header>
          <Layout.Content style={{ padding: 12 }}>Content</Layout.Content>
        </Layout>
      );
    case "collapse":
      return (
        <Collapse
          style={{ width: "100%" }}
          items={[{ key: "one", label: "折叠面板", children: "内容" }]}
        />
      );
    case "tabs":
      return (
        <Tabs
          items={[
            { key: "one", label: "标签一", children: "内容一" },
            { key: "two", label: "标签二", children: "内容二" },
          ]}
        />
      );
    case "empty":
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0 }} />
      );
    case "statistic":
      return <Statistic title="统计数值" value={112893} />;
    case "timeline":
      return (
        <Timeline
          items={[{ children: "创建项目" }, { children: "开发中" }]}
          style={{ marginTop: 16 }}
        />
      );
    case "descriptions":
      return (
        <Descriptions
          column={1}
          items={[
            { label: "名称", children: "Octane" },
            { label: "状态", children: "开发中" },
          ]}
        />
      );
    case "button":
      return (
        <>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
        </>
      );
    case "input":
      return <Input aria-label="预览输入" placeholder="请输入内容" />;
    case "checkbox":
      return <Checkbox defaultChecked>Checkbox</Checkbox>;
    case "switch":
      return <Switch defaultChecked aria-label="预览开关" />;
    case "radio":
      return (
        <Radio.Group
          aria-label="预览单选"
          options={["A", "B"]}
          defaultValue="A"
        />
      );
    case "tag":
      return (
        <>
          <Tag color="success">Success</Tag>
          <Tag color="blue">Tag</Tag>
        </>
      );
    case "alert":
      return <Alert type="success" showIcon message="保存成功" />;
    case "avatar":
      return (
        <>
          <Avatar size="large">O</Avatar>
          <Avatar shape="square">A</Avatar>
        </>
      );
    case "badge":
      return (
        <Badge count={5}>
          <Avatar shape="square">O</Avatar>
        </Badge>
      );
    case "card":
      return (
        <Card size="small" title="Card" style={{ width: 180 }}>
          内容区域
        </Card>
      );
    case "divider":
      return <Divider>Divider</Divider>;
    case "space":
      return (
        <Space>
          <Button size="small">A</Button>
          <Button size="small">B</Button>
        </Space>
      );
    case "flex":
      return (
        <Flex gap="small" style={{ width: "100%" }}>
          <Button block size="small">
            Flex
          </Button>
          <Button block size="small">
            Flex
          </Button>
        </Flex>
      );
    default:
      return null;
  }
}
export default function ComponentsPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>组件总览</h1>
      <p className="lead">熟悉的组件、交互与主题配置。</p>
      <p className="intro">
        当前为开发预览。每个组件页提供可运行示例、API 和支持范围。
      </p>
      {[
        ["general", "通用"],
        ["layout", "布局"],
        ["entry", "数据录入"],
        ["display", "数据展示"],
        ["feedback", "反馈"],
      ].map(([id, group]) => {
        const items = nav.filter(
          (item) => item.category === "components" && item.group === group,
        );
        return (
          <section key={id}>
            <h2 id={id} tabIndex={-1}>
              {group} <small className="count">{items.length}</small>
            </h2>
            <div className="component-catalog">
              {items.map((item) => (
                <section key={item.id} className="component-card">
                  <div className="component-preview">
                    <Preview name={item.id} />
                  </div>
                  <a href={`#${item.id}`}>
                    <strong>{item.title}</strong>
                    <span>查看文档 →</span>
                  </a>
                </section>
              ))}
            </div>
          </section>
        );
      })}
      <h2 id="configuration" tabIndex={-1}>
        主题与配置
      </h2>
      <p>ConfigProvider 提供全局主题、嵌套继承和组件级覆盖。</p>
      <a className="text-link" href="#theme">
        查看主题配置与兼容边界 →
      </a>
    </>
  );
}
