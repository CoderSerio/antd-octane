import type { DatePickerProps } from "./interface";
import { SinglePicker } from "./SinglePicker";

export type { DatePickerProps, PickerLocale, PickerRef } from "./interface";
export function DatePicker(props: DatePickerProps) {
  return <SinglePicker {...props} kind="date" />;
}
