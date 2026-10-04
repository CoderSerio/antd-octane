/** @jsxImportSource octane */
import type { CSSProperties, ElementDescriptor, OctaneNode } from "octane";
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "octane";
import { componentClassName } from "../_util/componentClassName";
import { useConfig } from "../config-provider";
import type { SizeType } from "../config-provider/context";
import { DisabledContextProvider } from "../config-provider/DisabledContext";
import { SizeContextProvider } from "../config-provider/SizeContext";
import { type Variant, VariantContext } from "./context";
import { useFormStyle } from "./style";

export type FormValues = Record<string, unknown>;
export interface FormRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (rule: FormRule, value: unknown) => void | Promise<void>;
}
export interface FormFieldError {
  name: string;
  errors: string[];
}
export interface FormValidationError {
  values: FormValues;
  errorFields: FormFieldError[];
  outOfDate?: boolean;
}
export interface FormInstance {
  getFieldValue: (name: string) => unknown;
  getFieldsValue: () => FormValues;
  setFieldsValue: (values: FormValues) => void;
  resetFields: () => void;
  validateFields: () => Promise<FormValues>;
}
interface Snapshot {
  values: FormValues;
  errors: Record<string, string[]>;
}
interface FormStore extends FormInstance {
  subscribe: (listener: () => void) => () => void;
  snapshot: () => Snapshot;
  initialize: (values: FormValues) => void;
  register: (name: string, rules: FormRule[]) => () => void;
  setRules: (name: string, rules: FormRule[]) => void;
  setFieldValue: (name: string, value: unknown) => FormValues;
}

function empty(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}
function ruleErrors(name: string, value: unknown, rules: FormRule[]) {
  const errors: string[] = [];
  for (const rule of rules) {
    let fallback = "";
    if (rule.required && empty(value)) fallback = `${name} 为必填项`;
    else if (!empty(value)) {
      const length =
        typeof value === "string" || Array.isArray(value)
          ? value.length
          : undefined;
      if (length !== undefined && rule.min !== undefined && length < rule.min)
        fallback = `${name} 至少 ${rule.min} 个字符`;
      else if (
        length !== undefined &&
        rule.max !== undefined &&
        length > rule.max
      )
        fallback = `${name} 最多 ${rule.max} 个字符`;
      else if (
        rule.pattern &&
        !new RegExp(
          rule.pattern.source,
          rule.pattern.flags.replaceAll("g", "").replaceAll("y", ""),
        ).test(String(value))
      )
        fallback = `${name} 格式不正确`;
    }
    if (fallback) errors.push(rule.message ?? fallback);
  }
  return errors;
}

async function validateRules(name: string, value: unknown, rules: FormRule[]) {
  const results = await Promise.all(
    rules.map(async (rule) => {
      const errors = ruleErrors(name, value, [rule]);
      if (rule.validator) {
        try {
          await rule.validator(rule, value);
        } catch (error) {
          errors.push(
            rule.message ??
              (error instanceof Error
                ? error.message
                : typeof error === "string"
                  ? error
                  : `${name} 校验失败`),
          );
        }
      }
      return errors;
    }),
  );
  return results.flat();
}

function sameRules(previous: FormRule[], next: FormRule[]) {
  return (
    previous.length === next.length &&
    previous.every((rule, index) => {
      const other = next[index];
      return (
        other !== undefined &&
        rule.required === other.required &&
        rule.min === other.min &&
        rule.max === other.max &&
        rule.message === other.message &&
        Boolean(rule.validator) === Boolean(other.validator) &&
        rule.pattern?.source === other.pattern?.source &&
        rule.pattern?.flags === other.pattern?.flags
      );
    })
  );
}

