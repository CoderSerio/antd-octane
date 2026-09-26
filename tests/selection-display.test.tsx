import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Radio,
  Tag,
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
function inputs() {
  return [...container.querySelectorAll("input")];
}
async function click(selector: string) {
  const el = container.querySelector<HTMLElement>(selector);
  if (!el) throw Error(`Missing ${selector}`);
  await act(() => el.click());
}
it("Checkbox.Group preserves option types and document order", async () => {
  const change = vi.fn();
  await render(
    <Checkbox.Group
      options={[
        { label: "Number", value: 1 },
        { label: "Boolean", value: false },
        { label: "String", value: "1" },
      ]}
      onChange={change}
    />,
  );
  await act(() => inputs()[2].click());
  await act(() => inputs()[0].click());
  await act(() => inputs()[1].click());
  expect(change.mock.lastCall?.[0]).toEqual([1, false, "1"]);
  expect(inputs().every((input) => input.checked)).toBe(true);
});
it("controlled Checkbox.Group can reject changes and skipGroup stays independent", async () => {
  const change = vi.fn();
  await render(
    <Checkbox.Group value={[1]} onChange={change}>
      <Checkbox value={1}>A</Checkbox>
      <Checkbox value={2}>B</Checkbox>
      <Checkbox skipGroup value={3}>
        C
      </Checkbox>
    </Checkbox.Group>,
  );
  await act(() => inputs()[1].click());
  expect(change).toHaveBeenCalledWith([1, 2]);
  expect(inputs()[1].checked).toBe(false);
  await act(() => inputs()[2].click());
  expect(inputs()[2].checked).toBe(true);
  expect(change).toHaveBeenCalledTimes(1);
});
it("removed checkbox children are not returned in later group changes", async () => {
  const change = vi.fn();
  function Example() {
    const [show, set] = useState(true);
    return (
      <>
        <Button onClick={() => set(false)}>Remove</Button>
        <Checkbox.Group defaultValue={[1]} onChange={change}>
          {show && <Checkbox value={1}>A</Checkbox>}
          <Checkbox value={2}>B</Checkbox>
        </Checkbox.Group>
      </>
    );
  }
  await render(<Example />);
  await click("button");
  await act(() => inputs()[0].click());
  expect(change).toHaveBeenCalledWith([2]);
});
it("checkbox option and provider disabled prevent interaction", async () => {
  const change = vi.fn();
  await render(
    <ConfigProvider componentDisabled>
      <Checkbox.Group options={[1, 2]} onChange={change} />
    </ConfigProvider>,
  );
  expect(inputs().every((input) => input.disabled)).toBe(true);
  await act(() => inputs()[0].click());
  expect(change).not.toHaveBeenCalled();
});
it("Radio.Group preserves values and uses a unique native name per group", async () => {
  const change = vi.fn();
  await render(
    <>
      <Radio.Group
        options={[
          { value: 1, label: "One" },
          { value: false, label: "No" },
        ]}
        defaultValue={1}
        onChange={change}
      />
      <Radio.Group options={[1, 2]} defaultValue={2} />
    </>,
  );
  expect(inputs()[0].name).toBe(inputs()[1].name);
  expect(inputs()[0].name).not.toBe(inputs()[2].name);
  await act(() => inputs()[1].click());
  expect(change.mock.lastCall?.[0].target.value).toBe(false);
  expect(inputs()[0].checked).toBe(false);
  expect(inputs()[1].checked).toBe(true);
  expect(inputs()[3].checked).toBe(true);
});
it("Radio controlled group rejects selection and button radios remain native inputs", async () => {
  const change = vi.fn();
  await render(
    <Radio.Group
      value={1}
      optionType="button"
      options={[1, 2]}
      onChange={change}
    />,
  );
  await act(() => inputs()[1].click());
  expect(inputs()[0].checked).toBe(true);
  expect(inputs()[1].checked).toBe(false);
  expect(container.querySelectorAll(".ant-radio-button-wrapper")).toHaveLength(
    2,
  );
  expect(change.mock.lastCall?.[0].target.value).toBe(2);
});
it("Tag close can be cancelled and never bubbles into its parent click handler", async () => {
  const parent = vi.fn();
  await render(
    <Tag closable onClick={parent} onClose={(event) => event.preventDefault()}>
      Keep
    </Tag>,
  );
  await click("button");
  expect(container.textContent).toContain("Keep");
  expect(parent).not.toHaveBeenCalled();
  await act(() => root?.render(<Tag closable>Remove</Tag>));
  await click("button");
  expect(container.querySelector(".ant-tag")).toBeNull();
});
it("CheckableTag is controlled and exposes a pressed state", async () => {
  function Example() {
    const [checked, set] = useState(false);
    return (
      <Tag.CheckableTag checked={checked} onChange={set}>
        Choice
      </Tag.CheckableTag>
    );
  }
  await render(<Example />);
  await click("button");
  expect(container.querySelector("button")?.getAttribute("aria-pressed")).toBe(
    "true",
  );
});
it("Alert closes and calls afterClose once after removal", async () => {
  const close = vi.fn();
  const after = vi.fn(() =>
    expect(container.querySelector('[role="alert"]')).toBeNull(),
  );
  await render(
    <Alert
      message="Notice"
      description="Details"
      closable
      onClose={close}
      afterClose={after}
    />,
  );
  await click("button");
  expect(close).toHaveBeenCalledTimes(1);
  expect(after).toHaveBeenCalledTimes(1);
});
it("Badge respects zero hiding, overflow and custom content", async () => {
  await render(
    <>
      <Badge count={0} />
      <Badge count={0} showZero />
      <Badge count={120} />
      <Badge count={<b>new</b>} />
    </>,
  );
  expect(container.querySelectorAll(".ant-badge-indicator")).toHaveLength(3);
  expect(container.textContent).toBe("099+new");
});
it("Avatar falls back on image failure and resets on a new source", async () => {
  await render(<Avatar src="/bad">AB</Avatar>);
  await act(() =>
    container.querySelector("img")?.dispatchEvent(new Event("error")),
  );
  expect(container.querySelector("img")).toBeNull();
  expect(container.textContent).toBe("AB");
  await act(() => root?.render(<Avatar src="/new">AB</Avatar>));
  expect(container.querySelector("img")?.getAttribute("src")).toBe("/new");
});
it("Avatar onError false keeps the image for consumer handling", async () => {
  await render(
    <Avatar src="/bad" onError={() => false}>
      AB
    </Avatar>,
  );
  await act(() =>
    container.querySelector("img")?.dispatchEvent(new Event("error")),
  );
  expect(container.querySelector("img")).not.toBeNull();
});
it("Card loading hides children and restores content with actions", async () => {
  await render(
    <Card
      title="Title"
      loading
      actions={[
        <button type="button" key="action">
          Edit
        </button>,
      ]}
    >
      <Card.Meta title="Meta" description="Details" />
    </Card>,
  );
  expect(container.querySelector('[role="status"]')).not.toBeNull();
  expect(container.textContent).not.toContain("Details");
  await act(() =>
    root?.render(
      <Card title="Title">
        <Card.Meta title="Meta" description="Details" />
      </Card>,
    ),
  );
  expect(container.textContent).toContain("Details");
  expect(container.querySelector('[role="status"]')).toBeNull();
});
