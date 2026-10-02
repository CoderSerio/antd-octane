import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Button } from "../packages/antd-octane/src/button";
import { Checkbox } from "../packages/antd-octane/src/checkbox";
import { Form, type FormInstance } from "../packages/antd-octane/src/form";
import { Input } from "../packages/antd-octane/src/input";
import { Select } from "../packages/antd-octane/src/select";
import { Switch } from "../packages/antd-octane/src/switch";

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
  root = undefined;
  container?.remove();
});
async function submit() {
  await act(async () => {
    container
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await Promise.resolve();
  });
}
async function inputValue(selector: string, value: string) {
  await act(() => {
    const input = container.querySelector<HTMLInputElement>(selector);
    if (!input) throw Error(`Missing ${selector}`);
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

it("validates, focuses the first error, then submits collected values", async () => {
  const finish = vi.fn();
  const failed = vi.fn();
  const changed = vi.fn();
  await render(
    <Form
      initialValues={{ email: "" }}
      onFinish={finish}
      onFinishFailed={failed}
      onValuesChange={changed}
    >
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: "请输入邮箱" },
          { pattern: /@/, message: "邮箱格式不正确" },
        ]}
      >
        <Input />
      </Form.Item>
      <Button htmlType="submit">提交</Button>
    </Form>,
  );
  await submit();
  expect(finish).not.toHaveBeenCalled();
  expect(failed).toHaveBeenCalledWith({
    values: { email: "" },
    errorFields: [{ name: "email", errors: ["请输入邮箱"] }],
  });
  expect(container.querySelector('[role="alert"]')?.textContent).toBe(
    "请输入邮箱",
  );
  expect(document.activeElement?.id).toContain("-email");
  await inputValue("input", "hello@example.com");
  expect(changed).toHaveBeenCalledWith(
    { email: "hello@example.com" },
    { email: "hello@example.com" },
  );
  expect(container.querySelector('[role="alert"]')).toBeNull();
  await submit();
  expect(finish).toHaveBeenCalledWith({ email: "hello@example.com" });
});

it("binds Select, Checkbox and Switch without losing their own handlers", async () => {
  const finish = vi.fn();
  const selectChange = vi.fn();
  await render(
    <Form
      onFinish={finish}
      initialValues={{ fruit: "apple", agree: true, news: false }}
    >
      <Form.Item name="fruit" label="水果" required>
        <Select
          options={[
            { value: "apple", label: "苹果" },
            { value: "pear", label: "梨" },
          ]}
          onChange={selectChange}
        />
      </Form.Item>
      <Form.Item name="agree" label="同意" valuePropName="checked">
        <Checkbox>同意条款</Checkbox>
      </Form.Item>
      <Form.Item name="news" label="通知" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>,
  );
  expect(
    container.querySelector<HTMLInputElement>('[role="combobox"]')?.value,
  ).toBe("苹果");
  expect(
    container.querySelector<HTMLInputElement>('input[type="checkbox"]')
      ?.checked,
  ).toBe(true);
  await act(() =>
    container
      .querySelector<HTMLInputElement>('input[type="checkbox"]')
      ?.click(),
  );
  await act(() =>
    container.querySelector<HTMLButtonElement>('[role="switch"]')?.click(),
  );
  await act(() =>
    container.querySelector<HTMLInputElement>('[role="combobox"]')?.click(),
  );
  await act(() =>
    document.querySelectorAll<HTMLElement>('[role="option"]')[1]?.click(),
  );
  expect(selectChange).toHaveBeenCalledWith("pear", {
    value: "pear",
    label: "梨",
  });
  await submit();
  expect(finish).toHaveBeenCalledWith({
    fruit: "pear",
    agree: false,
    news: true,
  });
});

it("supports useForm methods and reset to initial values", async () => {
  let form: FormInstance | undefined;
  function Example() {
    const [instance] = Form.useForm();
    const [, rerender] = useState(0);
    form = instance;
    return (
      <Form form={instance} initialValues={{ name: "seed" }}>
        <Form.Item name="name" label="名称" required>
          <Input />
        </Form.Item>
        <Button htmlType="reset">重置</Button>
        <Button
          onClick={() => {
            instance.setFieldsValue({ name: "updated" });
            rerender((value) => value + 1);
          }}
        >
          设置
        </Button>
      </Form>
    );
  }
  await render(<Example />);
  expect(form?.getFieldValue("name")).toBe("seed");
  await act(() =>
    container.querySelectorAll<HTMLButtonElement>("button")[1]?.click(),
  );
  expect(container.querySelector<HTMLInputElement>("input")?.value).toBe(
    "updated",
  );
  expect(await form?.validateFields()).toEqual({ name: "updated" });
  await act(() =>
    container.querySelectorAll<HTMLButtonElement>("button")[0]?.click(),
  );
  expect(form?.getFieldsValue()).toEqual({ name: "seed" });
  expect(container.querySelector<HTMLInputElement>("input")?.value).toBe(
    "seed",
  );
});

it("keeps labels, error descriptions and failed-submit focus linked to a custom control id", async () => {
  await render(
    <Form>
      <Form.Item name="email" label="Email" required>
        <Input id="contact-email" />
      </Form.Item>
      <Button htmlType="submit">Save</Button>
    </Form>,
  );
  const input = container.querySelector("input");
  expect(container.querySelector("label")?.htmlFor).toBe("contact-email");
  expect(input?.id).toBe("contact-email");
  await submit();
  expect(document.activeElement).toBe(input);
  expect(input?.getAttribute("aria-describedby")).toBe("contact-email-help");
  expect(container.querySelector('[role="alert"]')?.id).toBe(
    "contact-email-help",
  );
});
