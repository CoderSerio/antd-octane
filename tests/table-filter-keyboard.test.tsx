import { act, createRoot, type Root, useState } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FilterDropdownView } from "../packages/antd-octane/src/table/FilterDropdown";
import { FilterMenu } from "../packages/antd-octane/src/table/FilterMenu";

let root: Root;
let container: HTMLDivElement;
const changed = vi.fn();
const visible = vi.fn();
const filters = [
  { text: "Beijing", value: "beijing" },
  { text: "Harbin", value: "harbin" },
  { text: "Shanghai", value: "shanghai" },
];
function Fixture({ multiple = true }: { multiple?: boolean }) {
  const [keys, setKeys] = useState<string[]>([]);
  return (
    <FilterMenu
      filters={filters}
      selectedKeys={keys}
      filterMultiple={multiple}
      search=""
      onChange={(next) => {
        changed(next);
        setKeys(next);
      }}
    />
  );
}
beforeEach(() => {
  changed.mockClear();
  visible.mockClear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

function DropdownFixture({ autoFocus = false }: { autoFocus?: boolean }) {
  const [open, setOpen] = useState(true);
  return (
    <FilterDropdownView
      columnKey="city"
      filters={filters}
      draftKeys={[]}
      filtered={false}
      resetDisabled
      locale={{ filterTitle: "City filter" }}
      popupProps={{ open, autoFocus }}
      onDraftChange={changed}
      onConfirm={() => {}}
      onReset={() => {}}
      onVisibleChange={(next) => {
        visible(next);
        setOpen(next);
      }}
    />
  );
}

it("Dropdown handles the first Tab and closes on the next Tab with trigger focus", async () => {
  await act(() => root.render(<DropdownFixture />));
  const first = new KeyboardEvent("keydown", {
    key: "Tab",
    bubbles: true,
    cancelable: true,
  });
  await act(() => window.dispatchEvent(first));
  expect(first.defaultPrevented).toBe(true);
  expect(visible).not.toHaveBeenCalled();
  await act(() =>
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" })),
  );
  expect(visible.mock.calls).toEqual([[false]]);
  expect(document.activeElement).toBe(container.querySelector("button"));
});

it("autoFocus marks the overlay focus attempt, and Escape closes only once", async () => {
  await act(() => root.render(<DropdownFixture autoFocus />));
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
    ),
  );
  const event = new KeyboardEvent("keydown", { key: "Tab", cancelable: true });
  await act(() => window.dispatchEvent(event));
  expect(event.defaultPrevented).toBe(false);
  expect(visible.mock.calls).toEqual([[false]]);

  await act(() => root.render(<DropdownFixture key="escape" />));
  visible.mockClear();
  const item = document.querySelector<HTMLElement>('[role="menuitem"]');
  if (!item) throw Error("Missing menuitem");
  await key(item, "Escape");
  expect(visible.mock.calls).toEqual([[false]]);
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
});
function menu() {
  const node = container.querySelector<HTMLElement>('[role="menu"]');
  if (!node) throw Error("Missing menu");
  return node;
}
function items() {
  return [...container.querySelectorAll<HTMLElement>('[role="menuitem"]')];
}
async function key(node: HTMLElement, value: string) {
  await act(() =>
    node.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: value,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
}

it("the menu is the Tab entry; items are menuitems and nested inputs retain native tab stops", async () => {
  await act(() => root.render(<Fixture />));
  expect(menu().tagName).toBe("UL");
  expect(menu().tabIndex).toBe(0);
  expect(items().map((item) => [item.tagName, item.tabIndex])).toEqual([
    ["LI", -1],
    ["LI", -1],
    ["LI", -1],
  ]);
  expect(
    items().every(
      (item) =>
        !item.hasAttribute("aria-checked") &&
        !item.hasAttribute("aria-current"),
    ),
  ).toBe(true);
  expect(
    [...container.querySelectorAll<HTMLInputElement>("input")].map(
      (input) => input.tabIndex,
    ),
  ).toEqual([0, 0, 0]);
  expect(
    container
      .querySelector(".ant-table-filter-menu-indicator")
      ?.hasAttribute("aria-hidden"),
  ).toBe(false);
});

it("arrows wrap, Home/End stay within the level and letter keys do not add typeahead", async () => {
  await act(() => root.render(<Fixture />));
  await key(menu(), "ArrowDown");
  await vi.waitFor(() => expect(document.activeElement).toBe(items()[0]));
  await key(items()[0], "ArrowUp");
  await vi.waitFor(() => expect(document.activeElement).toBe(items()[2]));
  await key(items()[2], "Home");
  await vi.waitFor(() => expect(document.activeElement).toBe(items()[0]));
  await key(items()[0], "h");
  expect(document.activeElement).toBe(items()[0]);
  await key(items()[0], "End");
  await vi.waitFor(() => expect(document.activeElement).toBe(items()[2]));
  expect(changed).not.toHaveBeenCalled();
});

it("Enter selects a menuitem; Space on the item does not synthesize a button click", async () => {
  await act(() => root.render(<Fixture />));
  await act(() => items()[0].focus());
  await key(items()[0], " ");
  expect(changed).not.toHaveBeenCalled();
  await key(items()[0], "Enter");
  expect(changed).toHaveBeenLastCalledWith(["beijing"]);
  expect(items()[0].querySelector<HTMLInputElement>("input")?.checked).toBe(
    true,
  );
  await key(items()[0], "Enter");
  expect(changed).toHaveBeenLastCalledWith([]);
});

it("label forwarding bubbles one selection, while an input click still selects", async () => {
  await act(() => root.render(<Fixture />));
  const label = items()[0].querySelector<HTMLLabelElement>("label");
  const input = label?.querySelector<HTMLInputElement>("input");
  if (!label || !input) throw Error("Missing label/input");
  // Happy DOM forwards a label click before delegated document listeners run.
  // Complete bubbling first, then forward to the input as browsers do.
  label.addEventListener("click", (event) => {
    if (event.target === label) event.preventDefault();
  });
  await act(() => {
    label.click();
    input.click();
  });
  expect(changed.mock.calls).toEqual([[["beijing"]]]);
  await act(() => items()[1].querySelector<HTMLInputElement>("input")?.click());
  expect(changed).toHaveBeenLastCalledWith(["beijing", "harbin"]);
});

it("single mode retains the selected key on repeated Enter", async () => {
  await act(() => root.render(<Fixture multiple={false} />));
  expect(items()[0].querySelector("input")?.type).toBe("radio");
  await key(items()[0], "Enter");
  await key(items()[0], "Enter");
  expect(changed.mock.calls).toEqual([[["beijing"]], [["beijing"]]]);
  expect(items()[0].classList.contains("ant-menu-item-selected")).toBe(true);
});

it("arrow navigation follows the active hover item like rc-menu", async () => {
  await act(() => root.render(<Fixture />));
  await act(() => {
    items()[0].focus();
    items()[1].dispatchEvent(new MouseEvent("mouseenter"));
  });
  await key(items()[0], "ArrowDown");
  await vi.waitFor(() => expect(document.activeElement).toBe(items()[2]));
});

it("a reopened submenu waits for alignment and focuses its first item again", async () => {
  await act(() =>
    root.render(
      <FilterMenu
        filters={[{ text: "North", value: "north", children: filters }]}
        selectedKeys={[]}
        filterMultiple
        search=""
        onChange={changed}
      />,
    ),
  );
  const parent = items()[0];
  await key(parent, "ArrowRight");
  await vi.waitFor(() =>
    expect(document.activeElement?.textContent).toBe("Beijing"),
  );
  await key(document.activeElement as HTMLElement, "Escape");
  expect(document.activeElement).toBe(parent);
  await key(parent, "ArrowRight");
  await vi.waitFor(() =>
    expect(document.activeElement?.textContent).toBe("Beijing"),
  );
});

it("single submenu selection retains the parent on Enter but closes it on click", async () => {
  await act(() =>
    root.render(
      <FilterMenu
        filters={[{ text: "North", value: "north", children: filters }]}
        selectedKeys={[]}
        filterMultiple={false}
        search=""
        onChange={changed}
      />,
    ),
  );
  const parent = items()[0];
  await key(parent, "ArrowRight");
  await vi.waitFor(() =>
    expect(document.activeElement?.textContent).toBe("Beijing"),
  );
  const leaf = document.activeElement as HTMLElement;
  await key(leaf, "Enter");
  expect(changed).toHaveBeenLastCalledWith(["beijing"]);
  expect(parent.getAttribute("aria-expanded")).toBe("true");
  await act(() => leaf.click());
  expect(parent.getAttribute("aria-expanded")).toBe("false");
});
