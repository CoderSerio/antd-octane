# Date and time pickers (unreleased)

This development branch implements `DatePicker`, `DatePicker.RangePicker`, and `TimePicker` for Octane. These exports are not available in the currently published package. All use Dayjs values and native inputs, popups, and controlled state. They are a supported subset of the Ant Design API, not a complete rc-picker port.

Applications that import `dayjs` should declare it directly (for example
`pnpm add dayjs@1.11.23`), rather than rely on a transitive dependency.

```tsx
import dayjs from "dayjs";
import { DatePicker, TimePicker } from "antd-octane";

<DatePicker defaultValue={dayjs("2025-06-15")} onChange={(date, text) => console.log(date, text)} />;
<TimePicker minuteStep={15} secondStep={30} onChange={(time) => console.log(time)} />;
```

## Values and editing

Use `Dayjs | null` for `value` or `defaultValue`. `undefined` means uncontrolled; controlled `null` means empty. `onChange(value, formattedText)` reports a committed value. Clearing reports `(null, "")`. A controlled picker waits for the parent to update its value. Form.Item can collect the Dayjs value directly; its empty-string field sentinel is treated as empty internally without adding strings to the public value type.

Typing edits a draft. Enter parses and commits a valid draft; invalid dates and disabled values do not trigger `onChange` and mark the input invalid. Escape, clicking outside, or leaving the complete widget discards an uncommitted draft. Composition Enter does not commit. Clicking a date commits it. Time column edits remain drafts until OK; Enter in the text input also commits a valid time.

`open`, `defaultOpen`, and `onOpenChange` support controlled and uncontrolled popups. `disabled`, `inputReadOnly`, `allowClear`, `placeholder`, `size`, `status`, `id`, `name`, input labels, and descriptions are supported. The ref exposes `nativeElement`, `focus`, and `blur`. Popups use the existing Popover positioning and portal implementation, including `getPopupContainer` and its ConfigProvider default.

## Dates, time, and locale

DatePicker defaults to `YYYY-MM-DD`; TimePicker defaults to `HH:mm:ss`. `format` is a Dayjs strict parsing/formatting string, not a format array, formatter callback, or mask. Invalid dates such as February 31 are rejected. TimePicker uses 24-hour columns. Its hour/minute/second steps must be positive integers within 24/60/60; both text input and confirmation enforce them. `disabledTime` returns `disabledHours`, `disabledMinutes(hour)`, and `disabledSeconds(hour, minute)`. DatePicker checks `disabledDate` for both typed and panel selections.

Provide locale text through `ConfigProvider.locale.DatePicker` / `.TimePicker` or the component's `locale`. The component locale overrides individual provider fields. Load the corresponding Dayjs locale when using non-English month/day names:

```tsx
import "dayjs/locale/fr";
<DatePicker locale={{ locale: "fr", placeholder: "Choisir une date" }} format="DD MMMM YYYY" />;
```

Date panels respect the locale's first weekday. Arrow keys move one day or week; Home/End move to the locale week's boundaries; PageUp/PageDown move one month, or one year with Shift. ArrowDown from the input enters the panel. Date cells expose their full date and selected state, and disabled dates remain navigable but cannot be committed. Time columns use native select keyboard interaction. Tab can leave the widget without a focus trap.

## Deliberate limits

This version does not expose `TimePicker.RangePicker`, `showTime`, multiple selection, week/month/quarter/year picker modes, 12-hour columns, millisecond columns, presets, custom date adapters, date masks, custom cell renderers, or the full upstream semantic styling API. No placeholder exports are provided. Only supported props are included in TypeScript types.

The default time popup shows all three columns, even when the display format omits seconds. Use a format that describes the value you intend to collect; formatting does not change the three-column model. Timezone conversion and DST scheduling policies are the application's responsibility.

## Date ranges

`DatePicker.RangePicker` collects one `[Dayjs | null, Dayjs | null]` tuple. Use `value={null}` for a controlled empty range; `undefined` selects uncontrolled state. Both endpoints share a popup and a draft. Selecting the start moves to the end; completing a valid pair commits automatically by default, including when the end was edited first. Set `needConfirm` to keep panel selections provisional until OK. Enter in the end input also commits a valid typed range. `onCalendarChange` reports provisional tuples and `{ range: "start" | "end" }`; `onChange` reports only committed values. Clearing reports `(null, ["", ""])`.

```tsx
<DatePicker.RangePicker
  defaultValue={[dayjs("2025-06-10"), dayjs("2025-06-20")]}
  needConfirm
  onChange={(range, texts) => console.log(range, texts)}
/>;
```

Both dates are required by default. `allowEmpty={[true, false]}` permits an empty start; enabling either empty endpoint defaults to confirmation so a partial range is deliberate. An explicit `needConfirm={false}` restores automatic end selection. The start must not follow the end; reversed ranges remain uncommitted rather than being automatically reordered. `disabledDate(date, { type: "date", from })` receives the other endpoint when present and applies to text and panel selections. `disabled={[true, false]}` locks the existing start while allowing the end to change; clearing the entire range is unavailable while either endpoint is disabled.

Valid typed dates join the shared draft without requiring Enter before switching endpoints. Invalid text stays visible and prevents the other endpoint from silently replacing it. Escape, outside clicks, or leaving the complete widget discard the shared draft. Parent value changes replace the draft, including while open. ArrowDown enters the calendar for the focused endpoint; the single-date calendar keyboard shortcuts apply. Use the two labelled endpoint buttons to switch dates in the popup. Form.Item collects the tuple as one field. `placeholder` accepts two labels, with defaults from `locale.rangePlaceholder`. Ref focus targets the first enabled input.

This range implementation uses one calendar panel. It does not expose range time selection, presets, automatic ordering options, multiple ranges, or independently controlled panel dates. These unsupported props are omitted from its types.