function createFormStore(initialValues: FormValues = {}): FormStore {
  let initial: FormValues = { ...initialValues };
  let state: Snapshot = { values: { ...initialValues }, errors: {} };
  const listeners = new Set<() => void>();
  const rules = new Map<string, FormRule[]>();
  const emit = () =>
    listeners.forEach((listener) => {
      listener();
    });
  const update = (next: Snapshot) => {
    state = next;
    emit();
  };
  let revision = 0;
  let validationRun = 0;
  const fieldRuns = new Map<string, number>();
  const invalidate = (name: string) => {
    const run = (fieldRuns.get(name) ?? 0) + 1;
    fieldRuns.set(name, run);
    return run;
  };
  const changedErrors = (name: string, value: unknown) => {
    const run = invalidate(name);
    if (!state.errors[name]) return;
    const fieldRules = rules.get(name) ?? [];
    const errors = ruleErrors(name, value, fieldRules);
    if (fieldRules.some((rule) => rule.validator)) {
      void validateRules(name, value, fieldRules).then((messages) => {
        if (fieldRuns.get(name) !== run || !rules.has(name)) return;
        update({ ...state, errors: { ...state.errors, [name]: messages } });
      });
    }
    return errors;
  };
  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    snapshot: () => state,
    initialize(values) {
      revision++;
      validationRun++;
      for (const name of rules.keys()) invalidate(name);
      initial = { ...values };
      update({ values: { ...values }, errors: {} });
    },
    register(name, nextRules) {
      validationRun++;
      invalidate(name);
      rules.set(
        name,
        nextRules.map((rule) => ({ ...rule })),
      );
      return () => {
        rules.delete(name);
        invalidate(name);
        if (state.errors[name]) {
          const errors = { ...state.errors };
          delete errors[name];
          update({ ...state, errors });
        }
      };
    },
    setRules(name, nextRules) {
      const copied = nextRules.map((rule) => ({ ...rule }));
      if (sameRules(rules.get(name) ?? [], nextRules)) {
        rules.set(name, copied);
        return;
      }
      validationRun++;
      invalidate(name);
      rules.set(name, copied);
    },
    getFieldValue: (name) => state.values[name],
    getFieldsValue: () => ({ ...state.values }),
    setFieldValue(name, value) {
      revision++;
      const values = { ...state.values, [name]: value };
      const messages = changedErrors(name, value);
      const errors = messages
        ? { ...state.errors, [name]: messages }
        : state.errors;
      update({ values, errors });
      return { ...values };
    },
    setFieldsValue(values) {
      revision++;
      const merged = { ...state.values, ...values };
      const errors = { ...state.errors };
      for (const name of Object.keys(values)) {
        const messages = changedErrors(name, merged[name]);
        if (messages) errors[name] = messages;
      }
      update({ values: merged, errors });
    },
    resetFields() {
      revision++;
      validationRun++;
      for (const name of rules.keys()) invalidate(name);
      update({ values: { ...initial }, errors: {} });
    },
    async validateFields() {
      const run = ++validationRun;
      const valueRevision = revision;
      const values = { ...state.values };
      const entries = [...rules.entries()];
      const tokens = entries.map(([name]) => invalidate(name));
      const results = await Promise.all(
        entries.map(([name, fieldRules]) =>
          validateRules(name, values[name], fieldRules),
        ),
      );
      const errors: Record<string, string[]> = {};
      const errorFields: FormFieldError[] = [];
      entries.forEach(([name], index) => {
        const messages = results[index] ?? [];
        if (messages.length) {
          errors[name] = messages;
          errorFields.push({ name, errors: messages });
        }
      });
      const outOfDate =
        valueRevision !== revision ||
        run !== validationRun ||
        entries.some(([name], index) => fieldRuns.get(name) !== tokens[index]);
      if (!outOfDate) update({ ...state, errors });
      if (errorFields.length || outOfDate)
        throw {
          values: { ...state.values },
          errorFields,
          ...(outOfDate ? { outOfDate: true } : {}),
        } satisfies FormValidationError;
      return values;
    },
  };
}

export function useForm(): [FormInstance] {
  const [form] = useState<FormStore>(createFormStore);
  return [form];
}

interface FormContextValue {
  store: FormStore;
  id: string;
  fieldIds: Map<string, string>;
  stylePrefixCls: string;
  size?: SizeType;
  layout: "horizontal" | "vertical" | "inline";
  colon: boolean;
  onValuesChange?: (changed: FormValues, all: FormValues) => void;
}
const FormContext = createContext<FormContextValue | null>(null);

