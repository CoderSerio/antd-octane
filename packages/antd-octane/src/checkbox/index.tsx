import type {
  CSSProperties,
  HTMLAttributes,
  InputHTMLAttributes,
  OctaneNode,
  Ref,
} from "octane";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "octane";
import { useConfig } from "../config-provider";
import { resolveComponentAlias } from "../theme/resolve";

export interface CheckboxChangeEvent {
  target: CheckboxProps & { checked: boolean };
  nativeEvent: Event;
  stopPropagation: () => void;
  preventDefault: () => void;
}
export interface CheckboxRef {
  input: HTMLInputElement | null;
  nativeElement: HTMLSpanElement | null;
  focus: (options?: FocusOptions) => void;
  blur: () => void;
}
export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "ref" | "style" | "children" | "onChange" | "value"
  > {
  value?: CheckboxValue;
  skipGroup?: boolean;
  indeterminate?: boolean;
  children?: OctaneNode;
  style?: CSSProperties;
  ref?: Ref<CheckboxRef>;
  onChange?: (event: CheckboxChangeEvent) => void;
}
function InternalCheckbox(props: CheckboxProps) {
  const context = useContext(CheckboxGroupContext);
  const group = props.skipGroup ? null : context;
  const config = useConfig();
  const input = useRef<HTMLInputElement | null>(null);
  const registration = useRef(Symbol("checkbox"));
  useEffect(
    () => group?.register(registration.current, props.value, input.current),
    [group?.register, props.value],
  );
  const nativeElement = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (input.current)
      input.current.indeterminate = props.indeterminate ?? false;
  }, [props.indeterminate]);
  useImperativeHandle(
    props.ref,
    () => ({
      get input() {
        return input.current;
      },
      get nativeElement() {
        return nativeElement.current;
      },
      focus: (options?: FocusOptions) => input.current?.focus(options),
      blur: () => input.current?.blur(),
    }),
    [],
  );
  const variables = useMemo(() => {
    const t = resolveComponentAlias(config.theme, config.token, "Checkbox");
    return {
      "--ao-check-font": t.fontFamily,
      "--ao-check-font-size": `${t.fontSize}px`,
      "--ao-check-line": t.lineHeight,
      "--ao-check-size": `${t.controlInteractiveSize}px`,
      "--ao-check-radius": `${t.borderRadiusSM}px`,
      "--ao-check-border-width": `${t.lineWidth}px`,
      "--ao-check-line-type": t.lineType,
      "--ao-check-primary": t.colorPrimary,
      "--ao-check-hover": t.colorPrimaryHover,
      "--ao-check-color": t.colorText,
      "--ao-check-bg": t.colorBgContainer,
      "--ao-check-border": t.colorBorder,
      "--ao-check-disabled": t.colorTextDisabled,
      "--ao-check-disabled-bg": t.colorBgContainerDisabled,
      "--ao-check-tick": t.colorWhite,
      "--ao-check-tick-width": `${t.lineWidthBold}px`,
      "--ao-check-mixed-size": `${t.fontSizeLG / 2}px`,
      "--ao-check-focus-width": `${t.lineWidthFocus}px`,
      "--ao-check-gap": `${t.paddingXS}px`,
      "--ao-check-focus": t.colorPrimaryBorder,
      "--ao-check-duration": t.motionDurationMid,
    };
  }, [config.theme, config.token]);
  const {
    disabled = group?.disabled ?? config.componentDisabled ?? false,
    indeterminate = false,
    children,
    className,
    style,
    ref: _ref,
    onChange,
    value,
    skipGroup: _skipGroup,
    ...rest
  } = props;
  return (
    <label
      className={[
        "ant-checkbox-wrapper",
        disabled && "ant-checkbox-wrapper-disabled",
        className,
      ]}
      style={{ ...variables, ...style }}
    >
      <span
        ref={nativeElement}
        className={[
          "ant-checkbox",
          indeterminate && "ant-checkbox-indeterminate",
          disabled && "ant-checkbox-disabled",
        ]}
      >
        <input
          {...rest}
          type="checkbox"
          value={value === undefined ? undefined : String(value)}
          name={group?.name ?? rest.name}
          {...(group
            ? {
                checked: group.value.includes(value as CheckboxValue),
                defaultChecked: undefined,
              }
            : {})}
          ref={input}
          className="ant-checkbox-input"
          disabled={disabled}
          onChange={(event) => {
            const checked = (event.currentTarget as HTMLInputElement).checked;
            onChange?.({
              target: { ...props, disabled, checked },
              nativeEvent: event,
              preventDefault: () => event.preventDefault(),
              stopPropagation: () => event.stopPropagation(),
            });
            group?.toggle(value, checked);
            if (input.current) input.current.indeterminate = indeterminate;
          }}
        />
        <span className="ant-checkbox-inner" aria-hidden="true" />
      </span>
      {children !== undefined && <span>{children}</span>}
    </label>
  );
}

