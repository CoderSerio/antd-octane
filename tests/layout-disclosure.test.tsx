import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Button,
  Col,
  Collapse,
  Descriptions,
  Empty,
  Input,
  Layout,
  Row,
  Statistic,
  Tabs,
  Timeline,
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
  vi.unstubAllGlobals();
});
async function click(text: string) {
  const node = [
    ...container.querySelectorAll<HTMLElement>(
      'button, [role="button"], [role="tab"]',
    ),
  ].find((item) => item.textContent === text);
  if (!node) throw Error(`Missing button ${text}`);
  await act(() => node.click());
}
function mockMedia(initial: number) {
  let width = initial;
  const entries = new Map<
    string,
    { matches: boolean; listeners: Set<() => void> }
  >();
  const match = (query: string) => {
    const parts = query.match(/(min|max)-width:\s*([\d.]+)px/);
    return parts
      ? parts[1] === "min"
        ? width >= Number(parts[2])
        : width <= Number(parts[2])
      : false;
  };
  vi.stubGlobal("matchMedia", (query: string) => {
    const entry = entries.get(query) ?? {
      matches: match(query),
      listeners: new Set<() => void>(),
    };
    entries.set(query, entry);
    return {
      get matches() {
        return entry.matches;
      },
      media: query,
      addEventListener: (_: string, listener: () => void) =>
        entry.listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) =>
        entry.listeners.delete(listener),
    };
  });
  return {
    entries,
    resize(next: number) {
      width = next;
      for (const [query, entry] of entries) {
        const matches = match(query);
        if (matches !== entry.matches) {
          entry.matches = matches;
          for (const listener of entry.listeners) listener();
        }
      }
    },
  };
}
it("shares row breakpoint subscriptions, changes gutter/columns and cleans up", async () => {
  const media = mockMedia(1000);
  await render(
    <Row gutter={{ xs: 8, md: 24 }}>
      <Col xs={24} md={12}>
        A
      </Col>
      <Col xs={24} md={12}>
        B
      </Col>
    </Row>,
  );
  expect(container.querySelector<HTMLElement>(".ant-col")?.style.maxWidth).toBe(
    "50%",
  );
  expect(
    container.querySelector<HTMLElement>(".ant-col")?.style.paddingInline,
  ).toBe("12px");
  expect(
    [...media.entries.values()].every((entry) => entry.listeners.size === 1),
  ).toBe(true);
  await act(() => media.resize(390));
  expect(container.querySelector<HTMLElement>(".ant-col")?.style.maxWidth).toBe(
    "100%",
  );
  expect(
    container.querySelector<HTMLElement>(".ant-col")?.style.paddingInline,
  ).toBe("4px");
  await act(() => root?.unmount());
  root = undefined;
  expect(
    [...media.entries.values()].every((entry) => entry.listeners.size === 0),
  ).toBe(true);
});
it("Sider registers with Layout and reports responsive versus click collapse", async () => {
  const media = mockMedia(1000);
  const change = vi.fn();
  await render(
    <Layout>
      <Layout.Sider breakpoint="md" collapsible onCollapse={change}>
        Side
      </Layout.Sider>
      <Layout.Content>Body</Layout.Content>
    </Layout>,
  );
  expect(
    container.firstElementChild?.classList.contains("ant-layout-has-sider"),
  ).toBe(true);
  await act(() => media.resize(390));
  expect(change).toHaveBeenCalledWith(true, "responsive");
  expect(
    container.querySelector<HTMLElement>(".ant-layout-sider")?.style.width,
  ).toBe("80px");
  await act(() =>
    container
      .querySelector<HTMLButtonElement>(".ant-layout-sider-trigger")
      ?.click(),
  );
  expect(change).toHaveBeenCalledWith(false, "clickTrigger");
});
it("controlled Sider requests collapse without changing its width", async () => {
  const change = vi.fn();
  await render(
    <Layout.Sider
      collapsible
      collapsed={false}
      width={240}
      onCollapse={change}
    />,
  );
  await act(() => container.querySelector("button")?.click());
  expect(change).toHaveBeenCalledWith(true, "clickTrigger");
  expect(container.firstElementChild?.getAttribute("style")).toContain("240px");
});
it("Collapse lazily mounts content and retains uncontrolled edits by default", async () => {
  await render(
    <Collapse
      items={[
        { key: "a", label: "Open", children: <Input defaultValue="initial" /> },
      ]}
    />,
  );
  expect(container.querySelector("input")).toBeNull();
  await click("Open");
  const input = container.querySelector("input");
  if (!input) throw Error("No input");
  await act(() => {
    input.value = "changed";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await click("Open");
  expect(container.querySelector("input")).toBe(input);
  await act(() =>
    container.querySelector(".ant-collapse-content-motion")?.dispatchEvent(
      Object.assign(new Event("transitionend", { bubbles: true }), {
        propertyName: "height",
      }),
    ),
  );
  expect(
    container.querySelector<HTMLElement>(".ant-collapse-content")?.hidden,
  ).toBe(true);
  await click("Open");
  expect(container.querySelector("input")?.value).toBe("changed");
});
it("Collapse accordion uses string keys and destroyOnHidden unmounts", async () => {
  const change = vi.fn();
  await render(
    <Collapse
      accordion
      destroyOnHidden
      onChange={change}
      items={[
        { key: 1, label: "First", children: <Input /> },
        { key: 2, label: "Second", children: "Body" },
        { key: 3, label: "Disabled", collapsible: "disabled" },
      ]}
    />,
  );
  await click("First");
  await click("Second");
  expect(change.mock.lastCall?.[0]).toEqual(["2"]);
  expect(container.querySelector("input")).not.toBeNull();
  await act(() =>
    container.querySelector(".ant-collapse-content-inactive")?.dispatchEvent(
      Object.assign(new Event("transitionend", { bubbles: true }), {
        propertyName: "height",
      }),
    ),
  );
  expect(container.querySelector("input")).toBeNull();
  await click("Disabled");
  expect(change).toHaveBeenCalledTimes(2);
});
it("controlled Collapse can reject changes and extra actions do not toggle", async () => {
  const change = vi.fn();
  const extra = vi.fn();
  await render(
    <Collapse
      activeKey={[]}
      onChange={change}
      items={[
        {
          key: "a",
          label: "Panel",
          extra: (
            <Button
              onClick={(event) => {
                event.stopPropagation();
                extra();
              }}
            >
              Action
            </Button>
          ),
          children: "Body",
        },
      ]}
    />,
  );
  await click("Action");
  expect(extra).toHaveBeenCalledTimes(1);
  expect(change).not.toHaveBeenCalled();
  await act(() =>
    container.querySelector<HTMLElement>(".ant-collapse-header")?.click(),
  );
  expect(change).toHaveBeenCalledWith(["a"]);
  expect(
    container.querySelector("[aria-expanded]")?.getAttribute("aria-expanded"),
  ).toBe("false");
});
it("Tabs connects ARIA ids and activates only enabled items", async () => {
  const change = vi.fn();
  await render(
    <Tabs
      onChange={change}
      items={[
        { key: "a / 中文", label: "First", children: "A" },
        { key: "b", label: "Disabled", disabled: true },
        { key: "c", label: "Third", children: "C" },
      ]}
    />,
  );
  const tabs = [
    ...container.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  ];
  const controls = tabs[0].getAttribute("aria-controls");
  expect(container.querySelector('[role="tabpanel"]')?.id).toBe(controls);
  await click("Disabled");
  expect(change).not.toHaveBeenCalled();
  await click("Third");
  expect(change).toHaveBeenCalledWith("c");
  expect(tabs[2].getAttribute("aria-selected")).toBe("true");
  expect(
    container.querySelectorAll<HTMLElement>('[role="tabpanel"]')[0].hidden,
  ).toBe(true);
});
it("Tabs keeps mounted state and destroyOnHidden resets it", async () => {
  const items = [
    { key: "a", label: "First", children: <Input defaultValue="seed" /> },
    { key: "b", label: "Second", children: "B" },
  ];
  await render(<Tabs items={items} />);
  const input = container.querySelector("input");
  await click("Second");
  expect(container.querySelector("input")).toBe(input);
  await click("First");
  expect(container.querySelector("input")).toBe(input);
  await act(() => root?.render(<Tabs items={items} destroyOnHidden />));
  await click("Second");
  expect(container.querySelector("input")).toBeNull();
});
it("Tabs editable actions are callbacks and removed active items fall back", async () => {
  function Example() {
    const [items, set] = useState([
      { key: "a", label: "A" },
      { key: "b", label: "B" },
    ]);
    return (
      <Tabs
        type="editable-card"
        items={items}
        onEdit={(key, action) => {
          if (action === "remove")
            set(items.filter((item) => item.key !== key));
        }}
      />
    );
  }
  await render(<Example />);
  await act(() =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="关闭 A"]')
      ?.click(),
  );
  expect(container.querySelector('[role="tab"]')?.textContent).toBe("B");
  expect(
    container.querySelector('[role="tab"]')?.getAttribute("aria-selected"),
  ).toBe("true");
});
it("Descriptions packs spans and adjusts columns at breakpoints", async () => {
  const media = mockMedia(1000);
  await render(
    <Descriptions
      bordered
      column={{ xs: 1, md: 3 }}
      items={[
        { key: "a", label: "A", children: "One", span: 2 },
        { key: "b", label: "B", children: "Two" },
        { key: "c", label: "C", children: "Three", span: "filled" },
      ]}
    />,
  );
  expect(container.querySelectorAll("tr")).toHaveLength(2);
  expect(container.querySelector("td")?.colSpan).toBe(3);
  await act(() => media.resize(390));
  expect(container.querySelectorAll("tr")).toHaveLength(3);
  expect(container.querySelector("td")?.colSpan).toBe(1);
});
it("Statistic preserves decimal strings and truncates precision without floating point conversion", async () => {
  await render(
    <Statistic
      value="12345678901234567890.129"
      precision={2}
      prefix="¥"
      suffix="元"
    />,
  );
  expect(container.textContent).toBe("¥12,345,678,901,234,567,890.12元");
});
it("Empty respects hidden descriptions and custom footer", async () => {
  await render(
    <Empty description={false} image={null}>
      <Button>创建</Button>
    </Empty>,
  );
  expect(container.querySelector(".ant-empty-description")).toBeNull();
  expect(container.textContent).toBe("创建");
});
it("Timeline reverses a copy and adds pending content", async () => {
  const items = [
    { key: 1, children: "First" },
    { key: 2, children: "Second" },
  ];
  await render(<Timeline items={items} reverse pending="Loading" />);
  expect(
    [...container.querySelectorAll(".ant-timeline-item-content")].map(
      (item) => item.textContent,
    ),
  ).toEqual(["Loading", "Second", "First"]);
  expect(items[0].key).toBe(1);
});
