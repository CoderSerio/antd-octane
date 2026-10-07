import type { ElementDescriptor, HTMLAttributes, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Col,
  ConfigProvider,
  Divider,
  Flex,
  Layout,
  Menu,
  Row,
  Space,
  Splitter,
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
  root = undefined;
  container?.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("Flex supports native/custom roots, DOM refs and provider styling", async () => {
  let element: HTMLElement | null = null;
  function Section(props: HTMLAttributes<HTMLElement>) {
    return <section {...props} />;
  }
  await render(
    <ConfigProvider
      direction="rtl"
      prefixCls="custom"
      flex={{ className: "provider", style: { padding: 3 } }}
    >
      <Flex
        component={Section}
        rootClassName="root"
        gap="middle"
        vertical
        ref={(node) => {
          element = node;
        }}
      >
        <span>Child</span>
      </Flex>
    </ConfigProvider>,
  );
  const section = container.querySelector("section");
  expect(element).toBe(section);
  expect(section?.textContent).toBe("Child");
  expect(section?.classList.contains("custom-flex")).toBe(true);
  expect(section?.classList.contains("provider")).toBe(true);
  expect(section?.classList.contains("root")).toBe(true);
  expect(section?.style.gap).toBe("16px");
  expect(section?.style.direction).toBe("rtl");
  expect(section?.style.padding).toBe("3px");
  await act(() =>
    root?.render(
      <Flex component="article" wrap="wrap-reverse">
        Text
      </Flex>,
    ),
  );
  expect(container.firstElementChild?.tagName).toBe("ARTICLE");
  expect((container.firstElementChild as HTMLElement).style.flexWrap).toBe(
    "wrap-reverse",
  );
});

it("Space applies item semantics, provider gap defaults and split order", async () => {
  await render(
    <ConfigProvider
      space={{
        size: 12,
        classNames: { item: "provider-item" },
        styles: { item: { color: "red", padding: 2 } },
      }}
    >
      <Space
        prefixCls="custom-space"
        rootClassName="root"
        classNames={{ item: "local-item" }}
        styles={{ item: { color: "blue" } }}
        split="/"
      >
        <span>A</span>
        {null}
        <span>B</span>
      </Space>
    </ConfigProvider>,
  );
  const space = container.firstElementChild as HTMLElement;
  expect(space.classList.contains("custom-space")).toBe(true);
  expect(space.classList.contains("root")).toBe(true);
  expect(space.style.columnGap).toBe("12px");
  expect([...space.children].map((node) => node.textContent)).toEqual([
    "A",
    "/",
    "B",
  ]);
  const item = space.firstElementChild as HTMLElement;
  expect(item.classList.contains("local-item")).toBe(true);
  expect(item.classList.contains("provider-item")).toBe(false);
  expect(item.style.color).toBe("blue");
  expect(item.style.padding).toBe("2px");
  await act(() =>
    root?.render(
      <Space>
        {null}
        {false}
      </Space>,
    ),
  );
  expect(container.childElementCount).toBe(0);
});

it("Divider supports size inheritance, variants and default margins", async () => {
  await render(
    <ConfigProvider componentSize="small" divider={{ className: "provider" }}>
      <Divider variant="dotted" rootClassName="root" />
      <Divider size="middle" />
      <Divider size="large" dashed />
      <Divider size="large">Text</Divider>
    </ConfigProvider>,
  );
  const dividers = [...container.querySelectorAll<HTMLElement>(".ant-divider")];
  expect(
    dividers.map((node) => node.style.getPropertyValue("--ao-divider-margin")),
  ).toEqual(["8px", "16px", "24px", "16px"]);
  expect(dividers[0].classList.contains("ant-divider-sm")).toBe(true);
  expect(dividers[0].classList.contains("provider")).toBe(true);
  expect(dividers[0].classList.contains("root")).toBe(true);
  expect(dividers[0].style.getPropertyValue("--ao-divider-style")).toBe(
    "dotted",
  );
  expect(dividers[2].style.getPropertyValue("--ao-divider-style")).toBe(
    "dashed",
  );
});

it("Divider maps physical positions in RTL and applies numeric strings to the text", async () => {
  await render(
    <ConfigProvider direction="rtl">
      <Divider orientation="left" orientationMargin="0">
        Left
      </Divider>
      <Divider orientation="start" orientationMargin={50}>
        Start
      </Divider>
      <Divider orientation="center" orientationMargin={50}>
        Center
      </Divider>
    </ConfigProvider>,
  );
  const dividers = [...container.querySelectorAll<HTMLElement>(".ant-divider")];
  const texts = [
    ...container.querySelectorAll<HTMLElement>(".ant-divider-inner-text"),
  ];
  expect(dividers[0].classList.contains("ant-divider-with-text-end")).toBe(
    true,
  );
  expect(dividers[0].classList.contains("ant-divider-rtl")).toBe(true);
  expect(dividers[0].style.direction).toBe("");
  expect(texts[0].style.marginInlineEnd).toMatch(/^0(?:px)?$/);
  expect(texts[0].style.paddingInlineEnd).toMatch(/^0(?:px)?$/);
  expect(dividers[0].style.getPropertyValue("--ao-divider-edge")).toBe("0%");
  expect(dividers[1].classList.contains("ant-divider-with-text-start")).toBe(
    true,
  );
  expect(texts[1].style.marginInlineStart).toBe("50px");
  expect(texts[2].style.marginInlineStart).toBe("");
  expect(dividers[2].style.getPropertyValue("--ao-divider-edge")).toBe("5%");
});

it("Grid accepts CSS gutters and exposes native Row and Col refs", async () => {
  let row: HTMLDivElement | null = null;
  let col: HTMLDivElement | null = null;
  await render(
    <ConfigProvider
      prefixCls="custom"
      row={{ className: "configured-row" }}
      col={{ style: { color: "red" } }}
    >
      <Row
        gutter={["2rem", "1em"]}
        ref={(node) => {
          row = node;
        }}
      >
        <Col
          span={12}
          ref={(node) => {
            col = node;
          }}
        >
          A
        </Col>
        <Col span={12}>B</Col>
      </Row>
    </ConfigProvider>,
  );
  const rowElement = container.querySelector<HTMLElement>(".ant-row");
  const colElement = container.querySelector<HTMLElement>(".ant-col");
  expect(rowElement).toBe(row);
  expect(colElement).toBe(col);
  expect(rowElement?.classList.contains("custom-row")).toBe(true);
  expect(rowElement?.classList.contains("configured-row")).toBe(true);
  expect(rowElement?.style.marginInline).toBe("calc(2rem / -2)");
  expect(rowElement?.style.rowGap).toBe("1em");
  expect(colElement?.style.paddingInline).toBe("calc(2rem / 2)");
  expect(colElement?.style.color).toBe("red");
});

it("Grid accepts numeric string spans and responsive string spans", async () => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("max-width"),
    addEventListener() {},
    removeEventListener() {},
  }));
  await render(
    <Row>
      <Col span="12" offset="6">
        Numeric strings
      </Col>
    </Row>,
  );
  const col = container.querySelector<HTMLElement>(".ant-col");
  expect(col?.style.flex).toBe("0 0 50%");
  expect(col?.style.marginInlineStart).toBe("25%");
  await act(() =>
    root?.render(
      <Row>
        <Col xs="8">Responsive string</Col>
      </Row>,
    ),
  );
  expect(container.querySelector<HTMLElement>(".ant-col")?.style.flex).toBe(
    "0 0 33.33333333333333%",
  );
});

