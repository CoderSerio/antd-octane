import { createRoot } from "octane";
import {
  Checkbox,
  ConfigProvider,
  Radio,
} from "../../packages/antd-octane/src";
import "../../packages/antd-octane/src/style.css";

const root = document.getElementById("root");
if (!root) throw Error("Missing root");
createRoot(root).render(
  <ConfigProvider componentDisabled>
    <h1>Local disabled overrides</h1>
    <h2>Checkbox options</h2>
    <Checkbox.Group
      disabled={false}
      options={[
        "Checkbox enabled",
        { label: "Checkbox blocked", value: "blocked", disabled: true },
      ]}
    />
    <h2>Radio options</h2>
    <Radio.Group
      disabled={false}
      options={[
        "Radio first",
        "Radio second",
        { label: "Radio blocked", value: "blocked", disabled: true },
      ]}
    />
    <h2>Inherited provider</h2>
    <Checkbox.Group options={["Checkbox inherited"]} />
    <Radio.Group options={["Radio inherited"]} />
  </ConfigProvider>,
);
