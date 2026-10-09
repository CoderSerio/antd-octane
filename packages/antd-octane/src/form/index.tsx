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

export type NamePath = string | number | (string | number)[];
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
  name: NamePath;
  errors: string[];
}
export interface FormValidationError {
  values: FormValues;
  errorFields: FormFieldError[];
  outOfDate?: boolean;
}
export interface FormInstance {
  getFieldValue: (name: NamePath) => unknown;
  getFieldsValue: () => FormValues;
  setFieldsValue: (values: FormValues) => void;
  setFieldValue: (name: NamePath, value: unknown) => void;
  resetFields: (names?: NamePath[]) => void;
  validateFields: (names?: NamePath[]) => Promise<FormValues>;
}
interface Snapshot {
  values: FormValues;
  errors: Record<string, string[]>;
}
interface FormStore extends FormInstance {
  subscribe: (listener: () => void) => () => void;
  snapshot: () => Snapshot;
  initialize: (values: FormValues) => void;
  register: (
    name: NamePath,
    rules: FormRule[],
    dependencies: NamePath[],
    initialValue: unknown,
    token: object,
  ) => () => void;
  setRules: (
    name: NamePath,
    rules: FormRule[],
    token: object,
    initialValue: unknown,
  ) => void;
  setFieldValue: (name: NamePath, value: unknown) => FormValues;
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

function pathOf(name: NamePath): (string | number)[] {
  const path = Array.isArray(name) ? [...name] : [name];
  if (
    !path.length ||
    path.some(
      (part) =>
        (typeof part !== "string" && typeof part !== "number") ||
        part === "__proto__" ||
        part === "constructor" ||
        part === "prototype" ||
        (typeof part === "number" &&
          (!Number.isInteger(part) || part < 0 || part >= 2 ** 32 - 1)),
    )
  )
    throw new Error("Form: invalid or unsafe NamePath");
  return path;
}
const keyOf = (name: NamePath) => JSON.stringify(pathOf(name));
const labelOf = (name: NamePath) => pathOf(name).join(".");
function plain(value: unknown): value is FormValues {
  return (
    value !== null &&
    typeof value === "object" &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}
function copy<T>(value: T): T {
  if (Array.isArray(value)) return value.map(copy) as T;
  if (plain(value))
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, copy(item)]),
    ) as T;
  return value;
}
function getAt(values: unknown, name: NamePath): unknown {
  let value = values;
  for (const part of pathOf(name)) {
    if (
      value === null ||
      typeof value !== "object" ||
      !Object.hasOwn(value, part)
    )
      return undefined;
    value = (value as FormValues)[part];
  }
  return value;
}
function setAt(values: FormValues, name: NamePath, value: unknown): FormValues {
  const path = pathOf(name);
  const put = (current: unknown, index: number): unknown => {
    if (index === path.length) return copy(value);
    const part = path[index];
    if (Array.isArray(current)) {
      const indexValue = Number(part);
      if (
        !Number.isInteger(indexValue) ||
        indexValue < 0 ||
        indexValue >= 2 ** 32 - 1 ||
        String(indexValue) !== String(part)
      )
        throw new Error("Form: invalid NamePath array index");
    }
    const result = Array.isArray(current)
      ? [...current]
      : plain(current)
        ? { ...current }
        : typeof part === "number"
          ? []
          : {};
    (result as FormValues)[part] = put(getAt(current, part), index + 1);
    return result;
  };
  return put(values, 0) as FormValues;
}
function mergeValues(previous: FormValues, next: FormValues): FormValues {
  let result = { ...previous };
  for (const [key, value] of Object.entries(next)) {
    pathOf(key);
    result = setAt(
      result,
      key,
      plain(value)
        ? mergeValues(plain(previous[key]) ? previous[key] : {}, value)
        : value,
    );
  }
  return result;
}
function contains(parent: NamePath, child: NamePath) {
  const a = pathOf(parent),
    b = pathOf(child);
  return (
    a.length <= b.length &&
    a.every((part, index) => String(part) === String(b[index]))
  );
}
const related = (a: NamePath, b: NamePath) => contains(a, b) || contains(b, a);
function selectedValues(values: FormValues, names?: NamePath[]) {
  return names
    ? names.reduce<FormValues>(
        (result, name) => setAt(result, name, getAt(values, name)),
        {},
      )
    : copy(values);
}
function createFormStore(initialValues: FormValues = {}): FormStore {
  let initial = copy(initialValues);
  let state: Snapshot = { values: copy(initial), errors: {} };
  const listeners = new Set<() => void>();
  const fields = new Map<
    string,
    { name: NamePath; rules: FormRule[]; dependencies: NamePath[] }
  >();
  const registrations = new Map<
    string,
    Map<
      object,
      {
        name: NamePath;
        rules: FormRule[];
        dependencies: NamePath[];
        initialValue: unknown;
      }
    >
  >();
  const refreshField = (key: string) => {
    const entries = [...(registrations.get(key)?.values() ?? [])];
    if (!entries.length) {
      fields.delete(key);
      return;
    }
    fields.set(key, {
      name: entries[0].name,
      rules: entries.flatMap((entry) => entry.rules),
      dependencies: entries.flatMap((entry) => entry.dependencies),
    });
  };
  const initialSnapshot = () => {
    let values = copy(initial);
    for (const entries of registrations.values()) {
      const defaults = [...entries.values()].filter(
        (entry) => entry.initialValue !== undefined,
      );
      // As in Ant Design, competing Item defaults for one name are unsupported.
      if (
        defaults.length === 1 &&
        getAt(values, defaults[0].name) === undefined
      )
        values = setAt(values, defaults[0].name, defaults[0].initialValue);
    }
    return values;
  };
  let revision = 0,
    validationRun = 0;
  const runs = new Map<string, number>();
  const invalidate = (key: string) => {
    const run = (runs.get(key) ?? 0) + 1;
    runs.set(key, run);
    return run;
  };
  const update = (next: Snapshot) => {
    state = next;
    for (const listener of listeners) listener();
  };
  const change = (values: FormValues, changed: NamePath[]) => {
    revision++;
    const errors = { ...state.errors };
    const jobs: (() => void)[] = [];
    for (const [key, field] of fields) {
      const dependent = field.dependencies.some((dependency) =>
        changed.some((name) => related(name, dependency)),
      );
      if (!dependent && !changed.some((name) => related(name, field.name)))
        continue;
      const token = invalidate(key);
      if (!dependent && !state.errors[key]) continue;
      const value = getAt(values, field.name);
      errors[key] = ruleErrors(labelOf(field.name), value, field.rules);
      if (field.rules.some((rule) => rule.validator))
        jobs.push(() => {
          void validateRules(labelOf(field.name), value, field.rules).then(
            (messages) => {
              if (runs.get(key) !== token || !fields.has(key)) return;
              update({
                ...state,
                errors: { ...state.errors, [key]: messages },
              });
            },
          );
        });
    }
    update({ values, errors });
    for (const job of jobs) job();
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
      for (const key of fields.keys()) invalidate(key);
      initial = copy(values);
      update({ values: initialSnapshot(), errors: {} });
    },
    register(name, rules, dependencies, initialValue, token) {
      const key = keyOf(name);
      validationRun++;
      invalidate(key);
      const entries = registrations.get(key) ?? new Map();
      entries.set(token, {
        name: copy(name),
        rules: rules.map((rule) => ({ ...rule })),
        dependencies: copy(dependencies),
        initialValue: copy(initialValue),
      });
      registrations.set(key, entries);
      refreshField(key);
      if (
        getAt(state.values, name) === undefined &&
        initialValue !== undefined &&
        [...entries.values()].filter(
          (entry) => entry.initialValue !== undefined,
        ).length === 1
      ) {
        revision++;
        update({
          ...state,
          values: setAt(state.values, name, getAt(initialSnapshot(), name)),
        });
      }
      return () => {
        entries.delete(token);
        if (!entries.size) registrations.delete(key);
        refreshField(key);
        invalidate(key);
        if (!entries.size && state.errors[key]) {
          const errors = { ...state.errors };
          delete errors[key];
          update({ ...state, errors });
        }
      };
    },
    setRules(name, rules, token, initialValue) {
      const key = keyOf(name),
        field = registrations.get(key)?.get(token);
      if (!field) return;
      if (!sameRules(field.rules, rules)) {
        validationRun++;
        invalidate(key);
      }
      field.rules = rules.map((rule) => ({ ...rule }));
      field.initialValue = copy(initialValue);
      refreshField(key);
    },
    getFieldValue: (name) => copy(getAt(state.values, name)),
    getFieldsValue: () => copy(state.values),
    setFieldValue(name, value) {
      change(setAt(state.values, name, value), [name]);
      return copy(state.values);
    },
    setFieldsValue(values) {
      change(mergeValues(state.values, values), Object.keys(values));
    },
    resetFields(names) {
      revision++;
      validationRun++;
      const defaults = initialSnapshot();
      let values = names ? state.values : defaults;
      const errors = names ? { ...state.errors } : {};
      for (const name of names ?? [])
        values = setAt(values, name, getAt(defaults, name));
      for (const [key, field] of fields) {
        // Reset also invalidates dependency validators; it does not start new validation.
        if (
          !names ||
          names.some(
            (name) =>
              related(name, field.name) ||
              field.dependencies.some((dependency) =>
                related(name, dependency),
              ),
          )
        ) {
          invalidate(key);
          delete errors[key];
        }
      }
      update({ values, errors });
    },
    async validateFields(names) {
      const run = ++validationRun,
        valueRevision = revision;
      const values = copy(state.values);
      const entries = [...fields.entries()].filter(
        ([, field]) =>
          !names || names.some((name) => contains(name, field.name)),
      );
      const tokens = entries.map(([key]) => invalidate(key));
      const results = await Promise.all(
        entries.map(([, field]) =>
          validateRules(
            labelOf(field.name),
            getAt(values, field.name),
            field.rules,
          ),
        ),
      );
      const errors = names ? { ...state.errors } : {};
      const errorFields: FormFieldError[] = [];
      entries.forEach(([key, field], index) => {
        const messages = results[index] ?? [];
        delete errors[key];
        if (messages.length) {
          errors[key] = messages;
          errorFields.push({ name: copy(field.name), errors: messages });
        }
      });
      const outOfDate =
        valueRevision !== revision ||
        run !== validationRun ||
        entries.some(([key], index) => runs.get(key) !== tokens[index]);
      if (!outOfDate) update({ ...state, errors });
      if (errorFields.length || outOfDate)
        throw {
          values: copy(state.values),
          errorFields,
          ...(outOfDate ? { outOfDate: true } : {}),
        } satisfies FormValidationError;
      return selectedValues(values, names);
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
                    if (!error.outOfDate)
                      for (const field of error.errorFields) {
                        const element = document.getElementById(
                          fieldIds.get(keyOf(field.name)) ??
                            `${id}-${field.name}`,
                        );
                        if (!element || element.closest("[hidden]")) continue;
                        element.focus();
                        if (document.activeElement === element) break;
                      }
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
  name?: NamePath;
  dependencies?: NamePath[];
  initialValue?: unknown;
  hidden?: boolean;
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
  const [registration] = useState(() => ({}));
  const initialValue = useRef(props.initialValue);
  initialValue.current = props.initialValue;
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
  const nameKey = props.name === undefined ? undefined : keyOf(props.name);
  const name = useMemo(() => props.name, [nameKey]);
  const dependencyKey = JSON.stringify((props.dependencies ?? []).map(pathOf));
  const dependencies = useMemo(() => props.dependencies ?? [], [dependencyKey]);
  const rules = useMemo(
    () => props.rules ?? (props.required ? [{ required: true }] : []),
    [props.rules, props.required],
  );
  const required = props.required ?? rules.some((rule) => rule.required);
  useEffect(() => {
    if (name !== undefined)
      return context?.store.register(
        name,
        rules,
        dependencies,
        initialValue.current,
        registration,
      );
  }, [context?.store, name, dependencies]);
  useEffect(() => {
    if (name !== undefined)
      context?.store.setRules(name, rules, registration, props.initialValue);
  }, [context?.store, name, rules, props.initialValue]);
  const child = props.children;
  const valuePropName = props.valuePropName ?? "value";
  const descriptor = isValidElement(child)
    ? (child as ElementDescriptor<Record<string, unknown>>)
    : null;
  const id =
    name !== undefined
      ? ((descriptor?.props?.id as string | undefined) ??
        `${context?.id ?? `ao-form-${generatedId}`}-${Array.isArray(name) ? encodeURIComponent(keyOf(name)) : name}`)
      : undefined;
  const fieldIds = context?.fieldIds;
  useEffect(() => {
    if (nameKey === undefined || !id || !fieldIds) return;
    fieldIds.set(nameKey, id);
    return () => {
      if (fieldIds.get(nameKey) === id) fieldIds.delete(nameKey);
    };
  }, [fieldIds, nameKey, id]);
  const helpId = id ? `${id}-help` : undefined;
  const errors = nameKey !== undefined ? (snapshot.errors[nameKey] ?? []) : [];
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
  const value = name !== undefined ? getAt(snapshot.values, name) : undefined;
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
    name !== undefined && context && descriptor
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
            context.onValuesChange?.(setAt({}, name, value), all);
            if (typeof original === "function") original(...args);
          },
        })
      : child;
  return (
    <div
      ref={itemRef}
      hidden={props.hidden}
      className={[
        cls("-item"),
        cls(`-item-${layout}`),
        errors.length && cls("-item-has-error"),
        hasAdditional && cls("-item-with-help"),
        props.className,
        props.rootClassName,
      ]}
      style={{
        ...formStyle,
        ...props.style,
        ...(props.hidden ? { display: "none" } : {}),
      }}
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
