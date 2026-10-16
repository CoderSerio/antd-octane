import "../../packages/antd-octane/src/style.css";
import { createRoot, useState } from "octane";
import {
  ConfigProvider,
  type LabeledSelectValue,
  Select,
  theme,
} from "../../packages/antd-octane/src";

const options = [
  { value: "ada", label: "Ada" },
  { value: "blocked", label: "Blocked", disabled: true },
];
const params = new URLSearchParams(location.search);
const dark = params.has("dark"),
  compact = params.has("compact");
const style = { width: "min(280px, calc(100vw - 48px))", margin: 24 };
function Native() {
  const [value, setValue] = useState<LabeledSelectValue[]>([
    { value: "ada", label: "Ada" },
  ]);
  return (
    <ConfigProvider
      theme={{
        algorithm: [
          ...(dark ? [theme.darkAlgorithm] : []),
          ...(compact ? [theme.compactAlgorithm] : []),
        ],
      }}
    >
      <div style={style}>
        <Select
          aria-label="Owners"
          mode="tags"
          labelInValue
          options={options}
          value={value}
          onChange={setValue}
          tokenSeparators={[",", ";"]}
          allowClear
          style={{ width: "100%" }}
        />
        <output style={{ display: "block", overflowWrap: "anywhere" }}>
          {JSON.stringify(value)}
        </output>
        <button
          type="button"
          onClick={() => setValue([{ value: "ada", label: "Ada" }])}
        >
          Reset
        </button>
      </div>
    </ConfigProvider>
  );
}
const container = document.getElementById("root");
if (!container) throw new Error("Missing root");
if (params.get("renderer") === "antd") {
  const { createElement: h, useState: useReactState } = await import("react");
  const { createRoot: createReactRoot } = await import("react-dom/client");
  const {
    Select: AntSelect,
    ConfigProvider: AntConfig,
    theme: antTheme,
  } = await import("antd");
  function Upstream() {
    const [value, setValue] = useReactState<LabeledSelectValue[]>([
      { value: "ada", label: "Ada" },
    ]);
    return h(
      AntConfig,
      {
        theme: {
          algorithm: [
            ...(dark ? [antTheme.darkAlgorithm] : []),
            ...(compact ? [antTheme.compactAlgorithm] : []),
          ],
        },
      },
      h(
        "div",
        { style },
        h(AntSelect<LabeledSelectValue[]>, {
          "aria-label": "Owners",
          mode: "tags",
          labelInValue: true,
          options,
          value,
          onChange: setValue,
          tokenSeparators: [",", ";"],
          allowClear: true,
          style: { width: "100%" },
        }),
        h(
          "output",
          { style: { display: "block", overflowWrap: "anywhere" } },
          JSON.stringify(value),
        ),
        h(
          "button",
          {
            type: "button",
            onClick: () => setValue([{ value: "ada", label: "Ada" }]),
          },
          "Reset",
        ),
      ),
    );
  }
  createReactRoot(container).render(h(Upstream));
} else createRoot(container).render(<Native />);
