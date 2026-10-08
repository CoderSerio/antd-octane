import "../../packages/antd-octane/src/style.css";
import dayjs from "dayjs";
import { createRoot, useState } from "octane";
import {
  DatePicker,
  type DateRange,
} from "../../packages/antd-octane/src/date-picker";

function Fixture() {
  const [value, setValue] = useState<DateRange | null>([
    dayjs("2025-06-10"),
    dayjs("2025-06-20"),
  ]);
  const [confirm, setConfirm] = useState<DateRange | null>([
    dayjs("2024-02-28"),
    dayjs("2024-03-05"),
  ]);
  const result = (dates: DateRange | null) =>
    dates?.map((date) => date?.format("YYYY-MM-DD") ?? "empty").join(" / ") ??
    "empty";
  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Date range checks</h1>
      <section style={{ overflow: "hidden", height: 140 }}>
        <h2>Automatic</h2>
        <DatePicker.RangePicker
          aria-label="Automatic"
          value={value}
          onChange={setValue}
          disabledDate={(date) => date.date() === 1}
        />
        <output aria-label="Automatic result">{result(value)}</output>
      </section>
      <section>
        <h2>Confirm</h2>
        <DatePicker.RangePicker
          aria-label="Confirm"
          needConfirm
          value={confirm}
          onChange={setConfirm}
        />
        <output aria-label="Confirm result">{result(confirm)}</output>
        <button
          type="button"
          onClick={() => setConfirm([dayjs("2030-01-10"), dayjs("2030-01-20")])}
        >
          External reset
        </button>
      </section>
      <button type="button">After pickers</button>
    </main>
  );
}
const root = document.getElementById("app");
if (!root) throw Error("Missing fixture root");
createRoot(root).render(<Fixture />);
