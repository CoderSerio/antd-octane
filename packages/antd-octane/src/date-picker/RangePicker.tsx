/** @jsxImportSource octane */
import dayjs, { type Dayjs } from "dayjs";
import {
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import { useComponentTokens } from "../_util/tokens";
import generateConfig from "../calendar/dayjs";
import { useConfig } from "../config-provider";
import useLocale from "../locale/useLocale";
import { Popover } from "../popover";
import { DatePanel } from "./DatePanel";
import type { DateRange, RangePickerProps } from "./interface";

function asRange(value: unknown): DateRange {
  return Array.isArray(value)
    ? [
        dayjs.isDayjs(value[0]) && value[0].isValid() ? value[0] : null,
        dayjs.isDayjs(value[1]) && value[1].isValid() ? value[1] : null,
      ]
    : [null, null];
}
function signature(value: DateRange) {
  return value.map((date) => date?.valueOf() ?? "empty").join("/");
}
export function RangePicker(props: RangePickerProps) {
  const config = useConfig();
  const [contextLocale] = useLocale("DatePicker");
  const locale = { ...contextLocale, ...props.locale };
  const localeName = locale.locale ?? "en";
  const format = props.format ?? "YYYY-MM-DD";
  const placeholders = props.placeholder ??
    locale.rangePlaceholder ?? ["Start date", "End date"];
  const disabledProp = props.disabled ?? config.componentDisabled ?? false;
  const disabled: [boolean, boolean] = Array.isArray(disabledProp)
    ? disabledProp
    : [disabledProp, disabledProp];
  const allDisabled = disabled.every(Boolean);
  const allowEmpty = props.allowEmpty ?? [false, false];
  const needsConfirmation = props.needConfirm ?? allowEmpty.some(Boolean);
  const [internal, setInternal] = useState<DateRange | null>(
    props.defaultValue ?? null,
  );
  const value = asRange(props.value !== undefined ? props.value : internal);
  const valueKey = signature(value);
  const print = (date: Dayjs | null) =>
    date?.isValid() ? date.locale(localeName).format(format) : "";
  const strings = (dates: DateRange): [string, string] => [
    print(dates[0]),
    print(dates[1]),
  ];
  const [draft, setDraft] = useState<DateRange>(value);
  const [texts, setTexts] = useState<[string, string]>(strings(value));
  const [invalid, setInvalid] = useState(false);
  const [active, setActive] = useState<0 | 1>(disabled[0] ? 1 : 0);
  const [cursor, setCursor] = useState(value[active] ?? dayjs().startOf("day"));
  const [innerOpen, setInnerOpen] = useState(props.defaultOpen ?? false);
  const open = !allDisabled && (props.open ?? innerOpen);
  const root = useRef<HTMLDivElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const inputs = useRef<[HTMLInputElement | null, HTMLInputElement | null]>([
    null,
    null,
  ]);
  const composing = useRef(false);
  const edited = useRef<[boolean, boolean]>([false, false]);
  const pendingFocus = useRef(false);
  const panelId = useId();
  const { token } = useComponentTokens("Input");
  const variables = {
    "--ao-picker-bg": token.colorBgContainer,
    "--ao-picker-color": token.colorText,
    "--ao-picker-border": token.colorBorder,
    "--ao-picker-primary": token.colorPrimary,
    "--ao-picker-disabled": token.colorTextDisabled,
    "--ao-picker-error": token.colorError,
    "--ao-picker-warning": token.colorWarning,
    "--ao-picker-range": token.controlItemBgActive,
  };
  const setOpen = (next: boolean) => {
    if (allDisabled || next === open) return;
    if (props.open === undefined) setInnerOpen(next);
    props.onOpenChange?.(next);
  };
  const reset = () => {
    edited.current = [false, false];
    setDraft(value);
    setTexts(strings(value));
    setInvalid(false);
  };
  const cancel = () => {
    reset();
    setOpen(false);
  };
  const previous = useRef({ open: false, value: valueKey, format, localeName });
  useEffect(() => {
    const prev = previous.current;
    previous.current = { open, value: valueKey, format, localeName };
    if (
      valueKey !== prev.value ||
      format !== prev.format ||
      localeName !== prev.localeName ||
      (prev.open && !open)
    ) {
      reset();
      const index = disabled[active] ? (disabled[0] ? 1 : 0) : active;
      setActive(index);
      setCursor(value[index] ?? value[1 - index] ?? dayjs().startOf("day"));
    }
  }, [valueKey, open, format, localeName]);
  const focusPanel = () =>
    panel.current
      ?.querySelector<HTMLButtonElement>('[data-active="true"]')
      ?.focus();
  useLayoutEffect(() => {
    if (open && pendingFocus.current && panel.current) {
      pendingFocus.current = false;
      focusPanel();
    }
  }, [open, cursor.valueOf(), active]);
  useImperativeHandle(
    props.ref,
    () => ({
      get nativeElement() {
        return root.current;
      },
      focus: (options?: FocusOptions) =>
        inputs.current[disabled[0] ? 1 : 0]?.focus(options),
      blur: () => {
        inputs.current[0]?.blur();
        inputs.current[1]?.blur();
      },
    }),
    [disabled[0]],
  );
  const allowed = (date: Dayjs, index: 0 | 1, dates: DateRange) =>
    date.isValid() &&
    !disabled[index] &&
    !props.disabledDate?.(date, {
      type: "date",
      from: dates[1 - index] ?? undefined,
    });
  const parse = (replacing?: 0 | 1): DateRange | undefined => {
    const result: DateRange = [null, null];
    for (const index of [0, 1] as const) {
      if (disabled[index]) {
        result[index] = value[index];
        continue;
      }
      if (index === replacing || !texts[index].trim()) continue;
      const parsed = dayjs(texts[index], format, localeName, true);
      if (!parsed.isValid()) return;
      result[index] = parsed;
    }
    return result;
  };
  const valid = (dates: DateRange) => {
    for (const index of [0, 1] as const) {
      const date = dates[index];
      if (!date) {
        if (!allowEmpty[index]) return false;
      } else if (disabled[index]) {
        if (!date.isValid()) return false;
      } else if (!allowed(date, index, dates)) return false;
    }
    return !(dates[0] && dates[1] && dates[0].isAfter(dates[1], "day"));
  };
  const stage = (dates: DateRange, index: 0 | 1) => {
    setDraft(dates);
    setTexts(strings(dates));
    setInvalid(false);
    props.onCalendarChange?.([...dates], strings(dates), {
      range: index === 0 ? "start" : "end",
    });
  };
  const activate = (index: 0 | 1) => {
    if (disabled[index]) return;
    setActive(index);
    setCursor(draft[index] ?? draft[1 - index] ?? dayjs().startOf("day"));
    setOpen(true);
  };
  const finish = (dates: DateRange) => {
    if (!valid(dates)) {
      setInvalid(true);
      return;
    }
    const next = dates.every((date) => date === null) ? null : dates;
    if (props.value === undefined) setInternal(next);
    if (signature(dates) !== valueKey) props.onChange?.(next, strings(dates));
    if (props.value !== undefined) reset();
    else {
      setDraft(dates);
      setTexts(strings(dates));
      setInvalid(false);
    }
    edited.current = [false, false];
    setOpen(false);
    inputs.current[active]?.focus();
  };
  const confirm = () => {
    const dates = parse();
    if (!dates) {
      setInvalid(true);
      return;
    }
    finish(dates);
  };
  const select = (date: Dayjs) => {
    if (!allowed(date, active, draft)) return;
    const next = parse(active);
    if (!next) {
      setInvalid(true);
      return;
    }
    next[active] = date;
    edited.current[active] = true;
    stage(next, active);
    if (
      !needsConfirmation &&
      (active === 1 || edited.current[1 - active] || disabled[1 - active])
    ) {
      finish(next);
      return;
    }
    if (active === 0 && !disabled[1]) {
      setActive(1);
      setCursor(next[1] ?? date);
      inputs.current[1]?.focus();
    }
  };
  const leave = (event: FocusEvent) => {
    if (
      !(
        event.relatedTarget instanceof Node &&
        (root.current?.contains(event.relatedTarget) ||
          panel.current?.contains(event.relatedTarget))
      )
    ) {
      cancel();
      props.onBlur?.(event);
    }
  };
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      cancel();
      inputs.current[active]?.focus();
    }
  };
  const dateKey = (event: KeyboardEvent) => {
    let next: Dayjs | undefined;
    const offset: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (event.key in offset) next = cursor.add(offset[event.key], "day");
    if (event.key === "PageUp" || event.key === "PageDown")
      next = cursor.add(
        event.key === "PageUp" ? -1 : 1,
        event.shiftKey ? "year" : "month",
      );
    if (event.key === "Home" || event.key === "End")
      next = generateConfig.locale
        .getWeekFirstDate(localeName, cursor)
        .add(event.key === "End" ? 6 : 0, "day");
    if (next) {
      event.preventDefault();
      pendingFocus.current = true;
      setCursor(next);
    }
  };
  const contents = open ? (
    <div
      role="dialog"
      aria-label={placeholders[active]}
      id={panelId}
      className="ao-single-picker-panel"
      style={variables}
      ref={(node) => {
        panel.current = node;
        if (node && pendingFocus.current)
          queueMicrotask(() => {
            if (pendingFocus.current && panel.current) {
              pendingFocus.current = false;
              focusPanel();
            }
          });
      }}
      onMouseDown={(event) => {
        if (
          event.target instanceof Element &&
          !event.target.closest("input,select,textarea,[contenteditable=true]")
        )
          event.preventDefault();
      }}
      onBlur={leave}
      onKeyDown={handleEscape}
    >
      <div className="ao-range-picker-endpoints">
        {([0, 1] as const).map((index) => (
          <button
            type="button"
            key={index}
            disabled={disabled[index]}
            aria-pressed={active === index}
            onClick={() => activate(index)}
          >
            {placeholders[index]}
          </button>
        ))}
      </div>
      <DatePanel
        cursor={cursor}
        selected={draft.filter((date): date is Dayjs => date !== null)}
        range={draft}
        locale={locale}
        localeName={localeName}
        allowed={(date) => allowed(date, active, draft)}
        setCursor={setCursor}
        onKeyDown={dateKey}
        onSelect={select}
      />
      {needsConfirmation && (
        <button type="button" onClick={confirm}>
          {locale.ok}
        </button>
      )}
    </div>
  ) : null;
  return (
    <Popover
      open={open}
      trigger={[]}
      onOpenChange={(next) => {
        if (next) activate(active);
        else cancel();
      }}
      placement="bottomLeft"
      arrow={false}
      fresh
      destroyOnHidden
      getPopupContainer={props.getPopupContainer}
      content={contents}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: Compound input and popup is not a form fieldset. */}
      <div
        ref={root}
        role="group"
        className={[
          "ao-single-picker",
          "ao-range-picker",
          `ao-single-picker-${props.size ?? config.componentSize ?? "middle"}`,
          props.status && `ao-single-picker-${props.status}`,
          props.className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ ...variables, ...props.style }}
        onBlur={leave}
        onKeyDown={handleEscape}
      >
        {([0, 1] as const).map((index) => (
          <input
            key={index}
            ref={(node) => {
              inputs.current[index] = node;
            }}
            id={
              index === 0 ? props.id : props.id ? `${props.id}-end` : undefined
            }
            name={props.name ? `${props.name}[${index}]` : undefined}
            value={texts[index]}
            disabled={disabled[index]}
            readOnly={props.inputReadOnly}
            placeholder={placeholders[index]}
            aria-label={
              props["aria-label"]
                ? `${props["aria-label"]} ${placeholders[index]}`
                : placeholders[index]
            }
            aria-describedby={props["aria-describedby"]}
            role="combobox"
            aria-haspopup="dialog"
            aria-expanded={open && active === index}
            aria-controls={open ? panelId : undefined}
            aria-invalid={invalid || props.status === "error" || undefined}
            onFocus={(event) => {
              if (active !== index) {
                setActive(index);
                setCursor(
                  draft[index] ?? draft[1 - index] ?? dayjs().startOf("day"),
                );
              }
              props.onFocus?.(event);
            }}
            onClick={() => activate(index)}
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={() => {
              composing.current = false;
            }}
            onInput={(event) => {
              const next: [string, string] = [...texts];
              next[index] = event.currentTarget.value;
              setTexts(next);
              edited.current[index] = true;
              const text = next[index].trim();
              const date = text
                ? dayjs(next[index], format, localeName, true)
                : null;
              if (!date || date.isValid()) {
                const dates: DateRange = [...draft];
                dates[index] = date;
                setDraft(dates);
                setInvalid(false);
              } else setInvalid(true);
            }}
            onKeyDown={(event) => {
              if (composing.current || event.isComposing) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                pendingFocus.current = true;
                activate(index);
                if (open) focusPanel();
              }
              if (event.key === "Enter") {
                event.preventDefault();
                const dates = parse();
                if (!dates) {
                  setInvalid(true);
                  return;
                }
                if (index === 0 && !disabled[1]) {
                  if (dates[0] && !allowed(dates[0], 0, dates)) {
                    setInvalid(true);
                    return;
                  }
                  stage(dates, index);
                  activate(1);
                  setCursor(dates[1] ?? dates[0] ?? dayjs().startOf("day"));
                  inputs.current[1]?.focus();
                } else finish(dates);
              }
            }}
          />
        ))}
        {(props.allowClear ?? true) &&
          !disabled.some(Boolean) &&
          value.some(Boolean) && (
            <button
              type="button"
              aria-label={locale.clear}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (props.value === undefined) {
                  setInternal(null);
                  setDraft([null, null]);
                  setTexts(["", ""]);
                } else reset();
                props.onChange?.(null, ["", ""]);
                setInvalid(false);
                setOpen(false);
                inputs.current[0]?.focus();
              }}
            >
              ×
            </button>
          )}
      </div>
    </Popover>
  );
}
