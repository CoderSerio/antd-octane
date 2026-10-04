import type { ElementDescriptor, OctaneNode, Root } from "octane";
import { act, createRoot, Fragment } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Avatar,
  Card,
  Carousel,
  Collapse,
  ConfigProvider,
  Descriptions,
  Empty,
  Form,
  QRCode,
  Statistic,
  Table,
  type TableProps,
  Tree,
  type TreeRef,
} from "../packages/antd-octane/src";
import type {
  LegacyPanelProps,
} from "../packages/antd-octane/src/collapse/CollapsePanel";

let root: Root | undefined;

let container: HTMLDivElement;

async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}

async function update(node: ElementDescriptor) {
  await act(() => root?.render(node));
}

function element<T extends HTMLElement = HTMLElement>(selector: string): T {
  const node = container.querySelector<T>(selector);
  if (!node) throw Error(`Missing ${selector}`);
  return node;
}

const tableLayoutCases: {
  name: string;
  props: TableProps<{ key: string; name: string }>;
  expected: "auto" | "fixed";
}[] = [
  { name: "plain", props: {}, expected: "auto" },
  { name: "vertical scroll", props: { scroll: { y: 120 } }, expected: "fixed" },
  { name: "sticky", props: { sticky: true }, expected: "fixed" },
  {
    name: "ellipsis",
    props: { columns: [{ dataIndex: "name", ellipsis: true }] },
    expected: "fixed",
  },
  {
    name: "horizontal scroll without fixed columns",
    props: { scroll: { x: 600 } },
    expected: "auto",
  },
  {
    name: "fixed column with horizontal scroll",
    props: {
      columns: [{ dataIndex: "name", fixed: "left" }],
      scroll: { x: 600 },
    },
    expected: "fixed",
  },
  {
    name: "fixed column without horizontal scroll",
    props: { columns: [{ dataIndex: "name", fixed: "left" }] },
    expected: "auto",
  },
  {
    name: "max-content fixed column",
    props: {
      columns: [{ dataIndex: "name", fixed: "left" }],
      scroll: { x: "max-content" },
    },
    expected: "auto",
  },
  {
    name: "max-content preceding vertical scroll and ellipsis",
    props: {
      columns: [{ dataIndex: "name", fixed: "left", ellipsis: true }],
      scroll: { x: "max-content", y: 120 },
    },
    expected: "auto",
  },
  {
    name: "fixed selection column",
    props: { rowSelection: { fixed: true }, scroll: { x: 600 } },
    expected: "fixed",
  },
  {
    name: "fixed expansion column",
    props: { expandable: { fixed: true, expandedRowRender: () => "Detail" } },
    expected: "fixed",
  },
  {
    name: "explicit auto preceding ellipsis",
    props: {
      tableLayout: "auto",
      columns: [{ dataIndex: "name", ellipsis: true }],
    },
    expected: "auto",
  },
  {
    name: "explicit auto preceding scroll and sticky",
    props: { tableLayout: "auto", sticky: true, scroll: { y: 120 } },
    expected: "auto",
  },
  {
    name: "explicit fixed",
    props: { tableLayout: "fixed" },
    expected: "fixed",
  },
];

afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it.each(
  tableLayoutCases,
)("Table applies the upstream layout default for $name", async ({
  props,
  expected,
}) => {
  await render(
    <Table
      pagination={false}
      columns={[{ title: "Name", dataIndex: "name" }]}
      dataSource={[{ key: "one", name: "One" }]}
      {...props}
    />,
  );
  const tables = container.querySelectorAll<HTMLTableElement>(
    ".ant-table-container table",
  );
  expect(tables.length).toBeGreaterThan(0);
  tables.forEach((table) => {
    expect(table.style.tableLayout).toBe(expected);
  });
});

it("Table renders upstream caret geometry only for configured sort directions", async () => {
  await render(
    <Table
      pagination={false}
      columns={[
        {
          title: "Age",
          dataIndex: "age",
          sorter: true,
          sortDirections: ["ascend"],
        },
      ]}
      dataSource={[{ key: "one", age: 28 }]}
    />,
  );
  expect(element(".ant-table-column-sorter-up path").getAttribute("d")).toBe(
    "M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z",
  );
  expect(container.querySelector(".ant-table-column-sorter-down")).toBeNull();
  await act(() =>
    element<HTMLButtonElement>("button.ant-table-column-title").click(),
  );
  expect(
    element(".ant-table-column-sorter-up").classList.contains("active"),
  ).toBe(true);
});

// These exercise native runtime behavior from the antd 5.29.3 source audit;
// they are regression cases, not complete API or visual certification.
it("Tree keeps the rc-virtual-list range around a ref scroll target", async () => {
  const ref: { current: TreeRef | null } = { current: null };
  const treeData = Array.from({ length: 200 }, (_, index) => ({
    key: index,
    title: `Node ${index}`,
  }));
  await render(
    <Tree ref={ref} treeData={treeData} height={192} itemHeight={28} virtual />,
  );
  expect(container.querySelectorAll(".ant-tree-title")).toHaveLength(8);
  await act(() => ref.current?.scrollTo({ key: 150, align: "top" }));
  expect(
    [...container.querySelectorAll(".ant-tree-title")].map(
      (node) => node.textContent,
    ),
  ).toEqual(Array.from({ length: 9 }, (_, index) => `Node ${149 + index}`));
  await act(() => ref.current?.scrollTo({ key: 0, align: "top" }));
  expect(element(".ant-tree-title").textContent).toBe("Node 0");
});

