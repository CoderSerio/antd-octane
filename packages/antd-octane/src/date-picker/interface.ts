import type { Dayjs } from "dayjs";
import type { CSSProperties, Ref } from "octane";
import type { PopupContainer } from "../config-provider/context";

export interface PickerLocale {
  locale?: string;
  placeholder?: string;
  clear?: string;
  today?: string;
  ok?: string;
  previousMonth?: string;
  nextMonth?: string;
  hour?: string;
  minute?: string;
  second?: string;
}
export interface PickerRef {
  nativeElement: HTMLDivElement | null;
  focus: (options?: FocusOptions) => void;
  blur: () => void;
}
export interface DatePickerProps {
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null, dateString: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  format?: string;
  disabledDate?: (date: Dayjs) => boolean;
  disabled?: boolean;
  inputReadOnly?: boolean;
  getPopupContainer?: (trigger: HTMLElement) => PopupContainer;
  allowClear?: boolean;
  placeholder?: string;
  locale?: PickerLocale;
  size?: "small" | "middle" | "large";
  status?: "error" | "warning";
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<PickerRef>;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}
export interface DisabledTimes {
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number) => number[];
  disabledSeconds?: (hour: number, minute: number) => number[];
}
export interface TimePickerProps extends Omit<DatePickerProps, "disabledDate"> {
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  disabledTime?: (date: Dayjs) => DisabledTimes;
}
