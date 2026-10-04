import {
  Affix,
  Alert,
  Anchor,
  AutoComplete,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Carousel,
  Checkbox,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Empty,
  Flex,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Layout,
  List,
  Pagination,
  Popover,
  Progress,
  QRCode,
  Radio,
  Rate,
  Result,
  Row,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Splitter,
  Statistic,
  Steps,
  Switch,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  Watermark,
} from "antd-octane";
import dayjs from "dayjs";
import { componentCoverage, upstreamGroups } from "../component-coverage";
import { BasicDemo as PreviewApp } from "../demos/app-basic";
import { BasicDemo as PreviewDrawer } from "../demos/drawer-basic";
import { BasicDemo as PreviewDropdown } from "../demos/dropdown-basic";
import { BasicDemo as PreviewIcon } from "../demos/icon-basic";
import { BasicDemo as PreviewImage } from "../demos/image-basic";
import { BasicDemo as PreviewMenu } from "../demos/menu-basic";
import { BasicDemo as PreviewMessage } from "../demos/message-basic";
import { BasicDemo as PreviewModal } from "../demos/modal-basic";
import { BasicDemo as PreviewNotification } from "../demos/notification-basic";
import { BasicDemo as PreviewPopconfirm } from "../demos/popconfirm-basic";
import { BasicDemo as PreviewTour } from "../demos/tour-basic";
import { usePageAnchor } from "../docs-ui";
import { nav } from "../navigation";