it("Tree reads Fragment-wrapped legacy nodes at every depth", async () => {
  await render(
    <Tree defaultExpandAll>
      <Fragment key="root-fragment">
        <Tree.TreeNode key="parent" title="Parent">
          <Fragment key="child-fragment">
            <Tree.TreeNode key="child" title="Child" />
          </Fragment>
        </Tree.TreeNode>
        <Tree.TreeNode key="sibling" title="Sibling" />
      </Fragment>
    </Tree>,
  );
  expect(
    [...container.querySelectorAll(".ant-tree-title")].map(
      (node) => node.textContent,
    ),
  ).toEqual(["Parent", "Child", "Sibling"]);
  expect(container.querySelectorAll('[role="treeitem"]')).toHaveLength(3);
});

it("Tree gives a function node title precedence over titleRender", async () => {
  const title = vi.fn((node: { key?: string | number }) => `Own ${node.key}`);
  const titleRender = vi.fn((node: { key?: string | number }) => (
    <b>Shared {node.key}</b>
  ));
  await render(
    <Tree
      treeData={[
        { key: "a", title },
        { key: "b", title: "Plain" },
      ]}
      titleRender={titleRender}
    />,
  );
  expect(
    [...container.querySelectorAll(".ant-tree-title")].map(
      (node) => node.textContent,
    ),
  ).toEqual(["Own a", "Shared b"]);
  expect(title).toHaveBeenCalledWith(expect.objectContaining({ key: "a" }));
  expect(titleRender).toHaveBeenCalledTimes(1);
  expect(titleRender).toHaveBeenCalledWith(
    expect.objectContaining({ key: "b" }),
  );
});

it("DirectoryTree retains the last controlled selection and expansion when props are removed", async () => {
  const data = [
    {
      key: "parent",
      title: "Parent",
      children: [{ key: "child", title: "Child", isLeaf: true }],
    },
  ];
  await render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Tree.DirectoryTree
        treeData={data}
        selectedKeys={["parent"]}
        expandedKeys={[]}
      />
    </ConfigProvider>,
  );
  await update(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Tree.DirectoryTree
        treeData={data}
        selectedKeys={["child"]}
        expandedKeys={["parent"]}
      />
    </ConfigProvider>,
  );
  await update(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Tree.DirectoryTree treeData={data} />
    </ConfigProvider>,
  );
  expect(container.querySelectorAll('[role="treeitem"]')).toHaveLength(2);
  expect(
    element('[role="treeitem"][aria-selected="true"] .ant-tree-title')
      .textContent,
  ).toBe("Child");
  expect(
    element('[role="treeitem"][aria-level="1"]').getAttribute("aria-expanded"),
  ).toBe("true");
  await act(() => element<HTMLButtonElement>(".ant-tree-switcher").click());
  expect(container.querySelectorAll('[role="treeitem"]')).toHaveLength(1);
});

it("Table only enables virtualization through its own virtual prop", async () => {
  const data = Array.from({ length: 40 }, (_, index) => ({
    key: index,
    name: `Row ${index}`,
  }));
  const columns = [{ key: "name", title: "Name", dataIndex: "name" }];
  await render(
    <ConfigProvider virtual>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{ y: 100 }}
      />
    </ConfigProvider>,
  );
  expect(container.querySelector(".ant-table-virtual")).toBeNull();
  expect(container.querySelectorAll("tbody [data-row-key]")).toHaveLength(40);
  await update(
    <ConfigProvider virtual={false}>
      <Table
        virtual
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{ y: 100 }}
      />
    </ConfigProvider>,
  );
  expect(container.querySelector(".ant-table-virtual")).not.toBeNull();
  expect(
    container.querySelectorAll("tbody [data-row-key]").length,
  ).toBeLessThan(40);
});

it("Table selection consumes renderCell, onCell and align without losing checkbox behavior", async () => {
  const record = { key: "a", name: "Ada" };
  const onChange = vi.fn();
  const renderCell = vi.fn(
    (
      checked: boolean,
      row: typeof record,
      index: number,
      origin: OctaneNode,
    ) => (
      <span data-selected={String(checked)} data-rendered-row={row.key}>
        {`${index}:`}
        {origin}
      </span>
    ),
  );
  const onCell = vi.fn(() => ({
    className: "selection-cell-custom",
    "data-cell": "selection",
    style: { backgroundColor: "rgb(1, 2, 3)" },
  }));
  await render(
    <Table
      dataSource={[record]}
      columns={[{ title: "Name", dataIndex: "name" }]}
      pagination={false}
      rowSelection={{ align: "right", renderCell, onCell, onChange }}
    />,
  );
  const cell = element<HTMLTableCellElement>(
    "tbody .ant-table-selection-column",
  );
  expect(cell.classList.contains("selection-cell-custom")).toBe(true);
  expect(cell.dataset.cell).toBe("selection");
  expect(cell.style.textAlign).toBe("right");
  expect(cell.style.backgroundColor).toBe("rgb(1, 2, 3)");
  expect(element("thead .ant-table-selection-column").style.textAlign).toBe(
    "right",
  );
  expect(onCell).toHaveBeenCalledWith(record, 0);
  expect(renderCell).toHaveBeenCalledWith(false, record, 0, expect.anything());
  await act(() => element<HTMLInputElement>("tbody input").click());
  expect(onChange).toHaveBeenCalledWith(["a"], [record], { type: "single" });
  expect(element("[data-rendered-row]").dataset.selected).toBe("true");
});

