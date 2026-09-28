import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, expectTypeOf, it, vi } from "vitest";
import {
  type MultipleSelectProps,
  Select,
  type SelectProps,
  type SelectValue,
} from "../packages/antd-octane/src";

let root: Root | undefined;
let container: HTMLDivElement;
const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana", disabled: true },
  { value: "c", label: "Cherry" },
];
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
async function key(name: string, isComposing = false) {
  await act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", {
        key: name,
        isComposing,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
}
async function choose(label: string) {
  const option = [
    ...document.querySelectorAll<HTMLElement>('[role="option"]'),
  ].find((node) => node.textContent === label);
  if (!option) throw Error(`Missing option ${label}`);
  await act(() => option.click());
}
function labels() {
  return [
    ...container.querySelectorAll(".ant-select-selection-item-content"),
  ].map((node) => node.textContent);
}

it("adds and deselects multiple options without closing the popup", async () => {
  const change = vi.fn();
  const select = vi.fn();
  const deselect = vi.fn();
  await render(
    <Select
      mode="multiple"
      options={options}
      onChange={change}
      onSelect={select}
      onDeselect={deselect}
    />,
  );
  expect(input().readOnly).toBe(false);
  await act(() => input().click());
  expect(
    document
      .querySelector('[role="listbox"]')
      ?.getAttribute("aria-multiselectable"),
  ).toBe("true");
  await choose("Apple");
  await choose("Cherry");
  expect(change).toHaveBeenLastCalledWith(["a", "c"], [options[0], options[2]]);
  expect(select).toHaveBeenLastCalledWith("c", options[2]);
  expect(labels()).toEqual(["Apple", "Cherry"]);
  expect(input().getAttribute("aria-expanded")).toBe("true");
  expect(
    document.querySelector('[role="option"]')?.getAttribute("aria-selected"),
  ).toBe("true");
  await choose("Apple");
  expect(change).toHaveBeenLastCalledWith(["c"], [options[2]]);
  expect(deselect).toHaveBeenCalledWith("a", options[0]);
  expect(labels()).toEqual(["Cherry"]);
});

it("removes selected items, protects disabled options and clears with arrays", async () => {
  const change = vi.fn();
  const deselect = vi.fn();
  const clear = vi.fn();
  await render(
    <Select
      mode="multiple"
      options={options}
      defaultValue={["a", "b"]}
      allowClear
      onChange={change}
      onDeselect={deselect}
      onClear={clear}
    />,
  );
  expect(
    container.querySelector('button[aria-label="移除 Banana"]'),
  ).toBeNull();
  await act(() => input().click());
  await choose("Banana");
  expect(change).not.toHaveBeenCalled();
  await act(() =>
    container
      .querySelector<HTMLButtonElement>('button[aria-label="移除 Apple"]')
      ?.click(),
  );
  expect(labels()).toEqual(["Banana"]);
  expect(document.activeElement).toBe(input());
  expect(deselect).toHaveBeenCalledWith("a", options[0]);
  await act(() =>
    container.querySelector<HTMLButtonElement>(".ant-select-clear")?.click(),
  );
  expect(change).toHaveBeenLastCalledWith([], []);
  expect(clear).toHaveBeenCalledOnce();
  expect(deselect).toHaveBeenCalledTimes(1);
  expect(labels()).toEqual([]);
  expect(input().getAttribute("aria-expanded")).toBe("false");
});

it("respects controlled acceptance and rejection without mutating owner arrays", async () => {
  const initial: SelectValue[] = ["a"];
  const rejected = vi.fn();
  await render(
    <Select
      mode="multiple"
      options={options}
      value={initial}
      onChange={rejected}
    />,
  );
  await act(() => input().click());
  await choose("Cherry");
  expect(rejected).toHaveBeenCalledWith(["a", "c"], [options[0], options[2]]);
  expect(labels()).toEqual(["Apple"]);
  expect(initial).toEqual(["a"]);
  function Accepted() {
    const [value, setValue] = useState<SelectValue[]>(["a"]);
    return (
      <Select
        mode="multiple"
        options={options}
        value={value}
        onChange={setValue}
      />
    );
  }
  await render(<Accepted />);
  await act(() => input().click());
  await choose("Cherry");
  expect(labels()).toEqual(["Apple", "Cherry"]);
});

