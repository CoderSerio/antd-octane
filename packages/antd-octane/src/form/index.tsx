/** @jsxImportSource octane */
import type { CSSProperties, ElementDescriptor, OctaneNode } from "octane";
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "octane";
import { useConfig } from "../config-provider";

export type FormValues = Record<string, unknown>;
export interface FormRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
}
export interface FormFieldError {
  name: string;
  errors: string[];
}
export interface FormValidationError {
  values: FormValues;
  errorFields: FormFieldError[];
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
  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    snapshot: () => state,
    initialize(values) {
      initial = { ...values };
      update({ values: { ...values }, errors: {} });
    },
    register(name, nextRules) {
      rules.set(name, nextRules);
      return () => {
        rules.delete(name);
        if (state.errors[name]) {
          const errors = { ...state.errors };
          delete errors[name];
          update({ ...state, errors });
        }
      };
    },
    getFieldValue: (name) => state.values[name],
    getFieldsValue: () => ({ ...state.values }),
    setFieldValue(name, value) {
      const values = { ...state.values, [name]: value };
      const errors = state.errors[name]
        ? {
            ...state.errors,
            [name]: ruleErrors(name, value, rules.get(name) ?? []),
          }
        : state.errors;
      update({ values, errors });
      return { ...values };
    },
    setFieldsValue(values) {
      const merged = { ...state.values, ...values };
      const errors = { ...state.errors };
      for (const name of Object.keys(values)) {
        if (errors[name])
          errors[name] = ruleErrors(name, merged[name], rules.get(name) ?? []);
      }
      update({ values: merged, errors });
    },
    resetFields() {
      update({ values: { ...initial }, errors: {} });
    },
    async validateFields() {
      const errors: Record<string, string[]> = {};
      const errorFields: FormFieldError[] = [];
      for (const [name, fieldRules] of rules) {
        const messages = ruleErrors(name, state.values[name], fieldRules);
        if (messages.length) {
          errors[name] = messages;
          errorFields.push({ name, errors: messages });
        }
      }
      update({ ...state, errors });
      const values = { ...state.values };
      if (errorFields.length)
        throw { values, errorFields } satisfies FormValidationError;
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
  onValuesChange?: (changed: FormValues, all: FormValues) => void;
}
const FormContext = createContext<FormContextValue | null>(null);

export interface FormProps {
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
  const config = useConfig();
  const generatedId = useId();
  const id = props.id ?? props.name ?? `ao-form-${generatedId}`;
  return (
    <FormContext value={{ store, id, onValuesChange: props.onValuesChange }}>
      <form
        id={props.id}
        name={props.name}
        autoComplete={props.autoComplete}
        noValidate
        className={[
          "ant-form",
          `ant-form-${props.layout ?? "horizontal"}`,
          props.className,
        ]}
        style={{
          "--ao-form-text": config.token.colorText,
          "--ao-form-secondary": config.token.colorTextDescription,
          "--ao-form-error": config.token.colorError,
          "--ao-form-font": config.token.fontFamily,
          "--ao-form-size": `${config.token.fontSize}px`,
          ...props.style,
        }}
        onSubmit={(event) => {
          event.preventDefault();
          void store
            .validateFields()
            .then(props.onFinish, (error: FormValidationError) => {
              props.onFinishFailed?.(error);
              const first = error.errorFields[0]?.name;
              if (first) document.getElementById(`${id}-${first}`)?.focus();
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
  );
}

export interface FormItemProps {
  name?: string;
  label?: OctaneNode;
  rules?: FormRule[];
  required?: boolean;
  valuePropName?: "value" | "checked";
  help?: OctaneNode;
  extra?: OctaneNode;
  children?: OctaneNode;
  className?: string;
  style?: CSSProperties;
}
function fromChange(value: unknown, checked: boolean) {
  if (typeof value === "boolean") return value;
  if (value && typeof value === "object" && "target" in value) {
    const target = value.target as { value?: unknown; checked?: boolean };
    return checked ? target.checked : target.value;
  }
  return value;
}
const emptySnapshot: Snapshot = { values: {}, errors: {} };
const noopSubscribe = () => () => {};
const getEmptySnapshot = () => emptySnapshot;
function FormItem(props: FormItemProps) {
  const context = useContext(FormContext);
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
  useEffect(() => {
    if (name) return context?.store.register(name, rules);
  }, [context?.store, name, rules]);
  const id = name
    ? `${context?.id ?? `ao-form-${generatedId}`}-${name}`
    : undefined;
  const helpId = id ? `${id}-help` : undefined;
  const errors = name ? (snapshot.errors[name] ?? []) : [];
  const child = props.children;
  const valuePropName = props.valuePropName ?? "value";
  const descriptor = isValidElement(child)
    ? (child as ElementDescriptor<Record<string, unknown>>)
    : null;
  const original = descriptor?.props?.onChange;
  const control =
    name && context && descriptor
      ? cloneElement(descriptor, {
          id: descriptor.props?.id ?? id,
          [valuePropName]:
            snapshot.values[name] ?? (valuePropName === "checked" ? false : ""),
          status: errors.length ? "error" : descriptor.props?.status,
          "aria-invalid": errors.length
            ? true
            : descriptor.props?.["aria-invalid"],
          "aria-describedby": errors.length
            ? helpId
            : descriptor.props?.["aria-describedby"],
          onChange: (...args: unknown[]) => {
            const value = fromChange(args[0], valuePropName === "checked");
            const all = context.store.setFieldValue(name, value);
            context.onValuesChange?.({ [name]: value }, all);
            if (typeof original === "function") original(...args);
          },
        })
      : child;
  return (
    <div
      className={[
        "ant-form-item",
        errors.length && "ant-form-item-has-error",
        props.className,
      ]}
      style={props.style}
    >
      {props.label && (
        <label className="ant-form-item-label" htmlFor={id}>
          {props.label}
          {(props.required || rules.some((rule) => rule.required)) && (
            <span aria-hidden="true" className="ant-form-item-required">
              {" "}
              *
            </span>
          )}
        </label>
      )}
      <div className="ant-form-item-control">
        {control}
        {(errors.length > 0 || props.help) && (
          <div
            id={helpId}
            className="ant-form-item-explain"
            role={errors.length ? "alert" : undefined}
          >
            {errors[0] ?? props.help}
          </div>
        )}
        {props.extra && (
          <div className="ant-form-item-extra">{props.extra}</div>
        )}
      </div>
    </div>
  );
}

export const Form = Object.assign(FormRoot, { Item: FormItem, useForm });