export interface FormProps {
  prefixCls?: string;
  rootClassName?: string;
  colon?: boolean;
  disabled?: boolean;
  size?: SizeType;
  variant?: Variant;
  form?: FormInstance;
  initialValues?: FormValues;
  onFinish?: (values: FormValues) => void;
  onFinishFailed?: (error: FormValidationError) => void;
  onValuesChange?: (changed: FormValues, all: FormValues) => void;
  layout?: "horizontal" | "vertical" | "inline";
  children?: OctaneNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  name?: string;
  autoComplete?: string;
}
function FormRoot(props: FormProps) {
  const [internal] = useState(() => createFormStore(props.initialValues));
  const store = (props.form ?? internal) as FormStore;
  useEffect(() => {
    if (props.form) store.initialize(props.initialValues ?? {});
  }, [props.form]);
  const [fieldIds] = useState(() => new Map<string, string>());
  const config = useConfig();
  const prefixCls = config.getPrefixCls("form", props.prefixCls);
  const cls = (suffix = "") =>
    componentClassName("ant-form", prefixCls, suffix);
  const layout = props.layout ?? "horizontal";
  const size = props.size ?? config.componentSize;
  const formStyle = useFormStyle(size);
  const generatedId = useId();
  const id = props.id ?? props.name ?? `ao-form-${generatedId}`;
  return (
    <DisabledContextProvider disabled={props.disabled}>
      <SizeContextProvider size={props.size}>
        <VariantContext value={props.variant}>
          <FormContext
            value={{
              store,
              id,
              fieldIds,
              stylePrefixCls: prefixCls,
              size,
              layout,
              colon: props.colon ?? config.form?.colon ?? true,
              onValuesChange: props.onValuesChange,
            }}
          >
            <form
              id={props.id}
              name={props.name}
              autoComplete={props.autoComplete}
              noValidate
              className={[
                cls(),
                cls(`-${layout}`),
                size && cls(`-${size}`),
                config.direction === "rtl" && cls("-rtl"),
                config.form?.className,
                props.className,
                props.rootClassName,
              ]}
              style={{
                ...formStyle,
                ...config.form?.style,
                ...props.style,
              }}
              onSubmit={(event) => {
                event.preventDefault();
                void store
                  .validateFields()
                  .then(props.onFinish, (error: FormValidationError) => {
                    props.onFinishFailed?.(error);
                    const first = error.errorFields[0]?.name;
                    if (first && !error.outOfDate)
                      document
                        .getElementById(fieldIds.get(first) ?? `${id}-${first}`)
                        ?.focus();
                  });
              }}
              onReset={(event) => {
                event.preventDefault();
                store.resetFields();
              }}
            >
              {props.children}
            </form>
          </FormContext>
        </VariantContext>
      </SizeContextProvider>
    </DisabledContextProvider>
  );
}

