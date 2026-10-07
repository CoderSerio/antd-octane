import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { List, Typography } from "../packages/antd-octane/src";

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
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
async function button(label: string) {
  const button = container.querySelector<HTMLButtonElement>(
    `button[aria-label="${label}"]`,
  );
  if (!button) throw Error(`Missing ${label}`);
  await act(() => button.click());
  return button;
}
async function input(value: string) {
  const input = container.querySelector("textarea");
  if (!input) throw Error("Missing editor");
  await act(() => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  return input;
}
it("edits, preserves IME Enter, saves once and returns focus", async () => {
  const changed = vi.fn();
  function Example() {
    const [value, setValue] = useState("初始");
    return (
      <Typography.Paragraph
        editable={{
          onChange: (next) => {
            changed(next);
            setValue(next);
          },
        }}
      >
        {value}
      </Typography.Paragraph>
    );
  }
  await render(<Example />);
  await button("编辑");
  const editor = await input("新内容");
  await act(() =>
    editor.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        isComposing: true,
        bubbles: true,
      }),
    ),
  );
  expect(changed).not.toHaveBeenCalled();
  await act(() =>
    editor.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(changed).toHaveBeenCalledExactlyOnceWith("新内容");
  expect(container.textContent).toContain("新内容");
  expect(document.activeElement?.getAttribute("aria-label")).toBe("编辑");
});
it("cancels rich text without committing and starts with visible content", async () => {
  const cancel = vi.fn(),
    change = vi.fn();
  await render(
    <Typography.Text editable={{ onCancel: cancel, onChange: change }}>
      <strong>原文</strong>
    </Typography.Text>,
  );
  await button("编辑");
  expect(container.querySelector("textarea")?.value).toBe("原文");
  const editor = await input("修改");
  await act(() =>
    editor.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  expect(cancel).toHaveBeenCalledOnce();
  expect(change).not.toHaveBeenCalled();
  expect(container.textContent).toContain("原文");
});
it("honors controlled editing and explicit edit text", async () => {
  const change = vi.fn();
  await render(
    <Typography.Paragraph
      editable={{ editing: true, text: "显式文本", onChange: change }}
    >
      展示
    </Typography.Paragraph>,
  );
  expect(container.querySelector("textarea")?.value).toBe("显式文本");
  const editor = await input("保持受控");
  await act(() =>
    editor.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(change).toHaveBeenCalledWith("保持受控");
  expect(container.querySelector("textarea")).not.toBeNull();
});
it("copies rendered text and reports rejection without claiming success", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  const onCopy = vi.fn();
  await render(
    <Typography.Text copyable={{ onCopy }}>
      可以<strong>复制</strong>
    </Typography.Text>,
  );
  await button("复制");
  expect(writeText).toHaveBeenCalledWith("可以复制");
  expect(onCopy).toHaveBeenCalledOnce();
  expect(container.querySelector("[role=status]")?.textContent).toBe("已复制");
  writeText.mockRejectedValueOnce(Error("Denied"));
  await button("已复制");
  expect(container.querySelector("[role=status]")?.textContent).toContain(
    "复制失败",
  );
  expect(onCopy).toHaveBeenCalledOnce();
});
it("preserves controlled expansion while emitting requested state", async () => {
  const onExpand = vi.fn();
  await render(
    <Typography.Paragraph
      ellipsis={{ expanded: false, expandable: "collapsible", onExpand }}
    >
      内容
    </Typography.Paragraph>,
  );
  const toggle = container.querySelector<HTMLButtonElement>("button");
  await act(() => toggle?.click());
  expect(onExpand).toHaveBeenCalledWith(expect.anything(), { expanded: true });
  expect(toggle?.getAttribute("aria-expanded")).toBe("false");
});
it("keeps keyed list item input state when data reorders", async () => {
  function Example() {
    const [items, setItems] = useState([{ id: "a" }, { id: "b" }]);
    return (
      <>
        <button type="button" onClick={() => setItems([...items].reverse())}>
          反转
        </button>
        <List
          rowKey="id"
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <input defaultValue={item.id} />
            </List.Item>
          )}
        />
      </>
    );
  }
  await render(<Example />);
  const first = container.querySelector("input");
  if (!first) throw Error("No input");
  first.value = "保留";
  await act(() => container.querySelector("button")?.click());
  expect(
    [...container.querySelectorAll("input")].map((node) => node.value),
  ).toEqual(["b", "保留"]);
  expect(container.querySelectorAll(".ant-list-items > li")).toHaveLength(2);
});
it("shows custom empty content, suppresses it while loading, keeps header and footer", async () => {
  vi.useFakeTimers();
  await render(
    <List
      dataSource={[]}
      header="头部"
      footer="尾部"
      locale={{ emptyText: "没有记录" }}
    />,
  );
  expect(container.textContent).toContain("没有记录");
  await act(() =>
    root?.render(<List dataSource={[]} loading header="头部" footer="尾部" />),
  );
  await act(() => vi.advanceTimersByTime(0));
  expect(container.querySelector(".ant-spin")?.getAttribute("aria-busy")).toBe(
    "true",
  );
  expect(container.textContent).not.toContain("暂无数据");
  expect(container.querySelector(".ant-list")?.getAttribute("aria-busy")).toBe(
    "true",
  );
  expect(container.textContent).toContain("尾部");
});
