/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { useEffect, useId, useRef, useState } from "octane";
import { componentClassName } from "../_util/componentClassName";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import { Popover, type PopoverProps } from "../popover";
import {
  Color,
  type ColorFormatType,
  type ColorValue,
  formatColor,
  parseColor,
} from "./color";

export type { ColorFormatType, ColorValue, HSB } from "./color";
export { Color } from "./color";
export interface ColorPickerProps {
  value?: ColorValue;
  defaultValue?: ColorValue;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChange?: (value: Color, css: string) => void;
  onChangeComplete?: (value: Color) => void;
  onClear?: () => void;
  format?: ColorFormatType;
  defaultFormat?: ColorFormatType;
  onFormatChange?: (format: ColorFormatType) => void;
  disabledFormat?: boolean;
  disabledAlpha?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  showText?: boolean | ((color: Color) => OctaneNode);
  presets?: {
    label: OctaneNode;
    colors: (string | Color)[];
    defaultOpen?: boolean;
    key?: string | number;
  }[];
  placement?: PopoverProps["placement"];
  trigger?: "click" | "hover";
  getPopupContainer?: PopoverProps["getPopupContainer"];
  destroyOnHidden?: boolean;
  arrow?: PopoverProps["arrow"];
  autoAdjustOverflow?: PopoverProps["autoAdjustOverflow"];
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  id?: string;
  "aria-label"?: string;
}

