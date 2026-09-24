import type {
  CSSProperties,
  InputHTMLAttributes,
  OctaneNode,
  Ref,
} from "octane";
import { useEffect, useImperativeHandle, useMemo, useRef } from "octane";
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
    "type" | "size" | "ref" | "style" | "children" | "onChange"
  > {
  indeterminate?: boolean;
  children?: OctaneNode;
  style?: CSSProperties;
  ref?: Ref<CheckboxRef>;
  onChange?: (event: CheckboxChangeEvent) => void;
}
export function Checkbox(props: CheckboxProps) {
  const config = useConfig();
  const input = useRef<HTMLInputElement | null>(null);
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
    disabled = config.componentDisabled ?? false,
    indeterminate = false,
    children,
    className,
    style,
    ref: _ref,
    onChange,
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
            if (input.current) input.current.indeterminate = indeterminate;
          }}
        />
        <span className="ant-checkbox-inner" aria-hidden="true" />
      </span>
      {children !== undefined && <span>{children}</span>}
    </label>
  );
}
