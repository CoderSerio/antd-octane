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
it("Menu keeps custom links outside buttons and suppresses disabled link navigation", async () => {
  const change = vi.fn();
  await render(
    <Menu
      onClick={change}
      items={[
        { key: "link", label: <a href="#linked">Link</a> },
        {
          key: "disabled",
          disabled: true,
          label: <a href="#disabled">Disabled</a>,
        },
      ]}
    />,
  );
  expect(container.querySelector("button a")).toBeNull();
  const link = container.querySelector<HTMLAnchorElement>('a[href="#linked"]');
  expect(link?.tabIndex).toBe(-1);
  await act(() => link?.click());
  expect(change).toHaveBeenCalledOnce();
  expect(change.mock.calls[0][0].item).toBe(
    container.querySelector('[data-menu-key="link"]'),
  );
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  await act(() =>
    container.querySelector('a[href="#disabled"]')?.dispatchEvent(event),
  );
  expect(event.defaultPrevented).toBe(true);
  expect(change).toHaveBeenCalledOnce();
});
it("Menu normalizes numeric item keys for DOM and callback info", async () => {
  const click = vi.fn();
  await render(<Menu items={[{ key: 1, label: "One" }]} onClick={click} />);
  const item = container.querySelector<HTMLElement>('[data-menu-key="1"]');
  expect(item).not.toBeNull();
  await act(() => item?.click());
  expect(click.mock.lastCall?.[0].key).toBe("1");
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
it("vertical Menu opens a portal, preserves keyPath and restores the submenu title", async () => {
  const click = vi.fn();
  await render(
    <Menu
      triggerSubMenuAction="click"
      onClick={click}
      items={[
        {
          key: "parent",
          label: "Parent",
          children: [{ key: "child", label: "Child" }],
        },
      ]}
    />,
  );
  await act(() => button("Parent").click());
  expect(container.querySelector(".ant-menu-submenu-popup")).toBeNull();
  expect(document.querySelector(".ant-menu-submenu-popup")).not.toBeNull();
  await act(() => button("Child").click());
  expect(click.mock.calls[0][0].keyPath).toEqual(["child", "parent"]);
  expect(click.mock.calls[0][0].item).toBeInstanceOf(HTMLElement);
});
it("Menu keyboard navigation opens a submenu and returns focus to its title", async () => {
  await render(
    <Menu
      items={[
        {
          key: "parent",
          label: "Parent",
          children: [{ key: "child", label: "Child" }],
        },
      ]}
    />,
  );
  await key(button("Parent"), "ArrowRight");
  expect(document.activeElement).toBe(button("Child"));
  await key(button("Child"), "ArrowLeft");
  expect(document.activeElement).toBe(button("Parent"));
});
it("Menu collapse restores inline open keys, accepts dark tokens and custom expand icons", async () => {
  const items = [
    {
      key: "parent",
      label: "Parent",
      children: [{ key: "child", label: "Child" }],
    },
  ];
  await render(
    <ConfigProvider theme={{ components: { Menu: { darkItemBg: "#123456" } } }}>
      <Menu
        mode="inline"
        theme="dark"
        defaultOpenKeys={["parent"]}
        items={items}
        expandIcon={({ isOpen }: { isOpen: boolean }) =>
          isOpen ? "Open" : "Closed"
        }
      />
    </ConfigProvider>,
  );
  expect(
    container
      .querySelector<HTMLElement>(".ant-menu-root")
      ?.style.getPropertyValue("--ao-menu-bg"),
  ).toBe("#123456");
  await act(() =>
    root?.render(
      <ConfigProvider
        theme={{ components: { Menu: { darkItemBg: "#123456" } } }}
      >
        <Menu mode="inline" theme="dark" inlineCollapsed items={items} />
      </ConfigProvider>,
    ),
  );
  expect(container.querySelector(".ant-menu-sub")).toBeNull();
  await act(() =>
    root?.render(
      <ConfigProvider
        theme={{ components: { Menu: { darkItemBg: "#123456" } } }}
      >
        <Menu mode="inline" theme="dark" items={items} />
      </ConfigProvider>,
    ),
  );
  expect(container.querySelector(".ant-menu-sub")).not.toBeNull();
});
