import { Button, Carousel, Space } from "antd-octane";
import type { CSSProperties } from "octane";
import { useState } from "octane";

// Adapted from Ant Design 5.29.3 components/carousel/demo (MIT).
const contentStyle: CSSProperties = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};
function Slides() {
  return [1, 2, 3, 4].map((number) => (
    <div key={number}>
      <h3 style={contentStyle}>{number}</h3>
    </div>
  ));
}
export function BasicDemo() {
  return <Carousel>{Slides()}</Carousel>;
}
export function AutoplayDemo() {
  return <Carousel autoplay>{Slides()}</Carousel>;
}
export function PositionDemo() {
  const [position, setPosition] = useState<"top" | "bottom" | "left" | "right">(
    "bottom",
  );
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        {(["top", "bottom", "left", "right"] as const).map((value) => (
          <Button
            key={value}
            type={value === position ? "primary" : "default"}
            onClick={() => setPosition(value)}
          >
            {value}
          </Button>
        ))}
      </Space>
      <Carousel dotPosition={position}>{Slides()}</Carousel>
    </Space>
  );
}
export function FadeDemo() {
  return <Carousel effect="fade">{Slides()}</Carousel>;
}
export function ArrowsDemo() {
  return (
    <Carousel arrows infinite={false}>
      {Slides()}
    </Carousel>
  );
}
export function DotDurationDemo() {
  return (
    <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000}>
      {Slides()}
    </Carousel>
  );
}
