import { Avatar, Button, Card, List, Space, Tag } from "antd-octane";
import { useState } from "octane";

const entries = [
  {
    id: 1,
    title: "接入项目",
    description: "配置 Octane 编译器，并引入组件样式。",
  },
  {
    id: 2,
    title: "定制主题",
    description: "沿用品牌 token，验证暗色与紧凑主题。",
  },
  {
    id: 3,
    title: "验证交互",
    description: "检查键盘、输入状态和不同屏幕尺寸。",
  },
];
export function BasicDemo() {
  const data = [1, 2, 3, 4].map((index) => ({
    title: `Ant Design Title ${index}`,
  }));
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
              />
            }
            title={<a href="#list">{item.title}</a>}
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />
        </List.Item>
      )}
    />
  );
}
export function GridDemo() {
  const data = ["Title 1", "Title 2", "Title 3", "Title 4"];
  return (
    <List
      style={{ width: "100%" }}
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={(title) => (
        <List.Item>
          <Card title={title}>Card content</Card>
        </List.Item>
      )}
    />
  );
}

export function GridTestDemo() {
  const data = [
    "Title 1",
    "Title 2",
    "Title 3",
    "Title 4",
    "Title 5",
    "Title 6",
  ];
  return (
    <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={data}
      renderItem={(title) => (
        <List.Item>
          <Card title={title}>Card content</Card>
        </List.Item>
      )}
    />
  );
}

export function SimpleDemo() {
  return (
    <List
      style={{ width: "100%" }}
      dataSource={entries}
      renderItem={(item) => <List.Item>{item.title}</List.Item>}
    />
  );
}

export function VerticalDemo() {
  return (
    <List
      style={{ width: "100%" }}
      itemLayout="vertical"
      dataSource={entries}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a href="#list" key="read">
              查看
            </a>,
            <a href="#list" key="share">
              分享
            </a>,
          ]}
          extra={<Tag color="processing">进行中</Tag>}
        >
          <List.Item.Meta title={item.title} description={item.description} />
          <p>这里是列表项的正文内容，支持操作和额外信息。</p>
        </List.Item>
      )}
    />
  );
}

export function PaginationDemo() {
  return (
    <List
      style={{ width: "100%" }}
      bordered
      dataSource={Array.from({ length: 8 }, (_, index) => ({
        id: index,
        title: `条目 ${index + 1}`,
      }))}
      pagination={{ pageSize: 3, align: "center" }}
      renderItem={(item) => <List.Item>{item.title}</List.Item>}
    />
  );
}

export function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Button onClick={() => setLoading(!loading)}>
        {loading ? "停止加载" : "开始加载"}
      </Button>
      <List
        loading={loading}
        dataSource={entries}
        renderItem={(item) => <List.Item>{item.title}</List.Item>}
      />
    </Space>
  );
}

export function SizeDemo() {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <List
        size="small"
        bordered
        dataSource={entries.slice(0, 2)}
        renderItem={(item) => <List.Item>{item.title}</List.Item>}
      />
      <List
        size="large"
        bordered
        dataSource={entries.slice(0, 2)}
        renderItem={(item) => <List.Item>{item.title}</List.Item>}
      />
    </Space>
  );
}

export function FooterDemo() {
  return (
    <List
      style={{ width: "100%" }}
      bordered
      header="项目列表"
      footer="共 3 个项目"
      dataSource={entries}
      renderItem={(item) => <List.Item>{item.title}</List.Item>}
    />
  );
}

export function LoadMoreDemo() {
  const [items, setItems] = useState(entries.slice(0, 2));
  return (
    <List
      style={{ width: "100%" }}
      dataSource={items}
      renderItem={(item) => <List.Item>{item.title}</List.Item>}
      loadMore={
        items.length < entries.length ? (
          <Button onClick={() => setItems(entries)}>加载更多</Button>
        ) : (
          <span>没有更多了</span>
        )
      }
    />
  );
}

export function SplitDemo() {
  return (
    <List
      style={{ width: "100%" }}
      split={false}
      dataSource={entries}
      renderItem={(item) => <List.Item>{item.title}</List.Item>}
    />
  );
}

export function ResponsiveDemo() {
  return (
    <List
      style={{ width: "100%" }}
      grid={{ gutter: 16, column: 3, xs: 1, sm: 2, md: 3 }}
      dataSource={entries}
      renderItem={(item) => (
        <List.Item>
          <Card size="small" title={item.title}>
            {item.description}
          </Card>
        </List.Item>
      )}
    />
  );
}

export function InfiniteLoadDemo() {
  const [items, setItems] = useState(entries);
  return (
    <List
      style={{ width: "100%" }}
      dataSource={items}
      renderItem={(item) => <List.Item>{item.title}</List.Item>}
      loadMore={
        <Button
          onClick={() =>
            setItems([
              ...items,
              {
                id: items.length + 1,
                title: `新增条目 ${items.length + 1}`,
                description: "动态加载",
              },
            ])
          }
        >
          继续加载
        </Button>
      }
    />
  );
}

type SortableEntry = { key: number; content: string };
const sortableEntries: SortableEntry[] = [
  { key: 1, content: "Racing car sprays burning fuel into crowd." },
  { key: 2, content: "Japanese princess to wed commoner." },
  { key: 3, content: "Australian walks 100km after outback crash." },
  { key: 4, content: "Man charged over missing wedding girl." },
  { key: 5, content: "Los Angeles battles huge wildfires." },
];

function SortableListDemo({
  grid = false,
  handler = false,
}: {
  grid?: boolean;
  handler?: boolean;
}) {
  const [items, setItems] = useState(sortableEntries);
  const [dragging, setDragging] = useState<number | null>(null);
  const move = (target: number) => {
    if (dragging === null || dragging === target) return;
    setItems((current) => {
      const from = current.findIndex((item) => item.key === dragging);
      const to = current.findIndex((item) => item.key === target);
      if (from < 0 || to < 0) return current;
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDragging(null);
  };
  return (
    <List
      grid={grid ? { gutter: 16, column: 3 } : undefined}
      dataSource={items}
      renderItem={(item) => (
        <List.Item
          draggable={!handler}
          onDragStart={() => setDragging(item.key)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => move(item.key)}
          style={{ cursor: "move" }}
        >
          {handler && (
            <button
              type="button"
              draggable
              aria-label={`拖动第 ${item.key} 项`}
              onDragStart={() => setDragging(item.key)}
              style={{ marginInlineEnd: 8, cursor: "move" }}
            >
              ⋮⋮
            </button>
          )}
          {grid ? (
            <Card title={`Title ${item.key}`}>{item.content}</Card>
          ) : (
            `${item.key} ${item.content}`
          )}
        </List.Item>
      )}
    />
  );
}

export function DragSortingDemo() {
  return <SortableListDemo />;
}

export function DragSortingHandlerDemo() {
  return <SortableListDemo handler />;
}

export function GridDragSortingDemo() {
  return <SortableListDemo grid />;
}

export function GridDragSortingHandlerDemo() {
  return <SortableListDemo grid handler />;
}

export function VirtualListDemo() {
  const items = Array.from({ length: 100 }, (_, index) => ({
    title: `用户 ${index + 1}`,
    email: `user${index + 1}@example.com`,
  }));
  return (
    <div
      style={{ height: 300, overflowY: "auto", border: "1px solid #f0f0f0" }}
    >
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{item.title.slice(-1)}</Avatar>}
              title={<a href="#list">{item.title}</a>}
              description={item.email}
            />
            <div>Content</div>
          </List.Item>
        )}
      />
    </div>
  );
}
