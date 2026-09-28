import { Anchor } from "antd-octane";
import { useCallback, useRef, useState } from "octane";

const items = [
  {
    key: "start",
    href: "#anchor-nested-start",
    title: "开始",
    children: [
      { key: "install", href: "#anchor-nested-install", title: "安装" },
      { key: "usage", href: "#anchor-nested-usage", title: "使用" },
    ],
  },
  { key: "end", href: "#anchor-nested-end", title: "下一步" },
];

export function NestedDemo() {
  const host = useRef<HTMLElement | null>(null);
  const target = useCallback(() => host.current ?? window, []);
  const [active, setActive] = useState("");
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <Anchor
          affix={false}
          items={items}
          getContainer={target}
          onChange={setActive}
          style={{ flexShrink: 0 }}
        />
        <section
          ref={host}
          aria-label="嵌套锚点内容"
          style={{ height: 230, overflow: "auto", minWidth: 0, flex: 1 }}
        >
          {["start", "install", "usage", "end"].map((name) => (
            <section
              key={name}
              id={`anchor-nested-${name}`}
              style={{ minHeight: 220, padding: 12 }}
            >
              <h3>{name}</h3>
              <p>滚动或点击导航，观察 onChange。</p>
            </section>
          ))}
          <div style={{ height: 100 }} />
        </section>
      </div>
      <p aria-live="polite">当前激活：{active || "无"}</p>
    </div>
  );
}
