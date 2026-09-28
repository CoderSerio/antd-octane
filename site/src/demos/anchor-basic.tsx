import { Anchor } from "antd-octane";
import { useCallback, useRef } from "octane";
export function BasicDemo() {
  const host = useRef<HTMLElement | null>(null);
  const target = useCallback(() => host.current ?? window, []);
  return (
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <Anchor
        affix={false}
        getContainer={target}
        targetOffset={8}
        style={{ width: 100, flexShrink: 0 }}
        items={[
          { key: "one", href: "#anchor-demo-one", title: "项目介绍" },
          { key: "two", href: "#anchor-demo-two", title: "快速开始" },
          { key: "three", href: "#anchor-demo-three", title: "定制主题" },
        ]}
      />
      <section
        ref={host}
        aria-label="锚点内容容器"
        style={{ height: 260, overflow: "auto", flex: 1, minWidth: 0 }}
      >
        {["项目介绍", "快速开始", "定制主题"].map((title, index) => (
          <section
            id={`anchor-demo-${["one", "two", "three"][index]}`}
            key={title}
            style={{ minHeight: 240, padding: 8 }}
          >
            <h3>{title}</h3>
            <p>滚动内容或点击左侧链接。</p>
          </section>
        ))}
        <div style={{ height: 100 }} />
      </section>
    </div>
  );
}
export function MoreDemo() {
  return (
    <Anchor
      affix={false}
      direction="horizontal"
      items={[
        { key: "api", href: "#api", title: "API" },
        { key: "tokens", href: "#tokens", title: "主题与支持范围" },
      ]}
    />
  );
}
