// rc-picker 4.11.3 generate/dayjs.ts (MIT), adapted without React dependencies.
import dayjs, { type Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import type { CalendarGenerateConfig } from "./generateConfig";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend((_option, DayjsClass) => {
  const format = DayjsClass.prototype.format;
  DayjsClass.prototype.format = function (value) {
    // rc-picker accepts Wo as the localized week ordinal.
    return format.call(this, (value || "").replace("Wo", "wo"));
  };
});

const localeMap: Record<string, string> = {
  bn_BD: "bn-bd",
  by_BY: "be",
  en_GB: "en-gb",
  en_US: "en",
  fr_BE: "fr",
  fr_CA: "fr-ca",
  hy_AM: "hy-am",
  kmr_IQ: "ku",
  nl_BE: "nl-be",
  pt_BR: "pt-br",
  zh_CN: "zh-cn",
  zh_HK: "zh-hk",
  zh_TW: "zh-tw",
};
const parseLocale = (locale: string) =>
  localeMap[locale] || locale.split("_")[0];

const generateConfig: CalendarGenerateConfig<Dayjs> = {
  getNow: () => {
    const now = dayjs() as Dayjs & { tz?: () => Dayjs };
    return typeof now.tz === "function" ? now.tz() : now;
  },
  getFixedDate: (value) => dayjs(value, ["YYYY-M-DD", "YYYY-MM-DD"]),
  getEndDate: (value) => value.endOf("month"),
  getWeekDay: (value) => {
    const date = value.locale("en");
    return date.weekday() + date.localeData().firstDayOfWeek();
  },
  getYear: (value) => value.year(),
  getMonth: (value) => value.month(),
  getDate: (value) => value.date(),
  getHour: (value) => value.hour(),
  getMinute: (value) => value.minute(),
  getSecond: (value) => value.second(),
  getMillisecond: (value) => value.millisecond(),
  addYear: (value, diff) => value.add(diff, "year"),
  addMonth: (value, diff) => value.add(diff, "month"),
  addDate: (value, diff) => value.add(diff, "day"),
  setYear: (value, year) => value.year(year),
  setMonth: (value, month) => value.month(month),
  setDate: (value, date) => value.date(date),
  setHour: (value, hour) => value.hour(hour),
  setMinute: (value, minute) => value.minute(minute),
  setSecond: (value, second) => value.second(second),
  setMillisecond: (value, millisecond) => value.millisecond(millisecond),
  isAfter: (date1, date2) => date1.isAfter(date2),
  isValidate: (value) => value.isValid(),
  locale: {
    getWeekFirstDay: (locale) =>
      dayjs().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
    getWeekFirstDate: (locale, value) =>
      value.locale(parseLocale(locale)).weekday(0),
    getWeek: (locale, value) => value.locale(parseLocale(locale)).week(),
    getShortWeekDays: (locale) =>
      dayjs().locale(parseLocale(locale)).localeData().weekdaysMin(),
    getShortMonths: (locale) =>
      dayjs().locale(parseLocale(locale)).localeData().monthsShort(),
    format: (locale, value, format) =>
      value.locale(parseLocale(locale)).format(format),
    parse: (locale, text, formats) => {
      const localeName = parseLocale(locale);
      for (const format of formats) {
        if (format.includes("wo") || format.includes("Wo")) {
          const [year, week] = text.split("-");
          const firstWeek = dayjs(year, "YYYY")
            .startOf("year")
            .locale(localeName);
          for (let index = 0; index <= 52; index += 1) {
            const date = firstWeek.add(index, "week");
            if (date.format("Wo") === week) return date;
          }
          return null;
        }
        const date = dayjs(text, format, true).locale(localeName);
        if (date.isValid()) return date;
      }
      return null;
    },
  },
};

export default generateConfig;
