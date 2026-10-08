import { Table, type TableProps } from "antd-octane";
import { useState } from "octane";

type RecordRow = { key: string; name: string; hours: number };
const data: RecordRow[] = [
  { key: "alice", name: "Alice", hours: 12 },
  { key: "bob", name: "Bob", hours: 8 },
  { key: "chen", name: "Chen", hours: 16 },
];
const columns: TableProps<RecordRow>["columns"] = [
  { title: "成员", dataIndex: "name" },
  {
    title: "投入小时",
    dataIndex: "hours",
    sorter: (a, b) => a.hours - b.hours,
  },
];
export function BasicDemo() {
  return (
    <Table<RecordRow>
      style={{ width: "100%" }}
      rowKey="key"
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}
export function MoreDemo() {
  const [keys, setKeys] = useState<(string | number)[]>([]);
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Table<RecordRow>
        rowKey="key"
        columns={columns}
        dataSource={data}
        rowSelection={{
          selectedRowKeys: keys,
          onChange: setKeys,
          getCheckboxProps: (record) => ({
            disabled: record.key === "bob",
            "aria-label": `选择 ${record.name}`,
          }),
          getTitleCheckboxProps: () => ({ "aria-label": "选择本页成员" }),
        }}
        pagination={{ defaultPageSize: 2, showSizeChanger: false }}
      />
      <p aria-live="polite">选中：{keys.join("、") || "无"}</p>
    </div>
  );
}
