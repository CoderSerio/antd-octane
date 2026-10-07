import { Button, Carousel, type CarouselRef, Space } from "antd-octane";
import { useRef, useState } from "octane";

function Slide({ number }: { number: number }) {
  return (
    <div
      style={{
        height: 180,
        display: "grid",
        placeItems: "center",
        background: ["#364d79", "#135200", "#531dab"][number - 1],
        color: "white",
        fontSize: 28,
      }}
    >
      {number}
    </div>
  );
}
export function BasicDemo() {
  const ref = useRef<CarouselRef | null>(null);
  const [current, setCurrent] = useState(0);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Carousel ref={ref} arrows infinite={false} afterChange={setCurrent}>
        <Slide number={1} />
        <Slide number={2} />
        <Slide number={3} />
      </Carousel>
      <Space>
        <Button onClick={() => ref.current?.prev()} disabled={current === 0}>
          上一页
        </Button>
        <Button onClick={() => ref.current?.goTo(0)}>回到第一页</Button>
        <Button onClick={() => ref.current?.next()} disabled={current === 2}>
          下一页
        </Button>
      </Space>
      <p aria-live="polite">当前第 {current + 1} 张</p>
    </Space>
  );
}
export function MoreDemo() {
  return (
    <Carousel autoplay autoplaySpeed={3000} arrows>
      <Slide number={1} />
      <Slide number={2} />
      <Slide number={3} />
    </Carousel>
  );
}
