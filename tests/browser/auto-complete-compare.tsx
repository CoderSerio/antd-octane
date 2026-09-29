import "../../packages/antd-octane/src/auto-complete.css";
import { createRoot, useState } from "octane";
import { AutoComplete } from "../../packages/antd-octane/src/auto-complete";
import { ConfigProvider } from "../../packages/antd-octane/src/config-provider";
import { darkAlgorithm } from "../../packages/antd-octane/src/theme/resolve";

if (new URLSearchParams(location.search).has("dark")) {
  document.body.style.background = "#141414";
  document.body.style.color = "rgba(255,255,255,0.85)";
}
const initialOptions = [
  { value: "apple", label: "Apple suggestion" },
  { value: "banana", label: "Banana suggestion", disabled: true },
  { value: "cherry", label: "Cherry suggestion" },
];
if (new URLSearchParams(location.search).has("long"))
  initialOptions.push({
    value: "long".repeat(100),
    label: "Long label ".repeat(100),
  });
const startsEmpty = new URLSearchParams(location.search).has("empty");
const defaultOpen = new URLSearchParams(location.search).has("open");
function NativeFixture() {
  const [text, setText] = useState("");
  const [events, setEvents] = useState("");
  const [empty, setEmpty] = useState(startsEmpty);
  const [disabled, setDisabled] = useState(false);
  return (
    <ConfigProvider
      theme={{
        algorithm: new URLSearchParams(location.search).has("dark")
          ? darkAlgorithm
          : undefined,
      }}
    >
      <div
        style={{
          width: "min(280px, calc(100vw - 48px))",
          margin: 24,
          overflowWrap: "anywhere",
        }}
      >
        <AutoComplete
          options={empty ? [] : initialOptions}
          defaultOpen={defaultOpen}
          disabled={disabled}
          value={text}
          onChange={setText}
          onSearch={(next) => setEvents(`search:${next}`)}
          onSelect={(next) => setEvents(`select:${next}`)}
          allowClear
          aria-label="Suggestions"
          style={{ width: "100%" }}
        />
        <output id="value">{text}</output>
        <output id="events">{events}</output>
        <button
          type="button"
          style={{ marginTop: 180 }}
          onClick={() => setEmpty(!empty)}
        >
          Toggle empty options
        </button>
        <button type="button" onClick={() => setDisabled(!disabled)}>
          Toggle disabled
        </button>
        <AutoComplete
          aria-label="Disabled suggestions"
          disabled
          defaultValue="disabled"
          options={initialOptions}
          style={{ width: "100%", marginTop: 24 }}
        />
      </div>
    </ConfigProvider>
  );
}
const root = document.getElementById("root");
if (!root) throw Error("Missing fixture root");
if (new URLSearchParams(location.search).get("renderer") === "antd") {
  const { createElement: h, useState: useReactState } = await import("react");
  const { createRoot: createReactRoot } = await import("react-dom/client");
  const {
    AutoComplete: AntAutoComplete,
    ConfigProvider: AntConfigProvider,
    theme,
  } = await import("antd");
  function UpstreamFixture() {
    const [text, setText] = useReactState("");
    const [events, setEvents] = useReactState("");
    const [empty, setEmpty] = useReactState(startsEmpty);
    const [disabled, setDisabled] = useReactState(false);
    return h(
      AntConfigProvider,
      {
        theme: {
          algorithm: new URLSearchParams(location.search).has("dark")
            ? theme.darkAlgorithm
            : undefined,
        },
      },
      h(
        "div",
        {
          style: {
            width: "min(280px, calc(100vw - 48px))",
            margin: 24,
            overflowWrap: "anywhere",
          },
        },
        h(AntAutoComplete<string>, {
          options: empty ? [] : initialOptions,
          defaultOpen,
          disabled,
          value: text,
          onChange: setText,
          onSearch: (next) => setEvents(`search:${next}`),
          onSelect: (next) => setEvents(`select:${next}`),
          allowClear: true,
          "aria-label": "Suggestions",
          style: { width: "100%" },
        }),
        h("output", { id: "value" }, text),
        h("output", { id: "events" }, events),
        h(
          "button",
          {
            type: "button",
            style: { marginTop: 180 },
            onClick: () => setDisabled(!disabled),
          },
          "Toggle disabled",
        ),
        h(
          "button",
          { type: "button", onClick: () => setEmpty(!empty) },
          "Toggle empty options",
        ),
        h(AntAutoComplete<string>, {
          "aria-label": "Disabled suggestions",
          disabled: true,
          defaultValue: "disabled",
          options: initialOptions,
          style: { width: "100%", marginTop: 24 },
        }),
      ),
    );
  }
  createReactRoot(root).render(h(UpstreamFixture));
} else createRoot(root).render(<NativeFixture />);
