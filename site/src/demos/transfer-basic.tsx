import { Space, Transfer } from "antd-octane";
import { useState } from "octane";

const data = [
  { key: "read", title: "读取" },
  { key: "write", title: "编辑" },
  { key: "admin", title: "管理", disabled: true },
];
export function BasicDemo() {
  const [keys, setKeys] = useState<string[]>([]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Transfer
        dataSource={data}
        targetKeys={keys}
        onChange={setKeys}
        titles={["待分配", "已分配"]}
      />
      <p aria-live="polite">目标列表：{keys.join(", ") || "空"}</p>
    </Space>
  );
}
