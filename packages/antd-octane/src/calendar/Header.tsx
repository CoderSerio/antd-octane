/** @jsxImportSource octane */
// Ant Design 5.29.3 Calendar/Header.tsx (MIT), adapted to native Select and Radio.
import { useRef } from "octane";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { Radio } from "../radio";
import { Select } from "../select";
import type { CalendarGenerateConfig } from "./generateConfig";
import type {
  CalendarLocaleLang,
  CalendarMode,
  CalendarSelectSource,
} from "./interface";

const YEAR_SELECT_OFFSET = 10;
const YEAR_SELECT_TOTAL = 20;

interface SharedProps<DateType> {
  prefixCls: string;
  value: DateType;
  validRange?: [DateType, DateType];
  generateConfig: CalendarGenerateConfig<DateType>;
  locale: CalendarLocaleLang;
  fullscreen: boolean;
  getPopupContainer: () => HTMLElement;
  onChange: (date: DateType) => void;
}
const headerClass = (prefixCls: string, suffix: string) =>
  prefixCls === "ant-picker-calendar"
    ? `${prefixCls}-${suffix}`
    : `${prefixCls}-${suffix} ant-picker-calendar-${suffix}`;

function YearSelect<DateType>({
  prefixCls,
  value,
  validRange,
  generateConfig,
  locale,
  fullscreen,
  getPopupContainer,
  onChange,
}: SharedProps<DateType>) {
  const year = generateConfig.getYear(value);
  const start = validRange
    ? generateConfig.getYear(validRange[0])
    : year - YEAR_SELECT_OFFSET;
  const end = validRange
    ? generateConfig.getYear(validRange[1]) + 1
    : start + YEAR_SELECT_TOTAL;
  const suffix = locale.year === "年" ? "年" : "";
  const options = Array.from(
    { length: Math.max(0, end - start) },
    (_, index) => ({
      label: `${start + index}${suffix}`,
      value: start + index,
    }),
  );
  return (
    <Select
      size={fullscreen ? undefined : "small"}
      options={options}
      value={year}
      className={headerClass(prefixCls, "year-select")}
      aria-label={locale.yearSelect}
      getPopupContainer={getPopupContainer}
      onChange={(nextYear) => {
        if (typeof nextYear !== "number") return;
        let date = generateConfig.setYear(value, nextYear);
        if (validRange) {
          const [startDate, endDate] = validRange;
          const newYear = generateConfig.getYear(date);
          const newMonth = generateConfig.getMonth(date);
          if (
            newYear === generateConfig.getYear(endDate) &&
            newMonth > generateConfig.getMonth(endDate)
          )
            date = generateConfig.setMonth(
              date,
              generateConfig.getMonth(endDate),
            );
          if (
            newYear === generateConfig.getYear(startDate) &&
            newMonth < generateConfig.getMonth(startDate)
          )
            date = generateConfig.setMonth(
              date,
              generateConfig.getMonth(startDate),
            );
        }
        onChange(date);
      }}
    />
  );
}

function MonthSelect<DateType>({
  prefixCls,
  value,
  validRange,
  generateConfig,
  locale,
  fullscreen,
  getPopupContainer,
  onChange,
}: SharedProps<DateType>) {
  const year = generateConfig.getYear(value);
  const month = generateConfig.getMonth(value);
  const start =
    validRange && generateConfig.getYear(validRange[0]) === year
      ? generateConfig.getMonth(validRange[0])
      : 0;
  const end =
    validRange && generateConfig.getYear(validRange[1]) === year
      ? generateConfig.getMonth(validRange[1])
      : 11;
  const months =
    locale.shortMonths ??
    generateConfig.locale.getShortMonths?.(locale.locale || "en_US") ??
    [];
  const options = Array.from(
    { length: Math.max(0, end - start + 1) },
    (_, index) => ({ label: months[start + index], value: start + index }),
  );
  return (
    <Select
      size={fullscreen ? undefined : "small"}
      options={options}
      value={month}
      className={headerClass(prefixCls, "month-select")}
      aria-label={locale.monthSelect}
      getPopupContainer={getPopupContainer}
      onChange={(nextMonth) => {
        if (typeof nextMonth === "number")
          onChange(generateConfig.setMonth(value, nextMonth));
      }}
    />
  );
}

export interface CalendarHeaderProps<DateType> {
  prefixCls: string;
  value: DateType;
  mode: CalendarMode;
  locale: CalendarLocaleLang;
  validRange?: [DateType, DateType];
  generateConfig: CalendarGenerateConfig<DateType>;
  fullscreen: boolean;
  onChange: (date: DateType, source: CalendarSelectSource) => void;
  onModeChange: (mode: CalendarMode) => void;
}

export function CalendarHeader<DateType>(props: CalendarHeaderProps<DateType>) {
  const { prefixCls, mode, locale, fullscreen, onChange, onModeChange } = props;
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { componentSize } = useConfig();
  const { token } = useComponentTokens("Select");
  const size = fullscreen ? componentSize : "small";
  const height =
    size === "small"
      ? token.controlHeightSM
      : size === "large"
        ? token.controlHeightLG
        : token.controlHeight;
  const radius =
    size === "small"
      ? token.borderRadiusSM
      : size === "large"
        ? token.borderRadiusLG
        : token.borderRadius;
  const padding =
    size === "small"
      ? token.controlPaddingHorizontalSM - token.lineWidth
      : token.paddingSM - 1;
  const arrowPadding =
    size === "small" ? token.fontSize * 1.5 : Math.ceil(token.fontSize * 1.25);
  const shared = {
    ...props,
    getPopupContainer: () => headerRef.current ?? document.body,
  };
  return (
    <div
      className={headerClass(prefixCls, "header")}
      ref={headerRef}
      style={{
        "--ao-calendar-select-height": `${height}px`,
        "--ao-calendar-select-radius": `${radius}px`,
        "--ao-calendar-select-padding": `${padding}px`,
        "--ao-calendar-select-line-width": `${token.lineWidth}px`,
        "--ao-calendar-select-line-type": token.lineType,
        "--ao-calendar-select-arrow-padding": `${arrowPadding}px`,
        "--ao-calendar-select-arrow-end": `${token.paddingSM - 1}px`,
        "--ao-calendar-select-arrow-size": `${token.fontSizeIcon}px`,
        "--ao-calendar-select-arrow-color": token.colorTextQuaternary,
        "--ao-calendar-select-bg": token.colorBgContainer,
        "--ao-calendar-select-hover-border": token.colorPrimaryHover,
        "--ao-calendar-select-focus-border": token.colorPrimary,
        "--ao-calendar-select-focus-width": `${token.controlOutlineWidth}px`,
        "--ao-calendar-select-focus-color": token.controlOutline,
      }}
    >
      <YearSelect {...shared} onChange={(date) => onChange(date, "year")} />
      {mode === "month" && (
        <MonthSelect {...shared} onChange={(date) => onChange(date, "month")} />
      )}
      <Radio.Group
        value={mode}
        size={fullscreen ? undefined : "small"}
        className={headerClass(prefixCls, "mode-switch")}
        onChange={({ target: { value } }) => {
          if (value === "month" || value === "year") onModeChange(value);
        }}
      >
        <Radio.Button value="month">{locale.month}</Radio.Button>
        <Radio.Button value="year">{locale.year}</Radio.Button>
      </Radio.Group>
    </div>
  );
}