it("Layout renders semantic regions, DOM refs, prefix and context styles", async () => {
  let header: HTMLElement | null = null;
  await render(
    <ConfigProvider
      direction="rtl"
      prefixCls="custom"
      layout={{ className: "configured-layout", style: { color: "red" } }}
    >
      <Layout rootClassName="root-layout">
        <Layout.Sider width="240" collapsible>
          Side
        </Layout.Sider>
        <Layout>
          <Layout.Header
            ref={(node) => {
              header = node;
            }}
          >
            Header
          </Layout.Header>
          <Layout.Content>Body</Layout.Content>
          <Layout.Footer>Footer</Layout.Footer>
        </Layout>
      </Layout>
    </ConfigProvider>,
  );
  expect(container.querySelector("header")).toBe(header);
  expect(container.querySelector("main")?.textContent).toBe("Body");
  expect(container.querySelector("footer")?.textContent).toBe("Footer");
  const layout = container.querySelector<HTMLElement>(".ant-layout");
  expect(layout?.classList.contains("custom-layout-rtl")).toBe(true);
  expect(layout?.classList.contains("root-layout")).toBe(true);
  expect(layout?.style.color).toBe("red");
  expect(container.querySelector<HTMLElement>("aside")?.style.width).toBe(
    "240px",
  );
  expect(
    container.querySelector(".ant-layout-sider-trigger .anticon-right"),
  ).not.toBeNull();
});