it("Table preserves empty selection renderCell results", async () => {
  const record = { key: "a", name: "Ada" };
  const columns = [{ title: "Name", dataIndex: "name" }];
  await render(
    <Table
      dataSource={[record]}
      columns={columns}
      pagination={false}
      rowSelection={{ renderCell: () => null }}
    />,
  );
  expect(element("tbody .ant-table-selection-column").textContent).toBe("");
  expect(container.querySelector("tbody input")).toBeNull();
  expect(container.querySelector("thead input")).not.toBeNull();
  expect(container.querySelector("tbody tr")?.textContent).toBe("Ada");
  await update(
    <Table
      dataSource={[record]}
      columns={columns}
      pagination={false}
      rowSelection={{ renderCell: () => undefined }}
    />,
  );
  expect(element("tbody .ant-table-selection-column").textContent).toBe("");
  expect(container.querySelector("tbody input")).toBeNull();
  expect(container.querySelector("thead input")).not.toBeNull();
});

it("Table omits zero-span selection and summary cells", async () => {
  await render(
    <Table
      dataSource={[
        { key: "a", name: "Ada" },
        { key: "b", name: "Lin" },
      ]}
      columns={[{ title: "Name", dataIndex: "name" }]}
      pagination={false}
      rowSelection={{
        onCell: (_, index) => (index === 0 ? { rowSpan: 0 } : { colSpan: 0 }),
      }}
      summary={() => (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={0}>
              Hidden
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>Total</Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />,
  );
  expect(
    container.querySelectorAll("tbody .ant-table-selection-column"),
  ).toHaveLength(0);
  expect(container.querySelectorAll("tbody tr td")).toHaveLength(2);
  expect(container.querySelectorAll("tfoot td")).toHaveLength(1);
  expect(element("tfoot").textContent).toBe("Total");
});

it("Table.Summary renders row/cell attributes and fixed position around the page data", async () => {
  const data = [{ key: "a", amount: 7 }];
  const summary = vi.fn((rows: readonly (typeof data)[number][]) => (
    <Table.Summary fixed="top">
      <Table.Summary.Row data-summary-row="total">
        <Table.Summary.Cell index={0} align="right" colSpan={2}>
          Total {rows.reduce((total, row) => total + row.amount, 0)}
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  ));
  await render(
    <Table
      dataSource={data}
      columns={[{ title: "Amount", dataIndex: "amount" }]}
      pagination={false}
      summary={summary}
    />,
  );
  expect(summary).toHaveBeenCalledWith(data);
  expect(element("tfoot").dataset.fixed).toBe("top");
  expect(element("tfoot tr").dataset.summaryRow).toBe("total");
  const cell = element<HTMLTableCellElement>("tfoot td");
  expect(cell.colSpan).toBe(2);
  expect(cell.style.textAlign).toBe("right");
  expect(cell.dataset.summaryIndex).toBe("0");
  expect(cell.textContent).toBe("Total 7");
});

it("Table tree filters cascade checks and highlight search matches without hiding nodes", async () => {
  const onChange = vi.fn();
  const data = [
    { key: "beijing", region: "north", city: "beijing", label: "Beijing" },
    { key: "harbin", region: "north", city: "harbin", label: "Harbin" },
    { key: "shanghai", region: "south", city: "shanghai", label: "Shanghai" },
    { key: "shenzhen", region: "south", city: "shenzhen", label: "Shenzhen" },
  ];
  await render(
    <Table
      dataSource={data}
      pagination={false}
      onChange={onChange}
      columns={[
        {
          key: "city",
          title: "City",
          dataIndex: "label",
          filterMode: "tree",
          filterSearch: true,
          filters: [
            {
              text: "North",
              value: "north",
              children: [
                { text: "Beijing", value: "beijing" },
                { text: "Harbin", value: "harbin" },
              ],
            },
            {
              text: "South",
              value: "south",
              children: [
                { text: "Shanghai", value: "shanghai" },
                { text: "Shenzhen", value: "shenzhen" },
              ],
            },
          ],
          onFilter: (value, record) =>
            value === record.region || value === record.city,
        },
      ]}
    />,
  );
  await act(() =>
    element<HTMLButtonElement>(".ant-table-filter-trigger").click(),
  );

  const treeNodes = () =>
    document.querySelectorAll(
      ".ant-table-filter-dropdown-tree [role='treeitem']",
    );
  const treeCheckbox = (title: string) => {
    const input = document.querySelector<HTMLInputElement>(
      `.ant-table-filter-dropdown-tree input[aria-label="Select ${title}"]`,
    );
    if (!input) throw Error(`Missing tree filter checkbox for ${title}`);
    return input;
  };
  const searchInput = document.querySelector<HTMLInputElement>(
    ".ant-table-filter-dropdown-search-input input",
  );
  if (!searchInput) throw Error("Missing tree filter search input");
  expect(searchInput.size).toBe(1);

  expect(treeNodes()).toHaveLength(6);
  await act(() => {
    searchInput.value = "Beijing";
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(treeNodes()).toHaveLength(6);
  expect(
    document.querySelectorAll(
      ".ant-table-filter-dropdown-tree .ant-tree-treenode.filter-node",
    ),
  ).toHaveLength(1);
  expect(
    document.querySelector(
      ".ant-table-filter-dropdown-tree .ant-tree-treenode.filter-node .ant-tree-title",
    )?.textContent,
  ).toBe("Beijing");

  const checkAll = document.querySelector<HTMLInputElement>(
    ".ant-table-filter-dropdown-checkall input",
  );
  if (!checkAll) throw Error("Missing tree filter check-all checkbox");
  await act(() => checkAll.click());
  expect(checkAll.checked).toBe(true);
  expect(treeCheckbox("North").checked).toBe(true);
  expect(treeCheckbox("Beijing").checked).toBe(true);
  expect(treeCheckbox("Harbin").checked).toBe(true);

  await act(() => checkAll.click());
  await act(() => treeCheckbox("North").click());
  expect(treeCheckbox("North").getAttribute("aria-checked")).toBe("true");
  expect(treeCheckbox("Beijing").checked).toBe(true);
  expect(treeCheckbox("Harbin").checked).toBe(true);
  await act(() => treeCheckbox("Beijing").click());
  expect(treeCheckbox("North").getAttribute("aria-checked")).toBe("mixed");
  expect(treeCheckbox("Harbin").checked).toBe(true);
  expect(treeCheckbox("Beijing").checked).toBe(false);

  const buttons = document.querySelectorAll<HTMLButtonElement>(
    ".ant-table-filter-dropdown-btns button",
  );
  await act(() => buttons[1]?.click());
  expect(onChange.mock.calls.at(-1)?.[1]).toEqual({ city: ["harbin"] });
  expect(
    [...container.querySelectorAll("tbody [data-row-key]")].map(
      (row) => row.textContent,
    ),
  ).toEqual(["Harbin"]);
});

it("Table menu filters use radio/check items and portal nested menus", async () => {
  const onChange = vi.fn();
  const data = [
    { key: "beijing", city: 101, label: "Beijing" },
    { key: "harbin", city: 102, label: "Harbin" },
    { key: "shanghai", city: 201, label: "Shanghai" },
  ];
  await render(
    <Table
      dataSource={data}
      pagination={false}
      onChange={onChange}
      columns={[
        {
          key: "city",
          title: "City",
          filterSearch: true,
          filters: [
            {
              text: "North",
              value: 100,
              children: [
                { text: "Beijing", value: 101 },
                { text: "Harbin", value: 102 },
              ],
            },
            {
              text: "South",
              value: 200,
              children: [{ text: "Shanghai", value: 201 }],
            },
          ],
          onFilter: (value, record) => value === record.city,
        },
      ]}
    />,
  );
  await act(() => element<HTMLElement>(".ant-table-filter-trigger").click());

  expect(
    document.querySelector(".ant-table-filter-dropdown-checkall"),
  ).toBeNull();
  expect(
    document.querySelectorAll(
      '.ant-table-filter-dropdown .ant-table-filter-menu-list > [role="none"]',
    ),
  ).toHaveLength(2);
  const north = document.querySelector<HTMLElement>(
    ".ant-table-filter-menu-list > .ant-menu-submenu [role=menuitem]",
  );
  if (!north) throw Error("Missing North filter submenu");
  await act(() => {
    north.focus();
    north.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
  });
  const submenu = document.querySelector<HTMLElement>(
    "body > .ant-table-filter-submenu-popup:not([hidden])",
  );
  if (!submenu) throw Error("Missing portal filter submenu");
  expect(submenu.querySelectorAll('[role="menuitem"]')).toHaveLength(2);
  await vi.waitFor(() => {
    expect(document.activeElement?.textContent).toContain("Beijing");
    expect(
      document.activeElement?.classList.contains("ant-menu-item-active"),
    ).toBe(true);
  });

  const menuItems = [
    ...submenu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
  ];
  const beijing = menuItems[0];
  const harbin = menuItems[1];
  if (!beijing || !harbin) throw Error("Missing North city menu items");
  await act(() => beijing.click());
  await act(() => harbin.click());
  expect(
    north
      .closest(".ant-menu-submenu")
      ?.classList.contains("ant-menu-submenu-selected"),
  ).toBe(true);
  expect(submenu.hidden).toBe(false);
  expect(
    document.querySelector(".ant-table-filter-popup")?.hasAttribute("hidden"),
  ).toBe(false);

  const footerButtons = document.querySelectorAll<HTMLElement>(
    ".ant-table-filter-dropdown-btns button",
  );
  await act(() => footerButtons[1]?.click());
  expect(onChange.mock.calls.at(-1)?.[1]).toEqual({ city: [101, 102] });
  expect(
    [...container.querySelectorAll("tbody [data-row-key]")].map((row) =>
      row.getAttribute("data-row-key"),
    ),
  ).toEqual(["beijing", "harbin"]);
});

it("Table menu search preserves parent submenus and single mode uses radios", async () => {
  const onChange = vi.fn();
  const data = [
    { key: "beijing", city: "beijing", label: "Beijing" },
    { key: "shanghai", city: "shanghai", label: "Shanghai" },
  ];
  const filters = [
    {
      text: "North",
      value: "north",
      children: [{ text: "Beijing", value: "beijing" }],
    },
    {
      text: "South",
      value: "south",
      children: [{ text: "Shanghai", value: "shanghai" }],
    },
  ];
  await render(
    <ConfigProvider direction="rtl">
      <Table
        dataSource={data}
        pagination={false}
        onChange={onChange}
        columns={[
          {
            key: "city",
            title: "City",
            filterSearch: true,
            filterMultiple: false,
            filters,
            onFilter: (value, record) => value === record.city,
          },
        ]}
      />
    </ConfigProvider>,
  );
  await act(() => element<HTMLElement>(".ant-table-filter-trigger").click());
  const searchInput = document.querySelector<HTMLInputElement>(
    ".ant-table-filter-dropdown-search-input input",
  );
  if (!searchInput) throw Error("Missing menu filter search input");
  await act(() => {
    searchInput.value = "Beijing";
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(
    [
      ...document.querySelectorAll(
        '.ant-table-filter-dropdown .ant-table-filter-menu-list > [role="none"]',
      ),
    ].map((item) => item.textContent?.trim()),
  ).toEqual(["North", "South"]);
  const submenuArrow = document.querySelector<SVGSVGElement>(
    ".ant-table-filter-menu-list .ant-menu-submenu-arrow svg",
  );
  expect(submenuArrow?.getAttribute("viewBox")).toBe("64 64 896 896");
  expect(submenuArrow?.style.transform).toBe("rotate(180deg)");
  const south = document.querySelector<HTMLElement>(
    ".ant-table-filter-menu-list > .ant-menu-submenu:nth-child(2) [role=menuitem]",
  );
  if (!south) throw Error("Missing preserved empty South submenu");
  const southTrigger = south.closest<HTMLElement>(".ao-floating-trigger");
  if (!southTrigger) throw Error("Missing South hover trigger");
  await act(async () => {
    southTrigger.dispatchEvent(new MouseEvent("mouseenter"));
    await new Promise((resolve) => setTimeout(resolve, 120));
  });
  const emptySubmenu = document.querySelector<HTMLElement>(
    "body > .ant-table-filter-submenu-popup:not([hidden])",
  );
  if (!emptySubmenu) throw Error("Missing searched South submenu portal");
  expect(emptySubmenu.querySelectorAll('[role="menuitem"]')).toHaveLength(0);
  await act(async () => {
    southTrigger.dispatchEvent(
      new MouseEvent("mouseleave", {
        bubbles: true,
        relatedTarget: document.body,
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 120));
  });
  expect(south.getAttribute("aria-expanded")).toBe("false");

  // Close and reopen with a single filter selection; it must not cascade or
  // expose a checkbox role.
  await act(() =>
    document.querySelector<HTMLElement>(".ant-table-filter-trigger")?.click(),
  );
  await act(() =>
    document.querySelector<HTMLElement>(".ant-table-filter-trigger")?.click(),
  );
  const north = document.querySelector<HTMLElement>(
    ".ant-table-filter-menu-list > .ant-menu-submenu [role=menuitem]",
  );
  if (!north) throw Error("Missing North filter submenu after reopen");
  await act(() => {
    north.focus();
    north.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
    );
  });
  const submenu = [
    ...document.querySelectorAll<HTMLElement>(
      "body > .ant-table-filter-submenu-popup:not([hidden])",
    ),
  ].find((popup) =>
    [...popup.querySelectorAll("[role='menuitem']")].some(
      (button) => button.textContent?.trim() === "Beijing",
    ),
  );
  if (!submenu) throw Error("Missing North submenu portal");
  const city = submenu.querySelector<HTMLElement>('[role="menuitem"]');
  if (!city) throw Error("Missing single-select menu item");
  expect(submenu.querySelector('input[type="radio"]')).not.toBeNull();
  expect(submenu.querySelector('input[type="checkbox"]')).toBeNull();
  await act(() =>
    city.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    ),
  );
  expect(north.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(north);

  await act(() => {
    north.focus();
    north.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
    );
  });
  const reopenedSubmenu = [
    ...document.querySelectorAll<HTMLElement>(
      "body > .ant-table-filter-submenu-popup:not([hidden])",
    ),
  ].find((popup) =>
    [...popup.querySelectorAll("[role='menuitem']")].some(
      (button) => button.textContent?.trim() === "Beijing",
    ),
  );
  const reopenedCity =
    reopenedSubmenu?.querySelector<HTMLElement>('[role="menuitem"]');
  if (!reopenedSubmenu || !reopenedCity)
    throw Error("Missing reopened single-select menu item");
  expect(reopenedSubmenu.querySelector('input[type="radio"]')).not.toBeNull();
  await act(() => reopenedCity.click());
  expect(north.getAttribute("aria-expanded")).toBe("false");
  expect(
    document.querySelector(".ant-table-filter-popup")?.hasAttribute("hidden"),
  ).toBe(false);

  await act(() => {
    north.focus();
    north.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
    );
  });
  const repeatedSubmenu = [
    ...document.querySelectorAll<HTMLElement>(
      "body > .ant-table-filter-submenu-popup:not([hidden])",
    ),
  ].find((popup) =>
    [...popup.querySelectorAll("[role='menuitem']")].some(
      (button) => button.textContent?.trim() === "Beijing",
    ),
  );
  const repeatedCity =
    repeatedSubmenu?.querySelector<HTMLElement>('[role="menuitem"]');
  if (!repeatedCity) throw Error("Missing repeated single-select menu item");
  await act(() => repeatedCity.click());
  expect(repeatedCity.classList.contains("ant-menu-item-selected")).toBe(true);

  const buttons = document.querySelectorAll<HTMLElement>(
    ".ant-table-filter-dropdown-btns button",
  );
  await act(() => buttons[1]?.click());
  expect(onChange.mock.calls.at(-1)?.[1]).toEqual({ city: ["beijing"] });
  expect(
    [...container.querySelectorAll("tbody [data-row-key]")].map((row) =>
      row.getAttribute("data-row-key"),
    ),
  ).toEqual(["beijing"]);
});

it("Table preserves null and false custom filterDropdown output", async () => {
  for (const customContent of [null, false]) {
    await render(
      <Table
        pagination={false}
        columns={[
          {
            key: "name",
            title: "Name",
            filters: [{ text: "Ada", value: "ada" }],
            filterDropdown: () => customContent,
          },
        ]}
      />,
    );
    await act(() =>
      element<HTMLButtonElement>(".ant-table-filter-trigger").click(),
    );
    expect(
      document.querySelector(
        ".ant-table-filter-dropdown .ant-table-filter-menu",
      ),
    ).toBeNull();
    expect(
      document.querySelector(".ant-table-filter-dropdown-btns"),
    ).toBeNull();
    await act(() => root?.unmount());
    root = undefined;
    container.remove();
  }
});

it("Table menu search uses the Table.filter empty renderer when no leaves match", async () => {
  const renderEmpty = vi.fn((name?: string) =>
    name === "Table.filter" ? <div data-filter-empty>Empty filters</div> : null,
  );
  await render(
    <ConfigProvider renderEmpty={renderEmpty}>
      <Table
        pagination={false}
        columns={[
          {
            key: "city",
            title: "City",
            filterSearch: true,
            filters: [
              { text: "Beijing", value: "beijing" },
              { text: "Shanghai", value: "shanghai" },
            ],
          },
        ]}
      />
    </ConfigProvider>,
  );
  await act(() =>
    element<HTMLButtonElement>(".ant-table-filter-trigger").click(),
  );
  const searchInput = document.querySelector<HTMLInputElement>(
    ".ant-table-filter-dropdown-search-input input",
  );
  if (!searchInput) throw Error("Missing menu filter search input");
  await act(() => {
    searchInput.value = "missing";
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(renderEmpty).toHaveBeenCalledWith("Table.filter");
  expect(document.querySelector("[data-filter-empty]")?.textContent).toBe(
    "Empty filters",
  );
  expect(
    document.querySelector(
      ".ant-table-filter-dropdown .ant-table-filter-menu-list",
    ),
  ).toBeNull();
});

it("Table filter portals retain component and alias tokens", async () => {
  await render(
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 9,
          paddingXS: 12,
          paddingXXS: 6,
          controlItemBgActive: "#eee6ff",
        },
        components: {
          Table: {
            borderColor: "#b37feb",
            filterDropdownBg: "#fff7e6",
            filterDropdownMenuBg: "#f6ffed",
          },
        },
      }}
    >
      <Table
        pagination={false}
        columns={[
          {
            key: "city",
            title: "City",
            filterMode: "tree",
            filterSearch: true,
            filters: [{ text: "Beijing", value: "beijing" }],
          },
        ]}
      />
    </ConfigProvider>,
  );
  await act(() =>
    element<HTMLButtonElement>(".ant-table-filter-trigger").click(),
  );
  const panel = document.querySelector<HTMLElement>(
    ".ant-table-filter-dropdown",
  );
  if (!panel) throw Error("Missing Table filter portal");
  expect(container.contains(panel)).toBe(false);
  expect(panel.style.getPropertyValue("--ao-table-border")).toBe("#b37feb");
  expect(panel.style.getPropertyValue("--ao-table-filter-dropdown-bg")).toBe(
    "#fff7e6",
  );
  expect(panel.style.getPropertyValue("--ao-table-filter-menu-bg")).toBe(
    "#f6ffed",
  );
  expect(panel.style.getPropertyValue("--ao-table-filter-radius")).toBe("9px");
  expect(panel.style.getPropertyValue("--ao-table-filter-padding")).toBe(
    "12px",
  );
  expect(panel.style.getPropertyValue("--ao-table-filter-active-bg")).toBe(
    "#eee6ff",
  );
  expect(
    panel
      .querySelector<HTMLElement>(".ant-table-filter-dropdown-search-input")
      ?.style.getPropertyValue("--ao-input-affix-gap"),
  ).toBe("6px");
});

it("Table tree filters keep controlled number keys and onFilter values at the Table API", async () => {
  const onChange = vi.fn();
  const onFilter = vi.fn(
    (value: string | number | boolean, record: { value: number }) =>
      value === record.value,
  );
  const data = [
    { key: "beijing", value: 101, label: "Beijing" },
    { key: "harbin", value: 102, label: "Harbin" },
  ];
  const filters = [
    {
      text: "North",
      value: 100,
      children: [
        { text: "Beijing", value: 101 },
        { text: "Harbin", value: 102 },
      ],
    },
  ];
  await render(
    <Table
      dataSource={data}
      pagination={false}
      onChange={onChange}
      columns={[
        {
          key: "city",
          title: "City",
          dataIndex: "label",
          filterMode: "tree",
          filteredValue: ["101"],
          filters,
          onFilter,
        },
      ]}
    />,
  );
  expect(
    [...container.querySelectorAll("tbody [data-row-key]")].map(
      (row) => row.textContent,
    ),
  ).toEqual(["Beijing"]);
  expect(onFilter).toHaveBeenCalledWith(101, data[0]);

  await act(() =>
    element<HTMLButtonElement>(".ant-table-filter-trigger").click(),
  );
  const treeCheckbox = (title: string) => {
    const input = document.querySelector<HTMLInputElement>(
      `.ant-table-filter-dropdown-tree input[aria-label="Select ${title}"]`,
    );
    if (!input) throw Error(`Missing tree filter checkbox for ${title}`);
    return input;
  };
  expect(treeCheckbox("Beijing").checked).toBe(true);
  expect(treeCheckbox("North").getAttribute("aria-checked")).toBe("mixed");
  await act(() => treeCheckbox("North").click());
  expect(treeCheckbox("North").checked).toBe(true);
  expect(treeCheckbox("Beijing").checked).toBe(true);
  expect(treeCheckbox("Harbin").checked).toBe(true);
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    ".ant-table-filter-dropdown-btns button",
  );
  await act(() => buttons[1]?.click());
  expect(onChange.mock.calls.at(-1)?.[1]).toEqual({ city: [100, 101, 102] });
  expect(onFilter).toHaveBeenCalledWith(100, data[0]);
  expect(onFilter).toHaveBeenCalledWith(101, data[0]);
  expect(onFilter).toHaveBeenCalledWith(102, data[1]);
});

it("Table tree filters use strict single checks and support Tree keyboard toggles", async () => {
  const onChange = vi.fn();
  const filters = [
    {
      text: "North",
      value: "north",
      children: [
        { text: "Beijing", value: "beijing" },
        { text: "Harbin", value: "harbin" },
      ],
    },
  ];
  await render(
    <Table
      dataSource={[
        { key: "beijing", city: "beijing", label: "Beijing" },
        { key: "harbin", city: "harbin", label: "Harbin" },
      ]}
      pagination={false}
      onChange={onChange}
      columns={[
        {
          key: "city",
          title: "City",
          dataIndex: "label",
          filterMode: "tree",
          filterMultiple: false,
          filters,
          onFilter: (value, record) => value === record.city,
        },
      ]}
    />,
  );
  await act(() =>
    element<HTMLButtonElement>(".ant-table-filter-trigger").click(),
  );
  const treeCheckbox = (title: string) => {
    const input = document.querySelector<HTMLInputElement>(
      `.ant-table-filter-dropdown-tree input[aria-label="Select ${title}"]`,
    );
    if (!input) throw Error(`Missing tree filter checkbox for ${title}`);
    return input;
  };
  const tree = document.querySelector<HTMLElement>(
    ".ant-table-filter-dropdown-tree .ant-tree-root",
  );
  if (!tree) throw Error("Missing tree filter keyboard target");
  await act(() => {
    tree.focus();
    tree.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
  });
  await act(() =>
    tree.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true }),
    ),
  );
  expect(treeCheckbox("North").checked).toBe(true);
  expect(treeCheckbox("Beijing").checked).toBe(false);
  expect(treeCheckbox("Harbin").checked).toBe(false);

  await act(() => treeCheckbox("Beijing").click());
  expect(treeCheckbox("North").checked).toBe(false);
  expect(treeCheckbox("Beijing").checked).toBe(true);
  expect(treeCheckbox("Harbin").checked).toBe(false);
  await act(() => treeCheckbox("Harbin").click());
  expect(treeCheckbox("Beijing").checked).toBe(false);
  expect(treeCheckbox("Harbin").checked).toBe(true);

  const buttons = document.querySelectorAll<HTMLButtonElement>(
    ".ant-table-filter-dropdown-btns button",
  );
  await act(() => buttons[1]?.click());
  expect(onChange.mock.calls.at(-1)?.[1]).toEqual({ city: ["harbin"] });
});

