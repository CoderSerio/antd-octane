import { Anchor, Checkbox, Space } from "antd-octane";
import { useCallback, useRef, useState } from "octane";

const items = [
  { key: "one", href: "#anchor-history-one", title: "第一节" },
  { key: "two", href: "#anchor-history-two", title: "第二节" },
];

export function HistoryDemo() {
  const host = useRef<HTMLElement | null>(null);
  const target = useCallback(() => host.current ?? window, []);
  const [replace, setReplace] = useState(true);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Checkbox
        checked={replace}
        onChange={(event) => setReplace(event.target.checked)}
      >
        替换当前历史记录
      </Checkbox>
      <Anchor
        affix={false}
        direction="horizontal"
        items={items}
        getContainer={target}
        replace={replace}
      />
      <section
        ref={host}
        aria-label="历史记录锚点内容"
        style={{
          height: 180,
          overflow: "auto",
          border: "1px solid var(--line)",
        }}
      >
        {["one", "two"].map((name) => (
          <section
            key={name}
            id={`anchor-history-${name}`}
            style={{ minHeight: 200, padding: 12 }}
          >
            <h3>{name === "one" ? "第一节" : "第二节"}</h3>
            <p>点击导航观察地址栏 hash。</p>
          </section>
        ))}
        <div style={{ height: 100 }} />
      </section>
      <p>replace=true 使用 replaceState；false 为每次点击新增历史记录。</p>
    </Space>
  );
}
