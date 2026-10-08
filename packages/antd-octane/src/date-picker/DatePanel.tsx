/** @jsxImportSource octane */
import dayjs, { type Dayjs } from "dayjs";
import generateConfig from "../calendar/dayjs";
import type { PickerLocale } from "./interface";

interface DatePanelProps {
  cursor: Dayjs;
  selected: Dayjs[];
  range?: [Dayjs | null, Dayjs | null];
  locale: PickerLocale;
  localeName: string;
  allowed: (date: Dayjs) => boolean;
  setCursor: (date: Dayjs) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onSelect: (date: Dayjs) => void;
}
export function DatePanel({
  cursor,
  selected,
  range,
  locale,
  localeName,
  allowed,
  setCursor,
  onKeyDown,
  onSelect,
}: DatePanelProps) {
  const start = generateConfig.locale.getWeekFirstDate(
    localeName,
    cursor.startOf("month"),
  );
  const weekdayNames =
    generateConfig.locale.getShortWeekDays?.(localeName) ?? [];
  const weekStart = generateConfig.locale.getWeekFirstDay(localeName);
  return (
    <>
      <header>
        <button
          type="button"
          aria-label={locale.previousMonth}
          onClick={() => setCursor(cursor.subtract(1, "month"))}
        >
          ‹
        </button>
        <span aria-live="polite">
          {cursor.locale(localeName).format("MMMM YYYY")}
        </span>
        <button
          type="button"
          aria-label={locale.nextMonth}
          onClick={() => setCursor(cursor.add(1, "month"))}
        >
          ›
        </button>
      </header>
      <div className="ao-picker-weekdays">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i}>{weekdayNames[(weekStart + i) % 7]}</span>
        ))}
      </div>
      <table aria-label={cursor.format("YYYY-MM")} className="ao-picker-grid">
        <tbody>
          {Array.from({ length: 6 }, (_, row) => (
            <tr key={row}>
              {Array.from({ length: 7 }, (_, col) => {
                const date = start.add(row * 7 + col, "day");
                const active = date.isSame(cursor, "day");
                const unavailable = !allowed(date);
                return (
                  <td key={col}>
                    <button
                      type="button"
                      aria-pressed={selected.some((value) =>
                        value.isSame(date, "day"),
                      )}
                      data-date={date.format("YYYY-MM-DD")}
                      data-in-range={
                        (range?.[0] &&
                          range?.[1] &&
                          date.isAfter(range[0], "day") &&
                          date.isBefore(range[1], "day")) ||
                        undefined
                      }
                      data-active={active ? "true" : undefined}
                      tabIndex={active ? 0 : -1}
                      aria-label={date
                        .locale(localeName)
                        .format("YYYY-MM-DD dddd")}
                      aria-disabled={unavailable}
                      className={
                        date.month() === cursor.month()
                          ? undefined
                          : "ao-picker-outside"
                      }
                      onKeyDown={onKeyDown}
                      onClick={() => {
                        onSelect(date);
                      }}
                    >
                      {date.date()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        disabled={!allowed(dayjs().startOf("day"))}
        onClick={() => {
          onSelect(dayjs().startOf("day"));
        }}
      >
        {locale.today}
      </button>
    </>
  );
}