export interface FormItemProps {
  prefixCls?: string;
  rootClassName?: string;
  layout?: "horizontal" | "vertical" | "inline";
  colon?: boolean;
  name?: string;
  label?: OctaneNode;
  rules?: FormRule[];
  required?: boolean;
  valuePropName?: string;
  getValueProps?: (value: unknown) => Record<string, unknown>;
  // biome-ignore lint/suspicious/noExplicitAny: custom controls define their own event argument types.
  getValueFromEvent?: (...args: any[]) => unknown;
  trigger?: string;
  help?: OctaneNode;
  extra?: OctaneNode;
  children?: OctaneNode;
  className?: string;
  style?: CSSProperties;
}
function fromChange(value: unknown, valuePropName: string) {
  if (typeof value === "boolean") return value;
  if (value && typeof value === "object" && "target" in value) {
    const target = value.target;
    if (target && typeof target === "object" && valuePropName in target)
      return (target as Record<string, unknown>)[valuePropName];
  }
  return value;
}
const emptySnapshot: Snapshot = { values: {}, errors: {} };
const noopSubscribe = () => () => {};
const getEmptySnapshot = () => emptySnapshot;
function FormItem(props: FormItemProps) {
  const context = useContext(FormContext);
  const config = useConfig();
  const prefixCls = config.getPrefixCls("form", props.prefixCls);
  const formStyle = useFormStyle(
    context?.stylePrefixCls === prefixCls ? context?.size : undefined,
  );
  const cls = (suffix: string) =>
    componentClassName("ant-form", prefixCls, suffix);
  const layout = props.layout ?? context?.layout ?? "horizontal";
  const colon = props.colon ?? context?.colon ?? true;
  const label =
    colon && layout !== "vertical" && typeof props.label === "string"
      ? props.label.replace(/[:|：]\s*$/, "")
      : props.label;
  const snapshot = useSyncExternalStore<Snapshot>(
    context?.store.subscribe ?? noopSubscribe,
    context?.store.snapshot ?? getEmptySnapshot,
  );
  const generatedId = useId();
  const name = props.name;
  const rules = useMemo(
    () => props.rules ?? (props.required ? [{ required: true }] : []),
    [props.rules, props.required],
  );
  const required = props.required ?? rules.some((rule) => rule.required);
  useEffect(() => {
    if (name) return context?.store.register(name, rules);
  }, [context?.store, name]);
  useEffect(() => {
    if (name) context?.store.setRules(name, rules);
  }, [context?.store, name, rules]);
  const child = props.children;
  const valuePropName = props.valuePropName ?? "value";
  const descriptor = isValidElement(child)
    ? (child as ElementDescriptor<Record<string, unknown>>)
    : null;
  const id = name
    ? ((descriptor?.props?.id as string | undefined) ??
      `${context?.id ?? `ao-form-${generatedId}`}-${name}`)
    : undefined;
  const fieldIds = context?.fieldIds;
  useEffect(() => {
    if (!name || !id || !fieldIds) return;
    fieldIds.set(name, id);
    return () => {
      if (fieldIds.get(name) === id) fieldIds.delete(name);
    };
  }, [fieldIds, name, id]);
  const helpId = id ? `${id}-help` : undefined;
  const errors = name ? (snapshot.errors[name] ?? []) : [];
  const hasHelp = props.help !== undefined && props.help !== null;
  const hasAdditional = hasHelp || errors.length > 0;
  const itemRef = useRef<HTMLDivElement | null>(null);
  const extraRef = useRef<HTMLDivElement | null>(null);
  const [marginBottom, setMarginBottom] = useState<number | null>(null);
  const [extraHeight, setExtraHeight] = useState(0);
  useLayoutEffect(() => {
    if (!itemRef.current) return;
    setMarginBottom(
      hasAdditional
        ? Number.parseInt(getComputedStyle(itemRef.current).marginBottom, 10) ||
            0
        : null,
    );
    setExtraHeight(extraRef.current?.offsetHeight ?? 0);
  });
  useEffect(() => {
    const element = extraRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() =>
      setExtraHeight(element.offsetHeight),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [props.extra]);
  const trigger = props.trigger ?? "onChange";
  const original = descriptor?.props?.[trigger];
  const value = name ? snapshot.values[name] : undefined;
  const valueProps = props.getValueProps
    ? props.getValueProps(value)
    : {
        [valuePropName]:
          value ??
          (valuePropName === "checked"
            ? false
            : valuePropName === "value"
              ? ""
              : undefined),
      };
  const control =
    name && context && descriptor
      ? cloneElement(descriptor, {
          id: descriptor.props?.id ?? id,
          ...valueProps,
          status: errors.length ? "error" : descriptor.props?.status,
          "aria-invalid": errors.length
            ? true
            : descriptor.props?.["aria-invalid"],
          "aria-describedby": errors.length
            ? helpId
            : descriptor.props?.["aria-describedby"],
          [trigger]: (...args: unknown[]) => {
            const value = props.getValueFromEvent
              ? props.getValueFromEvent(...args)
              : fromChange(args[0], valuePropName);
            const all = context.store.setFieldValue(name, value);
            context.onValuesChange?.({ [name]: value }, all);
            if (typeof original === "function") original(...args);
          },
        })
      : child;
  return (
    <div
      ref={itemRef}
      className={[
        cls("-item"),
        cls(`-item-${layout}`),
        errors.length && cls("-item-has-error"),
        hasAdditional && cls("-item-with-help"),
        props.className,
        props.rootClassName,
      ]}
      style={{ ...formStyle, ...props.style }}
    >
      <div className={cls("-item-row")}>
        {props.label && (
          <div className={cls("-item-label")}>
            <label
              className={[
                !colon && cls("-item-no-colon"),
                required && cls("-item-required"),
              ]}
              htmlFor={id}
              title={typeof props.label === "string" ? props.label : ""}
            >
              {label}
            </label>
          </div>
        )}
        <div className={cls("-item-control")}>
          <div className={cls("-item-control-input")}>
            <div className={cls("-item-control-input-content")}>{control}</div>
          </div>
          <div
            className={cls("-item-additional")}
            style={
              marginBottom
                ? { minHeight: marginBottom + extraHeight }
                : undefined
            }
          >
            {hasAdditional && (
              <div
                id={helpId}
                className={cls("-item-explain")}
                role={errors.length ? "alert" : undefined}
              >
                {errors[0] ?? props.help}
              </div>
            )}
            {props.extra && (
              <div ref={extraRef} className={cls("-item-extra")}>
                {props.extra}
              </div>
            )}
          </div>
        </div>
      </div>
      {!!marginBottom && (
        <div
          className={cls("-item-margin-offset")}
          style={{ marginBottom: -marginBottom }}
        />
      )}
    </div>
  );
}

export const Form = Object.assign(FormRoot, { Item: FormItem, useForm });
