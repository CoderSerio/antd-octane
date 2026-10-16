import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Button, Form, Select } from "../packages/antd-octane/src";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  if (!root) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
});
function input() {
  const field = container.querySelector<HTMLInputElement>('[role="combobox"]');
  if (!field) throw new Error("Missing combobox");
  return field;
}
async function type(value: string) {
  await act(() => {
    input().value = value;
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function key(key: string, isComposing = false) {
  await act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        isComposing,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
}
function labels() {
  return [
    ...container.querySelectorAll(".ant-select-selection-item-content"),
  ].map((n) => n.textContent);
}
async function choose(label: string) {
  const option = [
    ...document.querySelectorAll<HTMLElement>('[role="option"]'),
  ].find((n) => n.textContent === label);
  if (!option) throw new Error(`Missing option ${label}`);
  await act(() => option.click());
}

it("creates tags with Enter, preserves numeric keys, and does not duplicate existing tags on blur", async () => {
  const change = vi.fn(),
    select = vi.fn();
  await render(
    <Select
      mode="tags"
      defaultValue={[0]}
      onChange={change}
      onSelect={select}
    />,
  );
  await type("new");
  await key("Enter");
  expect(labels()).toEqual(["0", "new"]);
  expect(change).toHaveBeenLastCalledWith(
    [0, "new"],
    [
      { value: 0, label: "0" },
      { value: "new", label: "new" },
    ],
  );
  expect(select).toHaveBeenLastCalledWith("new", {
    value: "new",
    label: "new",
  });
  await type("new");
  await act(() =>
    input().dispatchEvent(new FocusEvent("blur", { bubbles: true })),
  );
  expect(labels()).toEqual(["0", "new"]);
  expect(change).toHaveBeenCalledTimes(1);
  await type("0");
  await key("Enter");
  expect(labels()).toEqual(["0", "new", "0"]);
});
it("tokenizes pasted tags once, skips disabled options, and removes or clears selections", async () => {
  const change = vi.fn(),
    deselect = vi.fn();
  await render(
    <Select
      mode="tags"
      tokenSeparators={[",", ";"]}
      options={[{ value: "blocked", disabled: true }]}
      onChange={change}
      onDeselect={deselect}
      allowClear
    />,
  );
  await type("alpha,beta;alpha,blocked,");
  expect(labels()).toEqual(["alpha", "beta"]);
  expect(change).toHaveBeenCalledTimes(1);
  expect(input().value).toBe("");
  await key("Backspace");
  expect(labels()).toEqual(["alpha"]);
  expect(deselect).toHaveBeenLastCalledWith("beta", {
    value: "beta",
    label: "beta",
  });
  await act(() =>
    container.querySelector<HTMLButtonElement>(".ant-select-clear")?.click(),
  );
  expect(change).toHaveBeenLastCalledWith([], []);
});
it("does not commit IME input until composition ends and leaves Escape uncommitted", async () => {
  const change = vi.fn();
  await render(
    <Select mode="tags" tokenSeparators={[","]} onChange={change} />,
  );
  await act(() =>
    input().dispatchEvent(
      new CompositionEvent("compositionstart", { bubbles: true }),
    ),
  );
  await type("中文,");
  await key("Enter", true);
  expect(change).not.toHaveBeenCalled();
  await act(() =>
    input().dispatchEvent(
      new CompositionEvent("compositionend", { bubbles: true }),
    ),
  );
  expect(labels()).toEqual(["中文"]);
  await type("discard");
  await key("Escape");
  expect(labels()).toEqual(["中文"]);
});
it("commits typed tags on Tab and outside clicks", async () => {
  await render(<Select mode="tags" />);
  await type("tab");
  await key("Tab");
  expect(labels()).toEqual(["tab"]);
  await type("outside");
  await act(() =>
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    ),
  );
  expect(labels()).toEqual(["tab", "outside"]);
});
it("respects controlled tag and search values", async () => {
  const change = vi.fn();
  await render(
    <Select mode="tags" value={[]} searchValue="fixed" onChange={change} />,
  );
  await act(() => input().click());
  await key("Enter");
  expect(change).toHaveBeenLastCalledWith(
    ["fixed"],
    [{ value: "fixed", label: "fixed" }],
  );
  expect(labels()).toEqual([]);
  expect(input().value).toBe("fixed");
});
it("returns labeled single values and preserves mapped original option identity", async () => {
  const option = { id: 0, name: "Ada", team: "Web" };
  const change = vi.fn(),
    select = vi.fn();
  await render(
    <Select
      labelInValue
      fieldNames={{ value: "id", label: "name" }}
      options={[option]}
      onChange={change}
      onSelect={select}
      allowClear
    />,
  );
  await act(() => input().click());
  await choose("Ada");
  expect(change).toHaveBeenLastCalledWith({ value: 0, label: "Ada" }, option);
  expect(change.mock.calls[0][1]).toBe(option);
  expect(select).toHaveBeenLastCalledWith({ value: 0, label: "Ada" }, option);
  expect(input().value).toBe("Ada");
  await act(() =>
    container.querySelector<HTMLButtonElement>(".ant-select-clear")?.click(),
  );
  expect(change).toHaveBeenLastCalledWith(undefined);
});
it("keeps supplied remote labels and sends labeled deselections", async () => {
  const deselect = vi.fn(),
    change = vi.fn();
  await render(
    <Select
      mode="multiple"
      labelInValue
      defaultValue={[{ value: "remote", label: "Remote owner" }]}
      onChange={change}
      onDeselect={deselect}
    />,
  );
  expect(labels()).toEqual(["Remote owner"]);
  await key("Backspace");
  expect(deselect).toHaveBeenLastCalledWith(
    { value: "remote", label: "Remote owner" },
    { value: "remote", label: "Remote owner" },
  );
  expect(change).toHaveBeenLastCalledWith([], []);
});
it("retains a selected label after remote options disappear", async () => {
  function Fixture() {
    const [options, setOptions] = useState([{ value: "ada", label: "Ada" }]);
    return (
      <>
        <Select labelInValue options={options} />
        <button type="button" onClick={() => setOptions([])}>
          Forget options
        </button>
      </>
    );
  }
  await render(<Fixture />);
  await act(() => input().click());
  await choose("Ada");
  await act(() =>
    container.querySelector<HTMLButtonElement>("button")?.click(),
  );
  expect(input().value).toBe("Ada");
});
it("collects labeled tags through Form and restores initial labels on reset", async () => {
  const finish = vi.fn();
  await render(
    <Form
      initialValues={{ owners: [{ value: "ada", label: "Ada" }] }}
      onFinish={finish}
    >
      <Form.Item name="owners">
        <Select mode="tags" labelInValue />
      </Form.Item>
      <Button htmlType="submit">Save</Button>
      <Button htmlType="reset">Reset</Button>
    </Form>,
  );
  await type("bob");
  await key("Enter");
  await act(() =>
    container
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  expect(finish).toHaveBeenCalledWith({
    owners: [
      { value: "ada", label: "Ada" },
      { value: "bob", label: "bob" },
    ],
  });
  await act(() =>
    container
      .querySelector("form")
      ?.dispatchEvent(new Event("reset", { bubbles: true, cancelable: true })),
  );
  expect(labels()).toEqual(["Ada"]);
});
