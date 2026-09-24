import type { CSSProperties, InputHTMLAttributes, Ref } from "octane";
import { useImperativeHandle, useMemo, useRef } from "octane";
import { useConfig } from "../config-provider";
import { inputVariables } from "./tokens";

export type InputChangeEvent = Event & {
  target: HTMLInputElement;
  currentTarget: HTMLInputElement;
};
export interface InputRef {
  input: HTMLInputElement | null;
  nativeElement: HTMLInputElement | null;
  focus: (options?: FocusOptions) => void;
  blur: () => void;
  select: () => void;
}
export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "ref"
    | "style"
    | "value"
    | "defaultValue"
    | "onChange"
    | "onInput"
    | "onKeyDown"
  > {
  size?: "small" | "middle" | "large";
  status?: "error" | "warning";
  value?: string | number;
  defaultValue?: string | number;
  style?: CSSProperties;
  ref?: Ref<InputRef>;
  onChange?: (event: InputChangeEvent) => void;
  onPressEnter?: (event: KeyboardEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
}

export function Input(props: InputProps) {
  const config = useConfig();
  const node = useRef<HTMLInputElement | null>(null);
  const composing = useRef(false);
  useImperativeHandle(
    props.ref,
    () => ({
      get input() {
        return node.current;
      },
      get nativeElement() {
        return node.current;
      },
      focus: (options?: FocusOptions) => node.current?.focus(options),
      blur: () => node.current?.blur(),
      select: () => node.current?.select(),
    }),
    [],
  );
  const variables = useMemo(
    () => inputVariables(config.theme, config.token),
    [config.theme, config.token],
  );
  const {
    size = config.componentSize ?? "middle",
    status,
    disabled = config.componentDisabled ?? false,
    className,
    style,
    ref: _ref,
    onChange,
    onPressEnter,
    onKeyDown,
    onCompositionStart,
    onCompositionEnd,
    ...rest
  } = props;
  return (
    <input
      {...rest}
      ref={node}
      disabled={disabled}
      aria-invalid={status === "error" ? true : props["aria-invalid"]}
      className={[
        "ant-input",
        `ant-input-${size}`,
        status && `ant-input-status-${status}`,
        className,
      ]}
      style={{ ...variables, ...style }}
      onInput={(event) => onChange?.(event as unknown as InputChangeEvent)}
      onCompositionStart={(event) => {
        composing.current = true;
        onCompositionStart?.(event);
      }}
      onCompositionEnd={(event) => {
        composing.current = false;
        onCompositionEnd?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          event.key === "Enter" &&
          !event.isComposing &&
          !composing.current &&
          event.keyCode !== 229 &&
          !event.defaultPrevented
        )
          onPressEnter?.(event);
      }}
    />
  );
}
