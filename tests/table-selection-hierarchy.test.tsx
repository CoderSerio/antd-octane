import { act, createRoot } from "octane";
import { expect, it } from "vitest";
import { Table } from "../packages/antd-octane/src/table";

it("propagates partial descendant selection to every ancestor", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const dataSource = [
    {
      key: "root",
      children: [{ key: "branch", children: [{ key: "a" }, { key: "b" }] }],
    },
  ];
  const renderSelection = (selectedRowKeys: string[]) =>
    act(() =>
      root.render(
        <Table
          dataSource={dataSource}
          columns={[{ dataIndex: "key", title: "Key" }]}
          pagination={false}
          expandable={{ defaultExpandAllRows: true }}
          rowSelection={{ checkStrictly: false, selectedRowKeys }}
        />,
      ),
    );
  const checkbox = (key: string) => {
    const row = container.querySelector(`tr[data-row-key="${key}"]`);
    if (!row) throw Error(`Missing ${key} row`);
    return row;
  };
  try {
    await renderSelection(["a"]);
    for (const key of ["root", "branch"]) {
      expect(
        checkbox(key).querySelector(".ant-checkbox-indeterminate"),
      ).not.toBeNull();
      expect(
        checkbox(key).querySelector<HTMLInputElement>('input[type="checkbox"]')
          ?.checked,
      ).toBe(false);
    }
    await renderSelection(["a", "b"]);
    for (const key of ["root", "branch"]) {
      expect(
        checkbox(key).querySelector(".ant-checkbox-indeterminate"),
      ).toBeNull();
      expect(
        checkbox(key).querySelector<HTMLInputElement>('input[type="checkbox"]')
          ?.checked,
      ).toBe(true);
    }
    await renderSelection([]);
    for (const key of ["root", "branch"]) {
      expect(
        checkbox(key).querySelector(".ant-checkbox-indeterminate"),
      ).toBeNull();
      expect(
        checkbox(key).querySelector<HTMLInputElement>('input[type="checkbox"]')
          ?.checked,
      ).toBe(false);
    }
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
