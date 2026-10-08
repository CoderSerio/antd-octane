import type { TimePickerProps } from "../date-picker/interface";
import { SinglePicker } from "../date-picker/SinglePicker";

export type {
  DisabledTimes,
  PickerRef as TimePickerRef,
  TimePickerProps,
} from "../date-picker/interface";
export function TimePicker(props: TimePickerProps) {
  return <SinglePicker {...props} kind="time" />;
}
