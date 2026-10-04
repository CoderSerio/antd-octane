import { Alert, Badge, Button, Calendar } from "antd-octane";
import dayjs from "dayjs";
import { useState } from "octane";

const language = {
  lang: {
    locale: "zh-cn",
    shortWeekDays: ["日", "一", "二", "三", "四", "五", "六"],
    shortMonths: Array.from({ length: 12 }, (_, index) => `${index + 1}月`),
    weekStart: 1,
    year: "年",
    month: "月",
  },
};
const initialDate = dayjs("2025-12-10");

export function BasicDemo() {
  return (
    <Calendar
      defaultValue={initialDate}
      locale={language}
      cellRender={(date, info) =>
        info.type === "date" && date.isSame(initialDate, "day") ? (
          <span style={{ color: "#1677ff" }}>项目评审</span>
        ) : null
      }
    />
  );
}

export function CardDemo() {
  const [value, setValue] = useState(initialDate);
  return (
    <div style={{ width: 300, maxWidth: "100%" }}>
      <p>已选择：{value.format("YYYY-MM-DD")}</p>
      <Calendar
        fullscreen={false}
        value={value}
        locale={language}
        onSelect={(date) => setValue(date)}
      />
    </div>
  );
}

export function RangeDemo() {
  return (
    <div style={{ width: 300, maxWidth: "100%" }}>
      <Calendar
        fullscreen={false}
        defaultValue={initialDate}
        locale={language}
        validRange={[dayjs("2025-12-08"), dayjs("2025-12-20")]}
        showWeek
      />
    </div>
  );
}

export function NoticeDemo() {
  const events: Record<
    number,
    Array<{ status: "warning" | "success" | "error"; content: string }>
  > = {
    8: [
      { status: "warning", content: "这是警告事件。" },
      { status: "success", content: "这是普通事件。" },
    ],
    10: [
      { status: "warning", content: "这是警告事件。" },
      { status: "success", content: "这是普通事件。" },
      { status: "error", content: "这是错误事件。" },
    ],
    15: [
      { status: "warning", content: "这是警告事件。" },
      { status: "success", content: "这是很长的普通事件……" },
      { status: "error", content: "这是错误事件 1。" },
      { status: "error", content: "这是错误事件 2。" },
      { status: "error", content: "这是错误事件 3。" },
      { status: "error", content: "这是错误事件 4。" },
    ],
  };
  return (
    <Calendar
      defaultValue={initialDate}
      locale={language}
      cellRender={(date, info) => {
        if (info.type === "month") {
          return date.month() === 8 ? (
            <div style={{ textAlign: "center", lineHeight: 1.2 }}>
              <strong style={{ display: "block", fontSize: 16 }}>1394</strong>
              <span>待办数量</span>
            </div>
          ) : null;
        }
        return (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {(events[date.date()] ?? []).map((event) => (
              <li key={event.content} style={{ lineHeight: "20px" }}>
                <Badge status={event.status} text={event.content} />
              </li>
            ))}
          </ul>
        );
      }}
    />
  );
}

const lunarFormatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
  month: "long",
  day: "numeric",
});

export function LunarDemo() {
  return (
    <div style={{ width: 450, maxWidth: "100%" }}>
      <Calendar
        fullscreen={false}
        defaultValue={initialDate}
        locale={language}
        cellRender={(date, info) => {
          if (info.type === "month") {
            return (
              <span>
                {date.format("M 月")}（{lunarFormatter.format(date.toDate())}）
              </span>
            );
          }
          return (
            <span
              style={{ color: "var(--ant-color-text-tertiary)", fontSize: 11 }}
            >
              {lunarFormatter.format(date.toDate())}
            </span>
          );
        }}
      />
    </div>
  );
}

export function SelectDemo() {
  const [value, setValue] = useState(initialDate);
  return (
    <div>
      <Alert message={`已选择：${value.format("YYYY-MM-DD")}`} />
      <Calendar
        value={value}
        locale={language}
        onSelect={(next) => setValue(next)}
      />
    </div>
  );
}

export function WeekDemo() {
  return (
    <div>
      <Calendar
        fullscreen
        showWeek
        defaultValue={initialDate}
        locale={language}
      />
      <div style={{ height: 16 }} />
      <Calendar
        fullscreen={false}
        showWeek
        defaultValue={initialDate}
        locale={language}
      />
    </div>
  );
}

export function CustomHeaderDemo() {
  return (
    <Calendar
      defaultValue={initialDate}
      locale={language}
      headerRender={({ value, onChange, onTypeChange }) => (
        <div style={{ display: "flex", gap: 8, padding: "8px 12px" }}>
          <Button
            size="small"
            onClick={() => onChange(value.subtract(1, "month"))}
          >
            上个月
          </Button>
          <strong style={{ lineHeight: "24px" }}>
            {value.format("YYYY 年 MM 月")}
          </strong>
          <Button size="small" onClick={() => onChange(value.add(1, "month"))}>
            下个月
          </Button>
          <Button size="small" onClick={() => onTypeChange("year")}>
            按年查看
          </Button>
        </div>
      )}
    />
  );
}
