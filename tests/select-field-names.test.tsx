import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Select } from "../packages/antd-octane/src/select";

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
const ada = { id: 0, name: "Ada", team: "Engineering" };
const bob = { id: 1, name: "Bob", team: "Engineering", disabled: true };
const fields = {
  value: "id",
  label: "name",
  options: "members",
  groupLabel: "heading",
} as const;
const groups = [{ heading: "Engineering", members: [ada, bob] }];
function input() {
  const element = container.querySelector<HTMLInputElement>("[role=combobox]");
  if (!element) throw new Error("Missing combobox");
  return element;
}
async function choose(label: string) {
  const option = [
    ...document.querySelectorAll<HTMLElement>("[role=option]"),
  ].find((element) => element.textContent === label);
  if (!option) throw new Error(`Missing ${label}`);
  await act(() => option.click());
}
async function search(value: string) {
  await act(() => {
    input().value = value;
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
}
it("maps groups and numeric zero while callbacks retain original leaf identity and custom fields", async () => {
  const change = vi.fn(),
    select = vi.fn();
  await render(
    <Select
      fieldNames={fields}
      options={groups}
      showSearch
      onChange={change}
      onSelect={select}
    />,
  );
  await act(() => input().click());
  expect(document.querySelector(".ant-select-item-group")?.textContent).toBe(
    "Engineering",
  );
  await choose("Bob");
  expect(change).not.toHaveBeenCalled();
  await search("Engineering");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(2);
  await choose("Ada");
  expect(change).toHaveBeenCalledWith(0, ada);
  expect(change.mock.calls[0][1]).toBe(ada);
  expect(select.mock.calls[0][1].team).toBe("Engineering");
  expect(input().value).toBe("Ada");
});
it("multiple add/remove and custom predicates receive original mapped leaves", async () => {
  const change = vi.fn(),
    deselect = vi.fn(),
    filter = vi.fn((query: string, option: typeof ada) =>
      option.name.includes(query),
    );
  await render(
    <Select
      mode="multiple"
      fieldNames={fields}
      options={groups}
      onChange={change}
      onDeselect={deselect}
      filterOption={filter}
    />,
  );
  await act(() => input().click());
  await search("Ada");
  expect(
    filter.mock.calls.every(([, option]) => option === ada || option === bob),
  ).toBe(true);
  await choose("Ada");
  expect(change).toHaveBeenLastCalledWith([0], [ada]);
  expect(change.mock.calls[0][1][0]).toBe(ada);
  await choose("Ada");
  expect(change).toHaveBeenLastCalledWith([], []);
  expect(deselect.mock.calls[0][1]).toBe(ada);
});
it("supports custom filter fields, fallback group label mapping and keyboard disabled skipping", async () => {
  const change = vi.fn();
  await render(
    <Select
      fieldNames={{ value: "id", label: "name" }}
      options={[{ name: "People", options: [bob, ada] }]}
      showSearch
      optionFilterProp="team"
      onChange={change}
    />,
  );
  await act(() => input().click());
  await search("Engineering");
  await act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(change).toHaveBeenCalledWith(0, ada);
});

it("explicit filter props read the original key even when label/value are remapped", async () => {
  const raw = { id: 0, name: "Display name", label: "Search label" };
  await render(
    <Select
      fieldNames={{ value: "id", label: "name" }}
      options={[raw]}
      showSearch
      optionFilterProp="label"
    />,
  );
  await act(() => input().click());
  await search("Search label");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
  await search("Display name");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(0);
});