it("responsive zero-width Sider exposes its trigger without collapsible", async () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const onCollapse = vi.fn();
  const onBreakpoint = vi.fn();
  await render(
    <Layout.Sider
      breakpoint="md"
      collapsedWidth={0}
      onCollapse={onCollapse}
      onBreakpoint={onBreakpoint}
      zeroWidthTriggerStyle={{ top: 12, backgroundColor: "red" }}
    >
      Side
    </Layout.Sider>,
  );
  expect(onBreakpoint).toHaveBeenCalledWith(true);
  expect(onCollapse).toHaveBeenCalledWith(true, "responsive");
  const trigger = container.querySelector<HTMLButtonElement>(
    ".ant-layout-sider-zero-width-trigger",
  );
  expect(trigger?.style.top).toBe("12px");
  expect(trigger?.style.backgroundColor).toBe("red");
  expect(container.querySelector<HTMLElement>("aside")?.style.width).toBe(
    "0px",
  );
  await act(() => trigger?.click());
  expect(onCollapse).toHaveBeenLastCalledWith(false, "clickTrigger");
  expect(container.querySelector<HTMLElement>("aside")?.style.width).toBe(
    "200px",
  );
});

it("Sider collapse controls nested Menu while explicit inlineCollapsed takes precedence", async () => {
  const items = [
    {
      key: "parent",
      label: "Parent",
      children: [{ key: "child", label: "Child" }],
    },
  ];
  await render(
    <Layout.Sider collapsible>
      <Menu mode="inline" defaultOpenKeys={["parent"]} items={items} />
    </Layout.Sider>,
  );
  expect(container.querySelector(".ant-menu-sub")).not.toBeNull();
  await act(() =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="收起侧栏"]')
      ?.click(),
  );
  expect(container.querySelector(".ant-menu-inline-collapsed")).not.toBeNull();
  expect(container.querySelector(".ant-menu-sub")).toBeNull();
  await act(() =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="展开侧栏"]')
      ?.click(),
  );
  expect(container.querySelector(".ant-menu-inline-collapsed")).toBeNull();
  expect(container.querySelector(".ant-menu-sub")).not.toBeNull();
  await act(() =>
    root?.render(
      <Layout.Sider collapsed>
        <Menu
          mode="inline"
          inlineCollapsed={false}
          defaultOpenKeys={["parent"]}
          items={items}
        />
      </Layout.Sider>,
    ),
  );
  expect(container.querySelector(".ant-menu-inline-collapsed")).toBeNull();
  expect(container.querySelector(".ant-menu-sub")).not.toBeNull();
});
it("initially collapsed Menu honors defaultOpenKeys as popup submenus", async () => {
  await render(
    <Layout.Sider collapsed>
      <Menu
        mode="inline"
        defaultOpenKeys={["parent"]}
        items={[
          {
            key: "parent",
            label: "Parent",
            children: [{ key: "child", label: "Child" }],
          },
        ]}
      />
    </Layout.Sider>,
  );
  expect(container.querySelector(".ant-menu-inline-collapsed")).not.toBeNull();
  expect(document.querySelector<HTMLElement>(".ant-dropdown")?.hidden).toBe(
    false,
  );
  expect(document.querySelector(".ant-menu-popup-menu")?.textContent).toContain(
    "Child",
  );
  await act(() =>
    root?.render(
      <Layout.Sider collapsed={false}>
        <Menu
          mode="inline"
          defaultOpenKeys={["parent"]}
          items={[
            {
              key: "parent",
              label: "Parent",
              children: [{ key: "child", label: "Child" }],
            },
          ]}
        />
      </Layout.Sider>,
    ),
  );
  expect(container.querySelector(".ant-menu-sub")).not.toBeNull();
});

