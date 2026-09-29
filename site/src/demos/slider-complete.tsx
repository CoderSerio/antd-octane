import { Slider } from "antd-octane";
import { useState } from "octane";

export function SliderCompleteDemo() {
  const [value, setValue] = useState(30);
  const [complete, setComplete] = useState<number | null>(null);
  return (
    <div style={{ width: "100%" }}>
      <Slider
        aria-label="调整播放位置"
        value={value}
        onChange={(next) => {
          if (typeof next === "number") setValue(next);
        }}
        onChangeComplete={(next) => {
          if (typeof next === "number") setComplete(next);
        }}
      />
      <p role="status">
        实时位置：{value}；操作完成：{complete ?? "尚未操作"}
      </p>
    </div>
  );
}
