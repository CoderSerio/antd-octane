import { DatePicker, type DateRange } from "antd-octane";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "octane";
export function BasicDemo() {
  const [value, setValue] = useState<Dayjs | null>(null);
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <DatePicker
        aria-label="交付日期"
        value={value}
        onChange={setValue}
        disabledDate={(date) => date.day() === 0}
      />
      <p aria-live="polite">
        交付日期：{value?.format("YYYY-MM-DD") ?? "未选择"}
      </p>
    </div>
  );
}
export function MoreDemo() {
  const [value, setValue] = useState<DateRange | null>([
    dayjs("2026-10-12"),
    dayjs("2026-10-16"),
  ]);
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <DatePicker.RangePicker
        aria-label="报告周期"
        value={value}
        onChange={setValue}
        needConfirm
      />
      <p aria-live="polite">
        已确认：
        {value
          ?.map((date) => date?.format("YYYY-MM-DD") ?? "空")
          .join(" 至 ") ?? "未选择"}
      </p>
    </div>
  );
}
