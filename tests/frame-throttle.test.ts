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
