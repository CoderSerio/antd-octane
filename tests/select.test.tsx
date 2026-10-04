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

it.each([
  { provider: false, props: {}, width: "", minWidth: "160px" },
  {
    provider: false,
    props: { popupMatchSelectWidth: true },
    width: "160px",
    minWidth: "",
  },
  {
    provider: true,
    props: { dropdownMatchSelectWidth: false },
    width: "",
    minWidth: "160px",
  },
  {
    provider: false,
    props: { dropdownMatchSelectWidth: false, popupMatchSelectWidth: 280 },
    width: "280px",
    minWidth: "",
  },
])("popup width consumes provider and component precedence: $props", async ({
  provider,
  props,
  width,
  minWidth,
}) => {
  const warning = vi.spyOn(console, "error").mockImplementation(() => {});
  const rect = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockReturnValue(new DOMRect(0, 0, 160, 32));
  try {
    await render(
      <ConfigProvider popupMatchSelectWidth={provider}>
        <Select defaultOpen options={options} {...props} />
      </ConfigProvider>,
    );
    const popup = document.querySelector<HTMLElement>(".ant-select-dropdown");
    expect(popup?.style.width).toBe(width);
    expect(popup?.style.minWidth).toBe(minWidth);
  } finally {
    warning.mockRestore();
    rect.mockRestore();
  }
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

it("popup tokens control disabled colors, option radius and selected styles", async () => {
  await render(
    <ConfigProvider
      theme={{
        components: {
          Select: {
            borderRadiusSM: 7,
            paddingXXS: 6,
            colorTextDisabled: "#123456",
            optionActiveBg: "#654321",
            optionSelectedBg: "#abcdef",
            optionSelectedColor: "#fedcba",
            optionSelectedFontWeight: 500,
          },
        },
      }}
    >
      <Select defaultOpen options={options} />
    </ConfigProvider>,
  );
  const style = document.querySelector<HTMLElement>(
    ".ant-select-dropdown",
  )?.style;
  expect(style?.getPropertyValue("--ao-select-option-radius")).toBe("7px");
  expect(style?.getPropertyValue("--ao-select-popup-padding")).toBe("6px");
  expect(style?.getPropertyValue("--ao-select-disabled")).toBe("#123456");
  expect(style?.getPropertyValue("--ao-select-hover")).toBe("#654321");
  expect(style?.getPropertyValue("--ao-select-selected")).toBe("#abcdef");
  expect(style?.getPropertyValue("--ao-select-selected-color")).toBe("#fedcba");
  expect(style?.getPropertyValue("--ao-select-selected-weight")).toBe("500");
});

it("body popup positioning floors absolute document coordinates", async () => {
  const rect = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockReturnValue(new DOMRect(0, 0, 160, 32));
  const scroll = vi.spyOn(window, "scrollY", "get").mockReturnValue(14.8);
  try {
    await render(<Select defaultOpen options={options} />);
    expect(
      document.querySelector<HTMLElement>(".ant-select-dropdown")?.style.top,
    ).toBe("50px");
  } finally {
    rect.mockRestore();
    scroll.mockRestore();
  }
});
