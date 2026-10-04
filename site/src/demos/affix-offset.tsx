import { Affix, type AffixRef, Button, Space } from "antd-octane";
import { useCallback, useRef, useState } from "octane";

export function OffsetDemo() {
  const host = useRef<HTMLElement | null>(null);
  const affix = useRef<AffixRef | null>(null);
  const target = useCallback(() => host.current, []);
  const [offset, setOffset] = useState(8);
  const [fixed, setFixed] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space wrap>
        <Button onClick={() => setOffset(offset === 8 ? 40 : 8)}>
          切换顶部偏移
        </Button>
        <Button onClick={() => host.current?.scrollTo({ top: 180 })}>
          滚动到固定位置
        </Button>
        <Button
          onClick={() => {
            host.current?.scrollTo({ top: 0 });
            affix.current?.updatePosition();
          }}
        >
          回到起点
        </Button>
      </Space>
      <span aria-live="polite">
        顶部偏移 {offset}px，{fixed ? "已固定" : "未固定"}
      </span>
      <section
        ref={host}
        aria-label="可配置固钉滚动容器"
        style={{
          width: "100%",
          height: 220,
          overflow: "auto",
          border: "1px solid #d9d9d9",
        }}
      >
        <div style={{ height: 100, padding: 16 }}>向下滚动或点击上方按钮。</div>
        <Affix
          ref={affix}
          target={target}
          offsetTop={offset}
          onChange={(value) => setFixed(!!value)}
        >
          <Button type="primary">始终可见的保存操作</Button>
        </Affix>
        <div style={{ height: 460, padding: 16 }}>
          更改 offsetTop 会重新计算位置；也可使用 ref.updatePosition 主动更新。
        </div>
      </section>
    </Space>
  );
}
