import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Input,
  type InputRef,
  type TextAreaRef,
} from "../packages/antd-octane/src/input";

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
  vi.restoreAllMocks();
});
it("decorated clear emits native input, preserves ref and controlled rejection", async () => {
  const change = vi.fn();
  const clear = vi.fn();
  const ref = { current: null as InputRef | null };
  await render(
    <Input
      value="fixed"
      allowClear
      prefix="￥"
      addonAfter="元"
      onChange={change}
      onClear={clear}
      ref={ref}
    />,
  );
  expect(ref.current?.input).toBe(container.querySelector("input"));
  await act(() => container.querySelector("button")?.click());
  expect(change).toHaveBeenCalledOnce();
  expect(clear).toHaveBeenCalledOnce();
  expect(container.querySelector("input")?.value).toBe("fixed");
  expect(document.activeElement).toBe(container.querySelector("input"));
});
it("uncontrolled clear changes native value and form reset updates clear state", async () => {
  await render(
    <form>
      <Input defaultValue="original" allowClear />
      <button type="reset">reset</button>
    </form>,
  );
  await act(() =>
    container
      .querySelector<HTMLButtonElement>(".ant-input-clear-icon")
      ?.click(),
  );
  expect(container.querySelector("input")?.value).toBe("");
  expect(container.querySelector(".ant-input-clear-icon")).toBeNull();
  await act(() => container.querySelector("form")?.reset());
  await act(() => Promise.resolve());
  expect(container.querySelector("input")?.value).toBe("original");
  expect(container.querySelector(".ant-input-clear-icon")).not.toBeNull();
});
it("readonly and disabled never offer clear", async () => {
  await render(
    <div>
      <Input defaultValue="readonly" readOnly allowClear />
      <Input defaultValue="disabled" disabled allowClear />
    </div>,
  );
  expect(container.querySelectorAll(".ant-input-clear-icon")).toHaveLength(0);
});
it("Password toggles without replacing input and respects controlled visibility", async () => {
  await render(<Input.Password defaultValue="secret" />);
  const input = container.querySelector("input");
  expect(input?.type).toBe("password");
  await act(() => container.querySelector("button")?.click());
  expect(container.querySelector("input")).toBe(input);
  expect(input?.type).toBe("text");
  expect(input?.value).toBe("secret");
  const change = vi.fn();
  await render(
    <Input.Password
      visibilityToggle={{ visible: false, onVisibleChange: change }}
    />,
  );
  await act(() => container.querySelector("button")?.click());
  expect(change).toHaveBeenCalledWith(true);
  expect(container.querySelector("input")?.type).toBe("password");
});
it("Search emits entered value, suppresses IME and loading and identifies clear", async () => {
  const search = vi.fn();
  await render(
    <Input.Search
      defaultValue="query"
      allowClear
      enterButton="查找"
      onSearch={search}
    />,
  );
  const input = container.querySelector("input") as HTMLInputElement;
  await act(() =>
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        isComposing: true,
      }),
    ),
  );
  expect(search).not.toHaveBeenCalled();
  await act(() =>
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(search).toHaveBeenLastCalledWith("query", expect.any(Event), {
    source: "input",
  });
  await act(() =>
    container
      .querySelector<HTMLButtonElement>(".ant-input-clear-icon")
      ?.click(),
  );
  expect(search).toHaveBeenLastCalledWith("", expect.any(Event), {
    source: "clear",
  });
  search.mockClear();
  await render(<Input.Search loading defaultValue="query" onSearch={search} />);
  await act(() =>
    container
      .querySelector("input")
      ?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      ),
  );
  expect(search).not.toHaveBeenCalled();
});
it("TextArea supports native ref, clear and IME guard", async () => {
  const ref = { current: null as TextAreaRef | null };
  const enter = vi.fn();
  const change = vi.fn();
  await render(
    <Input.TextArea
      defaultValue="multiline"
      allowClear
      ref={ref}
      onPressEnter={enter}
      onChange={change}
    />,
  );
  expect(ref.current?.resizableTextArea.textArea).toBe(
    container.querySelector("textarea"),
  );
  await act(() =>
    container.querySelector("textarea")?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        isComposing: true,
        bubbles: true,
      }),
    ),
  );
  expect(enter).not.toHaveBeenCalled();
  await act(() => container.querySelector("button")?.click());
  expect(change).toHaveBeenCalledOnce();
  expect(container.querySelector("textarea")?.value).toBe("");
});
it("TextArea autoSize constrains content height and releases inline sizing when disabled", async () => {
  vi.spyOn(window, "getComputedStyle").mockReturnValue({
    lineHeight: "20px",
    fontSize: "14px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderTopWidth: "1px",
    borderBottomWidth: "1px",
  } as CSSStyleDeclaration);
  vi.spyOn(
    HTMLTextAreaElement.prototype,
    "scrollHeight",
    "get",
  ).mockReturnValue(200);
  await render(<Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />);
  const element = container.querySelector("textarea") as HTMLTextAreaElement;
  expect(element.style.height).toBe("90px");
  expect(element.style.overflowY).toBe("auto");
  await render(<Input.TextArea autoSize={false} />);
  expect(element.style.height).toBe("");
});
