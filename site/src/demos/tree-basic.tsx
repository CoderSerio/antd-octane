import { type Key, Tree, type TreeDataNode } from "antd-octane";
import { useState } from "octane";

const treeData = [
  {
    key: "workspace",
    title: "工作区",
    children: [
      {
        key: "src",
        title: "src",
        children: [
          { key: "components", title: "components" },
          { key: "tokens", title: "tokens", disabled: true },
        ],
      },
      { key: "readme", title: "README.md" },
      { key: "lock", title: "pnpm-lock.yaml", disableCheckbox: true },
    ],
  },
  { key: "archive", title: "归档", isLeaf: true },
];

const upstreamBasicTreeData = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        disabled: true,
        children: [
          { title: "leaf", key: "0-0-0-0", disableCheckbox: true },
          { title: "leaf", key: "0-0-0-1" },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            title: <span style={{ color: "#1677ff" }}>sss</span>,
            key: "0-0-1-0",
          },
        ],
      },
    ],
  },
];

export function BasicDemo() {
  return (
    <Tree
      checkable
      defaultExpandedKeys={["0-0-0", "0-0-1"]}
      defaultSelectedKeys={["0-0-1"]}
      defaultCheckedKeys={["0-0-0", "0-0-1"]}
      treeData={upstreamBasicTreeData}
    />
  );
}

export function StrictDemo() {
  const [checked, setChecked] = useState<string[]>(["src"]);
  return (
    <div style={{ maxWidth: 420 }}>
      <Tree
        treeData={treeData}
        checkable
        checkStrictly
        showIcon
        defaultExpandedKeys={["workspace", "src"]}
        checkedKeys={checked}
        onCheck={(keys) =>
          setChecked(
            Array.isArray(keys)
              ? (keys as string[])
              : (keys.checked as string[]),
          )
        }
      />
      <p
        aria-live="polite"
        style={{ margin: "12px 0 0", color: "var(--ao-muted)" }}
      >
        严格模式只改变当前节点：{checked.join(", ") || "无"}
      </p>
    </div>
  );
}

