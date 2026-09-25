import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it } from "vitest";
import { App } from "../packages/antd-octane/src/app";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import {
  createIcon,
  Icon,
  type IconDefinition,
} from "../packages/antd-octane/src/icon";

let root: Root | undefined, container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
  root = undefined;
});
function Consumer() {
  const api = App.useApp();
  return (
    <button type="button" onClick={() => api.message.success("Saved", 0)}>
      Notify
    </button>
  );
}
it("App exposes theme-aware message and cleans portals", async () => {
  await render(
    <ConfigProvider
      theme={{ components: { Message: { contentBg: "#abc123" } } }}
    >
      <App>
        <Consumer />
      </App>
    </ConfigProvider>,
  );
  await act(() => container.querySelector("button")?.click());
  expect(document.querySelector(".ant-message-notice")?.textContent).toContain(
    "Saved",
  );
  expect(
    document.querySelector(".ant-message")?.getAttribute("style"),
  ).toContain("#abc123");
  await act(() => root?.unmount());
  expect(document.querySelector(".ant-message")).toBeNull();
});
it("Icon renders SVG descriptors in correct namespace and supports two-tone", async () => {
  const definition: IconDefinition = {
    name: "test",
    theme: "twotone",
    icon: (primary, secondary) => ({
      tag: "svg",
      attrs: { viewBox: "0 0 16 16" },
      children: [
        { tag: "circle", attrs: { cx: "8", cy: "8", r: "7", fill: secondary } },
        { tag: "path", attrs: { d: "M4 8h8", stroke: primary } },
      ],
    }),
  };
  const TestIcon = createIcon(definition);
  await render(
    <TestIcon twoToneColor={["#123456", "#abcdef"]} aria-label="示例图标" />,
  );
  const circle = container.querySelector("circle");
  expect(circle?.namespaceURI).toBe("http://www.w3.org/2000/svg");
  expect(circle?.getAttribute("fill")).toBe("#abcdef");
  expect(
    container.querySelector('[role="img"]')?.getAttribute("aria-label"),
  ).toBe("示例图标");
});
it("Icon respects global motion false and marks decorative content hidden", async () => {
  await render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Icon spin>
        <path d="M0 0h10" />
      </Icon>
    </ConfigProvider>,
  );
  expect(container.querySelector(".ao-icon-spin")).toBeNull();
  expect(container.querySelector(".anticon")?.getAttribute("aria-hidden")).toBe(
    "true",
  );
});
it("Icon preserves SVG definition root paint attributes", async () => {
  await render(
    <Icon
      icon={{
        name: "root-paint",
        theme: "outlined",
        icon: {
          tag: "svg",
          attrs: {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#123456",
            "stroke-width": "2",
          },
          children: [{ tag: "path", attrs: { d: "M1 1h20v20" } }],
        },
      }}
    />,
  );
  const svg = container.querySelector("svg");
  expect(svg?.getAttribute("fill")).toBe("none");
  expect(svg?.getAttribute("stroke")).toBe("#123456");
  expect(svg?.getAttribute("stroke-width")).toBe("2");
});
