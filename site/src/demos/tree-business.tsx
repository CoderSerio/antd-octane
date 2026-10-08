import { Tree, type TreeProps } from "antd-octane";
import { useState } from "octane";

const data = [
  {
    key: "project",
    title: "项目",
    children: [
      { key: "design", title: "设计" },
      {
        key: "build",
        title: "开发",
        children: [
          { key: "frontend", title: "前端" },
          { key: "backend", title: "后端" },
        ],
      },
    ],
  },
];
export function BasicDemo() {
  const [keys, setKeys] = useState<(string | number)[]>([]);
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Tree
        treeData={data}
        defaultExpandAll
        selectedKeys={keys}
        onSelect={setKeys}
      />
      <p aria-live="polite">选中：{keys.join("、") || "无"}</p>
    </div>
  );
}
export function MoreDemo() {
  const [keys, setKeys] = useState<NonNullable<TreeProps["checkedKeys"]>>([]);
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Tree
        treeData={data}
        checkable
        defaultExpandAll
        checkedKeys={keys}
        onCheck={setKeys}
      />
      <p aria-live="polite">
        勾选：{(Array.isArray(keys) ? keys : keys.checked).join("、") || "无"}
      </p>
    </div>
  );
}
