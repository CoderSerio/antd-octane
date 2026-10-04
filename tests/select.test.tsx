import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { Select } from "../packages/antd-octane/src/select";

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
  const element = container.querySelector<HTMLInputElement>(
    'input[role="combobox"]',
  );
  if (!element) throw Error("Missing Select input");
  return element;
}

async function key(name: string) {
  await act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", {
        key: name,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
}

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana", disabled: true },
  { value: "c", label: "Cherry" },
];

it("selects enabled options by keyboard and reports value plus option", async () => {
  const change = vi.fn();
  await render(
    <Select options={options} placeholder="Fruit" onChange={change} />,
  );
  expect(input().placeholder).toBe("Fruit");
  await key("ArrowDown");
  expect(input().getAttribute("aria-expanded")).toBe("true");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(3);
  expect(input().getAttribute("aria-activedescendant")).toContain("option-0");
  await key("ArrowDown");
  expect(input().getAttribute("aria-activedescendant")).toContain("option-2");
  await key("Enter");
  expect(change).toHaveBeenCalledWith("c", options[2]);
  expect(input().value).toBe("Cherry");
  expect(input().getAttribute("aria-expanded")).toBe("false");
});

it("filters by label, skips disabled options and handles empty results", async () => {
  const change = vi.fn();
  const search = vi.fn();
  await render(
    <Select options={options} showSearch onChange={change} onSearch={search} />,
  );
  await act(() => input().click());
  await act(() => {
    input().value = "ban";
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(search).toHaveBeenCalledWith("ban");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
  await key("Enter");
  expect(change).not.toHaveBeenCalled();
  await act(() => {
    input().value = "none";
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(
    document.querySelector(".ant-select-item-empty .ant-empty-description")
      ?.textContent,
  ).toBe("No data");
  expect(
    document.querySelector(".ant-select-item-empty .ant-empty-image"),
  ).not.toBeNull();
  await key("Escape");
  expect(input().getAttribute("aria-expanded")).toBe("false");
});

it("preserves controlled values and reports clear without reopening", async () => {
  const change = vi.fn();
  await render(
    <Select options={options} value="a" allowClear onChange={change} />,
  );
  await act(() => input().click());
  await act(() =>
    document.querySelector<HTMLElement>('[role="option"]:last-child')?.click(),
  );
  expect(change).toHaveBeenCalledWith("c", options[2]);
  expect(input().value).toBe("Apple");
  await act(() =>
    container.querySelector<HTMLButtonElement>(".ant-select-clear")?.click(),
  );
  expect(change).toHaveBeenLastCalledWith(undefined);
  expect(input().value).toBe("Apple");
  expect(input().getAttribute("aria-expanded")).toBe("false");
});

it("clears an uncontrolled default and closes on outside pointer", async () => {
  await render(<Select options={options} defaultValue="a" allowClear />);
  expect(input().value).toBe("Apple");
  expect(container.querySelector(".ant-select-clear")).not.toBeNull();
  await act(() =>
    container.querySelector<HTMLButtonElement>(".ant-select-clear")?.click(),
  );
  expect(input().value).toBe("");
  await act(() => input().click());
  await act(() =>
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    ),
  );
  expect(input().getAttribute("aria-expanded")).toBe("false");
});

it("inherits disabled configuration and does not open", async () => {
  await render(
    <ConfigProvider componentDisabled>
      <Select options={options} />
    </ConfigProvider>,
  );
  expect(input().disabled).toBe(true);
  await key("ArrowDown");
  expect(document.querySelector('[role="listbox"]')).toBeNull();
});

it("opens from host padding and keeps the active option visible", async () => {
  const scroll = vi.spyOn(HTMLElement.prototype, "scrollIntoView");
  try {
    await render(
      <Select
        options={Array.from({ length: 20 }, (_, index) => ({
          value: index,
          label: `Option ${index}`,
        }))}
      />,
    );
    await act(() =>
      container.querySelector<HTMLElement>(".ant-select")?.click(),
    );
    expect(input().getAttribute("aria-expanded")).toBe("true");
    await key("End");
    expect(input().getAttribute("aria-activedescendant")).toContain(
      "option-19",
    );
    expect(scroll).toHaveBeenCalledWith({ block: "nearest" });
  } finally {
    scroll.mockRestore();
  }
});
