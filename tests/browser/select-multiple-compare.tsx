import "../../packages/antd-octane/src/style.css";
import { createRoot, useState } from "octane";
import {
  Select,
  type SelectValue,
} from "../../packages/antd-octane/src/select";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", disabled: true },
  { value: "cherry", label: "Cherry" },
];
function NativeFixture() {
  const [value, setValue] = useState<SelectValue[]>(["apple"]);
  return (
    <div style={{ width: 280, margin: 24 }}>
      <Select
        mode="multiple"
        options={options}
        value={value}
        onChange={setValue}
        allowClear
        aria-label="Fruits"
        style={{ width: "100%" }}
      />
      <output>{JSON.stringify(value)}</output>
      <button type="button" onClick={() => setValue(["apple"])}>
        Reset
      </button>
    </div>
  );
}
const container = document.getElementById("root");
if (!container) throw new Error("Missing fixture root");
if (new URLSearchParams(location.search).get("renderer") === "antd") {
  const { createElement: h, useState: useReactState } = await import("react");
  const { createRoot: createReactRoot } = await import("react-dom/client");
  const { Select: AntSelect } = await import("antd");
  function UpstreamFixture() {
    const [value, setValue] = useReactState<string[]>(["apple"]);
    return h(
      "div",
      { style: { width: 280, margin: 24 } },
      h(AntSelect<string[]>, {
        mode: "multiple",
        options,
        value,
        onChange: setValue,
        allowClear: true,
        "aria-label": "Fruits",
        style: { width: "100%" },
      }),
      h("output", null, JSON.stringify(value)),
      h(
        "button",
        { type: "button", onClick: () => setValue(["apple"]) },
        "Reset",
      ),
    );
  }
  createReactRoot(container).render(h(UpstreamFixture));
} else createRoot(container).render(<NativeFixture />);