it("Card resolves its variant before deprecated bordered, then Form before provider defaults", async () => {
  await render(
    <ConfigProvider variant="outlined" card={{ variant: "outlined" }}>
      <Form variant="borderless">
        <Card data-card="inherited">Inherited</Card>
        <Card data-card="explicit" variant="outlined" bordered={false}>
          Explicit
        </Card>
        <Card data-card="legacy-true" bordered>
          Legacy true
        </Card>
      </Form>
      <Card data-card="provider">Provider</Card>
      <Card data-card="legacy-false" bordered={false}>
        Legacy false
      </Card>
    </ConfigProvider>,
  );
  for (const name of ["inherited", "legacy-true", "legacy-false"])
    expect(
      element(`[data-card="${name}"]`).classList.contains(
        "ant-card-borderless",
      ),
    ).toBe(true);
  for (const name of ["explicit", "provider"])
    expect(
      element(`[data-card="${name}"]`).classList.contains("ant-card-bordered"),
    ).toBe(true);
});

it("Collapse flattens legacy Panel Fragments and passes active state and click handling through custom wrappers", async () => {
  const change = vi.fn();
  const wrapperClick = vi.fn();
  function WrappedPanel(props: LegacyPanelProps) {
    return <Collapse.Panel {...props} />;
  }
  await render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Collapse defaultActiveKey={["a"]} onChange={change}>
        <Fragment key="panels-fragment">
          <Collapse.Panel key="a" header="First">
            First body
          </Collapse.Panel>
          <Fragment key="wrapper-fragment">
            <WrappedPanel key="b" header="Wrapped" onItemClick={wrapperClick}>
              Wrapped body
            </WrappedPanel>
          </Fragment>
          <p data-raw="kept">Raw child</p>
        </Fragment>
      </Collapse>
    </ConfigProvider>,
  );
  const headers = [
    ...container.querySelectorAll<HTMLElement>(".ant-collapse-header"),
  ];
  expect(headers).toHaveLength(2);
  expect(headers[0].getAttribute("aria-expanded")).toBe("true");
  expect(headers[1].getAttribute("aria-expanded")).toBe("false");
  expect(container.textContent).not.toContain("Wrapped body");
  expect(element("[data-raw]").textContent).toBe("Raw child");
  await act(() => headers[1].click());
  expect(change).toHaveBeenCalledWith(["a", "b"]);
  expect(wrapperClick).toHaveBeenCalledWith("b");
  expect(headers[1].getAttribute("aria-expanded")).toBe("true");
  expect(container.textContent).toContain("Wrapped body");
});

