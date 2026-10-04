import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Affix, type AffixRef } from "../packages/antd-octane/src/affix";
import {
  getFixedBottom,
  getFixedTop,
} from "../packages/antd-octane/src/affix/utils";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";

let root: Root;
let host: HTMLDivElement;
let target: HTMLDivElement;
let frames: Map<number, FrameRequestCallback>;
let sequence: number;
const resize = vi.fn();
const disconnect = vi.fn();
const rect = (top = 80, height = 32, width = 100, left = 20) =>
  ({
    top,
    bottom: top + height,
    left,
    right: left + width,
    width,
    height,
    x: left,
    y: top,
  }) as DOMRect;
beforeEach(() => {
  host = document.createElement("div");
  target = document.createElement("div");
  document.body.append(host, target);
  root = createRoot(host);
  frames = new Map();
  sequence = 0;
  resize.mockClear();
  disconnect.mockClear();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++sequence, callback);
    return sequence;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = resize;
      disconnect = disconnect;
    },
  );
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue(
    rect(100, 300, 500, 10),
  );
});
afterEach(async () => {
  await act(() => root.unmount());
  host.remove();
  target.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
async function render(node: ElementDescriptor) {
  await act(() => root.render(node));
}
async function flush() {
  const callbacks = [...frames.values()];
  frames.clear();
  await act(() =>
    callbacks.forEach((callback) => {
      callback(performance.now());
    }),
  );
}
async function setup(props: Partial<Parameters<typeof Affix>[0]> = {}) {
  const ref = { current: null as AffixRef | null };
  const change = vi.fn();
  await render(
    <Affix ref={ref} target={() => target} onChange={change} {...props}>
      <button type="button">Child</button>
    </Affix>,
  );
  const holder = host.firstElementChild as HTMLDivElement;
  const box = vi.spyOn(holder, "getBoundingClientRect").mockReturnValue(rect());
  return { ref, change, holder, box };
}
it("matches source rounding at both boundaries", () => {
  expect(getFixedTop(rect(100.49), rect(100, 300), 0)).toBeUndefined();
  expect(getFixedTop(rect(99.49), rect(100, 300), 0)).toBe(100);
  expect(getFixedBottom(rect(368.49), rect(100, 300), 0)).toBeUndefined();
  expect(getFixedBottom(rect(368.51), rect(100, 300), 0)).toBe(
    window.innerHeight - 400,
  );
});
it("uses a separate hidden placeholder and applies rootClassName only to the fixed slot", async () => {
  const { holder, change, box, ref } = await setup({
    offsetTop: 10,
    className: "outer",
    rootClassName: "inner",
    style: { margin: 12 },
  });
  expect(holder.className).toBe("outer");
  expect(holder.querySelector(".inner")).toBeNull();
  await flush();
  const fixed = holder.querySelector<HTMLElement>(".ant-affix");
  expect(fixed?.classList.contains("inner")).toBe(true);
  expect(fixed?.style.top).toBe("110px");
  expect(fixed?.style.left).toBe("");
  expect(fixed?.style.height).toBe("32px");
  expect(holder.style.height).toBe("");
  expect(holder.style.margin).toBe("12px");
  const placeholder = holder.querySelector<HTMLElement>('[aria-hidden="true"]');
  expect(placeholder?.style.width).toBe("100px");
  expect(placeholder?.style.height).toBe("32px");
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  box.mockReturnValue(rect(130));
  await act(() => ref.current?.updatePosition());
  await flush();
  expect(holder.querySelector("[aria-hidden]")).toBeNull();
  expect(holder.querySelector(".ant-affix")).toBeNull();
  expect(change.mock.calls).toEqual([[true], [false]]);
});
it("uses bottom fixed positioning and tests top and bottom independently", async () => {
  const { holder, box, ref } = await setup({ offsetTop: 10, offsetBottom: 15 });
  box.mockReturnValue(rect(370));
  await flush();
  const fixed = holder.querySelector<HTMLElement>(".ant-affix");
  expect(fixed?.style.top).toBe("");
  expect(fixed?.style.bottom).toBe(`${15 + window.innerHeight - 400}px`);
  box.mockReturnValue(rect(80));
  await act(() => ref.current?.updatePosition());
  await flush();
  expect(fixed?.style.top).toBe("110px");
  expect(fixed?.style.bottom).toBe("");
});
it("exposes a throttled cancellable update and preserves the first request in a frame", async () => {
  const { ref, holder } = await setup();
  await flush();
  await flush();
  await act(() => {
    ref.current?.updatePosition();
    ref.current?.updatePosition();
  });
  expect(frames.size).toBe(1);
  ref.current?.updatePosition.cancel();
  expect(frames.size).toBe(0);
  expect(holder.querySelector(".ant-affix")).not.toBeNull();
});
it("listens to all source events on the chosen target and leaves window scrolling alone", async () => {
  const add = vi.spyOn(target, "addEventListener");
  const windowAdd = vi.spyOn(window, "addEventListener");
  const { holder, box } = await setup();
  await flush();
  expect(add.mock.calls.map(([event]) => event)).toEqual(
    expect.arrayContaining([
      "resize",
      "scroll",
      "touchstart",
      "touchmove",
      "touchend",
      "pageshow",
      "load",
    ]),
  );
  expect(windowAdd.mock.calls.some(([event]) => event === "scroll")).toBe(
    false,
  );
  box.mockReturnValue(rect(150));
  await act(() => target.dispatchEvent(new Event("touchend")));
  await flush();
  expect(holder.querySelector(".ant-affix")).toBeNull();
});
it("ignores all-zero hidden bounds until an explicit update", async () => {
  const { holder, box, ref, change } = await setup();
  box.mockReturnValue(rect(0, 0, 0, 0));
  await flush();
  expect(change).not.toHaveBeenCalled();
  expect(holder.querySelector("[aria-hidden]")).toBeNull();
  box.mockReturnValue(rect());
  await act(() => ref.current?.updatePosition());
  await flush();
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
});
it("resolves ConfigProvider target, prefix and component token overrides", async () => {
  const ref = { current: null as AffixRef | null };
  await render(
    <ConfigProvider
      prefixCls="custom"
      getTargetContainer={() => target}
      theme={{ components: { Affix: { zIndexPopup: 1234 } } }}
    >
      <Affix ref={ref} rootClassName="fixed-root">
        <button type="button">Child</button>
      </Affix>
    </ConfigProvider>,
  );
  const holder = host.querySelector("button")?.parentElement
    ?.parentElement as HTMLElement;
  vi.spyOn(holder, "getBoundingClientRect").mockReturnValue(rect());
  await flush();
  const fixed = holder.querySelector<HTMLElement>(".custom-affix");
  expect(fixed?.style.top).toBe("100px");
  expect(fixed?.style.zIndex).toBe("1234");
  expect(fixed?.classList.contains("ant-affix")).toBe(false);
});
it("detaches listeners, observer and pending frames on unmount", async () => {
  const remove = vi.spyOn(target, "removeEventListener");
  const { ref } = await setup();
  await flush();
  await flush();
  await act(() => ref.current?.updatePosition());
  expect(frames.size).toBe(1);
  const pending = [...frames.keys()];
  await act(() => root.unmount());
  for (const id of pending) expect(frames.has(id)).toBe(false);
  await flush();
  expect(frames.size).toBe(0);
  expect(remove.mock.calls.map(([event]) => event)).toEqual(
    expect.arrayContaining([
      "resize",
      "scroll",
      "touchstart",
      "touchmove",
      "touchend",
      "pageshow",
      "load",
    ]),
  );
  expect(disconnect).toHaveBeenCalled();
});
it("keeps concrete DOM resize subscriptions across ordinary re-renders", async () => {
  const { ref } = await setup();
  await flush();
  const initialCount = resize.mock.calls.length;
  expect(initialCount).toBe(2);
  await act(() => ref.current?.updatePosition());
  await flush();
  expect(resize.mock.calls.length).toBe(initialCount);
});
it("publishes a transition once when explicit and target updates share a frame", async () => {
  const { change, ref } = await setup();
  await act(() => {
    ref.current?.updatePosition();
    target.dispatchEvent(new Event("scroll"));
  });
  await flush();
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
});
