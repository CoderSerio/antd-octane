/** @jsxImportSource octane */
// Ant Design 5.29.3 Calendar/generateCalendar.tsx (MIT), adapted to Octane.
import { useState } from "octane";
import cssSize from "../_util/css-size";
import { useMediaQuery } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import useLocale from "../locale/useLocale";
import type { CalendarGenerateConfig } from "./generateConfig";
import { CalendarHeader } from "./Header";
import type {
  CalendarCellInfo,
  CalendarLocaleLang,
  CalendarMode,
  CalendarProps,
  CalendarSelectSource,
} from "./interface";

const englishMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const englishDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function generateCalendar<DateType>(
  generateConfig: CalendarGenerateConfig<DateType>,
) {
  return function Calendar({
    value,
    defaultValue,
    mode,
    fullscreen = true,
    showWeek = false,
    validRange,
    disabledDate,
    cellRender,
    fullCellRender,
    dateCellRender,
    dateFullCellRender,
    monthCellRender,
    monthFullCellRender,
    headerRender,
    onChange,
    onPanelChange,
    onSelect,
    locale,
    prefixCls: customPrefixCls,
    className,
    rootClassName,
    style,
  }: Readonly<CalendarProps<DateType>>) {
    const config = useConfig();
    const prefixCls = config.getPrefixCls("picker", customPrefixCls);
    // The fixed aliases carry this package's static CSS for custom prefixes.
    const cls = (suffix: string) =>
      prefixCls === "ant-picker"
        ? `${prefixCls}${suffix}`
        : `${prefixCls}${suffix} ant-picker${suffix}`;
    const [contextLocale] = useLocale("Calendar");
    const mergedLocale = { ...contextLocale, ...locale };
    const { token: t, component: c, base } = useComponentTokens("Calendar");
    const [internalValue, setInternalValue] = useState(
      () => value ?? defaultValue ?? generateConfig.getNow(),
    );
    const [internalMode, setInternalMode] = useState<CalendarMode>(
      mode ?? "month",
    );
    const selected = value ?? internalValue;
    const currentMode = mode ?? internalMode;
    const today = generateConfig.getNow();
    const narrow = useMediaQuery(`(max-width: ${t.screenXS}px)`);
    const calendarCls = `${prefixCls}-calendar`;
    const renderLocale: CalendarLocaleLang = {
      ...mergedLocale.lang,
      fieldDateFormat: mergedLocale.lang?.fieldDateFormat || "YYYY-MM-DD",
      fieldMonthFormat: mergedLocale.lang?.fieldMonthFormat || "YYYY-MM",
      cellDateFormat:
        mergedLocale.lang?.cellDateFormat ||
        mergedLocale.lang?.dayFormat ||
        "D",
    };
    const localeName = renderLocale.locale || "en_US";
    const fontHeightSM =
      t.fontHeightSM ?? Math.round(t.fontSizeSM * t.lineHeightSM);
    const calendarDateContentHeight =
      (fontHeightSM + t.marginXS) * 3 + t.lineWidth * 2;
    const weekStart = generateConfig.locale.getWeekFirstDay(localeName);
    const dayNames =
      renderLocale.shortWeekDays ??
      generateConfig.locale.getShortWeekDays?.(localeName) ??
      englishDays;
    const monthNames =
      renderLocale.shortMonths ??
      generateConfig.locale.getShortMonths?.(localeName) ??
      englishMonths;
    const formatDate = (date: DateType, format: string) =>
      generateConfig.locale.format(localeName, date, format);
    const isSameYear = (date1: DateType, date2: DateType) =>
      generateConfig.getYear(date1) === generateConfig.getYear(date2);
    const isSameMonth = (date1: DateType, date2: DateType) =>
      isSameYear(date1, date2) &&
      generateConfig.getMonth(date1) === generateConfig.getMonth(date2);
    const isSameDate = (date1: DateType, date2: DateType) =>
      isSameMonth(date1, date2) &&
      generateConfig.getDate(date1) === generateConfig.getDate(date2);
    const isDisabled = (date: DateType) =>
      (validRange
        ? generateConfig.isAfter(validRange[0], date) ||
          generateConfig.isAfter(date, validRange[1])
        : false) || !!disabledDate?.(date);
    const isMonthDisabled = (date: DateType) => {
      const monthStart = generateConfig.setDate(date, 1);
      const nextMonthStart = generateConfig.setMonth(
        monthStart,
        generateConfig.getMonth(monthStart) + 1,
      );
      const monthEnd = generateConfig.addDate(nextMonthStart, -1);
      return isDisabled(monthStart) && isDisabled(monthEnd);
    };
    const panelMode = currentMode === "year" ? "month" : "date";
    const changeDate = (date: DateType, source: CalendarSelectSource) => {
      setInternalValue(date);
      if (!isSameDate(date, selected)) {
        if (
          (panelMode === "date" && !isSameMonth(date, selected)) ||
          (panelMode === "month" && !isSameYear(date, selected))
        )
          onPanelChange?.(date, currentMode);
        onChange?.(date);
      }
      onSelect?.(date, { source });
    };
    const changeMode = (next: CalendarMode) => {
      setInternalMode(next);
      onPanelChange?.(selected, next);
    };
    const cell = (date: DateType, type: "date" | "month") => {
      const isToday =
        type === "date" ? isSameDate(date, today) : isSameMonth(date, today);
      const info: CalendarCellInfo<DateType> = {
        prefixCls,
        originNode: (
          <div className={cls("-cell-inner")}>
            {type === "date"
              ? formatDate(date, renderLocale.cellDateFormat ?? "D")
              : renderLocale.monthFormat
                ? formatDate(date, renderLocale.monthFormat)
                : monthNames[generateConfig.getMonth(date)]}
          </div>
        ),
        today,
        type,
        locale: renderLocale,
      };
      if (fullCellRender) return fullCellRender(date, info);
      const legacyFullCellRender =
        type === "date" ? dateFullCellRender : monthFullCellRender;
      if (legacyFullCellRender) return legacyFullCellRender(date);
      const content = cellRender
        ? cellRender(date, info)
        : type === "date"
          ? dateCellRender?.(date)
          : monthCellRender?.(date);
      return (
        <div
          className={`${cls("-cell-inner")} ${cls("-calendar-date")} ${isToday ? cls("-calendar-date-today") : ""}`}
        >
          <div className={cls("-calendar-date-value")}>
            {type === "date"
              ? String(generateConfig.getDate(date)).padStart(2, "0")
              : monthNames[generateConfig.getMonth(date)]}
          </div>
          <div className={cls("-calendar-date-content")}>{content}</div>
        </div>
      );
    };
    const firstOfMonth = generateConfig.setDate(selected, 1);
    let gridStart = generateConfig.addDate(
      firstOfMonth,
      weekStart - generateConfig.getWeekDay(firstOfMonth),
    );
    if (
      generateConfig.getMonth(gridStart) ===
        generateConfig.getMonth(selected) &&
      generateConfig.getDate(gridStart) > 1
    ) {
      gridStart = generateConfig.addDate(gridStart, -7);
    }
    const dateRows = Array.from({ length: 6 }, (_, row) =>
      Array.from({ length: 7 }, (_, column) =>
        generateConfig.addDate(gridStart, row * 7 + column),
      ),
    );
    const firstMonthDate = generateConfig.setMonth(selected, 0);
    const monthRows = Array.from({ length: 4 }, (_, row) =>
      Array.from({ length: 3 }, (_, column) =>
        generateConfig.addMonth(firstMonthDate, row * 3 + column),
      ),
    );
    return (
      <div
        className={[
          cls("-calendar"),
          fullscreen ? cls("-calendar-full") : cls("-calendar-mini"),
          config.direction === "rtl" && cls("-calendar-rtl"),
          narrow && cls("-calendar-narrow"),
          config.calendar?.className,
          className,
          rootClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          ...base,
          "--ao-calendar-full-bg": c?.fullBg ?? t.colorBgContainer,
          "--ao-calendar-font-size": `${t.fontSize}px`,
          "--ao-calendar-line-height": String(t.lineHeight),
          "--ao-calendar-line-width": `${t.lineWidth}px`,
          "--ao-calendar-line-type": t.lineType,
          "--ao-calendar-radius-lg": `${t.borderRadiusLG}px`,
          "--ao-calendar-panel-bg": c?.fullPanelBg ?? t.colorBgContainer,
          "--ao-calendar-active-bg": c?.itemActiveBg ?? t.controlItemBgActive,
          "--ao-calendar-hover-bg": t.controlItemBgHover,
          "--ao-calendar-primary": t.colorPrimary,
          "--ao-calendar-selected-text": t.colorTextLightSolid,
          "--ao-calendar-text": t.colorText,
          "--ao-calendar-muted": t.colorTextDisabled,
          "--ao-calendar-border": t.colorSplit,
          "--ao-calendar-border-width-bold": `${t.lineWidthBold}px`,
          "--ao-calendar-date-margin": `${t.marginXS / 2}px`,
          "--ao-calendar-date-padding-block": `${t.paddingXS / 2}px`,
          "--ao-calendar-date-padding-inline": `${t.paddingXS}px`,
          "--ao-calendar-date-value-height": `${t.controlHeightSM}px`,
          "--ao-calendar-date-content-height": `${calendarDateContentHeight}px`,
          "--ao-calendar-full-cell-height": `${t.controlHeightSM + calendarDateContentHeight + t.paddingXS / 2 + t.lineWidthBold}px`,
          "--ao-calendar-week-height": `${t.controlHeightSM * 0.75}px`,
          "--ao-calendar-week-heading-padding-inline": `${t.paddingSM}px`,
          "--ao-calendar-week-heading-padding-bottom": `${t.paddingXXS}px`,
          "--ao-calendar-header-gap": `${t.marginXS}px`,
          "--ao-calendar-header-padding-y": `${t.paddingSM}px`,
          "--ao-calendar-header-padding-inline": `${t.paddingXS}px`,
          "--ao-calendar-padding-xs": `${t.paddingXS}px`,
          "--ao-calendar-header-control-padding": `${t.controlPaddingHorizontal}px`,
          "--ao-calendar-header-control-padding-sm": `${t.controlPaddingHorizontalSM}px`,
          "--ao-calendar-control-height": `${t.controlHeight}px`,
          "--ao-calendar-control-height-sm": `${t.controlHeightSM}px`,
          "--ao-calendar-control-radius": `${t.borderRadius}px`,
          "--ao-calendar-control-radius-sm": `${t.borderRadiusSM}px`,
          "--ao-calendar-cell-height": `${t.controlHeightSM}px`,
          "--ao-calendar-cell-padding": `${t.paddingXXS * 1.5}px`,
          "--ao-calendar-cell-disabled-bg": t.colorBgContainerDisabled,
          "--ao-calendar-selected-disabled-bg": t.colorFillSecondary,
          "--ao-calendar-motion-mid": t.motionDurationMid,
          "--ao-calendar-year-width": cssSize(c?.yearControlWidth ?? 80),
          "--ao-calendar-month-width": cssSize(c?.monthControlWidth ?? 70),
          "--ao-calendar-mini-height": cssSize(c?.miniContentHeight ?? 256),
          "--ao-calendar-month-height": `${t.controlHeightLG * 1.65 * 4}px`,
          "--ao-calendar-month-padding": `${t.paddingXXS * 1.5}px`,
          "--ao-calendar-month-cell-width": `${t.controlHeightLG * 1.5}px`,
          "--ao-calendar-month-cell-height": `${t.controlHeightSM}px`,
          "--ao-calendar-month-cell-padding-inline": `${t.paddingXS}px`,
          "--ao-calendar-month-radius": `${t.borderRadiusSM}px`,
          "--ao-calendar-motion-slow": t.motionDurationSlow,
          ...config.calendar?.style,
          ...style,
        }}
      >
        {headerRender ? (
          headerRender({
            value: selected,
            type: currentMode,
            onChange: (date) => changeDate(date, "customize"),
            onTypeChange: changeMode,
          })
        ) : (
          <CalendarHeader
            prefixCls={calendarCls}
            value={selected}
            mode={currentMode}
            locale={renderLocale}
            validRange={validRange}
            generateConfig={generateConfig}
            fullscreen={fullscreen}
            onChange={changeDate}
            onModeChange={changeMode}
          />
        )}
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: rc-picker PickerPanel exposes its panel as a tab stop. */}
        <div className={cls("-panel")} tabIndex={0}>
          <div
            className={[
              cls(`-${panelMode}-panel`),
              showWeek && panelMode === "date"
                ? cls("-date-panel-show-week")
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={cls("-body")}>
              <table className={cls("-content")}>
                {panelMode === "date" && (
                  <thead>
                    <tr>
                      {showWeek && (
                        <th key="week">
                          <span
                            className={cls("-calendar-week-label")}
                            aria-hidden="true"
                          >
                            {renderLocale.week ?? "Week"}
                          </span>
                        </th>
                      )}
                      {Array.from({ length: 7 }, (_, index) => (
                        <th key={index}>{dayNames[(index + weekStart) % 7]}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {panelMode === "date"
                    ? dateRows.map((row) => {
                        const rowStartDate = row[0];
                        const weekDisabled =
                          showWeek && isDisabled(rowStartDate);
                        return (
                          <tr key={formatDate(rowStartDate, "YYYY-MM-DD")}>
                            {showWeek && (
                              // biome-ignore lint/a11y/useKeyWithClickEvents: rc-picker selects the week from its first day when the week label is clicked.
                              <td
                                className={[
                                  cls("-cell"),
                                  cls("-cell-week"),
                                  weekDisabled && cls("-cell-disabled"),
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                                key={`week-${formatDate(rowStartDate, "YYYY-MM-DD")}`}
                                onClick={() => {
                                  if (!weekDisabled)
                                    changeDate(rowStartDate, "date");
                                }}
                              >
                                <div className={cls("-cell-inner")}>
                                  {generateConfig.locale.getWeek(
                                    localeName,
                                    rowStartDate,
                                  )}
                                </div>
                              </td>
                            )}
                            {row.map((date) => {
                              const disabled = isDisabled(date);
                              const selectedDate = isSameDate(date, selected);
                              const inView = isSameMonth(date, selected);
                              const isToday = isSameDate(date, today);
                              return (
                                // biome-ignore lint/a11y/useKeyWithClickEvents: rc-picker selects dates by clicking table cells.
                                <td
                                  key={formatDate(date, "YYYY-MM-DD")}
                                  title={formatDate(
                                    date,
                                    renderLocale.fieldDateFormat ||
                                      "YYYY-MM-DD",
                                  )}
                                  className={[
                                    cls("-cell"),
                                    inView && cls("-cell-in-view"),
                                    selectedDate && cls("-cell-selected"),
                                    isToday && cls("-cell-today"),
                                    disabled && cls("-cell-disabled"),
                                  ]
                                    .filter(Boolean)
                                    .join(" ")}
                                  onClick={() => {
                                    if (!disabled) changeDate(date, "date");
                                  }}
                                >
                                  {cell(date, "date")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    : monthRows.map((row) => (
                        <tr key={generateConfig.getMonth(row[0])}>
                          {row.map((date) => {
                            const disabled = isMonthDisabled(date);
                            const selectedMonth = isSameMonth(date, selected);
                            const isToday = isSameMonth(date, today);
                            return (
                              // biome-ignore lint/a11y/useKeyWithClickEvents: rc-picker selects months by clicking table cells.
                              <td
                                key={generateConfig.getMonth(date)}
                                title={formatDate(
                                  date,
                                  renderLocale.fieldMonthFormat || "YYYY-MM",
                                )}
                                className={[
                                  cls("-cell"),
                                  cls("-cell-in-view"),
                                  selectedMonth && cls("-cell-selected"),
                                  isToday && cls("-cell-today"),
                                  disabled && cls("-cell-disabled"),
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                                onClick={() => {
                                  if (!disabled) changeDate(date, "month");
                                }}
                              >
                                {cell(date, "month")}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
