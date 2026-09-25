import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import {
  InputNumber,
  type InputNumberRef,
} from "../packages/antd-octane/src/input-number";

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
function input() {
  const node = container.querySelector("input");
  if (!node) throw Error("Missing input");
  return node;
}
async function type(text: string) {
  await act(() => input().focus());
  await act(() => {
    input().value = text;
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function key(name: string) {
  await act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", {
        key: name,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
}
async function blur() {
  await act(() => input().blur());
}
it("preserves numeric editing drafts and commits precision on blur without binary rounding artifacts", async () => {
  const change = vi.fn();
  await render(
    <InputNumber defaultValue={1} precision={2} onChange={change} />,
  );
  await type("-");
  expect(input().value).toBe("-");
  expect(change).not.toHaveBeenCalled();
  await type("1.");
  expect(input().value).toBe("1.");
  await type("1.005");
  expect(change).toHaveBeenLastCalledWith(1.005);
  await blur();
  expect(change).toHaveBeenLastCalledWith(1.01);
  expect(input().value).toBe("1.01");
  await type("");
  expect(change).toHaveBeenLastCalledWith(null);
  await blur();
  expect(input().value).toBe("");
});
it("steps decimal values accurately, stops at limits and emits step metadata", async () => {
  const change = vi.fn(),
    step = vi.fn();
  await render(
    <InputNumber
      defaultValue={0.1}
      step={0.1}
      min={0}
      max={0.3}
      onChange={change}
      onStep={step}
    />,
  );
  await key("ArrowUp");
  expect(input().value).toBe("0.2");
  await key("ArrowUp");
  expect(input().value).toBe("0.3");
  await key("ArrowUp");
  expect(change).toHaveBeenCalledTimes(2);
  expect(step).toHaveBeenLastCalledWith(0.3, { offset: 0.1, type: "up" });
  expect(
    container
      .querySelector('button[aria-label="增加数值"]')
      ?.hasAttribute("disabled"),
  ).toBe(true);
  await act(() =>
    container
      .querySelector<HTMLButtonElement>('button[aria-label="减少数值"]')
      ?.click(),
  );
  expect(input().value).toBe("0.2");
});
it("retains out-of-range drafts until blur and does not emit when bounds change", async () => {
  const change = vi.fn();
  await render(
    <InputNumber defaultValue={5} min={0} max={10} onChange={change} />,
  );
  await type("25");
  expect(input().value).toBe("25");
  expect(change).not.toHaveBeenCalled();
  await blur();
  expect(input().value).toBe("10");
  expect(change).toHaveBeenLastCalledWith(10);
  change.mockClear();
  await render(
    <InputNumber defaultValue={5} min={0} max={6} onChange={change} />,
  );
  expect(change).not.toHaveBeenCalled();
  expect(input().getAttribute("aria-valuenow")).toBe("10");
  expect(input().getAttribute("aria-invalid")).toBe("true");
});
it("controlled values may exceed bounds and rejected input is restored on blur", async () => {
  const change = vi.fn();
  await render(<InputNumber value={20} max={10} onChange={change} />);
  expect(input().value).toBe("20");
  expect(change).not.toHaveBeenCalled();
  await type("3");
  expect(change).toHaveBeenLastCalledWith(3);
  await blur();
  expect(input().value).toBe("20");
  await render(<InputNumber value={2} onChange={change} />);
  await key("ArrowUp");
  expect(change).toHaveBeenLastCalledWith(3);
  expect(input().value).toBe("2");
});
it("formatter receives typing info and parser converts decorated values without losing drafts", async () => {
  const change = vi.fn(),
    format = vi.fn(
      (
        value: number | string | undefined,
        info: { userTyping: boolean; input: string },
      ) =>
        info.userTyping ? info.input : value === undefined ? "" : `$ ${value}`,
    );
  await render(
    <InputNumber
      defaultValue={1000}
      formatter={format}
      parser={(text) => text?.replace(/[$,\s]/g, "") ?? ""}
      onChange={change}
    />,
  );
  expect(input().value).toBe("$ 1000");
  await type("$ 2,500");
  expect(change).toHaveBeenLastCalledWith(2500);
  expect(format).toHaveBeenCalledWith(2500, {
    userTyping: true,
    input: "$ 2,500",
  });
  await blur();
  expect(input().value).toBe("$ 2500");
  await type("invalid");
  await blur();
  expect(input().value).toBe("$ 2500");
});
it("IME does not emit intermediate values and readOnly/disabled/keyboard=false block stepping", async () => {
  const change = vi.fn();
  await render(<InputNumber defaultValue={1} onChange={change} />);
  await act(() =>
    input().dispatchEvent(
      new CompositionEvent("compositionstart", { bubbles: true }),
    ),
  );
  await type("12");
  expect(change).not.toHaveBeenCalled();
  await act(() =>
    input().dispatchEvent(
      new CompositionEvent("compositionend", { bubbles: true }),
    ),
  );
  expect(change).toHaveBeenLastCalledWith(12);
  change.mockClear();
  await render(<InputNumber defaultValue={1} readOnly onChange={change} />);
  await key("ArrowUp");
  expect(change).not.toHaveBeenCalled();
  expect(container.querySelectorAll("button")).toHaveLength(0);
  await render(
    <ConfigProvider componentDisabled>
      <InputNumber onChange={change} />
    </ConfigProvider>,
  );
  expect(input().disabled).toBe(true);
  await key("ArrowUp");
  expect(change).not.toHaveBeenCalled();
  await render(<InputNumber keyboard={false} onChange={change} />);
  await key("ArrowUp");
  expect(change).not.toHaveBeenCalled();
});
it("ref exposes input and focus; Enter commits, changeOnBlur=false discards invalid drafts", async () => {
  const ref = { current: null as InputNumberRef | null };
  const enter = vi.fn(),
    change = vi.fn();
  await render(
    <InputNumber
      ref={ref}
      defaultValue={4}
      max={10}
      onPressEnter={enter}
      onChange={change}
    />,
  );
  await act(() => ref.current?.focus());
  expect(document.activeElement).toBe(input());
  expect(ref.current?.nativeElement).toBe(container.firstElementChild);
  await type("22");
  await key("Enter");
  expect(change).toHaveBeenLastCalledWith(10);
  expect(enter).toHaveBeenCalledOnce();
  await render(
    <InputNumber
      defaultValue={4}
      max={10}
      changeOnBlur={false}
      onChange={change}
    />,
  );
  change.mockClear();
  await type("22");
  await blur();
  expect(change).not.toHaveBeenCalled();
  expect(input().value).toBe("10");
});
it("commits the latest formatter draft when input and blur share a render batch", async () => {
  const change = vi.fn();
  await render(
    <InputNumber
      defaultValue={1000}
      formatter={(n, info) => (info.userTyping ? info.input : `¥ ${n ?? ""}`)}
      parser={(text) => text?.replace(/[¥,\s]/g, "") ?? ""}
      onChange={change}
    />,
  );
  await act(() => {
    const field = input();
    field.focus();
    field.value = "2500";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.blur();
  });
  expect(input().value).toBe("¥ 2500");
  expect(change).toHaveBeenCalledTimes(1);
  expect(change).toHaveBeenLastCalledWith(2500);
});
