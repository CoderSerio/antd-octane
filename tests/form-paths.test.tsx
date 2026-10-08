import dayjs from "dayjs";
import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { DatePicker } from "../packages/antd-octane/src/date-picker";
import { Form, type FormInstance } from "../packages/antd-octane/src/form";
import { Input } from "../packages/antd-octane/src/input";
import { TreeSelect } from "../packages/antd-octane/src/tree-select";
import { Upload } from "../packages/antd-octane/src/upload";

let root: Root | undefined;
let host: HTMLDivElement;
async function render(node: ElementDescriptor) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  host?.remove();
});

it("preserves nested siblings, numeric array paths, literal dots and independent initial snapshots", async () => {
  let form!: FormInstance;
  const initial = {
    user: { name: "Ada", role: "reader" },
    "user.name": "literal",
    people: [{ email: "first" }],
  };
  const changed = vi.fn();
  function Example() {
    [form] = Form.useForm();
    return (
      <Form form={form} initialValues={initial} onValuesChange={changed}>
        <Form.Item name={["user", "name"]}>
          <Input aria-label="nested" />
        </Form.Item>
        <Form.Item name="user.name">
          <Input aria-label="literal" />
        </Form.Item>
        <Form.Item name={["people", 0, "email"]}>
          <Input />
        </Form.Item>
        <Form.Item name={0}>
          <Input aria-label="zero" />
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  initial.user.name = "mutated";
  await act(() => form.setFieldsValue({ user: { role: "editor" } }));
  expect(form.getFieldValue(["user", "name"])).toBe("Ada");
  const input = host.querySelector<HTMLInputElement>('[aria-label="nested"]');
  if (!input) throw new Error("Missing nested input");
  await act(() => {
    input.value = "Grace";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(changed).toHaveBeenCalledWith(
    { user: { name: "Grace" } },
    expect.objectContaining({ user: { name: "Grace", role: "editor" } }),
  );
  await act(() => {
    form.setFieldValue(["people", 1, "email"], "second");
    form.setFieldValue(0, "zero");
  });
  expect(form.getFieldValue("people")).toEqual([
    { email: "first" },
    { email: "second" },
  ]);
  expect(
    host.querySelector<HTMLInputElement>('[aria-label="zero"]')?.value,
  ).toBe("zero");
  const detached = form.getFieldsValue();
  (detached.user as { name: string }).name = "outside";
  expect(form.getFieldValue(["user", "name"])).toBe("Grace");
  await act(() => form.resetFields([["user", "name"]]));
  expect(form.getFieldValue("user")).toEqual({ name: "Ada", role: "editor" });
  expect(form.getFieldValue("user.name")).toBe("literal");
});

it("validates a subtree without removing unrelated errors, and focuses the nested control", async () => {
  let form!: FormInstance;
  const failed = vi.fn();
  function Example() {
    [form] = Form.useForm();
    return (
      <Form form={form} onFinishFailed={failed}>
        <Form.Item
          name={["user", "name"]}
          rules={[{ required: true, message: "Name missing" }]}
        >
          <Input id="nested-name" />
        </Form.Item>
        <Form.Item
          name="other"
          rules={[{ required: true, message: "Other missing" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  await act(async () => {
    await form.validateFields().catch(() => {});
  });
  expect(host.querySelectorAll('[role="alert"]')).toHaveLength(2);
  await act(() => form.setFieldValue(["user", "name"], "Ada"));
  await act(async () => {
    await expect(form.validateFields(["user"])).resolves.toEqual({
      user: { name: "Ada" },
    });
  });
  expect(host.querySelector('[role="alert"]')?.textContent).toBe(
    "Other missing",
  );
  await act(() => form.resetFields(["user"]));
  await act(async () => {
    host
      .querySelector("form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  expect(failed).toHaveBeenCalledWith(
    expect.objectContaining({
      errorFields: expect.arrayContaining([
        { name: ["user", "name"], errors: ["Name missing"] },
      ]),
    }),
  );
  expect(document.activeElement?.id).toBe("nested-name");
});

it("revalidates nested dependencies against the new values and discards older async results", async () => {
  let form!: FormInstance;
  let rejectOld!: (error: Error) => void;
  const old = new Promise<void>((_resolve, reject) => {
    rejectOld = reject;
  });
  function Example() {
    [form] = Form.useForm();
    return (
      <Form
        form={form}
        initialValues={{ account: { password: "first", confirm: "first" } }}
      >
        <Form.Item name={["account", "password"]}>
          <Input />
        </Form.Item>
        <Form.Item
          name={["account", "confirm"]}
          dependencies={[["account", "password"]]}
          rules={[
            {
              validator: (_rule, value) => {
                const password = form.getFieldValue(["account", "password"]);
                if (password === "pending") return old;
                if (password !== value) throw new Error("Does not match");
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  await act(() => form.setFieldValue(["account", "password"], "different"));
  expect(host.querySelector('[role="alert"]')?.textContent).toBe(
    "Does not match",
  );
  await act(() => form.setFieldValue(["account", "password"], "pending"));
  await act(() => form.setFieldValue(["account", "password"], "first"));
  await act(async () => {
    rejectOld(new Error("Stale"));
    await old.catch(() => {});
  });
  expect(host.querySelector('[role="alert"]')).toBeNull();
  await act(async () => {
    await expect(form.validateFields()).resolves.toEqual({
      account: { password: "first", confirm: "first" },
    });
  });
});

it("keeps Dayjs/File values intact and binds nested DatePicker, TreeSelect and Upload", async () => {
  let form!: FormInstance;
  const date = dayjs("2026-10-08");
  const file = new File(["hello"], "hello.txt", { type: "text/plain" });
  function Example() {
    [form] = Form.useForm();
    return (
      <Form
        form={form}
        initialValues={{
          request: {
            date,
            team: "a",
            files: [{ uid: "1", name: file.name, originFileObj: file }],
          },
        }}
      >
        <Form.Item name={["request", "date"]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name={["request", "team"]}>
          <TreeSelect treeData={[{ value: "a", title: "Team A" }]} allowClear />
        </Form.Item>
        <Form.Item
          name={["request", "files"]}
          valuePropName="fileList"
          getValueFromEvent={(info: { fileList: unknown[] }) => info.fileList}
        >
          <Upload beforeUpload={() => false}>
            <button type="button">Upload</button>
          </Upload>
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  expect(form.getFieldValue(["request", "date"])).toBe(date);
  expect(
    (form.getFieldValue(["request", "files"]) as { originFileObj: File }[])[0]
      .originFileObj,
  ).toBe(file);
  expect(
    host.querySelector<HTMLInputElement>(".ant-tree-select input")?.value,
  ).toBe("Team A");
  expect(host.textContent).toContain("hello.txt");
  await act(() => form.setFieldValue(["request", "team"], undefined));
  expect(
    host.querySelector<HTMLInputElement>(".ant-tree-select input")?.value,
  ).toBe("");
  await act(() => form.resetFields(["request"]));
  expect(
    host.querySelector<HTMLInputElement>(".ant-tree-select input")?.value,
  ).toBe("Team A");
});

it("rejects unsafe paths without prototype mutation", async () => {
  let form!: FormInstance;
  function Example() {
    [form] = Form.useForm();
    return <Form form={form} />;
  }
  await render(<Example />);
  expect(() => form.setFieldValue(["__proto__", "polluted"], true)).toThrow(
    "NamePath",
  );
  expect(() =>
    form.setFieldsValue(JSON.parse('{"__proto__":{"polluted":true}}')),
  ).toThrow("NamePath");
  expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
});

it("invalidates a pending nested validation when its parent is replaced or reset", async () => {
  let form!: FormInstance;
  let resolve!: () => void;
  let pending = new Promise<void>((done) => {
    resolve = done;
  });
  function Example() {
    [form] = Form.useForm();
    return (
      <Form form={form} initialValues={{ user: { name: "original" } }}>
        <Form.Item
          name={["user", "name"]}
          rules={[{ validator: () => pending }]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  }
  await render(<Example />);
  const first = form.validateFields(["user"]).catch((error) => error);
  await act(() => form.setFieldValue("user", { name: "replacement" }));
  await act(async () => {
    resolve();
    await first;
  });
  expect(await first).toMatchObject({
    outOfDate: true,
    values: { user: { name: "replacement" } },
  });
  pending = new Promise<void>((done) => {
    resolve = done;
  });
  const second = form
    .validateFields([["user", "name"]])
    .catch((error) => error);
  await act(() => form.resetFields(["user"]));
  await act(async () => {
    resolve();
    await second;
  });
  expect(await second).toMatchObject({
    outOfDate: true,
    values: { user: { name: "original" } },
  });
  expect(host.querySelector('[role="alert"]')).toBeNull();
});
