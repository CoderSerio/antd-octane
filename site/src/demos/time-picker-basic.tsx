import { Space, TimePicker } from "antd-octane";
import type { Dayjs } from "dayjs";
import { useState } from "octane";
export function BasicDemo() {
  const [value, setValue] = useState<Dayjs | null>(null);
  return (
    <Space direction="vertical">
      <TimePicker
        aria-label="选择时间"
        value={value}
        onChange={setValue}
        allowClear
      />
      <p aria-live="polite">时间：{value?.format("HH:mm:ss") ?? "未选择"}</p>
    </Space>
  );
}
