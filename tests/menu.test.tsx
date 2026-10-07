import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Dropdown } from "../packages/antd-octane/src/dropdown";
import { Menu } from "../packages/antd-octane/src/menu";

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
  vi.useRealTimers();
});
function button(text: string) {
  const node = [...document.querySelectorAll<HTMLButtonElement>("button")].find(
    (n) => n.textContent?.includes(text),
  );
  if (!node) throw Error(`Missing ${text}`);
  return node;
}
async function key(node: HTMLElement, key: string) {
  await act(() =>
    node.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true })),
  );
}
const items = [
  { key: "a", label: "Alpha" },
  { key: "disabled", label: "Disabled", disabled: true },
  { key: "sub", label: "Folder", children: [{ key: "child", label: "Child" }] },
  { key: "b", label: "Beta" },
];
it("places submenu popups in the Menu getPopupContainer target", async () => {
  const getPopupContainer = vi.fn((node: HTMLElement) => {
    const target = node.closest<HTMLElement>("[data-popup-host]");
    if (!target) throw new Error("Missing popup host");
    return target;
  });
  await render(
    <div data-popup-host>
      <Menu
        mode="vertical"
        items={items}
        defaultOpenKeys={["sub"]}
        getPopupContainer={getPopupContainer}
      />
    </div>,
  );
  expect(getPopupContainer).toHaveBeenCalled();
  const host = container.querySelector("[data-popup-host]");
  const popup = document.querySelector(".ant-menu-submenu-popup");
  expect(popup).not.toBeNull();
  expect(host?.contains(popup)).toBe(true);
});
it("selects leaves, ignores disabled and preserves controlled selection", async () => {
  const click = vi.fn();
  await render(<Menu items={items} onClick={click} />);
  await act(() => button("Alpha").click());
  expect(button("Alpha").getAttribute("aria-current")).toBe("page");
  await act(() => button("Disabled").click());
  expect(click).toHaveBeenCalledTimes(1);
  await act(() =>
    root?.render(<Menu items={items} selectedKeys={["b"]} onClick={click} />),
  );
  await act(() => button("Alpha").click());
  expect(button("Beta").getAttribute("aria-current")).toBe("page");
});
it("roving focus skips disabled and enters and exits submenu by keyboard", async () => {
  await render(<Menu items={items} mode="inline" />);
  await act(() => button("Alpha").focus());
  await key(button("Alpha"), "ArrowDown");
  expect(document.activeElement).toBe(button("Folder"));
  await key(button("Folder"), "ArrowRight");
  expect(document.activeElement).toBe(button("Child"));
  await key(button("Child"), "ArrowLeft");
  expect(document.activeElement).toBe(button("Folder"));
  expect(document.querySelector(".ant-menu-sub")).toBeNull();
});
it("controlled open state emits an intent without showing rejected children", async () => {
  const open = vi.fn();
  await render(
    <Menu
      items={items}
      openKeys={[]}
      onOpenChange={open}
      triggerSubMenuAction="click"
    />,
  );
  await act(() => button("Folder").click());
  expect(open).toHaveBeenCalledWith(["sub"]);
  expect(document.querySelector(".ant-menu-sub")).toBeNull();
});
it("multiple selection supports deselect and grouped items", async () => {
  const deselect = vi.fn();
  await render(
    <Menu
      multiple
      onDeselect={deselect}
      items={[
        {
          key: "group",
          type: "group",
          label: "Group",
          children: [
            { key: "a", label: "Alpha" },
            { key: "divider", type: "divider" },
            { key: "b", label: "Beta" },
          ],
        },
      ]}
    />,
  );
  await act(() => button("Alpha").click());
  await act(() => button("Beta").click());
  expect(button("Alpha").getAttribute("aria-checked")).toBe("true");
  await act(() => button("Alpha").click());
  expect(deselect.mock.calls[0][0].selectedKeys).toEqual(["b"]);
});
it("Dropdown opens by keyboard, portals, selects and restores trigger focus", async () => {
  const selected = vi.fn(),
    open = vi.fn();
  await render(
    <Dropdown
      trigger={["click"]}
      onOpenChange={open}
      menu={{ items: [{ key: "a", label: "Alpha" }], onClick: selected }}
    >
      <button type="button">Actions</button>
    </Dropdown>,
  );
  await key(button("Actions"), "ArrowDown");
  expect(document.activeElement).toBe(button("Alpha"));
  expect(container.querySelector(".ant-dropdown")).toBeNull();
  await act(() => button("Alpha").click());
  expect(selected).toHaveBeenCalledOnce();
  expect(open).toHaveBeenLastCalledWith(false, { source: "menu" });
  expect(document.activeElement).toBe(button("Actions"));
  expect(document.querySelector<HTMLElement>(".ant-dropdown")?.hidden).toBe(
    true,
  );
});
it("Dropdown Escape/outside and controlled reject preserve open contract", async () => {
  const change = vi.fn();
  await render(
    <Dropdown
      open
      onOpenChange={change}
      menu={{ items: [{ key: "a", label: "Alpha" }] }}
    >
      <button type="button">Actions</button>
    </Dropdown>,
  );
  await key(button("Alpha"), "Escape");
  expect(change).toHaveBeenCalledWith(false, { source: "trigger" });
  expect(document.querySelector<HTMLElement>(".ant-dropdown")?.hidden).toBe(
    false,
  );
  await act(() =>
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    ),
  );
  expect(change).toHaveBeenCalledTimes(2);
});
it("context menu opens at requested point and repeated invocation repositions", async () => {
  await render(
    <Dropdown
      trigger={["contextMenu"]}
      menu={{ items: [{ key: "a", label: "Alpha" }] }}
    >
      <button type="button">Actions</button>
    </Dropdown>,
  );
  await act(() =>
    button("Actions").dispatchEvent(
      new MouseEvent("contextmenu", {
        clientX: 100,
        clientY: 80,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(document.querySelector<HTMLElement>(".ant-dropdown")?.style.left).toBe(
    "100px",
  );
  await act(() =>
    button("Actions").dispatchEvent(
      new MouseEvent("contextmenu", {
        clientX: 150,
        clientY: 120,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(document.querySelector<HTMLElement>(".ant-dropdown")?.style.left).toBe(
    "150px",
  );
});
it("group auto keys stay distinct and hover closes after crossing boundaries", async () => {
  await render(
    <Menu
      items={[
        { type: "group", label: "Group", children: [{ label: "Nested" }] },
      ]}
    />,
  );
  await act(() => button("Nested").click());
  expect(button("Nested").getAttribute("aria-current")).toBe("page");
  await act(() =>
    root?.render(
      <Dropdown menu={{ items: [{ key: "a", label: "Hover action" }] }}>
        <button type="button">Hover trigger</button>
      </Dropdown>,
    ),
  );
  const trigger = button("Hover trigger").parentElement;
  if (!trigger) throw Error("Missing trigger wrapper");
  vi.useFakeTimers();
  await act(() =>
    trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false })),
  );
  await act(() => vi.advanceTimersByTime(150));
  expect(document.querySelector<HTMLElement>(".ant-dropdown")?.hidden).toBe(
    false,
  );
  await act(() =>
    trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false })),
  );
  await act(() => vi.advanceTimersByTime(110));
  expect(document.querySelector<HTMLElement>(".ant-dropdown")?.hidden).toBe(
    true,
  );
});
