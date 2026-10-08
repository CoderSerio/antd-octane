import "../../packages/antd-octane/src/style.css";
import type dayjs from "dayjs";
import { createRoot, useState } from "octane";
import { DatePicker } from "../../packages/antd-octane/src/date-picker";
import { TimePicker } from "../../packages/antd-octane/src/time-picker";

function Fixture() {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [time, setTime] = useState<dayjs.Dayjs | null>(null);
  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Date and time picker checks</h1>
      <div style={{ overflow: "hidden", height: 60 }}>
        <DatePicker
          aria-label="Appointment date"
          value={date}
          onChange={setDate}
          defaultOpen={false}
          disabledDate={(value) => value.date() === 1}
        />
        <output aria-label="Date result">
          {date?.format("YYYY-MM-DD") ?? "empty"}
        </output>
      </div>
      <p>
        <TimePicker
          aria-label="Appointment time"
          value={time}
          onChange={setTime}
          minuteStep={15}
          secondStep={30}
          disabledTime={() => ({ disabledHours: () => [12] })}
        />
        <output aria-label="Time result">
          {time?.format("HH:mm:ss") ?? "empty"}
        </output>
      </p>
      <button type="button">After pickers</button>
    </main>
  );
}
const container = document.getElementById("app");
if (!container) throw Error("Missing root");
createRoot(container).render(<Fixture />);
