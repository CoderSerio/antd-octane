import "../../packages/antd-octane/src/style.css";
import { createRoot } from "octane";
import { Input } from "../../packages/antd-octane/src/input";

const variants = ["plain", "affix", "grouped", "textarea", "textarea-clear"];
const widths = [200, "50%"];
const container = document.getElementById("root");
if (!container) throw new Error("Missing fixture root");

if (new URLSearchParams(location.search).get("renderer") === "antd") {
  const { createElement: h } = await import("react");
  const { createRoot: createReactRoot } = await import("react-dom/client");
  const { Input: AntInput } = await import("antd");
  createReactRoot(container).render(
    h(
      "div",
      { style: { width: 400 } },
      widths.flatMap((width) =>
        variants.map((variant) =>
          h(
            "section",
            {
              key: `${variant}-${width}`,
              "data-case": `${variant}-${width}`,
              style: { marginBottom: 28 },
            },
            variant.startsWith("textarea")
              ? h(AntInput.TextArea, {
                  showCount: true,
                  allowClear: variant === "textarea-clear",
                  defaultValue: "test",
                  style: { width },
                })
              : h(AntInput, {
                  showCount: true,
                  prefix: variant === "affix" ? "$" : undefined,
                  addonBefore: variant === "grouped" ? "https://" : undefined,
                  defaultValue: "test",
                  style: { width },
                }),
          ),
        ),
      ),
    ),
  );
} else {
  createRoot(container).render(
    <div style={{ width: 400 }}>
      {widths.flatMap((width) =>
        variants.map((variant) => (
          <section
            key={`${variant}-${width}`}
            data-case={`${variant}-${width}`}
            style={{ marginBottom: 28 }}
          >
            {variant.startsWith("textarea") ? (
              <Input.TextArea
                showCount
                allowClear={variant === "textarea-clear"}
                defaultValue="test"
                style={{ width }}
              />
            ) : (
              <Input
                showCount
                prefix={variant === "affix" ? "$" : undefined}
                addonBefore={variant === "grouped" ? "https://" : undefined}
                defaultValue="test"
                style={{ width }}
              />
            )}
          </section>
        )),
      )}
    </div>,
  );
}
