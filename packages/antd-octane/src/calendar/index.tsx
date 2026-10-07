/** @jsxImportSource octane */
import dayjsGenerateConfig from "./dayjs";
import generateCalendar from "./generateCalendar";

export type { CalendarGenerateConfig } from "./generateConfig";
export type {
  CalendarCellInfo,
  CalendarHeaderRender,
  CalendarLocale,
  CalendarLocaleLang,
  CalendarMode,
  CalendarProps,
  CalendarSelectInfo,
  CalendarSelectSource,
} from "./interface";

const InternalCalendar = generateCalendar(dayjsGenerateConfig);
export const Calendar = Object.assign(InternalCalendar, { generateCalendar });
