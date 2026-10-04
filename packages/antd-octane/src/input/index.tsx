/** @jsxImportSource octane */
import type {
  CSSProperties,
  InputHTMLAttributes,
  OctaneNode,
  Ref,
  TextareaHTMLAttributes,
} from "octane";
import {
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "octane";
import { Button } from "../button";
import { useConfig } from "../config-provider";
import Group from "./Group";
import { inputVariables } from "./tokens";

export type { GroupProps } from "./Group";

// The count shares the outer width; the field fills that width exactly once.
function countControlStyle(
  style: CSSProperties | undefined,
  showCount?: boolean,
): CSSProperties | undefined {
  return showCount
    ? { ...style, width: "100%", minWidth: undefined, maxWidth: undefined }
    : style;
}

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
    | "prefix"
    | "size"
    | "ref"
    | "style"
    | "value"
    | "defaultValue"
    | "onChange"
    | "onInput"
    | "onKeyDown"
  > {
  prefix?: OctaneNode;
  suffix?: OctaneNode;
  addonBefore?: OctaneNode;
  addonAfter?: OctaneNode;
  allowClear?: boolean | { clearIcon?: OctaneNode };
  showCount?: boolean;
  onClear?: () => void;
  size?: "small" | "middle" | "large";
  htmlSize?: number;
  status?: "error" | "warning";
  value?: string | number;
  defaultValue?: string | number;
  style?: CSSProperties;
  ref?: Ref<InputRef>;
  onChange?: (event: InputChangeEvent) => void;
  onPressEnter?: (event: KeyboardEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
}

function InternalInput(props: InputProps) {
  const config = useConfig();
  const countId = `ao-input-count-${useId()}`;
  const node = useRef<HTMLInputElement | null>(null);
  const composing = useRef(false);
  const [text, setText] = useState(String(props.defaultValue ?? ""));
  useEffect(() => {
    const form = node.current?.form;
    const reset = () =>
      queueMicrotask(() => {
        if (node.current) setText(node.current.value);
      });
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, []);
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
    htmlSize,
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
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    allowClear,
    showCount,
    onClear,
    ...rest
  } = props;
  const affix = prefix !== undefined || suffix !== undefined || !!allowClear;
  const grouped = addonBefore !== undefined || addonAfter !== undefined;
  const currentLength = String(props.value ?? text).length;
  const describedBy = [props["aria-describedby"], showCount && countId]
    .filter(Boolean)
    .join(" ");
  const field = (
    <input
      {...rest}
      ref={node}
      size={htmlSize}
      aria-describedby={describedBy || undefined}
      disabled={disabled}
      aria-invalid={status === "error" ? true : props["aria-invalid"]}
      className={[
        "ant-input",
        `ant-input-${size}`,
        status && `ant-input-status-${status}`,
        !affix && !grouped && className,
      ]}
      style={{
        ...variables,
        ...(!affix && !grouped
          ? countControlStyle(style, showCount)
          : undefined),
      }}
      onInput={(event) => {
        setText(event.currentTarget.value);
        onChange?.(event as unknown as InputChangeEvent);
      }}
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
  const clearVisible =
    !!allowClear &&
    !disabled &&
    !props.readOnly &&
    String(props.value ?? text).length > 0;
  const decorated = affix ? (
    <span
      className={[
        "ant-input-affix-wrapper",
        `ant-input-affix-wrapper-${size}`,
        status && `ant-input-affix-wrapper-status-${status}`,
        disabled && "ant-input-affix-wrapper-disabled",
        !grouped && className,
      ]}
      style={{
        ...variables,
        ...(!grouped ? countControlStyle(style, showCount) : undefined),
      }}
    >
      {prefix !== undefined && (
        <span className="ant-input-prefix">{prefix}</span>
      )}
      {field}
      <span className="ant-input-suffix">
        {clearVisible && (
          <button
            type="button"
            className="ant-input-clear-icon"
            aria-label="清除输入"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              const el = node.current;
              if (!el) return;
              el.value = "";
              el.dispatchEvent(new Event("input", { bubbles: true }));
              onClear?.();
              el.focus();
            }}
          >
            {typeof allowClear === "object"
              ? (allowClear.clearIcon ?? "×")
              : "×"}
          </button>
        )}
        {suffix}
      </span>
    </span>
  ) : (
    field
  );
  const control = grouped ? (
    <span
      className={[
        "ant-input-group-wrapper",
        `ant-input-group-wrapper-${size}`,
        className,
      ]}
      style={{ ...variables, ...countControlStyle(style, showCount) }}
    >
      {addonBefore !== undefined && (
        <span className="ant-input-group-addon">{addonBefore}</span>
      )}
      {decorated}
      {addonAfter !== undefined && (
        <span className="ant-input-group-addon">{addonAfter}</span>
      )}
    </span>
  ) : (
    decorated
  );
  return showCount ? (
    <span
      className="ant-input-count-wrapper"
      style={{
        ...variables,
        width: style?.width,
        minWidth: style?.minWidth,
        maxWidth: style?.maxWidth,
      }}
    >
      {control}
      <span
        id={countId}
        className={[
          "ant-input-count",
          props.maxLength !== undefined &&
            currentLength > props.maxLength &&
            "ant-input-count-exceed",
        ]}
      >
        {currentLength}
        {props.maxLength !== undefined ? ` / ${props.maxLength}` : ""}
      </span>
    </span>
  ) : (
    control
  );
}

export interface PasswordProps extends InputProps {
  visibilityToggle?:
    | boolean
    | { visible?: boolean; onVisibleChange?: (visible: boolean) => void };
  iconRender?: (visible: boolean) => OctaneNode;
}
function Password({
  visibilityToggle = true,
  iconRender,
  suffix,
  ...props
}: PasswordProps) {
  const [inner, setInner] = useState(false);
  const visible =
    typeof visibilityToggle === "object"
      ? (visibilityToggle.visible ?? inner)
      : inner;
  const config = useConfig();
  const disabled = props.disabled ?? config.componentDisabled;
  const toggle = () => {
    if (disabled) return;
    if (
      typeof visibilityToggle !== "object" ||
      visibilityToggle.visible === undefined
    )
      setInner(!visible);
    if (typeof visibilityToggle === "object")
      visibilityToggle.onVisibleChange?.(!visible);
  };
  return (
    <InternalInput
      {...props}
      type={visible ? "text" : "password"}
      suffix={
        <>
          {suffix}
          {visibilityToggle && (
            <button
              type="button"
              className="ant-input-password-icon"
              disabled={disabled}
              aria-label={visible ? "隐藏密码" : "显示密码"}
              aria-pressed={visible}
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggle}
            >
              {iconRender ? (
                iconRender(visible)
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  {!visible && (
                    <path
                      d="m3 3 18 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  )}
                </svg>
              )}
            </button>
          )}
        </>
      }
    />
  );
}
export interface SearchProps extends InputProps {
  enterButton?: boolean | OctaneNode;
  loading?: boolean;
  onSearch?: (
    value: string,
    event: Event,
    info: { source: "input" | "clear" },
  ) => void;
}
function Search({
  enterButton = false,
  loading = false,
  onSearch,
  onPressEnter,
  onClear,
  addonAfter,
  ref,
  ...props
}: SearchProps) {
  const config = useConfig();
  const input = useRef<InputRef | null>(null);
  useImperativeHandle(
    ref,
    () => ({
      get input() {
        return input.current?.input ?? null;
      },
      get nativeElement() {
        return input.current?.nativeElement ?? null;
      },
      focus: (options?: FocusOptions) => input.current?.focus(options),
      blur: () => input.current?.blur(),
      select: () => input.current?.select(),
    }),
    [],
  );
  const disabled = props.disabled ?? config.componentDisabled;
  const search = (event: Event) => {
    if (!loading && !disabled)
      onSearch?.(input.current?.input?.value ?? "", event, { source: "input" });
  };
  return (
    <InternalInput
      {...props}
      ref={input}
      onPressEnter={(event) => {
        onPressEnter?.(event);
        if (!event.defaultPrevented) search(event);
      }}
      onClear={() => {
        onClear?.();
        if (!loading && !disabled)
          onSearch?.("", new Event("clear"), { source: "clear" });
      }}
      addonAfter={
        <>
          <Button
            className="ant-input-search-button"
            size={props.size}
            disabled={disabled}
            loading={loading}
            type={enterButton ? "primary" : "default"}
            aria-label="搜索"
            onMouseDown={(event) => event.preventDefault()}
            onClick={search}
          >
            {typeof enterButton === "boolean" ? (
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="m15 15 6 6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              enterButton
            )}
          </Button>
          {addonAfter}
        </>
      }
    />
  );
}
export type TextAreaChangeEvent = Event & {
  target: HTMLTextAreaElement;
  currentTarget: HTMLTextAreaElement;
};
export interface TextAreaRef {
  nativeElement: HTMLTextAreaElement | null;
  resizableTextArea: { textArea: HTMLTextAreaElement | null };
  focus: (options?: FocusOptions) => void;
  blur: () => void;
  select: () => void;
}
export interface TextAreaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "ref" | "style" | "value" | "defaultValue" | "onChange" | "onInput"
  > {
  value?: string | number;
  defaultValue?: string | number;
  ref?: Ref<TextAreaRef>;
  style?: CSSProperties;
  status?: "error" | "warning";
  size?: "small" | "middle" | "large";
  allowClear?: boolean | { clearIcon?: OctaneNode };
  showCount?: boolean;
  onClear?: () => void;
  onChange?: (event: TextAreaChangeEvent) => void;
  onPressEnter?: (event: KeyboardEvent) => void;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
}
function TextArea({
  ref,
  autoSize = false,
  allowClear,
  showCount,
  onClear,
  size,
  status,
  disabled: customDisabled,
  style,
  className,
  onChange,
  onPressEnter,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...props
}: TextAreaProps) {
  const config = useConfig();
  const countId = `ao-input-count-${useId()}`;
  const disabled = customDisabled ?? config.componentDisabled;
  const resolvedSize = size ?? config.componentSize ?? "middle";
  const node = useRef<HTMLTextAreaElement | null>(null);
  const composing = useRef(false);
  const [text, setText] = useState(String(props.defaultValue ?? ""));
  const variables = useMemo(
    () => inputVariables(config.theme, config.token),
    [config.theme, config.token],
  );
  useImperativeHandle(
    ref,
    () => ({
      get nativeElement() {
        return node.current;
      },
      get resizableTextArea() {
        return { textArea: node.current };
      },
      focus: (options?: FocusOptions) => node.current?.focus(options),
      blur: () => node.current?.blur(),
      select: () => node.current?.select(),
    }),
    [],
  );
  useEffect(() => {
    const form = node.current?.form;
    const reset = () =>
      queueMicrotask(() => {
        if (node.current) setText(node.current.value);
      });
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, []);
  useLayoutEffect(() => {
    const element = node.current;
    if (!element || !autoSize) return;
    const resize = () => {
      const css = getComputedStyle(element);
      const line =
        Number.parseFloat(css.lineHeight) ||
        Number.parseFloat(css.fontSize) * 1.5715;
      const padding =
        Number.parseFloat(css.paddingTop) +
        Number.parseFloat(css.paddingBottom);
      const border =
        Number.parseFloat(css.borderTopWidth) +
        Number.parseFloat(css.borderBottomWidth);
      const options = typeof autoSize === "object" ? autoSize : {};
      const min = Math.max(1, options.minRows ?? 1);
      const max = Math.max(min, options.maxRows ?? Infinity);
      element.style.height = "auto";
      const desired = element.scrollHeight + border;
      const height = Math.max(
        min * line + padding + border,
        Math.min(max * line + padding + border, desired),
      );
      element.style.height = `${height}px`;
      element.style.overflowY = desired > height ? "auto" : "hidden";
    };
    resize();
    let width = element.getBoundingClientRect().width;
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(() => {
            const next = element.getBoundingClientRect().width;
            if (next !== width) {
              width = next;
              resize();
            }
          });
    observer?.observe(element);
    window.addEventListener("resize", resize);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      element.style.height =
        typeof style?.height === "number"
          ? `${style.height}px`
          : (style?.height ?? "");
      element.style.overflowY = style?.overflowY ?? "";
    };
  }, [autoSize, props.value, text, variables, style]);
  const textarea = (
    <textarea
      {...props}
      ref={node}
      aria-describedby={
        [props["aria-describedby"], showCount && countId]
          .filter(Boolean)
          .join(" ") || undefined
      }
      disabled={disabled}
      aria-invalid={status === "error" ? true : props["aria-invalid"]}
      className={[
        "ant-input",
        "ant-input-textarea",
        `ant-input-${resolvedSize}`,
        status && `ant-input-status-${status}`,
        !allowClear && className,
      ]}
      style={{
        ...variables,
        resize: autoSize ? "none" : undefined,
        ...(!allowClear ? countControlStyle(style, showCount) : undefined),
      }}
      onInput={(event) => {
        setText(event.currentTarget.value);
        onChange?.(event as unknown as TextAreaChangeEvent);
      }}
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
  const control = allowClear ? (
    <span
      className={["ant-input-textarea-wrapper", className]}
      style={{ ...variables, ...countControlStyle(style, showCount) }}
    >
      {textarea}
      {!disabled &&
        !props.readOnly &&
        String(props.value ?? text).length > 0 && (
          <button
            type="button"
            className="ant-input-clear-icon"
            aria-label="清除输入"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              const element = node.current;
              if (!element) return;
              element.value = "";
              element.dispatchEvent(new Event("input", { bubbles: true }));
              onClear?.();
              element.focus();
            }}
          >
            {typeof allowClear === "object"
              ? (allowClear.clearIcon ?? "×")
              : "×"}
          </button>
        )}
    </span>
  ) : (
    textarea
  );
  const currentLength = String(props.value ?? text).length;
  return showCount ? (
    <span
      className="ant-input-count-wrapper"
      style={{
        ...variables,
        width: style?.width,
        minWidth: style?.minWidth,
        maxWidth: style?.maxWidth,
      }}
    >
      {control}
      <span
        id={countId}
        className={[
          "ant-input-count",
          props.maxLength !== undefined &&
            currentLength > props.maxLength &&
            "ant-input-count-exceed",
        ]}
      >
        {currentLength}
        {props.maxLength !== undefined ? ` / ${props.maxLength}` : ""}
      </span>
    </span>
  ) : (
    control
  );
}
export const Input = Object.assign(InternalInput, {
  Group,
  Password,
  Search,
  TextArea,
});
