/** @jsxImportSource octane */
import { act, createRoot, type ElementDescriptor, type Root } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Cascader } from "../packages/antd-octane/src/cascader";
import { TreeSelect } from "../packages/antd-octane/src/tree-select";

let root: Root | undefined;
let host: HTMLDivElement;
async function render(node: ElementDescriptor) {
  if (!root) {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  }
  await act(() => root?.render(node));
}
async function click(element: Element | null) {
  if (!element) throw Error("Missing click target");
  await act(() => (element as HTMLElement).click());
}
async function key(element: Element, key: string) {
  await act(() =>
    element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })),
  );
}
async function search(value: string) {
  const input = host.querySelector("input")!;
  await act(() => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
const button = (label: string) =>
  [...document.querySelectorAll("button")].find(
    (node) => node.textContent === label,
  ) ?? null;
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  host?.remove();
});
const tree = [
  {
    value: "p",
    title: "Parent",
    children: [
      { value: "a", title: "Apple" },
      { value: "b", title: "Blocked", disabled: true },
    ],
  },
];
const options = [
  {
    value: "p",
    label: "Parent",
    children: [
      { value: "a", label: "Apple" },
      { value: "b", label: "Blocked", disabled: true },
    ],
  },
];
it("TreeSelect maps fields, filters ancestors, selects and clears a value", async () => {
  const change = vi.fn();
  await render(
    <TreeSelect
      aria-label="Tree"
      treeData={[{ id: 1, name: "Root", nodes: [{ id: 2, name: "Needle" }] }]}
      fieldNames={{ value: "id", label: "name", children: "nodes" }}
      showSearch
      allowClear
      onChange={change}
    />,
  );
  await click(host.querySelector("input"));
  await search("needle");
  expect(document.querySelectorAll('[role="treeitem"]').length).toBe(2);
  await click(
    [...document.querySelectorAll(".ant-tree-node-content-wrapper")].find(
      (node) => node.textContent?.includes("Needle"),
    ) ?? null,
  );
  expect(change).toHaveBeenLastCalledWith(2);
  expect(host.querySelector("input")?.value).toBe("Needle");
  await click(host.querySelector('button[aria-label="Clear selection"]'));
  expect(change).toHaveBeenLastCalledWith(undefined);
  expect(document.querySelector('[role="dialog"]')).toBeNull();
});
it("TreeSelect controlled multiple keeps the supplied value and blocks disabled nodes", async () => {
  const change = vi.fn();
  await render(
    <TreeSelect
      treeData={tree}
      multiple
      value={[]}
      defaultOpen
      treeDefaultExpandAll
      onChange={change}
    />,
  );
  const titles = () => [
    ...document.querySelectorAll(".ant-tree-node-content-wrapper"),
  ];
  await click(titles().find((node) => node.textContent === "Apple") ?? null);
  expect(change).toHaveBeenLastCalledWith(["a"]);
  expect(host.querySelector("input")?.value).toBe("");
  change.mockClear();
  await click(titles().find((node) => node.textContent === "Blocked") ?? null);
  expect(change).not.toHaveBeenCalled();
});
it("TreeSelect closes on Escape and cleans up a custom portal on unmount", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  try {
    await render(
      <TreeSelect treeData={tree} getPopupContainer={() => target} />,
    );
    const input = host.querySelector("input")!;
    await key(input, "ArrowDown");
    expect(target.querySelector('[role="dialog"]')).not.toBeNull();
    await key(input, "ArrowDown");
    expect(document.activeElement?.getAttribute("role")).toBe("tree");
    await key(document.activeElement!, "Escape");
    expect(target.childElementCount).toBe(0);
    expect(document.activeElement).toBe(input);
    await click(input);
    await act(() => root?.unmount());
    root = undefined;
    expect(target.childElementCount).toBe(0);
  } finally {
    target.remove();
  }
});
it("Cascader emits full paths and only commits leaves by default", async () => {
  const change = vi.fn();
  await render(
    <Cascader options={options} onChange={change} allowClear defaultOpen />,
  );
  await click(button("Parent ›"));
  expect(change).not.toHaveBeenCalled();
  await click(button("Blocked"));
  expect(change).not.toHaveBeenCalled();
  await click(button("Apple"));
  expect(change).toHaveBeenLastCalledWith(
    ["p", "a"],
    [options[0], options[0].children[0]],
  );
  expect(host.querySelector("input")?.value).toBe("Parent / Apple");
  await click(host.querySelector('button[aria-label="Clear selection"]'));
  expect(change).toHaveBeenLastCalledWith([], []);
});
it("Cascader changeOnSelect and controlled values preserve parent state", async () => {
  const change = vi.fn();
  await render(
    <Cascader
      options={options}
      value={[]}
      changeOnSelect
      onChange={change}
      defaultOpen
    />,
  );
  await click(button("Parent ›"));
  expect(change).toHaveBeenLastCalledWith(["p"], [options[0]]);
  expect(host.querySelector("input")?.value).toBe("");
  expect(button("Apple")).not.toBeNull();
});
it("Cascader search matches full paths and maps custom fields", async () => {
  const change = vi.fn();
  await render(
    <Cascader
      options={[{ id: 1, name: "North", nodes: [{ id: 2, name: "City" }] }]}
      fieldNames={{ value: "id", label: "name", children: "nodes" }}
      showSearch
      onChange={change}
    />,
  );
  await click(host.querySelector("input"));
  await search("north / city");
  await click(button("North / City"));
  expect(change.mock.calls[0][0]).toEqual([1, 2]);
});
it("Cascader keyboard opens columns and Escape returns focus", async () => {
  await render(<Cascader options={options} />);
  const input = host.querySelector("input")!;
  await key(input, "ArrowDown");
  await key(input, "ArrowDown");
  await key(document.activeElement!, "ArrowRight");
  expect(document.activeElement?.textContent).toBe("Apple");
  await key(document.activeElement!, "Escape");
  expect(document.activeElement).toBe(input);
  expect(document.querySelector('[role="dialog"]')).toBeNull();
});
it("disabled controls do not open and open state may be controlled", async () => {
  await render(<Cascader options={options} disabled defaultOpen />);
  expect(document.querySelector('[role="dialog"]')).toBeNull();
  const open = vi.fn();
  await render(<Cascader options={options} open={false} onOpenChange={open} />);
  await click(host.querySelector("input"));
  expect(open).toHaveBeenCalledWith(true);
  expect(document.querySelector('[role="dialog"]')).toBeNull();
});

