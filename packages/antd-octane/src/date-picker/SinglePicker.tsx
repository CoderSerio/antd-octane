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
import type { DatePickerProps, TimePickerProps } from "./interface";

type Props = DatePickerProps & TimePickerProps & { kind: "date" | "time" };
function step(value: number | undefined, limit: number) {
  if (value === undefined) return 1;
  if (!Number.isInteger(value) || value < 1 || value > limit)
    throw new RangeError(
      `Picker step must be an integer between 1 and ${limit}`,
    );
  return value;
}
export function SinglePicker(props: Props) {
  const config = useConfig();
  const [contextLocale] = useLocale(
    props.kind === "date" ? "DatePicker" : "TimePicker",
  );
  const locale = { ...contextLocale, ...props.locale };
  const localeName = locale.locale || "en";
  const format =
    props.format ?? (props.kind === "date" ? "YYYY-MM-DD" : "HH:mm:ss");
  const disabled = props.disabled ?? config.componentDisabled ?? false;
  const size = props.size ?? config.componentSize ?? "middle";
  const { token } = useComponentTokens("Input");
  const [internal, setInternal] = useState<Dayjs | null>(
    props.defaultValue ?? null,
  );
  const rawValue = props.value !== undefined ? props.value : internal;
  // Form.Item uses an empty string for unset value fields. It is an empty picker, not a date.
  const value = dayjs.isDayjs(rawValue) ? rawValue : null;
  const print = (date: Dayjs | null) =>
    date?.isValid() ? date.locale(localeName).format(format) : "";
  const [text, setText] = useState(print(value));
  const [invalid, setInvalid] = useState(false);
  const [internalOpen, setInternalOpen] = useState(props.defaultOpen ?? false);
  const open = !disabled && (props.open ?? internalOpen);
  const [cursor, setCursor] = useState(value?.isValid() ? value : dayjs());
  const root = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const composing = useRef(false);
  const pendingFocus = useRef(false);
  const panelId = useId();
  const hourStep = step(props.hourStep, 24);
  const minuteStep = step(props.minuteStep, 60);
  const secondStep = step(props.secondStep, 60);
  const allowed = (date: Dayjs) => {
    if (!date.isValid()) return false;
    if (props.kind === "date") return !props.disabledDate?.(date);
    const blocked = props.disabledTime?.(date);
    return (
      date.hour() % hourStep === 0 &&
      date.minute() % minuteStep === 0 &&
      date.second() % secondStep === 0 &&
      !blocked?.disabledHours?.().includes(date.hour()) &&
      !blocked?.disabledMinutes?.(date.hour()).includes(date.minute()) &&
      !blocked
        ?.disabledSeconds?.(date.hour(), date.minute())
        .includes(date.second())
    );
  };
  useEffect(() => {
    setText(print(value));
    setInvalid(false);
  }, [value?.valueOf(), format, localeName]);
  const previousPanel = useRef({ open: false, value: value?.valueOf() });
  useEffect(() => {
    const previous = previousPanel.current;
    const valueChanged = previous.value !== value?.valueOf();
    previousPanel.current = { open, value: value?.valueOf() };
    // A parent change supersedes a draft; unrelated renders must not reset it.
    if (open && (!previous.open || valueChanged)) {
      setCursor(
        value?.isValid()
          ? value
          : dayjs().startOf(props.kind === "date" ? "day" : "hour"),
      );
    }
  }, [open, value?.valueOf()]);
  const setOpen = (next: boolean) => {
    if (disabled || next === open) return;
    if (next)
      setCursor(
        value?.isValid()
          ? value
          : dayjs().startOf(props.kind === "date" ? "day" : "hour"),
      );
    if (props.open === undefined) setInternalOpen(next);
    props.onOpenChange?.(next);
  };
  const cancel = () => {
    setText(print(value));
    setInvalid(false);
    setOpen(false);
  };
  useImperativeHandle(
    props.ref,
    () => ({
      get nativeElement() {
        return root.current;
      },
      focus: (options?: FocusOptions) => input.current?.focus(options),
      blur: () => input.current?.blur(),
    }),
    [],
  );
  const commit = (next: Dayjs | null) => {
    if (disabled || (next !== null && !allowed(next))) {
      setInvalid(true);
      return false;
    }
    if (props.value === undefined) setInternal(next);
    setText(print(props.value === undefined ? next : value));
    setInvalid(false);
    if ((next?.valueOf() ?? null) !== (value?.valueOf() ?? null))
      props.onChange?.(next, print(next));
    setOpen(false);
    return true;
  };
  const submitText = () => {
    if (text.trim() === "") return commit(null);
    // Pass locale during strict parsing: changing it afterward cannot parse month names.
    const parsed = dayjs(text, format, localeName, true);
    if (!parsed.isValid()) {
      setInvalid(true);
      return false;
    }
    return commit(parsed);
  };
  const focusPanel = () =>
    panel.current
      ?.querySelector<HTMLElement>(
        props.kind === "date" ? '[data-active="true"]' : "select",
      )
      ?.focus();
  useLayoutEffect(() => {
    if (open && pendingFocus.current && panel.current) {
      pendingFocus.current = false;
      focusPanel();
    }
  }, [open, cursor.valueOf()]);
  const focusCell = (date: Dayjs) => {
    pendingFocus.current = true;
    setCursor(date);
  };
  const dateKey = (event: KeyboardEvent) => {
    let next: Dayjs | undefined;
    if (event.key === "ArrowLeft") next = cursor.subtract(1, "day");
    if (event.key === "ArrowRight") next = cursor.add(1, "day");
    if (event.key === "ArrowUp") next = cursor.subtract(7, "day");
    if (event.key === "ArrowDown") next = cursor.add(7, "day");
    if (event.key === "PageUp")
      next = cursor.subtract(1, event.shiftKey ? "year" : "month");
    if (event.key === "PageDown")
      next = cursor.add(1, event.shiftKey ? "year" : "month");
    if (event.key === "Home")
      next = generateConfig.locale.getWeekFirstDate(localeName, cursor);
    if (event.key === "End")
      next = generateConfig.locale
        .getWeekFirstDate(localeName, cursor)
        .add(6, "day");
    if (next) {
      event.preventDefault();
      focusCell(next);
    }
  };
  const units = ["hour", "minute", "second"] as const;
  const variables = {
    "--ao-picker-bg": token.colorBgContainer,
    "--ao-picker-color": token.colorText,
    "--ao-picker-border": token.colorBorder,
    "--ao-picker-primary": token.colorPrimary,
    "--ao-picker-error": token.colorError,
    "--ao-picker-warning": token.colorWarning,
    "--ao-picker-shadow": token.boxShadowSecondary,
    "--ao-picker-disabled": token.colorTextDisabled,
  };
  const contents = open ? (
    <div
      style={variables}
      onMouseDown={(event) => {
        // Keep focus for clicks on panel chrome/buttons, including browsers that
        // do not focus buttons. Editable controls retain their native behavior.
        if (
          event.target instanceof Element &&
          !event.target.closest("input,select,textarea,[contenteditable=true]")
        )
          event.preventDefault();
      }}
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
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          cancel();
          input.current?.focus();
        }
      }}
      onBlur={(event) => {
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
      }}
      id={panelId}
      role="dialog"
      aria-label={locale.placeholder}
      className="ao-single-picker-panel"
    >
      {props.kind === "date" ? (
        <DatePanel
          cursor={cursor}
          selected={value ? [value] : []}
          locale={locale}
          localeName={localeName}
          allowed={allowed}
          setCursor={setCursor}
          onKeyDown={dateKey}
          onSelect={(date) => {
            if (commit(date)) input.current?.focus();
          }}
        />
      ) : (
        <>
          <div className="ao-picker-time-columns">
            {units.map((unit, index) => {
              const limit = index === 0 ? 24 : 60;
              const stride = [hourStep, minuteStep, secondStep][index];
              return (
                <label key={unit}>
                  {locale[unit]}
                  <select
                    aria-label={locale[unit]}
                    size={6}
                    value={String(cursor[unit]())}
                    onChange={(event) =>
                      setCursor(
                        cursor.set(unit, Number(event.currentTarget.value)),
                      )
                    }
                  >
                    {Array.from(
                      { length: Math.ceil(limit / stride) },
                      (_, i) => i * stride,
                    ).map((number) => {
                      const candidate = cursor.set(unit, number);
                      const blocks = props.disabledTime?.(candidate);
                      const unavailable =
                        unit === "hour"
                          ? blocks?.disabledHours?.().includes(number)
                          : unit === "minute"
                            ? blocks
                                ?.disabledMinutes?.(candidate.hour())
                                .includes(number)
                            : blocks
                                ?.disabledSeconds?.(
                                  candidate.hour(),
                                  candidate.minute(),
                                )
                                .includes(number);
                      return (
                        <option
                          key={number}
                          value={String(number)}
                          disabled={unavailable}
                        >
                          {String(number).padStart(2, "0")}
                        </option>
                      );
                    })}
                  </select>
                </label>
              );
            })}
          </div>
          <button
            type="button"
            disabled={!allowed(cursor)}
            onClick={() => {
              if (commit(cursor)) input.current?.focus();
            }}
          >
            {locale.ok}
          </button>
        </>
      )}
    </div>
  ) : null;
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) setOpen(true);
        else cancel();
      }}
      trigger={[]}
      placement="bottomLeft"
      arrow={false}
      fresh
      destroyOnHidden
      getPopupContainer={props.getPopupContainer}
      content={contents}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: This input and popup wrapper is not a form fieldset. */}
      <div
        role="group"
        ref={root}
        className={[
          "ao-single-picker",
          `ao-single-picker-${size}`,
          props.status && `ao-single-picker-${props.status}`,
          props.className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ ...variables, ...props.style }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            cancel();
            input.current?.focus();
          }
        }}
        onBlur={(event) => {
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
        }}
      >
        <input
          ref={input}
          id={props.id}
          name={props.name}
          value={text}
          disabled={disabled}
          readOnly={props.inputReadOnly}
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={
            props["aria-label"] ?? props.placeholder ?? locale.placeholder
          }
          aria-describedby={props["aria-describedby"]}
          aria-invalid={invalid || props.status === "error" || undefined}
          placeholder={props.placeholder ?? locale.placeholder}
          onFocus={props.onFocus}
          onClick={() => setOpen(true)}
          onCompositionStart={() => {
            composing.current = true;
          }}
          onCompositionEnd={() => {
            composing.current = false;
          }}
          onInput={(event) => {
            setText(event.currentTarget.value);
            setInvalid(false);
          }}
          onKeyDown={(event) => {
            if (composing.current || event.isComposing) return;
            if (event.key === "Enter") {
              event.preventDefault();
              submitText();
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (open) focusPanel();
              else {
                pendingFocus.current = true;
                setOpen(true);
              }
            }
          }}
        />
        {(props.allowClear ?? true) && value !== null && (
          <button
            type="button"
            disabled={disabled}
            aria-label={locale.clear}
            onClick={(event) => {
              event.stopPropagation();
              commit(null);
              input.current?.focus();
            }}
          >
            ×
          </button>
        )}
        <button
          type="button"
          disabled={disabled}
          aria-label={locale.placeholder}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          ▾
        </button>
      </div>
    </Popover>
  );
}
