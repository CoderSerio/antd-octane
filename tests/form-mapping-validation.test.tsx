import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Form,
  type FormInstance,
  type FormRule,
} from "../packages/antd-octane/src/form";
import { Input } from "../packages/antd-octane/src/input";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
  root = undefined;
});
function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
async function field(rules: FormRule[], initial = "old") {
  let instance!: FormInstance;
  function Example() {
    const [form] = Form.useForm();
    instance = form;
    return (
      <Form form={form} initialValues={{ field: initial }}>
        <Form.Item name="field" rules={rules}>
          <Input />
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  return instance;
}

it("maps array values and custom trigger arguments, retains callbacks and resets", async () => {
  const own = vi.fn();
  const changed = vi.fn();
  let form!: FormInstance;
  function ArrayControl(props: {
    targetKeys?: string[];
    onMove?: (keys: string[], direction: string) => void;
  }) {
    return (
      <button type="button" onClick={() => props.onMove?.(["b"], "right")}>
        {JSON.stringify(props.targetKeys)}
      </button>
    );
  }
  function Example() {
    [form] = Form.useForm();
    return (
      <Form
        form={form}
        initialValues={{ keys: ["a"] }}
        onValuesChange={changed}
      >
        <Form.Item
          name="keys"
          valuePropName="targetKeys"
          trigger="onMove"
          getValueFromEvent={(keys: string[], direction: string) =>
            direction === "right" ? keys : []
          }
        >
          <ArrayControl onMove={own} />
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  expect(container.querySelector("button")?.textContent).toBe('["a"]');
  await act(() => container.querySelector("button")?.click());
  expect(form.getFieldValue("keys")).toEqual(["b"]);
  expect(own).toHaveBeenCalledExactlyOnceWith(["b"], "right");
  expect(changed).toHaveBeenCalledExactlyOnceWith(
    { keys: ["b"] },
    { keys: ["b"] },
  );
  await act(() => form.resetFields());
  expect(container.querySelector("button")?.textContent).toBe('["a"]');
});

it("getValueProps overrides valuePropName and receives the raw stored value", async () => {
  const mapped = vi.fn((value: unknown) => ({ count: Number(value ?? 0) }));
  let form!: FormInstance;
  function Count(props: {
    count?: number;
    ignored?: unknown;
    onChange?: (value: number) => void;
  }) {
    return (
      <button
        type="button"
        onClick={() => props.onChange?.(8)}
      >{`${props.count}/${props.ignored}`}</button>
    );
  }
  function Example() {
    [form] = Form.useForm();
    return (
      <Form form={form}>
        <Form.Item name="count" valuePropName="ignored" getValueProps={mapped}>
          <Count />
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  expect(mapped).toHaveBeenCalledWith(undefined);
  expect(container.querySelector("button")?.textContent).toBe("0/undefined");
  await act(() => container.querySelector("button")?.click());
  expect(form.getFieldValue("count")).toBe(8);
  expect(container.querySelector("button")?.textContent).toBe("8/undefined");
});

it("extracts native target properties and preserves undefined for custom mappings", async () => {
  let form!: FormInstance;
  function Control(props: {
    content?: string;
    onChange?: (event: unknown) => void;
  }) {
    return (
      <button
        type="button"
        onClick={() => props.onChange?.({ target: { content: "new" } })}
      >
        {String(props.content)}
      </button>
    );
  }
  function Example() {
    [form] = Form.useForm();
    return (
      <Form form={form}>
        <Form.Item name="content" valuePropName="content">
          <Control />
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  expect(container.querySelector("button")?.textContent).toBe("undefined");
  await act(() => container.querySelector("button")?.click());
  expect(form.getFieldValue("content")).toBe("new");
  await act(() => form.resetFields());
  expect(container.querySelector("button")?.textContent).toBe("undefined");
});

it("runs custom validators with rule/value and handles throws, rejection and message precedence", async () => {
  const validator = vi.fn((rule: FormRule, value: unknown) => {
    expect(rule.message).toBe("custom");
    expect(value).toBe("old");
    throw new Error("fallback");
  });
  const form = await field([
    { min: 5, message: "short" },
    { validator, message: "custom" },
    { validator: () => Promise.reject("async reason") },
  ]);
  await act(async () => {
    await expect(form.validateFields()).rejects.toMatchObject({
      values: { field: "old" },
      errorFields: [
        { name: "field", errors: ["short", "custom", "async reason"] },
      ],
    });
  });
  expect(validator).toHaveBeenCalledOnce();
  expect(container.querySelector('[role="alert"]')?.textContent).toBe("short");
});

it("awaits async validators before completing submit", async () => {
  const pending = deferred();
  const finish = vi.fn();
  await render(
    <Form onFinish={finish} initialValues={{ field: "valid" }}>
      <Form.Item name="field" rules={[{ validator: () => pending.promise }]}>
        <Input />
      </Form.Item>
    </Form>,
  );
  await act(() =>
    container
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  expect(finish).not.toHaveBeenCalled();
  await act(async () => {
    pending.resolve();
    await pending.promise;
  });
  expect(finish).toHaveBeenCalledExactlyOnceWith({ field: "valid" });
});

it("rejects stale validation after an edit without showing its errors", async () => {
  const old = deferred();
  const form = await field([
    {
      validator: (_rule, value) =>
        value === "old" ? old.promise : Promise.resolve(),
    },
  ]);
  const result = form.validateFields().catch((error) => error);
  await act(() => form.setFieldsValue({ field: "new" }));
  await act(async () => {
    old.reject(new Error("obsolete"));
    await result;
  });
  expect(await result).toMatchObject({
    outOfDate: true,
    values: { field: "new" },
  });
  expect(container.querySelector('[role="alert"]')).toBeNull();
  await expect(form.validateFields()).resolves.toEqual({ field: "new" });
});

it("keeps the newest overlapping validation result and invalidates reset work", async () => {
  const first = deferred();
  const second = deferred();
  let call = 0;
  const form = await field([
    { validator: () => (++call === 1 ? first.promise : second.promise) },
  ]);
  const a = form.validateFields().catch((error) => error);
  const b = form.validateFields().catch((error) => error);
  await act(async () => {
    second.reject(new Error("latest"));
    await b;
  });
  expect(container.querySelector('[role="alert"]')?.textContent).toBe("latest");
  await act(async () => {
    first.resolve();
    await a;
  });
  expect(await a).toMatchObject({ outOfDate: true });
  expect(container.querySelector('[role="alert"]')?.textContent).toBe("latest");
  const c = form.validateFields().catch((error) => error);
  await act(() => form.resetFields());
  expect(await c).toMatchObject({ outOfDate: true });
  expect(container.querySelector('[role="alert"]')).toBeNull();
});

it("revalidates previously failed fields and ignores older background results", async () => {
  const stale = deferred();
  const form = await field([
    {
      validator: (_rule, value) => {
        if (value === "old") throw new Error("taken");
        if (value === "stale") return stale.promise;
        return Promise.resolve();
      },
    },
  ]);
  await act(async () => {
    await form.validateFields().catch(() => {});
  });
  expect(container.querySelector('[role="alert"]')?.textContent).toBe("taken");
  await act(() => form.setFieldsValue({ field: "stale" }));
  await act(() => form.setFieldsValue({ field: "fresh" }));
  await act(async () => {
    stale.reject(new Error("older"));
    await Promise.resolve();
  });
  expect(container.querySelector('[role="alert"]')).toBeNull();
  expect(form.getFieldValue("field")).toBe("fresh");
});

it("invalidates pending validation on actual rule changes but not equivalent new rule arrays", async () => {
  const pending = deferred();
  const validator = () => pending.promise;
  let form!: FormInstance;
  let setMinimum!: (value: number) => void;
  let rerender!: () => void;
  function Example() {
    [form] = Form.useForm();
    const [minimum, updateMinimum] = useState(2);
    const [, update] = useState(0);
    setMinimum = updateMinimum;
    rerender = () => update((value) => value + 1);
    return (
      <Form form={form} initialValues={{ field: "old" }}>
        <Form.Item
          name="field"
          rules={[{ min: minimum, pattern: /./g, validator }]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  const first = form.validateFields().catch((error) => error);
  await act(rerender);
  await act(async () => {
    pending.resolve();
    await first;
  });
  expect(await first).toEqual({ field: "old" });
  const second = form.validateFields().catch((error) => error);
  await act(() => setMinimum(5));
  expect(await second).toMatchObject({ outOfDate: true });
  await act(async () => {
    await expect(form.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: "field", errors: ["field 至少 5 个字符"] }],
    });
  });
});

it("invalidates an entire validation when a new field registers", async () => {
  const pending = deferred();
  const validator = () => pending.promise;
  let form!: FormInstance;
  let add!: () => void;
  function Example() {
    [form] = Form.useForm();
    const [extra, setExtra] = useState(false);
    add = () => setExtra(true);
    return (
      <Form form={form} initialValues={{ field: "old" }}>
        <Form.Item name="field" rules={[{ validator }]}>
          <Input />
        </Form.Item>
        {extra && (
          <Form.Item name="extra" required>
            <Input />
          </Form.Item>
        )}
      </Form>
    );
  }
  await render(<Example />);
  const result = form.validateFields().catch((error) => error);
  await act(add);
  await act(async () => {
    pending.resolve();
    await result;
  });
  expect(await result).toMatchObject({ outOfDate: true });
  await act(async () => {
    await expect(form.validateFields()).rejects.toMatchObject({
      errorFields: [{ name: "extra", errors: ["extra 为必填项"] }],
    });
  });
});

it("does not submit or move focus for an obsolete async submission", async () => {
  const pending = deferred();
  const finish = vi.fn();
  const failed = vi.fn();
  await render(
    <Form
      onFinish={finish}
      onFinishFailed={failed}
      initialValues={{ field: "old" }}
    >
      <Form.Item name="field" rules={[{ validator: () => pending.promise }]}>
        <Input />
      </Form.Item>
      <button type="button">Other focus</button>
    </Form>,
  );
  await act(() =>
    container
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  const input = container.querySelector<HTMLInputElement>("input");
  await act(() => {
    if (input) {
      input.value = "new";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  container.querySelector("button")?.focus();
  await act(async () => {
    pending.reject(new Error("stale"));
    await Promise.resolve();
  });
  expect(finish).not.toHaveBeenCalled();
  expect(failed).toHaveBeenCalledWith(
    expect.objectContaining({ outOfDate: true }),
  );
  expect(document.activeElement?.textContent).toBe("Other focus");
  expect(container.querySelector('[role="alert"]')).toBeNull();
});