it("Form binds both value shapes and reset restores initial selections", async () => {
  let form: import("../packages/antd-octane/src/form").FormInstance | undefined;
  const { Form } = await import("../packages/antd-octane/src/form");
  function Scene() {
    const [instance] = Form.useForm();
    form = instance;
    return (
      <Form form={instance} initialValues={{ tree: "a", path: ["p", "a"] }}>
        <Form.Item name="tree">
          <TreeSelect treeData={tree} allowClear />
        </Form.Item>
        <Form.Item name="path">
          <Cascader options={options} allowClear />
        </Form.Item>
      </Form>
    );
  }
  await render(<Scene />);
  expect(
    [...host.querySelectorAll("input")].map((input) => input.value),
  ).toEqual(["Apple", "Parent / Apple"]);
  await click(host.querySelector('button[aria-label="Clear selection"]'));
  expect(form?.getFieldValue("tree")).toBeUndefined();
  await act(() => form?.resetFields());
  expect(
    [...host.querySelectorAll("input")].map((input) => input.value),
  ).toEqual(["Apple", "Parent / Apple"]);
});

it("nested picker portal stays inside its Popover owner", async () => {
  const { Popover } = await import("../packages/antd-octane/src/popover");
  const visible = vi.fn();
  await render(
    <Popover
      defaultOpen
      trigger="click"
      onOpenChange={visible}
      content={<TreeSelect treeData={tree} defaultOpen treeDefaultExpandAll />}
    >
      <button type="button">Outer</button>
    </Popover>,
  );
  const row = [
    ...document.querySelectorAll(".ant-tree-node-content-wrapper"),
  ].find((node) => node.textContent === "Apple");
  if (!row) throw Error("Missing nested tree row");
  await act(() =>
    row.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })),
  );
  expect(visible).not.toHaveBeenCalledWith(false);
  await click(row);
  expect(visible).not.toHaveBeenCalledWith(false);
});
it("multiple search preserves selections hidden by the filter", async () => {
  const change = vi.fn();
  await render(
    <TreeSelect
      multiple
      defaultValue={["p"]}
      treeData={tree}
      showSearch
      onChange={change}
    />,
  );
  await click(host.querySelector("input"));
  await search("apple");
  await click(
    [...document.querySelectorAll(".ant-tree-node-content-wrapper")].find(
      (node) => node.textContent === "Apple",
    ) ?? null,
  );
  expect(change).toHaveBeenLastCalledWith(["p", "a"]);
  await search("parent");
  await click(
    [...document.querySelectorAll(".ant-tree-node-content-wrapper")].find(
      (node) => node.textContent === "Parent",
    ) ?? null,
  );
  expect(change).toHaveBeenLastCalledWith(["a"]);
});

