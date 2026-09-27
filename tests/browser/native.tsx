import "../../packages/antd-octane/src/style.css";
import { createRoot, useEffect } from "octane";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  ConfigProvider,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Layout,
  List,
  Menu,
  Modal,
  message,
  notification,
  Pagination,
  Popconfirm,
  Progress,
  Radio,
  Rate,
  Result,
  Row,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Spin,
  Statistic,
  Steps,
  Switch,
  Tabs,
  Tag,
  Timeline,
  Typography,
  theme,
} from "../../packages/antd-octane/src";
import {
  brand,
  cases,
  checkboxCases,
  component,
  inputCases,
  switchCases,
} from "./cases";

function OverlayFixture() {
  const [msg, msgHolder] = message.useMessage();
  const [notice, noticeHolder] = notification.useNotification();
  useEffect(() => {
    msg.open({ key: "fixture", content: "Message content", duration: 0 });
    notice.open({
      key: "fixture",
      message: "Notification title",
      description: "Notification content",
      duration: 0,
    });
    return () => {
      msg.destroy();
      notice.destroy();
    };
  }, [msg, notice]);
  return (
    <>
      {msgHolder}
      {noticeHolder}
      <div data-overlays="menu">
        <Menu
          items={[
            { key: "one", label: "First" },
            { key: "two", label: "Second" },
          ]}
          defaultSelectedKeys={["one"]}
        />
      </div>
      <Modal open title="Dialog title" footer={null}>
        Dialog content
      </Modal>
      <Drawer open title="Drawer title" autoFocus={false}>
        Drawer content
      </Drawer>
      <Popconfirm open title="Confirm title" description="Confirm content">
        <button type="button">Confirm</button>
      </Popconfirm>
    </>
  );
}
const name = new URLSearchParams(location.search).get("theme");
const config =
  name === "dark"
    ? { algorithm: theme.darkAlgorithm }
    : name === "compact"
      ? { algorithm: theme.compactAlgorithm }
      : name === "brand"
        ? brand
        : name === "component"
          ? component
          : {};
