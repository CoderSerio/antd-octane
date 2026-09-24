import "../../packages/antd-octane/src/style.css";
import { createRoot } from "octane";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Divider,
  Input,
  Switch,
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
  </ConfigProvider>,
);