it("explicit undefined controls TreeSelect even when a default or old inner value exists", async () => {
  const change = vi.fn();
  await render(
    <TreeSelect
      treeData={tree}
      defaultValue="p"
      value={undefined}
      onChange={change}
    />,
  );
  expect(host.querySelector("input")?.value).toBe("");
  await render(<TreeSelect treeData={tree} defaultValue="p" />);
  expect(host.querySelector("input")?.value).toBe("Parent");
  await render(<TreeSelect treeData={tree} defaultValue="p" value="a" />);
  expect(host.querySelector("input")?.value).toBe("Apple");
  await render(
    <TreeSelect treeData={tree} defaultValue="p" value={undefined} />,
  );
  expect(host.querySelector("input")?.value).toBe("");
});
it("TreeSelect controlled clear stays empty instead of restoring its default", async () => {
  const { useState } = await import("octane");
  function Scene() {
    const [value, setValue] = useState<string | number | undefined>("a");
    return (
      <TreeSelect
        treeData={tree}
        defaultValue="p"
        value={value}
        onChange={setValue}
        allowClear
      />
    );
  }
  await render(<Scene />);
  await click(host.querySelector('button[aria-label="Clear selection"]'));
  expect(host.querySelector("input")?.value).toBe("");
});
it("Cascader explicit undefined resets a prior uncontrolled path and stays controlled", async () => {
  const change = vi.fn();
  await render(<Cascader options={options} defaultValue={["p", "a"]} />);
  expect(host.querySelector("input")?.value).toBe("Parent / Apple");
  await render(
    <Cascader
      options={options}
      defaultValue={["p", "a"]}
      value={undefined}
      onChange={change}
    />,
  );
  expect(host.querySelector("input")?.value).toBe("");
  await click(host.querySelector("input"));
  await click(button("Parent ›"));
  await click(button("Apple"));
  expect(change).toHaveBeenLastCalledWith(
    ["p", "a"],
    [options[0], options[0].children[0]],
  );
  expect(host.querySelector("input")?.value).toBe("");
});
it("an unset Form Cascader field renders empty and accepts a first selection", async () => {
  const { Form } = await import("../packages/antd-octane/src/form");
  let form: import("../packages/antd-octane/src/form").FormInstance | undefined;
  function Scene() {
    const [instance] = Form.useForm();
    form = instance;
    return (
      <Form form={instance}>
        <Form.Item name="path">
          <Cascader options={options} />
        </Form.Item>
      </Form>
    );
  }
  await render(<Scene />);
  expect(host.querySelector("input")?.value).toBe("");
  await click(host.querySelector("input"));
  await click(button("Parent ›"));
  await click(button("Apple"));
  expect(form?.getFieldValue("path")).toEqual(["p", "a"]);
});
