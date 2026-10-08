import dayjs from "dayjs";
import {
  DatePicker,
  type PickerRef,
  TimePicker,
} from "../packages/antd-octane/src";

const value = dayjs("2025-01-01");
export const valid = (
  <>
    <DatePicker
      value={null}
      onChange={(date, text) => {
        date?.format();
        text.toUpperCase();
      }}
      ref={(ref: PickerRef | null) => ref?.focus()}
    />
    <TimePicker
      defaultValue={value}
      minuteStep={15}
      disabledTime={() => ({ disabledHours: () => [12] })}
    />
  </>
);
// @ts-expect-error The single DatePicker accepts Dayjs, not serialized dates.
export const stringValue = <DatePicker value="2025-01-01" />;
// @ts-expect-error Range selection is not implemented.
export const range = <DatePicker value={[value, value]} />;
// @ts-expect-error Date/time composition is not implemented.
export const showTime = <DatePicker showTime />;
// @ts-expect-error Multiple selection is not implemented.
export const multiple = <DatePicker multiple />;
// @ts-expect-error This release exposes no RangePicker stub.
export const rangePicker = DatePicker.RangePicker;
// @ts-expect-error Only 24-hour time controls are implemented.
export const twelveHour = <TimePicker use12Hours />;
