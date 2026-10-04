/** @jsxImportSource octane */
import { act, createRoot, type Root } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import useNoticeTimer from "../packages/antd-octane/src/_util/useNoticeTimer";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import {
  type NotificationInstance,
  notification,
} from "../packages/antd-octane/src/notification";

let root: Root;
let container: HTMLDivElement;
let api: NotificationInstance;
let frameId: number;
let now: number;
let frames: Map<number, FrameRequestCallback>;
const notice = () =>
  document.querySelector<HTMLElement>(".ant-notification-notice");
const progress = () =>
  document.querySelector<HTMLProgressElement>(
    "progress.ant-notification-notice-progress",
  );
function Hooks() {
  const [instance, holder] = notification.useNotification({ stack: false });
  api = instance;
  return holder;
}
async function tick(ms: number) {
  now += ms;
  await act(() => vi.advanceTimersByTime(ms));
  await act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => {
      callback(now);
    });
  });
}
beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  now = 0;
  frameId = 0;
  frames = new Map();
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() =>
    root.render(
      <ConfigProvider theme={{ token: { motion: false } }}>
        <Hooks />
      </ConfigProvider>,
    ),
  );
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
it("renders a determinate native progress element with the remaining percentage", async () => {
  await act(() =>
    api.open({ message: "Progress", duration: 1, showProgress: true }),
  );
  expect(progress()?.max).toBe(100);
  expect(progress()?.value).toBe(100);
  expect(progress()?.textContent).toBe("100%");
  await tick(400);
  expect(progress()?.value).toBe(60);
  expect(progress()?.textContent).toBe("60%");
  await tick(601);
  expect(notice()).toBeNull();
});
it("pauses both the timeout and percentage on hover and forwards user callbacks", async () => {
  const enter = vi.fn(),
    leave = vi.fn(),
    close = vi.fn();
  await act(() =>
    api.open({
      message: "Pause",
      duration: 1,
      showProgress: true,
      onClose: close,
      props: { onMouseEnter: enter, onMouseLeave: leave },
    }),
  );
  await tick(400);
  const el = notice() as HTMLElement;
  await act(() => el.dispatchEvent(new MouseEvent("mouseenter")));
  await tick(2000);
  expect(progress()?.value).toBe(60);
  expect(close).not.toHaveBeenCalled();
  await act(() => el.dispatchEvent(new MouseEvent("mouseleave")));
  await tick(300);
  expect(progress()?.value).toBe(30);
  await tick(301);
  expect(close).toHaveBeenCalledOnce();
  expect(enter).toHaveBeenCalledOnce();
  expect(leave).toHaveBeenCalledOnce();
});
it("continues progress and closes while hovered when pauseOnHover is false", async () => {
  const close = vi.fn();
  await act(() =>
    api.open({
      message: "Continuous",
      duration: 1,
      showProgress: true,
      pauseOnHover: false,
      onClose: close,
    }),
  );
  await tick(400);
  await act(() => notice()?.dispatchEvent(new MouseEvent("mouseenter")));
  await tick(200);
  expect(progress()?.value).toBe(40);
  await tick(401);
  expect(close).toHaveBeenCalledOnce();
  expect(notice()).toBeNull();
});
it("keeps a native progress value on a same-key update and restarts the upstream timeout", async () => {
  await act(() =>
    api.open({
      key: "same",
      message: "Before",
      duration: 1,
      showProgress: true,
    }),
  );
  await tick(400);
  const el = progress();
  await act(() =>
    api.open({
      key: "same",
      message: "After",
      duration: 1,
      showProgress: true,
    }),
  );
  expect(progress()).toBe(el);
  expect(progress()?.value).toBe(60);
  await tick(300);
  expect(progress()?.value).toBe(30);
  await tick(301);
  expect(progress()?.value).toBe(0);
  expect(notice()).not.toBeNull();
  await tick(400);
  expect(notice()).toBeNull();
});
it("does not render progress for persistent/negative durations or showProgress=false", async () => {
  for (const duration of [0, null, -1]) {
    await act(() =>
      api.open({ message: "Persistent", duration, showProgress: true }),
    );
  }
  await act(() =>
    api.open({ message: "Hidden", duration: 10, showProgress: false }),
  );
  expect(progress()).toBeNull();
  await tick(0);
  await tick(0);
  expect(frames.size).toBe(0);
});
it("releases all non-pausing timers and frames on holder unmount", async () => {
  const close = vi.fn();
  await act(() =>
    api.open({
      message: "Unmount",
      duration: 1,
      pauseOnHover: false,
      showProgress: true,
      onClose: close,
    }),
  );
  await tick(200);
  await act(() => notice()?.dispatchEvent(new MouseEvent("mouseenter")));
  await act(() => root.unmount());
  await tick(2000);
  await tick(0);
  expect(frames.size).toBe(0);
  expect(close).not.toHaveBeenCalled();
});
it("pauses a notice when the stack forces hover even without a local pointer event", async () => {
  const close = vi.fn();
  function Timer({ hovered }: { hovered: boolean }) {
    const value = useNoticeTimer({
      duration: 1,
      times: 1,
      visible: true,
      forcedHovering: hovered,
      showProgress: true,
      onClose: close,
    });
    return (
      <progress
        className="ant-notification-notice-progress"
        max={100}
        value={value.percent}
      />
    );
  }
  await act(() => root.render(<Timer hovered={false} />));
  await tick(400);
  await act(() => root.render(<Timer hovered />));
  await tick(2000);
  expect(progress()?.value).toBe(60);
  expect(close).not.toHaveBeenCalled();
  await act(() => root.render(<Timer hovered={false} />));
  await tick(300);
  expect(progress()?.value).toBe(30);
  await tick(301);
  expect(close).toHaveBeenCalledOnce();
});
