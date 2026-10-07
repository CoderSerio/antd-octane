import type { ElementDescriptor, Root } from "octane";
import { act, cloneElement, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Anchor,
  Breadcrumb,
  ConfigProvider,
  Dropdown,
  Menu,
  Pagination,
  Steps,
  Tabs,
  type TabsProps,
  theme,
} from "../packages/antd-octane/src";

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
  root = undefined;
  vi.restoreAllMocks();
  vi.useRealTimers();
});
function button(text: string) {
  const node = [...document.querySelectorAll<HTMLButtonElement>("button")].find(
    (node) => node.textContent?.trim() === text,
  );
  if (!node) throw Error(`Missing ${text}`);
  return node;
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

it("standalone Breadcrumb separators keep their own slash default", async () => {
  await render(
    <Breadcrumb
      separator=""
      items={[
        { title: "Location" },
        { type: "separator", separator: ":" },
        { title: "Application" },
        { type: "separator" },
        { title: "Details" },
      ]}
    />,
  );
  expect(
    [...container.querySelectorAll(".ant-breadcrumb-separator")].map(
      (node) => node.textContent,
    ),
  ).toEqual([":", "/"]);
});
it("Anchor accepts legacy links, per-item replace, fixed ink and provider style", async () => {
  const replace = vi.spyOn(history, "replaceState");
  await render(
    <ConfigProvider
      direction="rtl"
      prefixCls="custom"
      anchor={{ className: "provider" }}
    >
      <Anchor affix={false} showInkInFixed rootClassName="root">
        <Anchor.Link href="#native-anchor" title="Target" replace />
      </Anchor>
    </ConfigProvider>,
  );
  const link = container.querySelector("a");
  await act(() => link?.click());
  expect(replace).toHaveBeenCalledWith(null, "", "#native-anchor");
  expect(
    container
      .querySelector(".custom-anchor-wrapper")
      ?.classList.contains("provider"),
  ).toBe(true);
  expect(container.querySelector(".ant-anchor-fixed")).toBeNull();
});
it("Anchor onChange receives the source link while getCurrentAnchor customizes the highlight", async () => {
  const change = vi.fn();
  await render(
    <Anchor
      affix={false}
      getCurrentAnchor={() => "#highlight"}
      onChange={change}
      items={[
        { key: "source", href: "#source", title: "Source" },
        { key: "highlight", href: "#highlight", title: "Highlight" },
      ]}
    />,
  );
  await act(() =>
    container.querySelector<HTMLAnchorElement>('a[href="#source"]')?.click(),
  );
  expect(change).toHaveBeenLastCalledWith("#source");
  expect(
    container.querySelector('[aria-current="location"]')?.textContent,
  ).toBe("Highlight");
});
it("Breadcrumb substitutes params, builds route paths and exposes itemRender paths", async () => {
  const itemRender = vi.fn((item, _params, _items, paths) => (
    <span>
      {item.title}: {paths.join("/")}
    </span>
  ));
  const items = [
    { title: "Home", path: "/home" },
    { title: "User", path: ":id" },
  ];
  await render(<Breadcrumb params={{ id: 42 }} items={items} />);
  expect(container.querySelectorAll("a")[1].getAttribute("href")).toBe(
    "#/home/42",
  );
  await act(() =>
    root?.render(
      <Breadcrumb params={{ id: 42 }} items={items} itemRender={itemRender} />,
    ),
  );
  expect(itemRender).toHaveBeenLastCalledWith(items[1], { id: 42 }, items, [
    "home",
    "42",
  ]);
});
it("Breadcrumb keeps falsy route parameters in titles and paths", async () => {
  await render(
    <Breadcrumb
      params={{ id: 0, enabled: false }}
      items={[{ title: "User :id :enabled", path: ":id/:enabled" }]}
    />,
  );
  const link = container.querySelector<HTMLAnchorElement>("a");
  expect(link?.getAttribute("href")).toBe("#/0/false");
  expect(link?.textContent).toBe("User 0 false");
});
it("Breadcrumb creates menus and retains compound Item/Separator content", async () => {
  await render(
    <Breadcrumb
      items={[
        {
          title: "Projects",
          menu: { items: [{ title: "Settings", key: "settings" }] },
          dropdownProps: { trigger: ["click"] },
        },
      ]}
    />,
  );
  await act(() =>
    container
      .querySelector<HTMLElement>(".ant-breadcrumb-overlay-link")
      ?.click(),
  );
  expect(button("Settings")).toBeDefined();
  await act(() =>
    root?.render(
      <Breadcrumb>
        <Breadcrumb.Item href="#home">Home</Breadcrumb.Item>
        <Breadcrumb.Separator>:</Breadcrumb.Separator>
        <Breadcrumb.Item>Current</Breadcrumb.Item>
      </Breadcrumb>,
    ),
  );
  expect(container.textContent).toContain("Home:Current");
});
it("Dropdown renders custom popup content and keeps multiple selectable menus open", async () => {
  const open = vi.fn();
  await render(
    <Dropdown
      trigger={["click"]}
      arrow
      menu={{
        multiple: true,
        selectable: true,
        items: [{ key: "one", label: "One" }],
      }}
      onOpenChange={open}
      popupRender={(menus) => (
        <section>
          {menus}
          <footer>Footer</footer>
        </section>
      )}
    >
      <button type="button">Actions</button>
    </Dropdown>,
  );
  await act(() => button("Actions").click());
  await act(() => button("One").click());
  expect(document.querySelector<HTMLElement>(".ant-dropdown")?.hidden).toBe(
    false,
  );
  expect(document.querySelector(".ant-dropdown footer")?.textContent).toBe(
    "Footer",
  );
  expect(document.querySelector(".ant-dropdown-arrow")).not.toBeNull();
  expect(open).toHaveBeenCalledTimes(1);
});
it("Dropdown.Button delegates the primary click and disabled state", async () => {
  const click = vi.fn();
  await render(
    <Dropdown.Button
      onClick={click}
      disabled
      menu={{ items: [{ key: "one", label: "One" }] }}
    >
      Action
    </Dropdown.Button>,
  );
  expect(button("Action").disabled).toBe(true);
  expect(
    container.querySelectorAll<HTMLButtonElement>("button")[1].disabled,
  ).toBe(true);
  await act(() =>
    root?.render(
      <Dropdown.Button
        onClick={click}
        menu={{ items: [{ key: "one", label: "One" }] }}
      >
        Action
      </Dropdown.Button>,
    ),
  );
  await act(() => button("Action").click());
  expect(click).toHaveBeenCalledOnce();
});
