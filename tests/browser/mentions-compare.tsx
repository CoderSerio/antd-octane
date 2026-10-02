import "../../packages/antd-octane/src/style.css";
import { createRoot, useState } from "octane";
import { Mentions } from "../../packages/antd-octane/src";

const options = [
  { value: "alice", label: "Alice" },
  { value: "alex", label: "Alex", disabled: true },
  { value: "bob", label: "Bob" },
];
function NativeFixture() {
  const [value, setValue] = useState("Before @al after");
  const [events, setEvents] = useState("");
  return (
    <div style={{ width: "min(460px, calc(100vw - 48px))", margin: 24 }}>
      <Mentions
        aria-label="Mention someone"
        options={options}
        value={value}
        onChange={setValue}
        onSearch={(text, prefix) => setEvents(`search:${prefix}${text}`)}
        onSelect={(option, prefix) =>
          setEvents(`select:${prefix}${option.value}`)
        }
        allowClear
        autoSize={{ minRows: 2, maxRows: 4 }}
      />
      <output id="value">{value}</output>
      <output id="events">{events}</output>
    </div>
  );
}
const root = document.getElementById("root");
if (!root) throw Error("Missing fixture root");
if (new URLSearchParams(location.search).get("renderer") === "antd") {
  const { createElement: h, useState: useReactState } = await import("react");
  const { createRoot: createReactRoot } = await import("react-dom/client");
  const { Mentions: AntMentions } = await import("antd");
  function UpstreamFixture() {
    const [value, setValue] = useReactState("Before @al after");
    const [events, setEvents] = useReactState("");
    return h(
      "div",
      { style: { width: "min(460px, calc(100vw - 48px))", margin: 24 } },
      h(AntMentions, {
        "aria-label": "Mention someone",
        options,
        value,
        onChange: setValue,
        onSearch: (text: string, prefix: string) =>
          setEvents(`search:${prefix}${text}`),
        onSelect: (option: { value?: string }, prefix: string) =>
          setEvents(`select:${prefix}${option.value}`),
        allowClear: true,
        autoSize: { minRows: 2, maxRows: 4 },
      }),
      h("output", { id: "value" }, value),
      h("output", { id: "events" }, events),
    );
  }
  createReactRoot(root).render(h(UpstreamFixture));
} else createRoot(root).render(<NativeFixture />);
