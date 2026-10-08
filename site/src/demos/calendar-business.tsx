import { Calendar } from "antd-octane";
import dayjs from "dayjs";
import { useState } from "octane";
export function BasicDemo() {
  const [value, setValue] = useState(dayjs("2026-10-12"));
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Calendar fullscreen={false} value={value} onChange={setValue} />
      <p aria-live="polite">当前日期：{value.format("YYYY-MM-DD")}</p>
    </div>
  );
}
export function MoreDemo() {
  const [chosen, setChosen] = useState("尚未选择");
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <Calendar
        fullscreen={false}
        defaultValue={dayjs("2026-10-12")}
        validRange={[dayjs("2026-10-01"), dayjs("2026-10-31")]}
        disabledDate={(date) => date.day() === 0}
        onSelect={(date, info) =>
          setChosen(`${date.format("YYYY-MM-DD")}（${info.source}）`)
        }
      />
      <p aria-live="polite">选择：{chosen}</p>
    </div>
  );
}
