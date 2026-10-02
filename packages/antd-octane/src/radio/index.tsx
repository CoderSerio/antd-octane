/** @jsxImportSource octane */
import type {
  CSSProperties,
  HTMLAttributes,
  InputHTMLAttributes,
  OctaneNode,
  Ref,
} from "octane";
import {
  createContext,
  useContext,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "octane";
import type { CheckboxRef } from "../checkbox";
import { useConfig } from "../config-provider";
import { resolveComponentAlias } from "../theme/resolve";
export type RadioValue = string | number | boolean;
export interface RadioChangeEvent {
  target: RadioProps & { checked: boolean };
  nativeEvent: Event;
  preventDefault: () => void;
  stopPropagation: () => void;
}
export interface RadioProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "style" | "value" | "ref" | "children" | "onChange"
  > {
  value?: RadioValue;
  style?: CSSProperties;
  children?: OctaneNode;
  ref?: Ref<CheckboxRef>;
  onChange?: (event: RadioChangeEvent) => void;
}
export interface RadioOption {
  label: OctaneNode;
  value: RadioValue;
  disabled?: boolean;
  title?: string;
  id?: string;
  style?: CSSProperties;
  className?: string;
}
export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: RadioValue;
  defaultValue?: RadioValue;
  options?: (string | number | RadioOption)[];
  name?: string;
  disabled?: boolean;
  optionType?: "default" | "button";
  buttonStyle?: "outline" | "solid";
  size?: "small" | "middle" | "large";
  block?: boolean;
  style?: CSSProperties;
  onChange?: (event: RadioChangeEvent) => void;
}
const RadioContext = createContext<{
  value?: RadioValue;
  name: string;
  disabled?: boolean;
  optionType?: "default" | "button";
  onChange: (event: RadioChangeEvent) => void;
} | null>(null);
function RadioControl({
  button = false,
  ...props
}: RadioProps & { button?: boolean }) {
  const group = useContext(RadioContext);
  const config = useConfig();
  const input = useRef<HTMLInputElement | null>(null);
  const element = useRef<HTMLSpanElement | null>(null);
  useImperativeHandle(
    props.ref,
    () => ({
      get input() {
        return input.current;
      },
      get nativeElement() {
        return element.current;
      },
      focus: (options?: FocusOptions) => input.current?.focus(options),
      blur: () => input.current?.blur(),
    }),
    [],
  );
  const {
    value,
    children,
    style,
    className,
    ref: _ref,
    onChange,
    disabled = group?.disabled ?? config.componentDisabled ?? false,
    ...rest
  } = props;
  const isButton = button || group?.optionType === "button";
  const t = resolveComponentAlias(config.theme, config.token, "Radio");
  const c = config.theme.components?.Radio;
  return (
    <label
      className={[
        isButton ? "ant-radio-button-wrapper" : "ant-radio-wrapper",
        disabled && "ant-radio-wrapper-disabled",
        className,
      ]}
      style={{
        "--ao-radio-size": `${c?.radioSize ?? t.fontSizeLG}px`,
        "--ao-radio-dot": `${c?.dotSize ?? t.fontSizeLG - (4 + t.lineWidth) * 2}px`,
        "--ao-radio-font": t.fontFamily,
        "--ao-radio-font-size": `${t.fontSize}px`,
        "--ao-radio-line": t.lineHeight,
        "--ao-radio-color": t.colorText,
        "--ao-radio-bg": t.colorBgContainer,
        "--ao-radio-border": t.colorBorder,
        "--ao-radio-primary": t.colorPrimary,
        "--ao-radio-hover": t.colorPrimaryHover,
        "--ao-radio-active": t.colorPrimaryActive,
        "--ao-radio-disabled": t.colorTextDisabled,
        "--ao-radio-disabled-bg": t.colorBgContainerDisabled,
        "--ao-radio-dot-disabled": c?.dotColorDisabled ?? t.colorTextDisabled,
        "--ao-radio-checked-bg": c?.buttonCheckedBg ?? t.colorBgContainer,
        "--ao-radio-button-bg": c?.buttonBg ?? t.colorBgContainer,
        "--ao-radio-button-color": c?.buttonColor ?? t.colorText,
        "--ao-radio-solid-color":
          c?.buttonSolidCheckedColor ?? t.colorTextLightSolid,
        "--ao-radio-solid-bg": c?.buttonSolidCheckedBg ?? t.colorPrimary,
        "--ao-radio-solid-hover":
          c?.buttonSolidCheckedHoverBg ?? t.colorPrimaryHover,
        "--ao-radio-solid-active":
          c?.buttonSolidCheckedActiveBg ?? t.colorPrimaryActive,
        "--ao-radio-margin": `${c?.wrapperMarginInlineEnd ?? 8}px`,
        "--ao-radio-gap": `${t.paddingXS}px`,
        "--ao-radio-padding": `${c?.buttonPaddingInline ?? t.padding - t.lineWidth}px`,
        "--ao-radio-small-padding": `${t.paddingXS - t.lineWidth}px`,
        "--ao-radio-large-font": `${t.fontSizeLG}px`,
        "--ao-radio-small-radius": `${t.borderRadiusSM}px`,
        "--ao-radio-large-radius": `${t.borderRadiusLG}px`,
        "--ao-radio-height": `${t.controlHeight}px`,
        "--ao-radio-small": `${t.controlHeightSM}px`,
        "--ao-radio-large": `${t.controlHeightLG}px`,
        "--ao-radio-radius": `${t.borderRadius}px`,
        "--ao-radio-focus": t.colorPrimaryBorder,
        "--ao-radio-white": t.colorWhite,
        ...style,
      }}
    >
      <span
        className={isButton ? "ant-radio-button" : "ant-radio"}
        ref={element}
      >
        <input
          {...rest}
          type="radio"
          className="ant-radio-input"
          ref={input}
          value={value === undefined ? undefined : String(value)}
          disabled={disabled}
          name={group?.name ?? rest.name}
          {...(group
            ? { checked: group.value === value, defaultChecked: undefined }
            : {})}
          onChange={(event) => {
            const change = {
              target: {
                ...props,
                disabled,
                checked: (event.currentTarget as HTMLInputElement).checked,
              },
              nativeEvent: event,
              preventDefault: () => event.preventDefault(),
              stopPropagation: () => event.stopPropagation(),
            };
            onChange?.(change);
            group?.onChange(change);
          }}
        />
        <span
          className={isButton ? "ant-radio-button-inner" : "ant-radio-inner"}
          aria-hidden="true"
        />
      </span>
      {children !== undefined && (
        <span className="ant-radio-label">{children}</span>
      )}
    </label>
  );
}
function RadioButton(props: RadioProps) {
  return <RadioControl {...props} button />;
}
function RadioGroup({
  value,
  defaultValue,
  options,
  name,
  disabled,
  optionType = "default",
  buttonStyle = "outline",
  size,
  block = false,
  children,
  onChange,
  className,
  style,
  ...rest
}: RadioGroupProps) {
  const generated = useId();
  const config = useConfig();
  const [inner, setInner] = useState(defaultValue);
  const selected = value ?? inner;
  return (
    <div
      {...rest}
      className={[
        "ant-radio-group",
        `ant-radio-group-${buttonStyle}`,
        `ant-radio-group-${size ?? config.componentSize ?? "middle"}`,
        block && "ant-radio-group-block",
        className,
      ]}
      style={style}
    >
      <RadioContext
        value={{
          value: selected,
          name: name ?? generated,
          disabled: disabled ?? config.componentDisabled,
          optionType,
          onChange: (event) => {
            const next = event.target.value;
            if (value === undefined) setInner(next);
            if (next !== selected) onChange?.(event);
          },
        }}
      >
        {options?.length
          ? options.map((option) => {
              const item =
                typeof option === "object"
                  ? option
                  : { label: option, value: option };
              return (
                <RadioControl
                  key={`${typeof item.value}:${item.value}`}
                  value={item.value}
                  title={item.title}
                  id={item.id}
                  style={item.style}
                  className={item.className}
                  disabled={
                    item.disabled || (disabled ?? config.componentDisabled)
                  }
                >
                  {item.label}
                </RadioControl>
              );
            })
          : children}
      </RadioContext>
    </div>
  );
}
export const Radio = Object.assign(RadioControl, {
  Group: RadioGroup,
  Button: RadioButton,
});
export type RadioRef = CheckboxRef;
