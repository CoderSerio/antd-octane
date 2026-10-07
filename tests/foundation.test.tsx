import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  ConfigProvider,
  Divider,
  Flex,
  Space,
  Switch,
} from "../packages/antd-octane/src";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
});
function button() {
  const el = container.querySelector("button");
  if (!el) throw Error("No switch");
  return el;
}
it("uses the owner's value for controlled switches and reports the requested next state", async () => {
  const change = vi.fn();
  await render(<Switch checked={false} onChange={change} />);
  await act(() => button().click());
  expect(change).toHaveBeenCalledWith(true, expect.any(MouseEvent));
  expect(button().getAttribute("aria-checked")).toBe("false");
});
it("updates uncontrolled switches and supports direction keys without duplicate callbacks", async () => {
  const change = vi.fn();
  await render(<Switch defaultChecked onChange={change} />);
  await act(() =>
    button().dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
    ),
  );
  expect(button().getAttribute("aria-checked")).toBe("false");
  await act(() =>
    button().dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
    ),
  );
  expect(change).toHaveBeenCalledTimes(1);
  await act(() => button().click());
  expect(button().getAttribute("aria-checked")).toBe("true");
});
it("supports value aliases and owner updates", async () => {
  function Example() {
    const [value, set] = useState(false);
    return <Switch value={value} onChange={set} />;
  }
  await render(<Example />);
  await act(() => button().click());
  expect(button().getAttribute("aria-checked")).toBe("true");
});
it("loading and provider disability prevent state changes", async () => {
  const change = vi.fn();
  await render(
    <ConfigProvider componentDisabled>
      <Switch onChange={change} />
      <Switch disabled={false} loading onChange={change} />
    </ConfigProvider>,
  );
  for (const el of container.querySelectorAll("button")) {
    expect(el.disabled).toBe(true);
    await act(() => el.click());
  }
  expect(change).not.toHaveBeenCalled();
});
it("respects a cancelled keyboard handler", async () => {
  await render(<Switch onKeyDown={(event) => event.preventDefault()} />);
  await act(() =>
    button().dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(button().getAttribute("aria-checked")).toBe("false");
});
it("merges component theme overrides across nested providers", async () => {
  await render(
    <ConfigProvider
      theme={{
        components: {
          Switch: { handleBg: "#ff0000", trackHeight: 30 },
          Divider: { verticalMarginInline: 12 },
        },
      }}
    >
      <ConfigProvider theme={{ components: { Switch: { trackMinWidth: 60 } } }}>
        <Switch />
        <Divider type="vertical" />
      </ConfigProvider>
    </ConfigProvider>,
  );
  expect(button().style.getPropertyValue("--ao-switch-handle-bg")).toBe(
    "#ff0000",
  );
  expect(button().style.getPropertyValue("--ao-switch-height")).toBe("30px");
  expect(button().style.getPropertyValue("--ao-switch-width")).toBe("60px");
  expect(
    container
      .querySelector<HTMLElement>(".ant-divider")
      ?.style.getPropertyValue("--ao-divider-vertical-margin"),
  ).toBe("12px");
});
it("excludes empty Space items while preserving zero and separators", async () => {
  await render(
    <Space split="/">
      {null}
      {false}
      {0}
      <span>Second</span>
    </Space>,
  );
  expect(container.querySelectorAll(".ant-space-item")).toHaveLength(2);
  expect(container.querySelectorAll(".ant-space-item-split")).toHaveLength(1);
  expect(container.textContent).toBe("0/Second");
});
it("Flex does not wrap children and uses configured spacing", async () => {
  await render(
    <ConfigProvider theme={{ token: { paddingXS: 13 } }}>
      <Flex gap="small" vertical wrap>
        <span>A</span>
        <span>B</span>
      </Flex>
    </ConfigProvider>,
  );
  const flex = container.querySelector<HTMLElement>(".ant-flex");
  expect(flex?.children).toHaveLength(2);
  expect(flex?.style.gap).toBe("13px");
  expect(flex?.style.flexDirection).toBe("column");
  expect(flex?.style.flexWrap).toBe("wrap");
});
it("gives Divider static separator semantics and hides vertical titles", async () => {
  await render(
    <>
      <Divider>Title</Divider>
      <Divider type="vertical">Hidden</Divider>
    </>,
  );
  expect(container.querySelectorAll('[role="separator"]')).toHaveLength(2);
  expect(container.textContent).toBe("Title");
  expect(
    container
      .querySelector('[aria-orientation="vertical"]')
      ?.hasAttribute("tabindex"),
  ).toBe(false);
});
