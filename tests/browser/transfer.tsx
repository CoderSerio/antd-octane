import "../../packages/antd-octane/src/style.css";
import { createRoot, useState } from "octane";
import {
  ConfigProvider,
  Transfer,
  theme,
} from "../../packages/antd-octane/src";

const mode = new URLSearchParams(location.search).get("theme");
function Demo() {
  const [keys, setKeys] = useState<string[]>([]);
  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark"
            ? theme.darkAlgorithm
            : mode === "compact"
              ? theme.compactAlgorithm
              : theme.defaultAlgorithm,
      }}
    >
      <div style={{ padding: 24, maxWidth: 600 }}>
        <Transfer
          dataSource={[
            { key: "a", title: "Alice" },
            { key: "b", title: "Bob" },
            { key: "c", title: "Carol", disabled: true },
          ]}
          targetKeys={keys}
          onChange={setKeys}
          showSearch
        />
        <output id="keys">{keys.join(",")}</output>
        <ConfigProvider
          componentDisabled
          theme={{ token: { colorBgContainer: "rgb(240, 230, 220)" } }}
        >
          <Transfer dataSource={[{ key: "d", title: "Disabled" }]} />
        </ConfigProvider>
      </div>
    </ConfigProvider>
  );
}
const root = document.getElementById("root");
if (!root) throw Error("Missing fixture root");
createRoot(root).render(<Demo />);