it("Descriptions consumes nested Fragment Items, including filled spans", async () => {
  await render(
    <Descriptions column={2} bordered>
      <Fragment key="items-fragment">
        <Descriptions.Item key="a" label="Name">
          Ada
        </Descriptions.Item>
        <Fragment key="nested-item-fragment">
          <Descriptions.Item key="b" label="Role" span="filled">
            Developer
          </Descriptions.Item>
        </Fragment>
      </Fragment>
    </Descriptions>,
  );
  expect(
    container.querySelectorAll(".ant-descriptions-item-label"),
  ).toHaveLength(2);
  expect(container.textContent).toContain("NameAda");
  expect(container.textContent).toContain("RoleDeveloper");
  expect(container.querySelectorAll("tbody tr")).toHaveLength(1);
});

it("Carousel uses cssEase ease by default independently from the JavaScript easing prop", async () => {
  await render(
    <Carousel easing="linear">
      <div>First</div>
      <div>Second</div>
    </Carousel>,
  );
  expect(element(".slick-track").style.transition).toBe("transform 500ms ease");
  await update(
    <Carousel easing="linear" cssEase="ease-in">
      <div>First</div>
      <div>Second</div>
    </Carousel>,
  );
  expect(element(".slick-track").style.transition).toBe(
    "transform 500ms ease-in",
  );
});

