import { Anchor, Space } from "antd-octane";
import { useCallback, useRef, useState } from "octane";

const items = [
  { key: "one", href: "#anchor-offset-one", title: "第一节" },
  { key: "two", href: "#anchor-offset-two", title: "第二节" },
];

export function OffsetDemo() {
  const host = useRef<HTMLElement | null>(null);
  const target = useCallback(() => host.current ?? window, []);
  const [offset, setOffset] = useState(40);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <label>
        targetOffset：
        <select
          value={offset}
          onChange={(event) =>
            setOffset(Number((event.target as HTMLSelectElement).value))
          }
        >
          <option value={0}>0px</option>
          <option value={40}>40px</option>
          <option value={80}>80px</option>
        </select>
      </label>
      <Anchor
        affix={false}
        direction="horizontal"
        items={items}
        getContainer={target}
        targetOffset={offset}
      />
      <section
        ref={host}
        aria-label="带偏移的锚点内容"
        style={{
          height: 230,
          overflow: "auto",
          border: "1px solid var(--line)",
        }}
      >
        <div style={{ height: 90 }} />
        {["one", "two"].map((name) => (
          <section
            key={name}
            id={`anchor-offset-${name}`}
            style={{ minHeight: 230, padding: 12 }}
          >
            <h3>{name === "one" ? "第一节" : "第二节"}</h3>
            <p>点击导航后，标题与容器顶部保持指定距离。</p>
          </section>
        ))}
      </section>
    </Space>
  );
}