export type CheckboxValue = string | number | boolean;
export interface CheckboxOption {
  label: OctaneNode;
  value: CheckboxValue;
  disabled?: boolean;
  title?: string;
  className?: string;
  style?: CSSProperties;
}
export interface CheckboxGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: CheckboxValue[];
  defaultValue?: CheckboxValue[];
  options?: (CheckboxValue | CheckboxOption)[];
  name?: string;
  disabled?: boolean;
  style?: CSSProperties;
  onChange?: (values: CheckboxValue[]) => void;
}
interface GroupContext {
  value: CheckboxValue[];
  name?: string;
  disabled?: boolean;
  register: (
    id: symbol,
    value: CheckboxValue | undefined,
    node: HTMLInputElement | null,
  ) => () => void;
  toggle: (value: CheckboxValue | undefined, checked: boolean) => void;
}
const CheckboxGroupContext = createContext<GroupContext | null>(null);
function CheckboxGroup({
  value,
  defaultValue = [],
  options,
  name,
  disabled,
  children,
  onChange,
  className,
  style,
  ...rest
}: CheckboxGroupProps) {
  const config = useConfig();
  const [inner, setInner] = useState(defaultValue);
  const selected = value ?? inner;
  const entries = useRef(
    new Map<symbol, { value: CheckboxValue; node: HTMLInputElement }>(),
  );
  const register = useCallback(
    (
      id: symbol,
      optionValue: CheckboxValue | undefined,
      node: HTMLInputElement | null,
    ) => {
      if (optionValue !== undefined && node)
        entries.current.set(id, { value: optionValue, node });
      return () => {
        entries.current.delete(id);
      };
    },
    [],
  );
  const toggle = (optionValue: CheckboxValue | undefined, checked: boolean) => {
    if (optionValue === undefined) return;
    const next = new Set(selected);
    if (checked) next.add(optionValue);
    else next.delete(optionValue);
    const ordered = [...entries.current.values()].sort((a, b) =>
      a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    );
    const result = [
      ...new Set(
        ordered.map((item) => item.value).filter((item) => next.has(item)),
      ),
    ];
    if (value === undefined) setInner(result);
    onChange?.(result);
  };
  return (
    <div
      {...rest}
      className={["ant-checkbox-group", className]}
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        columnGap: config.token.marginXS,
        rowGap: config.token.marginXS,
        ...style,
      }}
    >
      <CheckboxGroupContext
        value={{
          value: selected,
          name,
          disabled: disabled ?? config.componentDisabled,
          register,
          toggle,
        }}
      >
        {options?.length
          ? options.map((option) => {
              const item =
                typeof option === "object"
                  ? option
                  : { label: String(option), value: option };
              return (
                <InternalCheckbox
                  key={`${typeof item.value}:${item.value}`}
                  value={item.value}
                  disabled={
                    item.disabled || disabled || config.componentDisabled
                  }
                  title={item.title}
                  className={item.className}
                  style={item.style}
                >
                  {item.label}
                </InternalCheckbox>
              );
            })
          : children}
      </CheckboxGroupContext>
    </div>
  );
}
export const Checkbox = Object.assign(InternalCheckbox, {
  Group: CheckboxGroup,
});
