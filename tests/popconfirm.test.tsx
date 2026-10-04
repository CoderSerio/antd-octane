import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Popconfirm } from "../packages/antd-octane/src/popconfirm";

let root: Root | undefined, container: HTMLDivElement;

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

const popup = () => document.querySelector(".ant-popconfirm") as HTMLElement;

const click = async (text: string) => {
  const button = Array.from(document.querySelectorAll("button")).find(
    (b) => b.textContent === text,
  );
  if (!button) throw Error(text);
  await act(() => button.click());
};

it("opens, cancels and confirms with original trigger behavior", async () => {
  const cancel = vi.fn(),
    confirm = vi.fn(),
    trigger = vi.fn();
  await render(
    <Popconfirm title="确认删除" onCancel={cancel} onConfirm={confirm}>
      <button type="button" onClick={trigger}>
        打开
      </button>
    </Popconfirm>,
  );
  await click("打开");
  expect(popup().hidden).toBe(false);
  expect(trigger).toHaveBeenCalledOnce();
  await click("Cancel");
  expect(cancel).toHaveBeenCalledOnce();
  await act(() =>
    popup()?.dispatchEvent(
      Object.assign(new Event("animationend", { bubbles: true }), {
        animationName: "ao-floating-zoom-out",
      }),
    ),
  );
  expect(popup().hidden).toBe(true);
  await click("打开");
  await click("OK");
  expect(confirm).toHaveBeenCalledOnce();
  await act(() =>
    popup()?.dispatchEvent(
      Object.assign(new Event("animationend", { bubbles: true }), {
        animationName: "ao-floating-zoom-out",
      }),
    ),
  );
  expect(popup().hidden).toBe(true);
});

it("waits for async success and allows retry after rejection", async () => {
  let resolve: () => void = () => {},
    reject: (reason: Error) => void = () => {};
  const confirm = vi.fn(
    () =>
      new Promise<void>((yes, no) => {
        resolve = yes;
        reject = no;
      }),
  );
  await render(
    <Popconfirm title="保存" onConfirm={confirm}>
      <button type="button">打开</button>
    </Popconfirm>,
  );
  await click("打开");
  await click("OK");
  expect(popup().querySelector(".ant-btn-loading")).not.toBeNull();
  await act(() => reject(Error("retry")));
  expect(popup().hidden).toBe(false);
  expect(popup().querySelector(".ant-btn-loading")).toBeNull();
  await click("OK");
  await act(() => resolve());
  await act(() =>
    popup()?.dispatchEvent(
      Object.assign(new Event("animationend", { bubbles: true }), {
        animationName: "ao-floating-zoom-out",
      }),
    ),
  );
  expect(popup().hidden).toBe(true);
});

it("respects disabled and a controlled owner rejecting close", async () => {
  const change = vi.fn();
  await render(
    <Popconfirm title="确认" disabled>
      <button type="button">打开</button>
    </Popconfirm>,
  );
  await click("打开");
  expect(popup()).toBeNull();
  await render(
    <Popconfirm title="确认" open onOpenChange={change}>
      <button type="button">打开</button>
    </Popconfirm>,
  );
  await click("OK");
  expect(change).toHaveBeenCalledWith(false, expect.any(MouseEvent));
  expect(popup().hidden).toBe(false);
});

it("an earlier async action cannot close a newly opened popup", async () => {
  let resolve: () => void = () => {};
  await render(
    <Popconfirm
      title="确认"
      onConfirm={() =>
        new Promise<void>((yes) => {
          resolve = yes;
        })
      }
    >
      <button type="button">打开</button>
    </Popconfirm>,
  );
  await click("打开");
  await click("OK");
  await act(() =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  await click("打开");
  await act(() => resolve());
  expect(popup().hidden).toBe(false);
});
