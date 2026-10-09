import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Form, type FormInstance } from "../packages/antd-octane/src/form";
import { Input } from "../packages/antd-octane/src/input";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  if (!root) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
});

it.each([
  false,
  true,
])("initialValues takes precedence with external form=%s and subtree resets restore Item defaults", async (external) => {
  let form!: FormInstance;
  const change = vi.fn();
  function App() {
    [form] = Form.useForm();
    return (
      <Form
        form={external ? form : undefined}
        initialValues={{ user: { name: "Form", nil: null } }}
        onValuesChange={change}
      >
        <Form.Item name={["user", "name"]} initialValue="Item">
          <Input id="name" />
        </Form.Item>
        <Form.Item name={["user", "role"]} initialValue="Reader">
          <Input id="role" />
        </Form.Item>
        <Form.Item name={["user", "nil"]} initialValue="Fallback">
          <Input id="nil" />
        </Form.Item>
        <button type="reset">Reset</button>
      </Form>
    );
  }
  await render(<App />);
  expect(container.querySelector<HTMLInputElement>("#name")?.value).toBe(
    "Form",
  );
  expect(container.querySelector<HTMLInputElement>("#role")?.value).toBe(
    "Reader",
  );
  expect(container.querySelector<HTMLInputElement>("#nil")?.value).toBe("");
  if (external) {
    await act(() => {
      form.setFieldsValue({
        user: { name: "Edit", role: "Admin" },
        untouched: 7,
      });
      form.resetFields(["user"]);
    });
    expect(form.getFieldsValue()).toEqual({
      user: { name: "Form", role: "Reader", nil: null },
      untouched: 7,
    });
  } else {
    await act(() => {
      const input = container.querySelector<HTMLInputElement>("#role");
      if (!input) throw new Error("Missing role");
      input.value = "Admin";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(() => container.querySelector("button")?.click());
    expect(container.querySelector<HTMLInputElement>("#role")?.value).toBe(
      "Reader",
    );
  }
  expect(change).toHaveBeenCalledTimes(external ? 0 : 1);
});

it.each([
  false,
  true,
])("a duplicate name with one Item default initializes consistently (external form=%s)", async (external) => {
  function App() {
    const [form] = Form.useForm();
    return (
      <Form form={external ? form : undefined}>
        <Form.Item name="role">
          <Input id="without-default" />
        </Form.Item>
        <Form.Item name="role" initialValue="Reader">
          <Input id="with-default" />
        </Form.Item>
        <button type="reset">Reset</button>
      </Form>
    );
  }
  await render(<App />);
  for (const input of container.querySelectorAll<HTMLInputElement>("input"))
    expect(input.value).toBe("Reader");
  await act(() => {
    const input = container.querySelector<HTMLInputElement>("#without-default");
    if (!input) throw new Error("Missing role input");
    input.value = "Edited";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(() => container.querySelector("button")?.click());
  for (const input of container.querySelectorAll<HTMLInputElement>("input"))
    expect(input.value).toBe("Reader");
});

it("dynamic fields preserve existing edits and reset uses only registered defaults", async () => {
  let form!: FormInstance;
  let toggle!: (visible: boolean) => void;
  function App() {
    [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    toggle = setVisible;
    return (
      <Form form={form}>
        {visible && (
          <Form.Item name="role" initialValue="Reader">
            <Input />
          </Form.Item>
        )}
      </Form>
    );
  }
  await render(<App />);
  await act(() => form.setFieldValue("role", "Admin"));
  await act(() => toggle(true));
  expect(form.getFieldValue("role")).toBe("Admin");
  await act(() => form.resetFields());
  expect(form.getFieldValue("role")).toBe("Reader");
  await act(() => toggle(false));
  await act(() => form.resetFields());
  expect(form.getFieldValue("role")).toBeUndefined();
});

it("unmounting a duplicate field keeps its sibling validation registered", async () => {
  let form!: FormInstance;
  let toggle!: (visible: boolean) => void;
  function App() {
    [form] = Form.useForm();
    const [visible, setVisible] = useState(true);
    toggle = setVisible;
    return (
      <Form form={form}>
        <Form.Item
          name="role"
          initialValue="Reader"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input id="first" />
        </Form.Item>
        {visible && (
          <Form.Item name="role" initialValue="Admin">
            <Input id="second" />
          </Form.Item>
        )}
      </Form>
    );
  }
  await render(<App />);
  await act(() => form.resetFields());
  expect(form.getFieldValue("role")).toBeUndefined();
  await act(() => toggle(false));
  await act(() => form.setFieldValue("role", ""));
  await expect(form.validateFields()).rejects.toMatchObject({
    errorFields: [{ name: "role", errors: ["Required"] }],
  });
  await act(() => form.resetFields());
  expect(form.getFieldValue("role")).toBe("Reader");
});

it("hidden fields retain values and validate without taking error focus", async () => {
  let form!: FormInstance;
  const finish = vi.fn(),
    failed = vi.fn();
  function App() {
    [form] = Form.useForm();
    return (
      <Form form={form} onFinish={finish} onFinishFailed={failed}>
        <Form.Item
          name="secret"
          hidden
          initialValue=""
          required
          style={{ display: "block" }}
        >
          <Input id="secret" />
        </Form.Item>
        <Form.Item name="visible" required>
          <Input id="visible" />
        </Form.Item>
        <button type="submit">Submit</button>
      </Form>
    );
  }
  await render(<App />);
  expect(container.querySelector("[hidden]")?.getAttribute("style")).toContain(
    "display: none",
  );
  await act(async () => {
    container.querySelector("button")?.click();
    await Promise.resolve();
  });
  expect(failed.mock.calls[0][0].errorFields).toHaveLength(2);
  expect(document.activeElement?.id).toBe("visible");
  await act(() => form.setFieldsValue({ secret: "token", visible: "Ada" }));
  await act(async () => {
    container.querySelector("button")?.click();
    await Promise.resolve();
  });
  expect(finish).toHaveBeenCalledWith({ secret: "token", visible: "Ada" });
});

it("changing an Item default does not overwrite edits but is used by an explicit reset", async () => {
  let form!: FormInstance;
  function App({ initial }: { initial: string }) {
    [form] = Form.useForm();
    return (
      <Form form={form}>
        <Form.Item name="name" initialValue={initial}>
          <Input />
        </Form.Item>
      </Form>
    );
  }
  await render(<App initial="Ada" />);
  await act(() => form.setFieldValue("name", "Edited"));
  await render(<App initial="Grace" />);
  expect(form.getFieldValue("name")).toBe("Edited");
  await act(() => form.resetFields());
  expect(form.getFieldValue("name")).toBe("Grace");
});
