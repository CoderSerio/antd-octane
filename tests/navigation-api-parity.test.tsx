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
it("Tabs card sizing uses theme heights and hides disabled removal actions", async () => {
  await render(
    <ConfigProvider
      theme={{
        components: {
          Tabs: { cardHeightSM: 30, cardPaddingSM: "3px 9px" },
        },
      }}
    >
      <Tabs
        type="editable-card"
        size="small"
        items={[
          { key: "one", label: "One", children: "One" },
          { key: "two", label: "Two", children: "Two", disabled: true },
        ]}
      />
    </ConfigProvider>,
  );
  const tabs = container.querySelector<HTMLElement>(".ant-tabs");
  expect(tabs?.style.getPropertyValue("--ao-tabs-card-height")).toBe("30px");
  expect(tabs?.style.getPropertyValue("--ao-tabs-card-padding")).toBe(
    "3px 9px",
  );
  expect(container.querySelectorAll(".ant-tabs-tab-remove")).toHaveLength(1);
  expect(
    container.querySelector(".ant-tabs-tab-disabled .ant-tabs-tab-remove"),
  ).toBeNull();
});

it("Menu collapsed dimensions and Steps spacing follow compact tokens", async () => {
  await render(
    <ConfigProvider theme={{ algorithm: theme.compactAlgorithm }}>
      <Menu
        mode="inline"
        inlineCollapsed
        items={[{ key: "one", label: "One" }]}
      />
      <Steps
        type="inline"
        current={1}
        items={[
          { title: "One", description: "One" },
          { title: "Two", description: "Two" },
          { title: "Three", description: "Three" },
        ]}
      />
    </ConfigProvider>,
  );
  const menu = container.querySelector<HTMLElement>(".ant-menu-root");
  expect(menu?.style.getPropertyValue("--ao-menu-collapsed-width")).toBe(
    "70px",
  );
  expect(menu?.style.getPropertyValue("--ao-menu-collapsed-icon-size")).toBe(
    "14px",
  );
  const steps = container.querySelector<HTMLElement>(".ant-steps");
  expect(steps?.style.getPropertyValue("--ao-steps-xs")).toBe("4px");
  expect(steps?.style.getPropertyValue("--ao-steps-inline-font")).toBe("10px");
  expect(container.querySelectorAll(".ant-steps-item-first")).toHaveLength(1);
  expect(container.querySelectorAll(".ant-steps-item-last")).toHaveLength(1);
  expect(
    container.querySelector(".ant-steps-item-first")?.textContent,
  ).toContain("One");
  expect(
    container.querySelector(".ant-steps-item-last")?.textContent,
  ).toContain("Three");
});

it("Pagination simple slash and mini jump sizes retain their upstream spacing", async () => {
  await render(
    <Pagination total={500} defaultCurrent={3} simple={{ readOnly: true }} />,
  );
  expect(container.querySelector(".ant-pagination-slash")?.textContent).toBe(
    "/",
  );
  expect(
    container.querySelector(".ant-pagination-simple-pager input"),
  ).toBeNull();
  await act(() => root?.render(<Pagination size="small" total={500} />));
  const pager = container.querySelector<HTMLElement>(".ant-pagination");
  expect(pager?.style.getPropertyValue("--ao-pagination-size")).toBe("24px");
  expect(pager?.style.getPropertyValue("--ao-pagination-normal-size")).toBe(
    "32px",
  );
});

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