function Preview({ name }: { name: string }) {
  switch (name) {
    case "tour":
      return <PreviewTour />;
    case "qr-code":
      return <QRCode value="https://ant.design" type="svg" size={120} />;
    case "affix":
      return (
        <Affix offsetTop={8}>
          <Button>固定操作</Button>
        </Affix>
      );
    case "anchor":
      return (
        <Anchor
          affix={false}
          items={[
            { key: "intro", href: "#components", title: "组件总览" },
            {
              key: "coverage",
              href: "#components/coverage",
              title: "覆盖清单",
            },
          ]}
        />
      );
    case "float-button":
      return (
        <div style={{ display: "flex", gap: 16 }}>
          <FloatButton style={{ position: "relative", inset: "auto" }} />
          <FloatButton
            type="primary"
            icon="+"
            style={{ position: "relative", inset: "auto" }}
          />
        </div>
      );
    case "image":
      return <PreviewImage />;
    case "calendar":
      return (
        <Calendar
          fullscreen={false}
          defaultValue={dayjs("2025-12-10")}
          style={{ width: 240 }}
        />
      );
    case "carousel":
      return (
        <Carousel style={{ width: "100%" }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                height: 100,
                display: "grid",
                placeItems: "center",
                background: "#364d79",
                color: "white",
              }}
            >
              {n}
            </div>
          ))}
        </Carousel>
      );
    case "splitter":
      return (
        <Splitter style={{ width: "100%", height: 100 }}>
          <Splitter.Panel style={{ padding: 12 }}>目录</Splitter.Panel>
          <Splitter.Panel style={{ padding: 12 }}>内容</Splitter.Panel>
        </Splitter>
      );
    case "watermark":
      return (
        <Watermark content="Octane" gap={[24, 24]} style={{ width: "100%" }}>
          <div style={{ height: 100 }} />
        </Watermark>
      );
    case "app":
      return <PreviewApp />;
    case "icon":
      return <PreviewIcon />;

    case "modal":
      return <PreviewModal />;
    case "drawer":
      return <PreviewDrawer />;
    case "message":
      return <PreviewMessage />;
    case "notification":
      return <PreviewNotification />;
    case "menu":
      return <PreviewMenu />;
    case "dropdown":
      return <PreviewDropdown />;
    case "popconfirm":
      return <PreviewPopconfirm />;

    case "input-number":
      return <InputNumber defaultValue={3} min={0} max={10} />;
    case "auto-complete":
      return (
        <AutoComplete
          options={[{ value: "Octane" }, { value: "Ant Design" }]}
          placeholder="输入搜索词"
          aria-label="示例自动完成"
        />
      );
    case "form":
      return (
        <Form layout="vertical" style={{ width: "100%" }}>
          <Form.Item name="name" label="名称">
            <Input placeholder="填写名称" />
          </Form.Item>
        </Form>
      );
    case "select":
      return (
        <Select
          options={[
            { value: "项目", label: "项目" },
            { value: "成员", label: "成员" },
          ]}
          defaultValue="项目"
          aria-label="示例选择器"
        />
      );
    case "slider":
      return (
        <div style={{ width: "100%", padding: "0 16px" }}>
          <Slider defaultValue={40} />
        </div>
      );
    case "segmented":
      return <Segmented options={["日", "周", "月"]} defaultValue="周" />;
    case "rate":
      return <Rate defaultValue={3} />;
    case "breadcrumb":
      return (
        <Breadcrumb
          items={[{ title: "首页" }, { title: "应用" }, { title: "详情" }]}
        />
      );
    case "pagination":
      return <Pagination total={50} simple />;
    case "steps":
      return (
        <Steps
          size="small"
          current={1}
          items={[{ title: "开始" }, { title: "进行中" }]}
        />
      );
    case "tooltip":
      return (
        <Tooltip title="提示内容">
          <Button>悬停查看提示</Button>
        </Tooltip>
      );
    case "popover":
      return (
        <Popover title="标题" content="补充说明">
          <Button>查看说明</Button>
        </Popover>
      );

    case "spin":
      return <Spin />;
    case "skeleton":
      return (
        <Skeleton
          title={{ width: "50%" }}
          paragraph={{ rows: 2 }}
          style={{ width: "100%" }}
        />
      );
    case "progress":
      return <Progress percent={65} style={{ width: "100%" }} />;
    case "result":
      return (
        <Result status="success" title="操作成功" style={{ padding: 0 }} />
      );

    case "typography":
      return (
        <div>
          <Typography.Title level={4}>文字的层次</Typography.Title>
          <Typography.Text type="secondary">清晰表达内容</Typography.Text>
        </div>
      );
    case "list":
      return (
        <List dataSource={["项目介绍", "快速开始"]} style={{ width: "100%" }} />
      );
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
        当前为开发预览。每个组件页提供可运行示例、API 和支持范围。 按 Ant Design
        5.x 的 {componentCoverage.length} 个文档条目核对， 当前{" "}
        {componentCoverage.filter((item) => item.implemented).length}{" "}
        项已提供支持子集，仍有{" "}
        {componentCoverage.filter((item) => !item.implemented).length}{" "}
        项待推进。
        <a href="#components/coverage">查看完整覆盖清单 →</a>
      </p>
      {[
        ["general", "通用"],
        ["layout", "布局"],
        ["navigation", "导航"],
        ["entry", "数据录入"],
        ["display", "数据展示"],
        ["feedback", "反馈"],
        ["other", "其他"],
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
      <h2 id="coverage" tabIndex={-1}>
        完整覆盖清单
      </h2>
      <p>
        「已提供」表示可以从包中使用，具体功能仍可能只是子集，不代表完整
        API、子组件、交互或主题兼容；目录覆盖数量不是功能完成百分比。点击本库文档检查具体支持范围；尚未实现的项目只链接上游参考。
      </p>
      {upstreamGroups.map(([group]) => (
        <section key={group} className="coverage-group">
          <h3>{group}</h3>
          <ul className="coverage-list">
            {componentCoverage
              .filter((item) => item.group === group)
              .map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href ?? item.upstream}
                    target={item.href ? undefined : "_blank"}
                    rel={item.href ? undefined : "noreferrer"}
                  >
                    {item.name}
                    {!item.implemented && " ↗"}
                  </a>
                  <span
                    className={item.implemented ? "coverage-ready" : undefined}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ))}
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
