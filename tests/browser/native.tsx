import "../../packages/antd-octane/src/style.css";
import { createRoot } from "octane";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Divider,
  Input,
  Radio,
  Switch,
  Tag,
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
  </ConfigProvider>,
);
