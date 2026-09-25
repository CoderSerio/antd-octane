import { Affix, Button } from "antd-octane";
import { useCallback, useRef, useState } from "octane";
export function BasicDemo() {
  const host = useRef<HTMLElement | null>(null);
  const target = useCallback(() => host.current, []);
  const [fixed, setFixed] = useState(false);
  return (
    <section
      ref={host}
      aria-label="固钉滚动容器"
      style={{
        height: 240,
        overflow: "auto",
        width: "100%",
        border: "1px solid #d9d9d9",
      }}
    >
      <div style={{ height: 80, padding: 16 }}>向下滚动查看固定效果</div>
      <Affix target={target} offsetTop={8} onChange={setFixed}>
        <Button type="primary">{fixed ? "已固定" : "滚动后固定"}</Button>
      </Affix>
      <div style={{ height: 500, padding: 16 }}>
        继续滚动，按钮保持在此容器顶部。
      </div>
    </section>
  );
}
export function MoreDemo() {
  const host = useRef<HTMLElement | null>(null);
  const target = useCallback(() => host.current, []);
  return (
    <section
      ref={host}
      aria-label="底部固钉容器"
      style={{
        height: 200,
        overflow: "auto",
        width: "100%",
        border: "1px solid #d9d9d9",
      }}
    >
      <div style={{ height: 400, padding: 16 }}>底部固定示例</div>
      <Affix target={target} offsetBottom={8}>
        <Button>底部操作</Button>
      </Affix>
      <div style={{ height: 80 }} />
    </section>
  );
}
