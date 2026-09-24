import "../../packages/antd-octane/src/style.css";
import { createRoot } from "octane";
import { Button, ConfigProvider, theme } from "../../packages/antd-octane/src";
import { brand, cases, component } from "./cases";

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
  </ConfigProvider>,
);
