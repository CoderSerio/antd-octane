import type { Dayjs } from "dayjs";
import type { CSSProperties, OctaneNode } from "octane";

export interface CalendarSelectInfo {
  source: CalendarSelectSource;
}
export type CalendarHeaderRender<DateType = Dayjs> = (config: {
  value: DateType;
  type: CalendarMode;
  onChange: (date: DateType) => void;
  onTypeChange: (type: CalendarMode) => void;
}) => OctaneNode;

export type CalendarMode = "month" | "year";
export type CalendarSelectSource = "year" | "month" | "date" | "customize";
export interface CalendarCellInfo<DateType = Dayjs> {
  prefixCls: string;
  originNode: OctaneNode;
  today: DateType;
  type: "date" | "month";
  locale?: CalendarLocaleLang;
}
export interface CalendarLocaleLang {
  placeholder?: string;
  yearPlaceholder?: string;
  quarterPlaceholder?: string;
  monthPlaceholder?: string;
  weekPlaceholder?: string;
  rangePlaceholder?: [string, string];
  rangeYearPlaceholder?: [string, string];
  rangeQuarterPlaceholder?: [string, string];
  rangeMonthPlaceholder?: [string, string];
  rangeWeekPlaceholder?: [string, string];
  locale?: string;
  dateFormat?: string;
  dateTimeFormat?: string;
  fieldDateTimeFormat?: string;
  fieldDateFormat?: string;
  fieldTimeFormat?: string;
  fieldMonthFormat?: string;
  fieldYearFormat?: string;
  fieldWeekFormat?: string;
  fieldQuarterFormat?: string;
  monthBeforeYear?: boolean;
  yearFormat?: string;
  monthFormat?: string;
  cellYearFormat?: string;
  cellQuarterFormat?: string;
  dayFormat?: string;
  cellDateFormat?: string;
  cellMeridiemFormat?: string;
  today?: string;
  now?: string;
  backToToday?: string;
  ok?: string;
  timeSelect?: string;
  dateSelect?: string;
  weekSelect?: string;
  clear?: string;
  week?: string;
  month?: string;
  year?: string;
  previousMonth?: string;
  nextMonth?: string;
  monthSelect?: string;
  yearSelect?: string;
  decadeSelect?: string;
  previousYear?: string;
  nextYear?: string;
  previousDecade?: string;
  nextDecade?: string;
  previousCentury?: string;
  nextCentury?: string;
  shortWeekDays?: string[];
  shortMonths?: string[];
  weekStart?: number;
  yearStart?: number;
}
export interface CalendarLocale {
  lang?: CalendarLocaleLang;
  timePickerLocale?: Record<string, unknown>;
}
export interface CalendarProps<DateType = Dayjs> {
  value?: DateType;
  defaultValue?: DateType;
  mode?: CalendarMode;
  fullscreen?: boolean;
  showWeek?: boolean;
  validRange?: [DateType, DateType];
  disabledDate?: (date: DateType) => boolean;
  cellRender?: (date: DateType, info: CalendarCellInfo<DateType>) => OctaneNode;
  fullCellRender?: (
    date: DateType,
    info: CalendarCellInfo<DateType>,
  ) => OctaneNode;
  /** @deprecated Use cellRender. */
  dateCellRender?: (date: DateType) => OctaneNode;
  /** @deprecated Use fullCellRender. */
  dateFullCellRender?: (date: DateType) => OctaneNode;
  /** @deprecated Use cellRender. */
  monthCellRender?: (date: DateType) => OctaneNode;
  /** @deprecated Use fullCellRender. */
  monthFullCellRender?: (date: DateType) => OctaneNode;
  headerRender?: CalendarHeaderRender<DateType>;
  onChange?: (date: DateType) => void;
  onPanelChange?: (date: DateType, mode: CalendarMode) => void;
  onSelect?: (date: DateType, info: CalendarSelectInfo) => void;
  locale?: CalendarLocale;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
}