it("Pagination itemRender replaces the control structure without nesting buttons", async () => {
  const change = vi.fn();
  const renderItem = vi.fn((_page, type, original) =>
    type === "next" ? <a href="#next">Next</a> : original,
  );
  await render(
    <Pagination
      total={100}
      showSizeChanger={false}
      itemRender={renderItem}
      onChange={change}
    />,
  );
  const next = container.querySelector<HTMLAnchorElement>(
    ".ant-pagination-next > a",
  );
  expect(next).not.toBeNull();
  expect(container.querySelector("button a, button button")).toBeNull();
  expect(renderItem.mock.calls[0][2].type).toBe("button");
  await key(next as HTMLElement, "Enter");
  expect(change).toHaveBeenCalledExactlyOnceWith(2, 10);
  await act(() =>
    root?.render(
      <Pagination
        total={100}
        disabled
        itemRender={renderItem}
        onChange={change}
      />,
    ),
  );
  await act(() =>
    container
      .querySelector<HTMLAnchorElement>(".ant-pagination-next > a")
      ?.click(),
  );
  expect(change).toHaveBeenCalledTimes(1);
});
it("Pagination preserves supplied size-option order and custom go-button nodes", async () => {
  const change = vi.fn();
  await render(
    <Pagination
      total={200}
      showSizeChanger
      pageSizeOptions={[50, 10, 20]}
      showQuickJumper={{ goButton: <button type="button">Go</button> }}
      onChange={change}
    />,
  );
  expect(container.querySelector("button button")).toBeNull();
  const input = container.querySelector<HTMLInputElement>(
    '[aria-label="跳转页码"]',
  );
  await act(() => {
    if (!input) throw Error("Missing jumper");
    input.value = "4";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(() => button("Go").click());
  expect(change).toHaveBeenCalledExactlyOnceWith(4, 10);
  await act(() =>
    container.querySelector<HTMLInputElement>('[role="combobox"]')?.click(),
  );
  expect(
    [...container.querySelectorAll('[role="option"]')].map(
      (n) => n.textContent,
    ),
  ).toEqual(["50 / page", "10 / page", "20 / page"]);
});
it("Pagination discards a pending quick jump when focus moves to a page control", async () => {
  const change = vi.fn();
  await render(<Pagination total={200} showQuickJumper onChange={change} />);
  const input = container.querySelector<HTMLInputElement>(
    '[aria-label="跳转页码"]',
  );
  await act(() => {
    if (!input) throw Error("Missing jumper");
    input.value = "9";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(() =>
    input?.dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        relatedTarget: container.querySelector(".ant-pagination-next button"),
      }),
    ),
  );
  expect(change).not.toHaveBeenCalled();
  expect(input?.value).toBe("");
});
it("Pagination can clone the original control without duplicate change events", async () => {
  const change = vi.fn();
  await render(
    <Pagination
      total={100}
      showSizeChanger={false}
      itemRender={(_page, _type, original) =>
        cloneElement(original as ElementDescriptor, {
          className: "custom-control",
        })
      }
      onChange={change}
    />,
  );
  await act(() =>
    container
      .querySelector<HTMLButtonElement>(".ant-pagination-next button")
      ?.click(),
  );
  expect(change).toHaveBeenCalledExactlyOnceWith(2, 10);
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
it("Pagination renders all small page counts, read-only simple mode and configured size changer", async () => {
  await render(
    <ConfigProvider
      componentSize="small"
      pagination={{ showSizeChanger: { showSearch: false } }}
    >
      <Pagination total={70} align="end" showTitle={false} />
    </ConfigProvider>,
  );
  expect(container.querySelectorAll(".ant-pagination-item")).toHaveLength(7);
  expect(
    container.querySelector(".ant-pagination-mini.ant-pagination-end"),
  ).not.toBeNull();
  expect(
    container.querySelector('[aria-label="Next Page"]')?.hasAttribute("title"),
  ).toBe(false);
  expect(container.querySelector('[role="combobox"]')).not.toBeNull();
  await act(() =>
    root?.render(<Pagination total={50} simple={{ readOnly: true }} />),
  );
  expect(container.querySelector("input")).toBeNull();
});
it("Pagination defers blur when a go button is configured", async () => {
  const change = vi.fn();
  await render(
    <Pagination
      total={100}
      showSizeChanger={false}
      showQuickJumper={{ goButton: true }}
      onChange={change}
    />,
  );
  const input = container.querySelector<HTMLInputElement>("input");
  if (!input) throw Error("Missing input");
  await act(() => {
    input.value = "4";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(() =>
    input.dispatchEvent(new FocusEvent("focusout", { bubbles: true })),
  );
  expect(change).not.toHaveBeenCalled();
  await act(() => button("confirm").click());
  expect(change).toHaveBeenCalledWith(4, 10);
});
it("Steps supports custom dots, progress circles, inline overrides and legacy Step", async () => {
  const dot = vi.fn((_node, info) => <b>{info.index}</b>);
  await render(
    <Steps
      initial={2}
      current={3}
      progressDot={dot}
      items={[{ title: "First" }, { title: "Second" }]}
      responsive={false}
    />,
  );
  expect(dot).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ index: 3, status: "process" }),
  );
  await act(() =>
    root?.render(
      <Steps
        current={1}
        percent={75}
        items={[{ title: "First" }, { title: "Second" }]}
        responsive={false}
      />,
    ),
  );
  expect(
    container
      .querySelector('.ant-steps-progress-icon [role="progressbar"]')
      ?.getAttribute("aria-valuenow"),
  ).toBe("75");
  await act(() =>
    root?.render(
      <Steps type="inline" direction="vertical" percent={80}>
        <Steps.Step
          title="First"
          description="Details"
          icon="Icon"
          subTitle="Subtitle"
        />
      </Steps>,
    ),
  );
  expect(
    container.querySelector(
      ".ant-steps-horizontal.ant-steps-inline.ant-steps-dot",
    ),
  ).not.toBeNull();
  expect(container.textContent).not.toContain("Icon");
  expect(container.textContent).not.toContain("Subtitle");
});
it("Tabs respects an initially disabled active item and null/false close icons", async () => {
  await render(
    <Tabs
      type="editable-card"
      items={[
        {
          key: "a",
          label: "First",
          disabled: true,
          children: "A",
          closeIcon: null,
        },
        { key: "b", label: "Second", closeIcon: false },
        { key: "c", label: "Third" },
      ]}
    />,
  );
  expect(container.querySelector('[aria-selected="true"]')?.textContent).toBe(
    "First",
  );
  expect(container.querySelectorAll(".ant-tabs-tab-remove")).toHaveLength(1);
});
it("Tabs calls indicator functions with the tab dimensions and forwards its native root", async () => {
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(120);
  const size = vi.fn((origin: number) => origin - 20);
  let native: HTMLDivElement | null = null;
  await render(
    <Tabs
      indicator={{ size }}
      ref={(ref) => {
        native = ref?.nativeElement ?? null;
      }}
      items={[{ key: "a", label: "A" }]}
    />,
  );
  expect(size).toHaveBeenCalledWith(120);
  expect(native).toBe(container.querySelector(".ant-tabs"));
  expect(
    container
      .querySelector<HTMLElement>(".ant-tabs")
      ?.style.getPropertyValue("--ao-tabs-indicator-size"),
  ).toBe("100px");
});
it("Tabs creates panels lazily, caches visited panels and applies item presentation", async () => {
  await render(
    <Tabs
      items={[
        { key: "a", label: "First", children: "A" },
        {
          key: "b",
          label: "Second",
          children: "B",
          className: "custom-pane",
          style: { height: 200 },
        },
        { key: "c", label: "Third", children: "C", forceRender: true },
      ]}
    />,
  );
  expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(2);
  expect(container.querySelector(".custom-pane")).toBeNull();
  await act(() => button("Second").click());
  expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(3);
  const panel = container.querySelector<HTMLElement>(".custom-pane");
  expect(panel?.style.height).toBe("200px");
  expect(panel?.tabIndex).toBe(0);
  await act(() => button("First").click());
  expect(panel?.hidden).toBe(true);
  expect(panel?.textContent).toBe("B");
  expect(panel?.tabIndex).toBe(-1);
});
it("Tabs removes an inactive panel when destroyOnHidden is enabled", async () => {
  await render(
    <Tabs
      destroyOnHidden
      items={[
        { key: "a", label: "First", children: "A" },
        { key: "b", label: "Second", children: "B" },
      ]}
    />,
  );
  const first = container.querySelector('[role="tabpanel"]');
  await act(() => button("Second").click());
  expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(1);
  expect(first?.isConnected).toBe(false);
  expect(container.querySelector('[role="tabpanel"]')?.textContent).toBe("B");
});

it("Tabs renderTabBar preserves default navigation and accepts per-tab wrappers", async () => {
  const change = vi.fn();
  const click = vi.fn();
  let nativeBar: HTMLDivElement | null = null;
  const renderBar: NonNullable<TabsProps["renderTabBar"]> = (
    props,
    DefaultTabBar,
  ) => (
    <div data-custom-tab-bar="true">
      <DefaultTabBar
        {...props}
        ref={(node) => {
          nativeBar = node;
        }}
        className="custom-bar"
        style={{ background: "rgb(240, 240, 240)" }}
      >
        {(node) => (
          <div
            data-wrapped-tab={node.props["data-node-key"]}
            style={{ position: "relative" }}
          >
            {node}
          </div>
        )}
      </DefaultTabBar>
    </div>
  );
  await render(
    <Tabs
      prefixCls="custom-tabs"
      renderTabBar={renderBar}
      animated={{}}
      onChange={change}
      onTabClick={click}
      items={[
        { key: "a", label: "First", children: "Panel A" },
        { key: "b", label: "Second", children: "Panel B" },
      ]}
    />,
  );
  const bar = container.querySelector<HTMLElement>(".ant-tabs-nav");
  expect(nativeBar).toBe(bar);
  expect(bar?.classList.contains("custom-tabs-nav")).toBe(true);
  expect(bar?.style.background).toBe("rgb(240, 240, 240)");
  expect(container.querySelectorAll("[data-wrapped-tab]")).toHaveLength(2);
  expect(container.querySelector(".ant-tabs-ink-bar-animated")).not.toBeNull();
  await act(() => button("Second").click());
  expect(change).toHaveBeenLastCalledWith("b");
  expect(click.mock.calls.at(-1)?.[0]).toBe("b");
  expect(container.querySelector(".ant-tabs-nav")).toBe(bar);
  expect(container.querySelector(".ant-tabs-tabpane-active")?.textContent).toBe(
    "Panel B",
  );
  await key(button("Second"), "Home");
  expect(document.activeElement).toBe(button("First"));
});

it("Tabs allows a fully custom tab bar to use the same selection callback", async () => {
  let received:
    | Parameters<NonNullable<TabsProps["renderTabBar"]>>[0]
    | undefined;
  await render(
    <Tabs
      items={[
        { key: "a", label: "A", children: "Panel A" },
        { key: "b", label: "B", children: "Panel B" },
      ]}
      renderTabBar={(props) => {
        received = props;
        return (
          <button
            type="button"
            onClick={(event) => props.onTabClick("b", event)}
          >
            Choose B
          </button>
        );
      }}
    />,
  );
  expect(received?.activeKey).toBe("a");
  expect(received?.animated).toEqual({ inkBar: true, tabPane: false });
  expect(received?.panes).toHaveLength(2);
  expect(container.querySelector(".ant-tabs-nav")).toBeNull();
  await act(() => button("Choose B").click());
  expect(received?.activeKey).toBe("b");
  expect(container.querySelector(".ant-tabs-tabpane-active")?.textContent).toBe(
    "Panel B",
  );
});

it("Tabs opacity motion retains the leaving pane until its transition finishes", async () => {
  vi.useFakeTimers();
  const frames: FrameRequestCallback[] = [];
  vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(
    (callback) => {
      frames.push(callback);
      return frames.length;
    },
  );
  vi.spyOn(globalThis, "cancelAnimationFrame").mockImplementation(() => {});
  await render(
    <Tabs
      animated={{ tabPane: true }}
      destroyOnHidden
      items={[
        {
          key: "a",
          label: "First",
          children: "Panel A",
          destroyOnHidden: false,
        },
        { key: "b", label: "Second", children: "Panel B" },
      ]}
    />,
  );
  expect(container.querySelector("[class*=tabs-switch]")).toBeNull();
  await act(() => button("Second").click());
  const leaving = container.querySelector<HTMLElement>(
    ".ant-tabs-switch-leave-start",
  );
  expect(leaving?.hidden).toBe(false);
  expect(leaving?.getAttribute("aria-hidden")).toBe("true");
  expect(
    container.querySelector(".ant-tabs-switch-enter-start"),
  ).not.toBeNull();
  await act(() =>
    frames.splice(0).forEach((frame) => {
      frame(0);
    }),
  );
  await act(() =>
    frames.splice(0).forEach((frame) => {
      frame(16);
    }),
  );
  expect(
    container.querySelector(".ant-tabs-switch-leave-active"),
  ).not.toBeNull();
  expect(
    container.querySelector(".ant-tabs-switch-enter-active"),
  ).not.toBeNull();
  await act(() => vi.advanceTimersByTime(400));
  expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(1);
  expect(container.querySelector('[role="tabpanel"]')?.textContent).toBe(
    "Panel B",
  );
});

it("Tabs disables pane motion with the theme motion token", async () => {
  await render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Tabs
        animated
        items={[
          { key: "a", label: "First", children: "A" },
          { key: "b", label: "Second", children: "B" },
        ]}
      />
    </ConfigProvider>,
  );
  await act(() => button("Second").click());
  expect(container.querySelector("[class*=tabs-switch]")).toBeNull();
  expect(container.querySelector('[role="tabpanel"][hidden]')).not.toBeNull();
  expect(
    container
      .querySelector<HTMLElement>(".ant-tabs")
      ?.style.getPropertyValue("--ao-tabs-motion-duration"),
  ).toBe("0s");
});
