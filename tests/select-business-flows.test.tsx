import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { Form } from "../packages/antd-octane/src/form";
import {
  Select,
  type SelectOptionItem,
} from "../packages/antd-octane/src/select";

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
  const element = container.querySelector("input");
  if (!element) throw Error("Missing input");
  return element;
}
async function key(key: string) {
  await act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
    ),
  );
}
async function search(value: string) {
  await act(() => {
    input().value = value;
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
}
const grouped: SelectOptionItem[] = [
  {
    label: "Engineering",
    key: "eng",
    options: [
      { value: "alice", label: "Alice", title: "Frontend" },
      { value: "disabled", label: "Disabled", disabled: true },
    ],
  },
  {
    label: "Design",
    options: [{ value: "bob", label: "Bob", title: "Research" }],
  },
  { value: 0, label: "Unassigned" },
];
it("renders accessible groups and navigates only enabled leaf options", async () => {
  const change = vi.fn();
  await render(<Select options={grouped} defaultOpen onChange={change} />);
  expect(document.querySelectorAll('[role="group"]')).toHaveLength(2);
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(4);
  await key("ArrowDown");
  await key("Enter");
  expect(change.mock.lastCall?.[0]).toBe("bob");
});
it("matches group labels or individual leaves without orphan headings", async () => {
  await render(<Select options={grouped} showSearch defaultOpen />);
  await search("Engineering");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(2);
  await search("Bob");
  expect(document.querySelectorAll('[role="group"]')).toHaveLength(1);
  expect(document.querySelector('[role="group"]')?.textContent).toBe(
    "DesignBob",
  );
  await search("missing");
  expect(document.querySelectorAll('[role="group"]')).toHaveLength(0);
});
it("supports explicit filter fields and custom predicates on original leaf options", async () => {
  await render(
    <Select
      options={grouped}
      showSearch
      defaultOpen
      optionFilterProp="title"
    />,
  );
  await search("research");
  expect(document.querySelector('[role="option"]')?.textContent).toBe("Bob");
  const filter = vi.fn(
    (query: string, option: { value: string | number }) =>
      option.value === 0 && query === "zero",
  );
  await render(
    <Select options={grouped} showSearch defaultOpen filterOption={filter} />,
  );
  await search("zero");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
  expect(document.querySelector('[role="option"]')?.textContent).toBe(
    "Unassigned",
  );
  expect(filter.mock.calls.every(([, option]) => "value" in option)).toBe(true);
});
it("keeps controlled remote search and loading separate from selection", async () => {
  const change = vi.fn(),
    onSearch = vi.fn();
  await render(
    <Select
      options={grouped}
      loading
      showSearch
      searchValue="server query"
      filterOption={false}
      defaultOpen
      onSearch={onSearch}
      onChange={change}
    />,
  );
  expect(input().getAttribute("aria-busy")).toBe("true");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(4);
  await search("next query");
  expect(onSearch).toHaveBeenCalledWith("next query");
  expect(input().value).toBe("server query");
  expect(change).not.toHaveBeenCalled();
  await key("Enter");
  expect(change.mock.lastCall?.[0]).toBe("alice");
});
it("preserves explicit empty content and provider suppression", async () => {
  await render(
    <Select
      defaultOpen
      options={[]}
      loading
      notFoundContent={<span>Fetching people</span>}
    />,
  );
  expect(document.querySelector('[role="listbox"]')?.textContent).toBe(
    "Fetching people",
  );
  await render(<Select defaultOpen options={[]} notFoundContent={null} />);
  expect(document.querySelector('[role="listbox"]')?.textContent).toBe("");
  await render(
    <ConfigProvider renderEmpty={() => null}>
      <Select defaultOpen options={[]} />
    </ConfigProvider>,
  );
  expect(document.querySelector('[role="listbox"]')?.textContent).toBe("");
});
it("keeps grouped multiple values controlled and respects disabled selections", async () => {
  const change = vi.fn();
  await render(
    <Select
      mode="multiple"
      value={["disabled"]}
      options={grouped}
      defaultOpen
      onChange={change}
    />,
  );
  await key("Backspace");
  expect(change).not.toHaveBeenCalled();
  await key("Enter");
  expect(change.mock.lastCall?.[0]).toEqual(["disabled", "alice"]);
  expect(container.querySelectorAll(".ant-select-selection-item")).toHaveLength(
    1,
  );
});
it("does not select during composition and uses Form's primitive value contract", async () => {
  const change = vi.fn();
  function Fixture() {
    const [query, setQuery] = useState("");
    return (
      <Form onValuesChange={change}>
        <Form.Item name="owner" label="Owner">
          <Select
            showSearch
            options={grouped}
            searchValue={query}
            onSearch={setQuery}
          />
        </Form.Item>
      </Form>
    );
  }
  await render(<Fixture />);
  await search("Bob");
  await act(() =>
    input().dispatchEvent(
      new CompositionEvent("compositionstart", { bubbles: true }),
    ),
  );
  await key("Enter");
  expect(change).not.toHaveBeenCalled();
  await act(() =>
    input().dispatchEvent(
      new CompositionEvent("compositionend", { bubbles: true }),
    ),
  );
  await key("Enter");
  expect(change.mock.lastCall?.[0]).toEqual({ owner: "bob" });
});
it("inherits portal container and theme while keeping disabled loading noninteractive", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  try {
    await render(
      <ConfigProvider
        getPopupContainer={() => target}
        theme={{ components: { Select: { optionSelectedBg: "rgb(1, 2, 3)" } } }}
      >
        <Select options={grouped} defaultOpen loading />
      </ConfigProvider>,
    );
    expect(target.querySelector('[role="listbox"]')).not.toBeNull();
    expect(
      target
        .querySelector<HTMLElement>('[role="listbox"]')
        ?.style.getPropertyValue("--ao-select-selected"),
    ).toBe("rgb(1, 2, 3)");
    await render(<Select disabled loading defaultOpen options={grouped} />);
    expect(input().disabled).toBe(true);
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  } finally {
    target.remove();
  }
});

it("scrolls the active leaf rather than its group wrapper", async () => {
  await render(<Select defaultOpen options={grouped} />);
  const bob = [
    ...document.querySelectorAll<HTMLElement>('[role="option"]'),
  ].find((option) => option.textContent === "Bob");
  if (!bob) throw Error("Missing Bob option");
  const scroll = vi.spyOn(bob, "scrollIntoView");
  try {
    await key("ArrowDown");
    expect(scroll).toHaveBeenCalledWith({ block: "nearest" });
  } finally {
    scroll.mockRestore();
  }
});