export function ColorPicker(props: ColorPickerProps) {
  const config = useConfig();
  const { token: t, base } = useComponentTokens("ColorPicker");
  const prefix = config.getPrefixCls("color-picker", props.prefixCls);
  const cls = (suffix = "") =>
    componentClassName("ant-color-picker", prefix, suffix);
  const disabled = props.disabled ?? config.componentDisabled;
  const size = props.size ?? config.componentSize ?? "middle";
  const [inner, setInner] = useState(
    () =>
      new Color(
        props.defaultValue === undefined ? "#1677ff" : props.defaultValue,
      ),
  );
  const [innerOpen, setInnerOpen] = useState(props.defaultOpen ?? false);
  const [innerFormat, setInnerFormat] = useState<ColorFormatType>(
    props.defaultFormat ?? "hex",
  );
  const color = props.value === undefined ? inner : new Color(props.value);
  const format = props.format ?? innerFormat;
  const opened = !disabled && (props.open ?? innerOpen);
  const [draft, setDraft] = useState<string | undefined>();
  const [invalid, setInvalid] = useState(false);
  const lastValue = useRef(color.toHexString());
  const lastFormat = useRef(format);
  const dragCleanup = useRef<(() => void) | undefined>();
  const latest = useRef(color);
  const panel = useRef<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();
  const hsv = color.toHsb();
  useEffect(() => {
    if (
      lastValue.current !== color.toHexString() ||
      lastFormat.current !== format
    ) {
      setDraft(undefined);
      setInvalid(false);
      lastValue.current = color.toHexString();
      lastFormat.current = format;
    }
  }, [color.toHexString(), format]);
  useEffect(() => {
    if (!opened || disabled) dragCleanup.current?.();
    return () => dragCleanup.current?.();
  }, [opened, disabled]);
  const setOpen = (next: boolean) => {
    if (disabled || next === opened) return;
    if (props.open === undefined) setInnerOpen(next);
    props.onOpenChange?.(next);
    if (!next) {
      setDraft(undefined);
      setInvalid(false);
    }
  };
  const change = (next: Color, complete = false) => {
    if (disabled) return;
    if (props.disabledAlpha && !next.cleared)
      next = new Color({ ...next.toHsb(), a: 1 });
    latest.current = next;
    if (props.value === undefined) setInner(next);
    setDraft(undefined);
    setInvalid(false);
    props.onChange?.(new Color(next), next.toCssString());
    if (complete) props.onChangeComplete?.(new Color(next));
  };
  const commit = () => {
    if (draft === undefined) return;
    const next = parseColor(draft);
    if (next) change(next, true);
    else setInvalid(true);
  };
  const vars = {
    ...base,
    "--ao-cp-height": `${size === "small" ? t.controlHeightSM : size === "large" ? t.controlHeightLG : t.controlHeight}px`,
    "--ao-cp-border": t.colorBorder,
    "--ao-cp-disabled": t.colorTextDisabled,
    "--ao-cp-radius": `${t.borderRadius}px`,
  };
  const channels = [
    { key: "h" as const, label: "Hue", max: 359, value: hsv.h, scale: 1 },
    {
      key: "s" as const,
      label: "Saturation",
      max: 100,
      value: hsv.s * 100,
      scale: 100,
    },
    {
      key: "b" as const,
      label: "Brightness",
      max: 100,
      value: hsv.b * 100,
      scale: 100,
    },
    ...(!props.disabledAlpha
      ? [
          {
            key: "a" as const,
            label: "Alpha",
            max: 100,
            value: hsv.a * 100,
            scale: 100,
          },
        ]
      : []),
  ];
  const content = (
    <div
      ref={panel}
      id={panelId}
      className={cls("-panel")}
      style={vars}
      dir={config.direction}
      role="dialog"
      aria-label="Color picker"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <div
        className={cls("-saturation")}
        aria-hidden="true"
        style={{
          backgroundColor: new Color({
            h: hsv.h,
            s: 1,
            b: 1,
            a: 1,
          }).toHexString(),
        }}
        onPointerDown={(event) => {
          if (disabled || event.button !== 0) return;
          event.preventDefault();
          dragCleanup.current?.();
          const target = event.currentTarget as HTMLElement;
          const rect = target.getBoundingClientRect();
          const id = event.pointerId;
          const start = { ...hsv };
          const update = (e: PointerEvent) => {
            if (e.pointerId !== id || !rect.width || !rect.height) return;
            change(
              new Color({
                ...start,
                s: Math.max(
                  0,
                  Math.min(1, (e.clientX - rect.left) / rect.width),
                ),
                b:
                  1 -
                  Math.max(
                    0,
                    Math.min(1, (e.clientY - rect.top) / rect.height),
                  ),
              }),
            );
          };
          const cleanup = () => {
            document.removeEventListener("pointermove", update);
            document.removeEventListener("pointerup", finish);
            document.removeEventListener("pointercancel", cancel);
            dragCleanup.current = undefined;
          };
          const finish = (e: PointerEvent) => {
            if (e.pointerId !== id) return;
            update(e);
            cleanup();
            props.onChangeComplete?.(new Color(latest.current));
          };
          const cancel = (e: PointerEvent) => {
            if (e.pointerId === id) cleanup();
          };
          dragCleanup.current = cleanup;
          document.addEventListener("pointermove", update);
          document.addEventListener("pointerup", finish);
          document.addEventListener("pointercancel", cancel);
          update(event);
        }}
      >
        <span
          className={cls("-cursor")}
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.b) * 100}%`,
            background: color.toCssString(),
          }}
        />
      </div>
      {channels.map(({ key, label, max, value, scale }) => (
        <label key={key} className={cls("-channel")}>
          <span>{label}</span>
          <input
            aria-label={label}
            type="range"
            min={0}
            max={max}
            step={1}
            value={Math.round(value)}
            disabled={disabled}
            onInput={(event) =>
              change(
                new Color({
                  ...hsv,
                  [key]:
                    Number((event.target as HTMLInputElement).value) / scale,
                }),
              )
            }
            onChange={() => {
              if (!disabled)
                props.onChangeComplete?.(new Color(latest.current));
            }}
          />
          <output>{Math.round(value)}</output>
        </label>
      ))}
      <div className={cls("-input-row")}>
        <select
          aria-label="Color format"
          value={format}
          disabled={disabled || props.disabledFormat}
          onChange={(event) => {
            const next = (event.target as HTMLSelectElement)
              .value as ColorFormatType;
            if (props.format === undefined) setInnerFormat(next);
            setDraft(undefined);
            setInvalid(false);
            props.onFormatChange?.(next);
          }}
        >
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
          <option value="hsb">HSB</option>
        </select>
        <input
          aria-label="Color value"
          aria-invalid={invalid || undefined}
          value={draft ?? formatColor(color, format)}
          disabled={disabled}
          onInput={(event) => {
            setDraft((event.target as HTMLInputElement).value);
            setInvalid(false);
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.isComposing) {
              event.preventDefault();
              commit();
            }
          }}
        />
      </div>
      {invalid && (
        <div role="alert">Enter a valid HEX, RGB, HSL or HSB color.</div>
      )}
      {props.allowClear && (
        <button
          type="button"
          disabled={disabled || color.cleared}
          onClick={() => {
            change(new Color(null), true);
            props.onClear?.();
          }}
        >
          Clear
        </button>
      )}
      {props.presets?.map((preset, index) => (
        <details key={preset.key ?? index} open={preset.defaultOpen ?? true}>
          <summary>{preset.label}</summary>
          <div className={cls("-presets")}>
            {preset.colors.map((item, i) => {
              const candidate = item instanceof Color ? item : parseColor(item);
              return (
                candidate && (
                  <button
                    key={i}
                    type="button"
                    className={cls("-preset")}
                    disabled={disabled}
                    aria-label={candidate.toHexString()}
                    title={candidate.toHexString()}
                    style={{ background: candidate.toCssString() }}
                    onClick={() => change(candidate, true)}
                  />
                )
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
  return (
    <Popover
      open={opened}
      onOpenChange={setOpen}
      trigger={disabled ? [] : (props.trigger ?? "click")}
      placement={props.placement ?? "bottomLeft"}
      content={content}
      getPopupContainer={props.getPopupContainer}
      destroyOnHidden={props.destroyOnHidden}
      arrow={props.arrow ?? true}
      autoAdjustOverflow={props.autoAdjustOverflow}
      rootClassName={props.rootClassName}
      afterOpenChange={(next) => {
        if (next)
          panel.current?.querySelector<HTMLInputElement>("input")?.focus();
      }}
    >
      <button
        ref={trigger}
        id={props.id}
        type="button"
        disabled={disabled}
        className={[cls(), disabled && cls("-disabled"), props.className]}
        style={{ ...vars, ...props.style }}
        aria-label={props["aria-label"] ?? "Choose color"}
        aria-haspopup="dialog"
        aria-expanded={opened}
        aria-controls={opened ? panelId : undefined}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className={[cls("-swatch"), color.cleared && cls("-cleared")]}>
          <span style={{ background: color.toCssString() }} />
        </span>
        {props.showText && (
          <span>
            {typeof props.showText === "function"
              ? props.showText(color)
              : color.cleared
                ? "Clear"
                : formatColor(color, format)}
          </span>
        )}
      </button>
    </Popover>
  );
}