export function ControlledDemo() {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(["workspace"]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  return (
    <Tree
      checkable
      treeData={treeData}
      expandedKeys={expandedKeys}
      selectedKeys={selectedKeys}
      checkedKeys={checkedKeys}
      onExpand={setExpandedKeys}
      onSelect={setSelectedKeys}
      onCheck={(keys) =>
        setCheckedKeys(Array.isArray(keys) ? keys : keys.checked)
      }
    />
  );
}

export function AsyncDemo() {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([
    { key: "projects", title: "项目目录", isLeaf: false },
  ]);
  const [loadedKeys, setLoadedKeys] = useState<Key[]>([]);

  return (
    <div style={{ maxWidth: 420 }}>
      <Tree
        treeData={treeData}
        loadData={(node) =>
          new Promise<void>((resolve) => {
            setTimeout(() => {
              setTreeData((current) =>
                current.map((item) =>
                  item.key === node.key
                    ? {
                        ...item,
                        children: [
                          { key: "project-alpha", title: "Project Alpha" },
                          { key: "project-beta", title: "Project Beta" },
                        ],
                      }
                    : item,
                ),
              );
              resolve();
            }, 350);
          })
        }
        onLoad={(keys) => setLoadedKeys(keys)}
      />
      <p
        aria-live="polite"
        style={{ margin: "12px 0 0", color: "var(--ao-muted)" }}
      >
        已加载节点：{loadedKeys.join(", ") || "无"}
      </p>
    </div>
  );
}

export function FilterDemo() {
  const [query, setQuery] = useState("");
  return (
    <div style={{ maxWidth: 420 }}>
      <input
        aria-label="筛选树节点"
        placeholder="输入节点名称以高亮匹配项"
        value={query}
        onInput={(event) => setQuery(event.currentTarget.value)}
        style={{ boxSizing: "border-box", width: "100%", marginBottom: 8 }}
      />
      <Tree
        treeData={treeData}
        defaultExpandedKeys={["workspace", "src"]}
        filterTreeNode={(node) =>
          query.length > 0 &&
          String(node.title).toLowerCase().includes(query.toLowerCase())
        }
      />
    </div>
  );
}

export function SearchDemo() {
  return <FilterDemo />;
}

export function DirectoryDemo() {
  const [selected, setSelected] = useState<Key[]>(["notes"]);
  return (
    <div style={{ maxWidth: 420 }}>
      <Tree.DirectoryTree
        multiple
        selectedKeys={selected}
        defaultExpandedKeys={["documents"]}
        onSelect={(keys) => setSelected(keys)}
      >
        <Tree.TreeNode key="documents" title="Documents">
          <Tree.TreeNode key="notes" title="Meeting notes.md" />
          <Tree.TreeNode key="drafts" title="Drafts">
            <Tree.TreeNode key="proposal" title="Proposal.docx" />
            <Tree.TreeNode key="budget" title="Budget.xlsx" />
          </Tree.TreeNode>
        </Tree.TreeNode>
        <Tree.TreeNode key="images" title="Images">
          <Tree.TreeNode key="cover" title="Cover.png" />
        </Tree.TreeNode>
      </Tree.DirectoryTree>
      <p
        aria-live="polite"
        style={{ margin: "12px 0 0", color: "var(--ao-muted)" }}
      >
        目录选中：{selected.join(", ") || "无"}；按住 Ctrl / Command 多选，按住
        Shift 选择可见范围。
      </p>
    </div>
  );
}

export function DragDemo() {
  const [message, setMessage] = useState("拖动节点调整位置");
  return (
    <div style={{ maxWidth: 420 }}>
      <Tree
        treeData={treeData}
        draggable
        blockNode
        defaultExpandedKeys={["workspace", "src"]}
        onDrop={(info) => setMessage(`已放置到：${String(info.node.title)}`)}
      />
      <p aria-live="polite">{message}</p>
    </div>
  );
}

export function LineDemo() {
  const [showLine, setShowLine] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  return (
    <div style={{ maxWidth: 420 }}>
      <p>
        <label>
          <input
            type="checkbox"
            checked={showLine}
            onChange={(event) => setShowLine(event.currentTarget.checked)}
          />{" "}
          显示连接线
        </label>{" "}
        <label>
          <input
            type="checkbox"
            checked={showIcon}
            onChange={(event) => setShowIcon(event.currentTarget.checked)}
          />{" "}
          显示图标
        </label>
      </p>
      <Tree
        treeData={treeData}
        showLine={showLine}
        showIcon={showIcon}
        defaultExpandedKeys={["workspace", "src"]}
      />
    </div>
  );
}

export function BlockDemo() {
  return (
    <Tree
      checkable
      blockNode
      defaultExpandAll
      defaultSelectedKeys={["readme"]}
      treeData={treeData}
    />
  );
}

export function IconDemo() {
  return (
    <Tree
      showIcon
      defaultExpandAll
      switcherIcon={<span aria-hidden="true">▾</span>}
      icon={<span aria-hidden="true">◆</span>}
      titleRender={(node) => <span>{node.title} · 自定义</span>}
      treeData={treeData}
    />
  );
}

function makeLargeTree(path = "0", level = 2): TreeDataNode[] {
  return Array.from({ length: 8 }, (_, index) => {
    const key = `${path}-${index}`;
    return {
      key,
      title: key,
      children: level > 0 ? makeLargeTree(key, level - 1) : undefined,
    };
  });
}

export function VirtualDemo() {
  return (
    <Tree
      height={220}
      treeData={makeLargeTree()}
      defaultExpandAll
      titleRender={(node) => (
        <span title={String(node.title)}>{node.title}</span>
      )}
    />
  );
}

export function TitleDemo() {
  return (
    <Tree
      treeData={treeData}
      defaultExpandAll
      titleRender={(node) => <strong>{node.title}</strong>}
    />
  );
}

export function SwitcherDemo() {
  return (
    <Tree
      showLine
      switcherIcon={<span aria-hidden="true">▾</span>}
      defaultExpandedKeys={["workspace", "src"]}
      treeData={treeData}
    />
  );
}

const bigTreeData: TreeDataNode[] = Array.from({ length: 100 }, (_, index) => ({
  title: `parent ${index}`,
  key: `large-${index}`,
  children: Array.from({ length: 20 }, (_, childIndex) => ({
    title: `child ${index}-${childIndex}`,
    key: `large-${index}-${childIndex}`,
  })),
}));

export function BigDataDemo() {
  return <Tree defaultExpandAll height={300} treeData={bigTreeData} />;
}

export function MultipleLineDemo() {
  return (
    <Tree
      checkable
      style={{ width: 300 }}
      defaultExpandedKeys={["line-root", "line-disabled"]}
      treeData={[
        {
          title: "parent 1",
          key: "line-root",
          children: [
            {
              title: "parent 1-0",
              key: "line-disabled",
              disabled: true,
              children: [
                {
                  title: "This is a very very very very long text",
                  key: "line-long",
                  disableCheckbox: true,
                },
                {
                  title: "This is also a very very very very very long text",
                  key: "line-long-2",
                },
              ],
            },
            {
              title: "parent 1-1",
              key: "line-child",
              children: [
                {
                  title: <span style={{ color: "#1677ff" }}>sss</span>,
                  key: "line-sss",
                },
              ],
            },
          ],
        },
      ]}
    />
  );
}
