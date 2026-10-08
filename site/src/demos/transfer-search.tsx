import { Button, Space, Transfer } from "antd-octane";
import { useState } from "octane";

const data = [
  { key: "alice", title: "Alice", description: "设计" },
  { key: "bob", title: "Bob", description: "工程" },
  { key: "carol", title: "Carol", description: "工程" },
];
export function SearchDemo() {
  const [target, setTarget] = useState<string[]>(["bob"]);
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Transfer
        dataSource={data}
        targetKeys={target}
        selectedKeys={selected}
        onChange={setTarget}
        onSelectChange={(left, right) => setSelected([...left, ...right])}
        showSearch
      />
      <Button onClick={() => setSelected([])}>清空勾选</Button>
      <p aria-live="polite">勾选：{selected.join(", ") || "空"}</p>
    </Space>
  );
}
