import { act, createRoot, type Root } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Table } from "../packages/antd-octane/src/table";

let root: Root;
let container: HTMLDivElement;
const dataSource = Array.from({ length: 30 }, (_, key) => ({ key }));
const columns = [{ dataIndex: "key", title: "Key" }];
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
});
async function selectTwenty() {
  const trigger = container.querySelector<HTMLElement>('[role="combobox"]');
  if (!trigger) throw Error("Missing page size selector");
  await act(() => trigger.click());
  const option = [
    ...document.querySelectorAll<HTMLElement>('[role="option"]'),
  ].find((element) => element.textContent?.includes("20"));
  if (!option) throw Error("Missing 20 rows option");
  await act(() => option.click());
}
it("uses defaultPageSize only to initialize uncontrolled pagination", async () => {
  const change = vi.fn();
  await act(() =>
    root.render(
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        onChange={change}
      />,
    ),
  );
  expect(container.querySelectorAll("tbody tr.ant-table-row")).toHaveLength(10);
  await selectTwenty();
  expect(change.mock.lastCall?.[0].pageSize).toBe(20);
  expect(container.querySelectorAll("tbody tr.ant-table-row")).toHaveLength(20);
});
it("keeps controlled pageSize until the parent updates it", async () => {
  const change = vi.fn();
  await act(() =>
    root.render(
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10, defaultPageSize: 5, showSizeChanger: true }}
        onChange={change}
      />,
    ),
  );
  await selectTwenty();
  expect(change.mock.lastCall?.[0].pageSize).toBe(20);
  expect(container.querySelectorAll("tbody tr.ant-table-row")).toHaveLength(10);
  await act(() =>
    root.render(
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 20, defaultPageSize: 5, showSizeChanger: true }}
      />,
    ),
  );
  expect(container.querySelectorAll("tbody tr.ant-table-row")).toHaveLength(20);
});
