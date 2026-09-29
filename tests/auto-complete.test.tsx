import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  AutoComplete,
  type AutoCompleteRef,
} from "../packages/antd-octane/src/auto-complete";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";

let root: Root | undefined;
let container: HTMLDivElement;
const options = [
  { value: "apple", label: "Apple suggestion" },
  { value: "banana", label: "Banana suggestion", disabled: true },
  { value: "cherry", label: "Cherry suggestion" },
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
  const element =
    container.querySelector<HTMLInputElement>('[role="combobox"]');
  if (!element) throw Error("Missing AutoComplete input");
  return element;
}
async function type(value: string) {
  await act(() => {
    input().value = value;
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function key(name: string, isComposing = false) {
  const event = new KeyboardEvent("keydown", {
    key: name,
    bubbles: true,
    cancelable: true,
    isComposing,
  });
  await act(() => input().dispatchEvent(event));
  return event;
}
async function choose(label: string) {
  const element = [
    ...document.querySelectorAll<HTMLElement>('[role="option"]'),
  ].find((node) => node.textContent === label);
  if (!element) throw Error(`Missing ${label}`);
  await act(() => element.click());
}

it("accepts arbitrary text and differentiates searching from suggestion selection", async () => {
  const change = vi.fn();
  const search = vi.fn();
  const select = vi.fn();
  await render(
    <AutoComplete
      options={options}
      onChange={change}
      onSearch={search}
      onSelect={select}
    />,
  );
  await type("not an option");
  expect(input().value).toBe("not an option");
  expect(change).toHaveBeenCalledWith("not an option");
  expect(search).toHaveBeenCalledWith("not an option");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(3);
  search.mockClear();
  await choose("Cherry suggestion");
  expect(input().value).toBe("cherry");
  expect(change).toHaveBeenLastCalledWith("cherry");
  expect(select).toHaveBeenCalledWith("cherry", options[2]);
  expect(search).not.toHaveBeenCalled();
  expect(input().getAttribute("aria-expanded")).toBe("false");
});

it("does not activate the first suggestion by default and preserves native Home/End", async () => {
  await render(
    <AutoComplete options={options} defaultValue="free" defaultOpen />,
  );
  expect(input().getAttribute("aria-activedescendant")).toBeNull();
  expect((await key("Enter")).defaultPrevented).toBe(false);
  expect(input().getAttribute("aria-expanded")).toBe("false");
  expect((await key("Home")).defaultPrevented).toBe(false);
  expect((await key("End")).defaultPrevented).toBe(false);
  expect(input().value).toBe("free");
  await key("ArrowDown");
  expect(input().getAttribute("aria-expanded")).toBe("true");
  expect(input().getAttribute("aria-activedescendant")).toBeNull();
  await key("ArrowDown");
  expect(input().getAttribute("aria-activedescendant")).toContain("option-0");
  await key("ArrowDown");
  expect(input().getAttribute("aria-activedescendant")).toContain("option-2");
  await key("Enter");
  expect(input().value).toBe("cherry");
});

it("can explicitly activate the first enabled suggestion", async () => {
  await render(
    <AutoComplete options={options} defaultOpen defaultActiveFirstOption />,
  );
  expect(input().getAttribute("aria-activedescendant")).toContain("option-0");
  expect((await key("Enter")).defaultPrevented).toBe(true);
  expect(input().value).toBe("apple");
});

it("keeps IME change/search events while blocking composition key selection", async () => {
  const change = vi.fn();
  const search = vi.fn();
  const select = vi.fn();
  await render(
    <AutoComplete
      options={options}
      defaultActiveFirstOption
      onChange={change}
      onSearch={search}
      onSelect={select}
    />,
  );
  await act(() =>
    input().dispatchEvent(new Event("compositionstart", { bubbles: true })),
  );
  await type("中");
  expect(change).toHaveBeenCalledWith("中");
  expect(search).toHaveBeenCalledWith("中");
  await key("Enter");
  await key("ArrowDown", true);
  expect(select).not.toHaveBeenCalled();
  await act(() =>
    input().dispatchEvent(new Event("compositionend", { bubbles: true })),
  );
  expect(search).toHaveBeenCalledTimes(1);
  await key("Enter");
  expect(select).toHaveBeenCalledWith("apple", options[0]);
});

it("preserves controlled rejection and supports accepted free text", async () => {
  const change = vi.fn();
  await render(
    <AutoComplete options={options} value="fixed" onChange={change} />,
  );
  await type("attempt");
  expect(input().value).toBe("fixed");
  expect(change).toHaveBeenCalledWith("attempt");
  await choose("Apple suggestion");
  expect(input().value).toBe("fixed");
  expect(change).toHaveBeenLastCalledWith("apple");
  function Accepted() {
    const [text, setText] = useState("");
    return <AutoComplete value={text} onChange={setText} />;
  }
  await render(<Accepted />);
  await type("any text");
  expect(input().value).toBe("any text");
});

it("clears to empty text and searches once without selecting or reopening", async () => {
  const change = vi.fn();
  const search = vi.fn();
  const clear = vi.fn();
  const select = vi.fn();
  await render(
    <AutoComplete
      options={options}
      defaultValue="seed"
      defaultOpen
      allowClear={{ clearIcon: "Clear" }}
      onChange={change}
      onSearch={search}
      onClear={clear}
      onSelect={select}
    />,
  );
  await act(() =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="清除输入"]')
      ?.click(),
  );
  expect(input().value).toBe("");
  expect(change).toHaveBeenCalledOnce();
  expect(change).toHaveBeenCalledWith("");
  expect(search).toHaveBeenCalledWith("");
  expect(clear).toHaveBeenCalledOnce();
  expect(select).not.toHaveBeenCalled();
  expect(input().getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(input());
});

it("never displays an empty menu, including controlled-open and filtered results", async () => {
  await render(<AutoComplete open options={[]} />);
  expect(document.querySelector('[role="listbox"]')).toBeNull();
  expect(input().getAttribute("aria-expanded")).toBe("false");
  await type("arbitrary");
  expect(input().value).toBe("arbitrary");
  await render(
    <AutoComplete open value="missing" options={options} filterOption />,
  );
  expect(document.querySelector('[role="listbox"]')).toBeNull();
  await render(
    <AutoComplete open value="apple" options={options} filterOption />,
  );
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
});

it("supports custom filtering and skips disabled suggestions", async () => {
  const select = vi.fn();
  await render(
    <AutoComplete
      options={options}
      filterOption={(text, option) => String(option.label).includes(text)}
      onSelect={select}
    />,
  );
  await type("Banana");
  await choose("Banana suggestion");
  await key("ArrowDown");
  await key("Enter");
  expect(select).not.toHaveBeenCalled();
  expect(input().value).toBe("Banana");
});

it("honors controlled popup state and closes uncontrolled menus with Escape/Tab/outside pointer", async () => {
  const opened = vi.fn();
  await render(<AutoComplete options={options} open onOpenChange={opened} />);
  await key("Escape");
  expect(opened).toHaveBeenCalledWith(false);
  expect(input().getAttribute("aria-expanded")).toBe("true");
  await render(<AutoComplete options={options} />);
  await act(() => input().click());
  await key("Tab");
  expect(input().getAttribute("aria-expanded")).toBe("false");
  await act(() => input().click());
  await act(() =>
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    ),
  );
  expect(input().getAttribute("aria-expanded")).toBe("false");
});

it("inherits disabled/size and preserves required/name/description semantics", async () => {
  const change = vi.fn();
  await render(
    <ConfigProvider componentDisabled componentSize="large">
      <AutoComplete
        options={options}
        name="city"
        required
        aria-describedby="help"
        onChange={change}
        defaultValue="seed"
        allowClear
      />
    </ConfigProvider>,
  );
  expect(input().disabled).toBe(true);
  expect(input().required).toBe(true);
  expect(input().name).toBe("city");
  expect(input().getAttribute("aria-describedby")).toBe("help");
  expect(container.querySelector(".ant-auto-complete-large")).not.toBeNull();
  expect(container.querySelector("button")).toBeNull();
  await type("attempt");
  await key("ArrowDown");
  expect(change).not.toHaveBeenCalled();
  expect(document.querySelector('[role="listbox"]')).toBeNull();
});

it("exposes native refs, preserves focus and renders in a supplied popup container", async () => {
  const ref = { current: null as AutoCompleteRef | null };
  await render(
    <AutoComplete
      options={options}
      ref={ref}
      getPopupContainer={(trigger) => trigger}
    />,
  );
  ref.current?.focus();
  expect(document.activeElement).toBe(input());
  expect(ref.current?.input).toBe(input());
  await act(() => input().click());
  expect(
    ref.current?.nativeElement?.querySelector('[role="listbox"]'),
  ).not.toBeNull();
  ref.current?.blur();
  await act(() => Promise.resolve());
  expect(input().getAttribute("aria-expanded")).toBe("false");
  await act(() => root?.unmount());
  root = undefined;
  expect(ref.current).toBeNull();
});

it("opens deferred options from defaultOpen and hides them while disabled", async () => {
  await render(<AutoComplete options={[]} defaultOpen defaultValue="free" />);
  expect(document.querySelector('[role="listbox"]')).toBeNull();
  await render(<AutoComplete options={options} defaultOpen />);
  expect(input().value).toBe("free");
  expect(input().getAttribute("aria-expanded")).toBe("true");
  await render(<AutoComplete options={options} defaultOpen disabled />);
  expect(input().disabled).toBe(true);
  expect(document.querySelector('[role="listbox"]')).toBeNull();
  await render(<AutoComplete options={options} defaultOpen />);
  expect(input().getAttribute("aria-expanded")).toBe("true");
});

it("preserves input click handlers and respects cancellation", async () => {
  const click = vi.fn((event: MouseEvent) => event.preventDefault());
  await render(<AutoComplete options={options} onClick={click} />);
  await act(() => input().click());
  expect(click).toHaveBeenCalledOnce();
  expect(document.querySelector('[role="listbox"]')).toBeNull();
  await render(<AutoComplete options={options} onClick={() => {}} />);
  await act(() => input().click());
  expect(input().getAttribute("aria-expanded")).toBe("true");
});
