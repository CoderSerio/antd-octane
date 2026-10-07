import { afterEach, beforeEach, expect, it, vi } from "vitest";
import throttleByAnimationFrame from "../packages/antd-octane/src/_util/throttleByAnimationFrame";

let frames: Map<number, FrameRequestCallback>;
let sequence: number;
const cleanups: (() => void)[] = [];
beforeEach(() => {
  frames = new Map();
  sequence = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++sequence, callback);
    return sequence;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
});
afterEach(() => {
  for (const cleanup of cleanups.splice(0)) cleanup();
  vi.unstubAllGlobals();
});
function throttle<T extends unknown[]>(callback: (...args: T) => void) {
  const fn = throttleByAnimationFrame(callback);
  cleanups.push(fn.cancel);
  return fn;
}
function flush() {
  const callbacks = [...frames.values()];
  frames.clear();
  for (const callback of callbacks) callback(0);
}
it("retains the first arguments until the next frame", () => {
  const callback = vi.fn();
  const fn = throttle(callback);
  fn("first");
  fn("second");
  expect(frames.size).toBe(1);
  flush();
  expect(callback).toHaveBeenCalledExactlyOnceWith("first");
});
it("batches sibling measurements before microtask renders change their layout", async () => {
  let layout = 0;
  const measured: number[] = [];
  const first = throttle(() => {
    measured.push(layout);
    queueMicrotask(() => {
      layout = 22;
    });
  });
  const second = throttle(() => {
    measured.push(layout);
  });
  first();
  second();
  expect(frames.size).toBe(1);
  flush();
  await Promise.resolve();
  expect(measured).toEqual([0, 0]);
  expect(layout).toBe(22);
});
it("cancels only its own sibling task and cancels the empty frame", () => {
  const one = vi.fn();
  const two = vi.fn();
  const first = throttle(one);
  const second = throttle(two);
  first();
  second();
  first.cancel();
  expect(frames.size).toBe(1);
  flush();
  expect(one).not.toHaveBeenCalled();
  expect(two).toHaveBeenCalledOnce();
  second();
  second.cancel();
  expect(frames.size).toBe(0);
});
it("skips a sibling unmounted during dispatch and schedules new work in a new frame", () => {
  const callback = vi.fn();
  const second = throttle(callback);
  const deferred = throttle(callback);
  const first = throttle(() => {
    second.cancel();
    deferred("next frame");
  });
  first();
  second("cancelled");
  flush();
  expect(callback).not.toHaveBeenCalled();
  expect(frames.size).toBe(1);
  flush();
  expect(callback).toHaveBeenCalledExactlyOnceWith("next frame");
});
it("reports a callback error without stranding sibling measurements", async () => {
  const report = vi.fn();
  vi.stubGlobal("reportError", report);
  const error = new Error("Consumer callback");
  const first = throttle(() => {
    throw error;
  });
  const callback = vi.fn();
  const second = throttle(callback);
  first();
  second();
  flush();
  await Promise.resolve();
  expect(report).toHaveBeenCalledExactlyOnceWith(error);
  expect(callback).toHaveBeenCalledOnce();
  second();
  flush();
  expect(callback).toHaveBeenCalledTimes(2);
});
