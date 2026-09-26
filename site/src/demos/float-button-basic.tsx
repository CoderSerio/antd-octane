import { FloatButton } from "antd-octane";
import { useCallback, useRef, useState } from "octane";
export function BasicDemo() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ position: "relative", height: 200, width: "100%" }}>
      <FloatButton
        tooltip="联系支持"
        aria-label="联系支持"
        style={{ position: "absolute", right: 24, bottom: 24 }}
        onClick={() => setCount(count + 1)}
      />
      <FloatButton
        type="primary"
        icon="+"
        tooltip="新建项目"
        aria-label="新建项目"
        style={{ position: "absolute", right: 84, bottom: 24 }}
        onClick={() => setCount(count + 1)}
      />
      <FloatButton
        shape="square"
        description="帮助"
        style={{ position: "absolute", right: 144, bottom: 24 }}
        onClick={() => setCount(count + 1)}
      />
      <p aria-live="polite">操作次数：{count}</p>
    </div>
  );
}
export function MoreDemo() {
  const host = useRef<HTMLElement | null>(null);
  const target = useCallback(() => host.current ?? window, []);
  const [count, setCount] = useState(0);
  return (
    <div style={{ position: "relative", width: "100%", height: 260 }}>
      <section
        ref={host}
        aria-label="返回顶部容器"
        style={{ height: 260, overflow: "auto", border: "1px solid #d9d9d9" }}
      >
        <div style={{ height: 700, padding: 16 }}>
          向下滚动显示返回顶部。<p aria-live="polite">组内操作：{count}</p>
        </div>
      </section>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ position: "absolute", right: 20, bottom: 20 }}
      >
        <FloatButton
          tooltip="创建"
          aria-label="组内创建"
          icon="+"
          onClick={() => setCount(count + 1)}
        />
        <FloatButton
          tooltip="帮助"
          aria-label="组内帮助"
          onClick={() => setCount(count + 1)}
        />
      </FloatButton.Group>
      <FloatButton.BackTop
        target={target}
        visibilityHeight={100}
        duration={200}
        style={{ position: "absolute", right: 80, bottom: 20 }}
      />
    </div>
  );
}
