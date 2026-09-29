import "../../packages/antd-octane/src/style.css";
import { createRoot, useState } from "octane";
import { Button } from "../../packages/antd-octane/src/button";
import { ConfigProvider } from "../../packages/antd-octane/src/config-provider";
import { Input } from "../../packages/antd-octane/src/input";
import { InputNumber } from "../../packages/antd-octane/src/input-number";
import { Select } from "../../packages/antd-octane/src/select";
import { Space } from "../../packages/antd-octane/src/space";

const root = document.getElementById("root");
if (!root) throw Error("Missing fixture root");
const sizes = ["small", "middle", "large"] as const;

function NativeFixture() {
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState("octane");
  const [submitted, setSubmitted] = useState("");
  return (
    <main style={{ width: "min(600px, 100%)" }}>
      {sizes.map((size) => (
        <section
          key={size}
          data-case={`size-${size}`}
          style={{ marginBottom: 24 }}
        >
          <Space.Compact size={size}>
            <Input
              aria-label={`${size} input`}
              style={{ width: 160 }}
              defaultValue="Value"
            />
            <Button>First</Button>
            <Button>Last</Button>
          </Space.Compact>
        </section>
      ))}
      <section data-case="interactive" style={{ marginBottom: 24 }}>
        <Button onClick={() => setDisabled(!disabled)}>Toggle disabled</Button>
        <ConfigProvider componentDisabled={disabled}>
          <Space.Compact block style={{ marginTop: 8 }}>
            <Input
              aria-label="Query"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              style={{ flex: 1, minWidth: 0 }}
            />
            <Button type="primary" onClick={() => setSubmitted(value)}>
              Submit
            </Button>
          </Space.Compact>
        </ConfigProvider>
        <output>{submitted}</output>
      </section>
      <section data-case="vertical" style={{ marginBottom: 24 }}>
        <Space.Compact direction="vertical">
          <Button>Top</Button>
          <Button>Middle</Button>
          <Button>Bottom</Button>
        </Space.Compact>
      </section>
      <section data-case="nested" style={{ marginBottom: 24 }}>
        <Space.Compact>
          <Space.Compact>
            <Button>A</Button>
            <Button>B</Button>
          </Space.Compact>
          <Space.Compact>
            <Button>C</Button>
            <Button>D</Button>
          </Space.Compact>
        </Space.Compact>
      </section>
      <section data-case="affix" style={{ marginBottom: 24 }}>
        <Space.Compact block>
          <Input
            prefix="$"
            allowClear
            defaultValue="Money"
            style={{ flex: 1, minWidth: 0 }}
          />
          <Input.Password
            defaultValue="Secret"
            style={{ flex: 1, minWidth: 0 }}
          />
          <Button>Save</Button>
        </Space.Compact>
      </section>
      <section data-case="addon" style={{ marginBottom: 24 }}>
        <Space.Compact block>
          <Space.Addon>https://</Space.Addon>
          <Input
            aria-label="Domain"
            defaultValue="octane.dev"
            style={{ flex: 1, minWidth: 0 }}
          />
          <Space.Addon>.org</Space.Addon>
        </Space.Compact>
      </section>
      <section data-case="controls" style={{ marginBottom: 24 }}>
        <Space.Compact block>
          <Select
            aria-label="Protocol"
            defaultValue="https"
            options={[
              { value: "https", label: "HTTPS" },
              { value: "http", label: "HTTP" },
            ]}
            style={{ width: 110 }}
          />
          <InputNumber
            aria-label="Port"
            defaultValue={443}
            style={{ flex: 1, minWidth: 0 }}
          />
          <Button>Connect</Button>
        </Space.Compact>
      </section>
      <section data-case="count" style={{ marginBottom: 32 }}>
        <Space.Compact block>
          <Input showCount defaultValue="Value" style={{ width: "60%" }} />
          <Button>Count</Button>
        </Space.Compact>
      </section>
      <section data-case="grouped" style={{ marginBottom: 24 }}>
        <Space.Compact block>
          <Input
            addonBefore="https://"
            addonAfter=".org"
            style={{ flex: 1, minWidth: 0 }}
          />
          <Button>Open</Button>
        </Space.Compact>
      </section>
      <section data-case="rtl" dir="rtl" style={{ marginBottom: 24 }}>
        <Space.Compact>
          <Button>First RTL</Button>
          <Button>Last RTL</Button>
        </Space.Compact>
      </section>
    </main>
  );
}

const renderer = new URLSearchParams(location.search).get("renderer");
if (renderer === "antd") {
  const { createElement: h } = await import("react");
  const { createRoot: createReactRoot } = await import("react-dom/client");
  const {
    Space: AntSpace,
    Button: AntButton,
    Input: AntInput,
  } = await import("antd");
  createReactRoot(root).render(
    h(
      "main",
      { style: { width: 600 } },
      ...sizes.map((size) =>
        h(
          "section",
          {
            key: size,
            "data-case": `size-${size}`,
            style: { marginBottom: 24 },
          },
          h(
            AntSpace.Compact,
            { size },
            h(AntInput, { style: { width: 160 }, defaultValue: "Value" }),
            h(AntButton, null, "First"),
            h(AntButton, null, "Last"),
          ),
        ),
      ),
      h(
        "section",
        { "data-case": "vertical" },
        h(
          AntSpace.Compact,
          { direction: "vertical" },
          h(AntButton, null, "Top"),
          h(AntButton, null, "Middle"),
          h(AntButton, null, "Bottom"),
        ),
      ),
    ),
  );
} else createRoot(root).render(<NativeFixture />);
