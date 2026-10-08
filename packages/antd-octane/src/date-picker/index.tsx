import type { DatePickerProps } from "./interface";
import { RangePicker } from "./RangePicker";
import { SinglePicker } from "./SinglePicker";

export type { DatePickerProps, PickerLocale, PickerRef } from "./interface";

function InternalDatePicker(props: DatePickerProps) {
  return <SinglePicker {...props} kind="date" />;
}

export const DatePicker = Object.assign(InternalDatePicker, { RangePicker });
export type { DateRange, RangePickerProps } from "./interface";
