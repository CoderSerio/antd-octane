import { createRoot, useState } from "octane";
import {
  type Color,
  ColorPicker,
  ConfigProvider,
  theme,
} from "../../packages/antd-octane/src";
import "../../packages/antd-octane/src/style.css";
const mode = new URLSearchParams(location.search).get("theme");
function Fixture() {
  const [value, setValue] = useState<Color | string>("#1677ff");
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  return (
    <ConfigProvider
      theme={
        mode === "dark"
          ? { algorithm: theme.darkAlgorithm }
          : mode === "compact"
            ? { algorithm: theme.compactAlgorithm }
            : {}
      }
    >
      <h1>ColorPicker — unpublished source</h1>
      <p>Solid colors; controlled value, keyboard, alpha, presets, clear.</p>
      <div
        style={{ padding: 16, maxWidth: 310, overflow: "hidden", height: 60 }}
      >
        {visible && (
          <ColorPicker
            value={value}
            onChange={setValue}
            onChangeComplete={() => setCount(count + 1)}
            showText
            allowClear
            presets={[
              {
                label: "Brand colors",
                colors: ["#ff0000", "#00ff00", "#0000ff80"],
              },
            ]}
          />
        )}
      </div>
      <p id="result">
        {typeof value === "string"
          ? value
          : value.cleared
            ? "cleared"
            : value.toHexString()}
      </p>
      <p id="completed">{count}</p>
      <button type="button" onClick={() => setVisible(!visible)}>
        Toggle mount
      </button>
      <ConfigProvider theme={{ token: { colorPrimary: "#722ed1" } }}>
        <ColorPicker
          aria-label="Nested color"
          disabled
          showText
          defaultValue="#722ed1"
        />
      </ConfigProvider>
    </ConfigProvider>
  );
}
const root = document.getElementById("root");
if (!root) throw Error("Missing root");
createRoot(root).render(<Fixture />);
