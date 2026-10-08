import { act, createRoot, type Root } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Table } from "../packages/antd-octane/src/table";

let root: Root;
let container: HTMLDivElement;
const dataSource = [{ key: "device-1", name: "含水仪 01" }];
const columns = [{ dataIndex: "name", title: "设备名称" }];
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
});

it.each([
  "checkbox",
  "radio",
] as const)("preserves custom row %s labels and restores the default when removed", async (type) => {
  const change = vi.fn();
  const render = (custom: boolean) =>
    act(() =>
      root.render(
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowSelection={{
            type,
            getCheckboxProps: (record) => ({
              "aria-label": custom ? `选择${record.name}` : undefined,
            }),
            onChange: change,
          }}
        />,
      ),
    );
  await render(true);
  const input = container.querySelector<HTMLInputElement>(
    `tbody input[type="${type}"]`,
  );
  expect(input?.getAttribute("aria-label")).toBe("选择含水仪 01");
  if (!input) throw Error("Missing row selection input");
  await act(() => input.click());
  expect(change.mock.lastCall?.[0]).toEqual(["device-1"]);
  await render(false);
  expect(
    container
      .querySelector(`tbody input[type="${type}"]`)
      ?.getAttribute("aria-label"),
  ).toBe("Select row 1");
});

it("prioritizes the title checkbox label over locale and retains both fallbacks", async () => {
  const change = vi.fn();
  const render = (label?: string, selectAll?: string) =>
    act(() =>
      root.render(
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          locale={{ selectAll }}
          rowSelection={{
            getTitleCheckboxProps: () => ({ "aria-label": label }),
            onChange: change,
          }}
        />,
      ),
    );
  const title = () =>
    container.querySelector<HTMLInputElement>('thead input[type="checkbox"]');
  await render("选择本页设备", "本页全选");
  expect(title()?.getAttribute("aria-label")).toBe("选择本页设备");
  const input = title();
  if (!input) throw Error("Missing title selection input");
  await act(() => input.click());
  expect(change.mock.lastCall?.[0]).toEqual(["device-1"]);
  await render(undefined, "本页全选");
  expect(title()?.getAttribute("aria-label")).toBe("本页全选");
  await render();
  expect(title()?.getAttribute("aria-label")).toBe("Select current page");
});
