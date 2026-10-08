import { Space, TimePicker } from "antd-octane";
import dayjs from "dayjs";
import { useState } from "octane";
export function StepsDemo() {
  const [result, setResult] = useState("09:00:00");
  return (
    <Space direction="vertical">
      <TimePicker
        aria-label="选择工作时间"
        defaultValue={dayjs("2026-01-01T09:00:00")}
        minuteStep={15}
        secondStep={30}
        disabledTime={() => ({
          disabledHours: () => [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23,
          ],
        })}
        onChange={(_, text) => setResult(text)}
      />
      <p aria-live="polite">
        9–17 时可选；分钟步长 15、秒步长 30：{result || "未选择"}
      </p>
    </Space>
  );
}