it("supports keyboard selection, empty-search Backspace and IME guards", async () => {
  await render(
    <Select mode="multiple" options={options} defaultValue={["a", "b"]} />,
  );
  await key("Backspace");
  expect(labels()).toEqual(["Banana"]);
  await key("ArrowDown");
  await key("ArrowDown");
  await key("Enter", true);
  expect(labels()).toEqual(["Banana"]);
  await key("Enter");
  expect(labels()).toEqual(["Banana", "Cherry"]);
  await act(() => {
    input().value = "ap";
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
  await key("Backspace");
  expect(labels()).toEqual(["Banana", "Cherry"]);
  await key("Escape");
  expect(input().getAttribute("aria-expanded")).toBe("false");
});

it("clears uncontrolled search after selection but preserves controlled search", async () => {
  const search = vi.fn();
  await render(<Select mode="multiple" options={options} onSearch={search} />);
  await act(() => {
    input().value = "ap";
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
  await choose("Apple");
  expect(input().value).toBe("");
  expect(search).toHaveBeenCalledWith("ap");
  await render(<Select mode="multiple" options={options} searchValue="ch" />);
  await choose("Cherry");
  expect(input().value).toBe("ch");
});

it("keeps numeric and string values distinct and describes unknown selected values", async () => {
  await render(
    <Select
      mode="multiple"
      options={[
        { value: 0, label: "Zero" },
        { value: "0", label: "String zero" },
      ]}
      defaultValue={[0, "0", "missing"]}
      aria-describedby="help"
    />,
  );
  expect(labels()).toEqual(["Zero", "String zero", "missing"]);
  const summary = container.querySelector('[role="status"]');
  expect(summary?.textContent).toContain("已选择 3 项");
  expect(input().getAttribute("aria-describedby")?.split(" ")).toEqual([
    "help",
    summary?.id,
  ]);
  await key("Backspace");
  expect(labels()).toEqual(["Zero", "String zero"]);
});

it("blocks disabled multi-select and can turn search off", async () => {
  await render(
    <Select
      mode="multiple"
      options={options}
      defaultValue={["a"]}
      disabled
      allowClear
    />,
  );
  expect(input().disabled).toBe(true);
  expect(container.querySelector("button")).toBeNull();
  await key("Backspace");
  expect(labels()).toEqual(["Apple"]);
  await render(<Select mode="multiple" options={options} showSearch={false} />);
  expect(input().readOnly).toBe(true);
});

// This fixture is compiled by the repository type check, including the intentional errors.
interface LegacySelectProps extends SelectProps {
  testId?: string;
}
function typeConsumer() {
  const legacy: LegacySelectProps = {
    options,
    value: "a",
    onChange: (value) =>
      expectTypeOf(value).toEqualTypeOf<SelectValue | undefined>(),
  };
  const multiple: MultipleSelectProps = {
    options,
    mode: "multiple",
    value: ["a"],
    onChange: (values) => expectTypeOf(values).toEqualTypeOf<SelectValue[]>(),
  };
  const invalid: MultipleSelectProps = {
    options,
    mode: "multiple",
    // @ts-expect-error Multiple mode accepts an array, not a scalar.
    value: "a",
  };
  void invalid;
  return (
    <>
      <Select {...legacy} />
      <Select {...multiple} />
      <Select
        mode="multiple"
        options={options}
        onChange={(values) =>
          expectTypeOf(values).toEqualTypeOf<SelectValue[]>()
        }
      />
    </>
  );
}
void typeConsumer;

it("keeps pointer-selected option active and leaves search Home/End to the input", async () => {
  await render(
    <Select mode="multiple" options={options} defaultValue={["a"]} />,
  );
  await act(() => input().click());
  await choose("Cherry");
  const active = input().getAttribute("aria-activedescendant");
  expect(document.getElementById(active ?? "")?.textContent).toBe("Cherry");
  for (const key of ["Home", "End"]) {
    const event = new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true,
    });
    await act(() => input().dispatchEvent(event));
    expect(event.defaultPrevented).toBe(false);
    expect(input().getAttribute("aria-activedescendant")).toBe(active);
  }
  await key("ArrowUp");
  await key("Enter");
  expect(labels()).toEqual(["Cherry"]);
});
