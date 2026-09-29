import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, Fragment, useState } from "octane";
import { afterEach, expect, it } from "vitest";
import { Button } from "../packages/antd-octane/src/button";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { Input, type InputRef } from "../packages/antd-octane/src/input";
import { Select } from "../packages/antd-octane/src/select";
import { Space } from "../packages/antd-octane/src/space";

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
  root = undefined;
  container?.remove();
});

it("filters absent nodes and fragments without introducing flex wrappers", async () => {
  await render(
    <Space.Compact block rootClassName="group" aria-label="Actions">
      {null}
      <Fragment key="fragment">
        <Button className="custom">First</Button>
        {false}
        <Button>Middle</Button>
      </Fragment>
      <Button>Last</Button>
      {undefined}
    </Space.Compact>,
  );
  const group = container.querySelector(".ant-space-compact");
  expect(group?.classList.contains("ant-space-compact-block")).toBe(true);
  expect(group?.classList.contains("group")).toBe(true);
  expect(group?.getAttribute("aria-label")).toBe("Actions");
  const buttons = [...container.querySelectorAll("button")];
  expect(group?.children).toHaveLength(3);
  expect(buttons[0].classList.contains("custom")).toBe(true);
  expect(buttons[0].classList.contains("ant-space-compact-first-item")).toBe(
    true,
  );
  expect(buttons[1].classList.contains("ant-space-compact-first-item")).toBe(
    false,
  );
  expect(buttons[1].classList.contains("ant-space-compact-last-item")).toBe(
    false,
  );
  expect(buttons[2].classList.contains("ant-space-compact-last-item")).toBe(
    true,
  );
});

it("renders an empty compact as null and preserves both corners of a single item", async () => {
  await render(
    <Space.Compact>
      {false}
      {null}
    </Space.Compact>,
  );
  expect(container.children).toHaveLength(0);
  await act(() =>
    root?.render(
      <Space.Compact>
        <Button>Only</Button>
      </Space.Compact>,
    ),
  );
  const button = container.querySelector("button");
  expect(button?.classList.contains("ant-space-compact-first-item")).toBe(true);
  expect(button?.classList.contains("ant-space-compact-last-item")).toBe(true);
});

it("inherits provider size and disabled state, with explicit control overrides", async () => {
  await render(
    <ConfigProvider componentSize="large" componentDisabled>
      <Space.Compact>
        <Input aria-label="Inherited" />
        <Button>Disabled</Button>
        <Button size="small" disabled={false}>
          Override
        </Button>
      </Space.Compact>
      <Space.Compact size="small">
        <Select options={[{ value: "a", label: "A" }]} />
        <Space.Addon>Label</Space.Addon>
      </Space.Compact>
    </ConfigProvider>,
  );
  expect(
    container.querySelector("input")?.classList.contains("ant-input-large"),
  ).toBe(true);
  expect(container.querySelector("input")?.disabled).toBe(true);
  const buttons = [...container.querySelectorAll("button")];
  expect(buttons[0].classList.contains("ant-btn-large")).toBe(true);
  expect(buttons[0].disabled).toBe(true);
  expect(buttons[1].classList.contains("ant-btn-small")).toBe(true);
  expect(buttons[1].disabled).toBe(false);
  expect(
    container
      .querySelector(".ant-select")
      ?.classList.contains("ant-select-small"),
  ).toBe(true);
  expect(
    container
      .querySelector(".ant-space-addon")
      ?.classList.contains("ant-space-addon-small"),
  ).toBe(true);
});

it("propagates first and last boundaries into nested compacts of the same direction", async () => {
  await render(
    <Space.Compact direction="vertical">
      <Space.Compact direction="vertical">
        <Button>One</Button>
        <Button>Two</Button>
      </Space.Compact>
      <Space.Compact direction="vertical">
        <Button>Three</Button>
        <Button>Four</Button>
      </Space.Compact>
    </Space.Compact>,
  );
  const buttons = [...container.querySelectorAll("button")];
  expect(
    buttons.map((button) =>
      button.classList.contains("ant-space-compact-first-item"),
    ),
  ).toEqual([true, false, false, false]);
  expect(
    buttons.map((button) =>
      button.classList.contains("ant-space-compact-last-item"),
    ),
  ).toEqual([false, false, false, true]);
  expect(
    buttons.every((button) =>
      button.classList.contains("ant-space-compact-vertical-item"),
    ),
  ).toBe(true);
});

it("updates context and boundaries without losing uncontrolled input state or focus", async () => {
  function Example() {
    const [small, setSmall] = useState(false);
    const [extra, setExtra] = useState(true);
    return (
      <>
        <Button onClick={() => setSmall(!small)}>Size</Button>
        <Button onClick={() => setExtra(!extra)}>Remove</Button>
        <Space.Compact size={small ? "small" : "large"}>
          <Input key="field" defaultValue="seed" />
          {extra && <Button key="extra">Extra</Button>}
        </Space.Compact>
      </>
    );
  }
  await render(<Example />);
  const input = container.querySelector("input");
  if (!input) throw Error("Missing input");
  input.value = "edited";
  input.focus();
  await act(() => container.querySelectorAll("button")[0].click());
  expect(container.querySelector("input")).toBe(input);
  expect(input.value).toBe("edited");
  expect(document.activeElement).toBe(input);
  expect(input.classList.contains("ant-input-small")).toBe(true);
  await act(() => container.querySelectorAll("button")[1].click());
  expect(input.classList.contains("ant-space-compact-last-item")).toBe(true);
  expect(container.querySelector("input")).toBe(input);
});

it("keeps original callbacks and refs while merging compact classes", async () => {
  let clicks = 0;
  const ref = { current: null as InputRef | null };
  await render(
    <Space.Compact>
      <Input ref={ref} />
      <Button onClick={() => clicks++}>Action</Button>
    </Space.Compact>,
  );
  expect(ref.current?.input).toBe(container.querySelector("input"));
  await act(() => container.querySelector("button")?.click());
  expect(clicks).toBe(1);
});