function splitterDimension() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(600);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(300);
}
it("Splitter collapses past min and restores the previous distribution", async () => {
  splitterDimension();
  const onCollapse = vi.fn();
  const onResize = vi.fn();
  const onResizeEnd = vi.fn();
  const onResizeStart = vi.fn();
  await render(
    <Splitter
      onCollapse={onCollapse}
      onResize={onResize}
      onResizeEnd={onResizeEnd}
      onResizeStart={onResizeStart}
    >
      <Splitter.Panel defaultSize="40%" min="20%" collapsible>
        First
      </Splitter.Panel>
      <Splitter.Panel collapsible>Second</Splitter.Panel>
    </Splitter>,
  );
  await act(() =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="收起面板 1"]')
      ?.click(),
  );
  expect(onCollapse).toHaveBeenLastCalledWith([true, false], [0, 600]);
  expect(
    container.querySelector<HTMLElement>(".ant-splitter-panel")?.style
      .flexBasis,
  ).toBe("0px");
  expect(container.querySelector(".ant-splitter-panel-hidden")).not.toBeNull();
  expect(
    container.querySelector("[role=separator]")?.getAttribute("aria-disabled"),
  ).toBe("true");
  await act(() =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="展开面板 1"]')
      ?.click(),
  );
  expect(onCollapse).toHaveBeenLastCalledWith([false, false], [240, 360]);
  expect(onResize).toHaveBeenLastCalledWith([240, 360]);
  expect(onResizeEnd).toHaveBeenLastCalledWith([240, 360]);
  expect(onResizeStart).not.toHaveBeenCalled();
});

it("Splitter keeps controlled panels fixed and honors icon visibility", async () => {
  splitterDimension();
  const onCollapse = vi.fn();
  await render(
    <Splitter onCollapse={onCollapse}>
      <Splitter.Panel
        size={200}
        collapsible={{ end: true, showCollapsibleIcon: true }}
      >
        First
      </Splitter.Panel>
      <Splitter.Panel
        size={400}
        collapsible={{ start: true, showCollapsibleIcon: false }}
      >
        Second
      </Splitter.Panel>
    </Splitter>,
  );
  expect(
    container.querySelectorAll(".ant-splitter-bar-collapse-bar"),
  ).toHaveLength(2);
  expect(
    container.querySelectorAll(".ant-splitter-bar-collapse-bar-always-hidden"),
  ).toHaveLength(1);
  await act(() =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="收起面板 1"]')
      ?.click(),
  );
  expect(onCollapse).toHaveBeenCalledWith([true, false], [0, 600]);
  expect(
    container.querySelector<HTMLElement>(".ant-splitter-panel")?.style
      .flexBasis,
  ).toBe("200px");
});

it("lazy Splitter shows a constrained preview then applies size only on release", async () => {
  splitterDimension();
  const onResize = vi.fn();
  const onResizeEnd = vi.fn();
  await render(
    <ConfigProvider direction="rtl">
      <Splitter lazy onResize={onResize} onResizeEnd={onResizeEnd}>
        <Splitter.Panel defaultSize="40%" max="50%">
          First
        </Splitter.Panel>
        <Splitter.Panel>Second</Splitter.Panel>
      </Splitter>
    </ConfigProvider>,
  );
  const handle = container.querySelector("[role=separator]");
  await act(() =>
    handle?.dispatchEvent(
      new PointerEvent("pointerdown", {
        clientX: 100,
        pointerId: 1,
        button: 0,
        bubbles: true,
      }),
    ),
  );
  await act(() =>
    document.dispatchEvent(
      new PointerEvent("pointermove", { clientX: 0, pointerId: 1 }),
    ),
  );
  expect(
    container.querySelector<HTMLElement>(".ant-splitter-panel")?.style
      .flexBasis,
  ).toBe("240px");
  expect(
    container.querySelector<HTMLElement>(".ant-splitter-bar-preview")?.style
      .transform,
  ).toBe("translateX(-60px)");
  expect(onResize).not.toHaveBeenCalled();
  await act(() =>
    document.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 })),
  );
  expect(
    container.querySelector<HTMLElement>(".ant-splitter-panel")?.style
      .flexBasis,
  ).toBe("300px");
  expect(container.querySelector(".ant-splitter-bar-preview")).toBeNull();
  expect(onResizeEnd).toHaveBeenCalledWith([300, 300]);
  expect(onResize).not.toHaveBeenCalled();
  expect(document.body.style.userSelect).toBe("");
});
