import { Slider, Space } from "antd-octane";

export function SliderTooltipDemo() {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", paddingTop: 20 }}
    >
      <Slider
        aria-label="始终显示百分比"
        defaultValue={35}
        tooltip={{ open: true, formatter: (value) => `${value}%` }}
      />
      <Slider
        aria-label="无提示标签"
        defaultValue={60}
        tooltip={{ open: false }}
      />
      <Slider
        aria-label="独立刻度"
        defaultValue={25}
        min={0}
        max={100}
        step={25}
        dots
        included={false}
        marks={{ 0: "低", 50: "中", 100: "高" }}
      />
    </Space>
  );
}