it("display components consume locale text and nested component Tokens in rendered native styles", async () => {
  const refresh = vi.fn();
  await render(
    <ConfigProvider
      locale={{
        locale: "en-test",
        Empty: { description: "No records" },
        QRCode: { expired: "Expired code", refresh: "Retry code" },
      }}
      theme={{
        components: {
          Avatar: { containerSize: 52 },
          Statistic: { titleFontSize: 19, contentFontSize: 37 },
        },
      }}
    >
      <Empty />
      <QRCode
        type="svg"
        value="native-regression"
        status="expired"
        onRefresh={refresh}
      />
      <Avatar>Outer</Avatar>
      <ConfigProvider theme={{ components: { Avatar: { containerSize: 28 } } }}>
        <Avatar>Inner</Avatar>
        <Statistic title="Total" value={7} />
      </ConfigProvider>
    </ConfigProvider>,
  );
  expect(element(".ant-empty-description").textContent).toBe("No records");
  expect(element(".ant-qrcode-expired").textContent).toContain("Expired code");
  expect(container.textContent).toContain("Retry code");
  await act(() =>
    element<HTMLButtonElement>(".ant-qrcode-mask button").click(),
  );
  expect(refresh).toHaveBeenCalledTimes(1);
  const avatars = [...container.querySelectorAll<HTMLElement>(".ant-avatar")];
  expect(avatars[0].style.getPropertyValue("--ao-avatar-size")).toBe("52px");
  expect(avatars[1].style.getPropertyValue("--ao-avatar-size")).toBe("28px");
  const statistic = element(".ant-statistic");
  expect(statistic.style.getPropertyValue("--ao-statistic-title-size")).toBe(
    "19px",
  );
  expect(statistic.style.getPropertyValue("--ao-statistic-content-size")).toBe(
    "37px",
  );
  expect(element(".ant-statistic-content-value").textContent).toBe("7");
});
