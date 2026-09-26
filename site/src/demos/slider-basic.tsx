import { Slider, Space, Switch } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [value, setValue] = useState(30);
  const [disabled, setDisabled] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <Slider
        aria-label="音量"
        value={value}
        disabled={disabled}
        onChange={(next) => setValue(next as number)}
      />
      <p aria-live="polite">音量：{value}</p>
      <Space>
        <Switch
          checked={disabled}
          onChange={setDisabled}
          aria-label="禁用滑块"
        />
        <span>禁用滑块</span>
      </Space>
    </div>
  );
}
export function MoreDemo() {
  const [range, setRange] = useState<[number, number]>([20, 80]);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div style={{ width: "100%", minWidth: 220 }}>
        <Slider
          range
          value={range}
          onChange={(next) => setRange(next as [number, number])}
          marks={{ 0: "0°C", 20: "20°C", 50: "50°C", 100: "100°C" }}
        />
        <p>
          范围：{range[0]}–{range[1]}°C
        </p>
      </div>
      <Slider
        aria-label="离散档位"
        defaultValue={50}
        step={null}
        marks={{ 0: "低", 50: "中", 100: "高" }}
      />
      <div style={{ height: 180, display: "flex", gap: 40, padding: 16 }}>
        <Slider aria-label="纵向音量" vertical defaultValue={40} />
        <Slider aria-label="反向音量" vertical reverse defaultValue={60} />
      </div>
    </Space>
  );
}