const root = document.getElementById("root");
if (!root) throw new Error("Missing fixture root");
createRoot(root).render(
  <ConfigProvider theme={config}>
    {new URLSearchParams(location.search).has("overlays") && <OverlayFixture />}
    <div data-entry="number">
      <InputNumber defaultValue={3} />
    </div>
    <div data-entry="select">
      <Select
        aria-label="Choose a fruit"
        showSearch
        allowClear
        placeholder="Choose a fruit"
        options={[
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana", disabled: true },
          { value: "cherry", label: "Cherry" },
        ]}
      />
    </div>
    <div data-entry="form" style={{ width: 360 }}>
      <Form
        layout="vertical"
        initialValues={{ email: "" }}
        onFinish={(values) => {
          const result = document.querySelector("[data-form-result]");
          if (result) result.textContent = String(values.email);
        }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Email required" }]}
        >
          <Input placeholder="email@example.com" />
        </Form.Item>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
      <output data-form-result />
    </div>
    <div
      data-entry="select-static-container"
      style={{ paddingInlineStart: 32 }}
    >
      <Select
        aria-label="Static container fruit"
        placeholder="Static container"
        options={[{ value: "apple", label: "Apple" }]}
        getPopupContainer={() =>
          document.querySelector<HTMLElement>(
            '[data-entry="select-static-container"]',
          ) ?? document.body
        }
      />
    </div>
    <div data-entry="number-small">
      <InputNumber size="small" defaultValue={3} />
    </div>
    <div data-entry="number-large">
      <InputNumber size="large" defaultValue={3} />
    </div>
    <div data-entry="slider" style={{ width: 300 }}>
      <Slider defaultValue={40} />
    </div>
    <div data-entry="affix">
      <Input prefix="$" suffix="USD" defaultValue="10" />
    </div>
    <div data-entry="textarea">
      <Input.TextArea defaultValue="Text" rows={2} />
    </div>

    <div data-controls="segmented">
      <Segmented options={["Day", "Week", "Month"]} defaultValue="Week" />
    </div>
    <div data-controls="rate">
      <Rate defaultValue={3} />
    </div>
    <div data-controls="breadcrumb">
      <Breadcrumb
        items={[
          { title: "Home", href: "#" },
          { title: "App" },
          { title: "Details" },
        ]}
      />
    </div>
    <div data-controls="pagination">
      <Pagination total={50} defaultCurrent={2} />
    </div>
    <div data-controls="steps">
      <Steps
        current={1}
        items={[{ title: "First" }, { title: "Second" }, { title: "Last" }]}
      />
    </div>

    <div data-feedback="spin">
      <Spin />
    </div>
    <div data-feedback="skeleton">
      <Skeleton />
    </div>
    <div data-feedback="progress">
      <Progress percent={40} />
    </div>
    <div data-feedback="result">
      <Result
        status="success"
        title="Completed"
        subTitle="Saved successfully"
      />
    </div>

    <div data-content="text">
      <Typography.Text>Text</Typography.Text>
    </div>
    <div data-content="heading">
      <Typography.Title level={3}>Heading</Typography.Title>
    </div>
    <div data-content="paragraph">
      <Typography.Paragraph>Paragraph</Typography.Paragraph>
    </div>
    <div data-content="list">
      <List
        bordered
        header="Header"
        footer="Footer"
        dataSource={["First", "Second"]}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item} description="Description" />
          </List.Item>
        )}
      />
    </div>
    <div data-content="small">
      <List
        bordered
        size="small"
        dataSource={["Small"]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </div>

    {cases.map(({ id, props }) => (
      <div key={id} style={{ padding: 12 }}>
        <Button {...props} id={id}>
          Button
        </Button>
      </div>
    ))}
    {inputCases.map(({ id, props }) => (
      <div key={id} style={{ padding: 12, width: 280 }}>
        <Input {...props} id={id} defaultValue="Input" />
      </div>
    ))}
    {checkboxCases.map(({ id, props }) => (
      <div key={id} style={{ padding: 12 }}>
        <Checkbox {...props} id={id}>
          Checkbox
        </Checkbox>
      </div>
    ))}
    {switchCases.map(({ id, props }) => (
      <div key={id} style={{ padding: 12 }}>
        <Switch {...props} id={id} />
      </div>
    ))}
    <Divider id="divider-default" />
    <Divider id="divider-text">Title</Divider>
    <div data-display="radio">
      <Radio checked>Radio</Radio>
    </div>
    <div data-display="radio-button">
      <Radio.Group defaultValue="a" optionType="button" options={["a", "b"]} />
    </div>
    <div data-display="tag">
      <Tag>Tag</Tag>
    </div>
    <div data-display="tag-success">
      <Tag color="success">Success</Tag>
    </div>
    <div data-display="tag-blue">
      <Tag color="blue">Blue</Tag>
    </div>
    <div data-display="alert">
      <Alert message="Message" type="success" />
    </div>
    <div data-display="alert-description">
      <Alert message="Message" description="Description" showIcon />
    </div>
    <div data-display="card">
      <Card title="Title">Body</Card>
    </div>
    <div data-display="card-small">
      <Card title="Title" size="small">
        Body
      </Card>
    </div>
    <div data-display="badge">
      <Badge count={5} />
    </div>
    <div data-display="avatar">
      <Avatar>O</Avatar>
    </div>
    <div data-display="avatar-large">
      <Avatar size="large" shape="square">
        O
      </Avatar>
    </div>
    <div data-layout="row">
      <Row gutter={16}>
        <Col span={12}>A</Col>
        <Col span={12}>B</Col>
      </Row>
    </div>
    <div data-layout="layout">
      <Layout>
        <Layout.Header>Header</Layout.Header>
        <Layout.Content>Content</Layout.Content>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    </div>
    <div data-layout="collapse">
      <Collapse
        defaultActiveKey={["one"]}
        items={[
          { key: "one", label: "Label", children: "Content" },
          { key: "two", label: "Label 2", children: "Content 2" },
        ]}
      />
    </div>
    <div data-layout="tabs">
      <Tabs
        items={[
          { key: "one", label: "First", children: "Content" },
          { key: "two", label: "Second", children: "Second content" },
        ]}
      />
    </div>
    <div data-layout="empty">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>
    <div data-layout="statistic">
      <Statistic title="Statistic" value={1234.56} precision={2} />
    </div>
    <div data-layout="timeline">
      <Timeline items={[{ children: "First" }, { children: "Second" }]} />
    </div>
    <div data-layout="descriptions">
      <Descriptions
        bordered
        title="Details"
        items={[
          { key: "a", label: "A", children: "One" },
          { key: "b", label: "B", children: "Two" },
          { key: "c", label: "C", children: "Three" },
        ]}
      />
    </div>
  </ConfigProvider>,
);
