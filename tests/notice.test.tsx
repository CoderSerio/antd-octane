import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { App } from "../packages/antd-octane/src/app";
import {
  ConfigProvider,
  useConfig,
} from "../packages/antd-octane/src/config-provider";
import {
  type MessageInstance,
  message,
} from "../packages/antd-octane/src/message";
import {
  type NotificationInstance,
  notification,
} from "../packages/antd-octane/src/notification";

let root: Root | undefined;

let container: HTMLDivElement;

let api: MessageInstance;

let notices: NotificationInstance;

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
  vi.useRealTimers();
});

function MessageDemo() {
  const [instance, holder] = message.useMessage({ maxCount: 2 });
  api = instance;
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#123456" },
        components: { Message: { contentBg: "#abc123" } },
      }}
    >
      {holder}
    </ConfigProvider>
  );
}

function NotificationDemo() {
  const [instance, holder] = notification.useNotification();
  notices = instance;
  return holder;
}

function ThemeReader() {
  return <span data-color={useConfig().token.colorPrimary}>context</span>;
}

it("direct notice hooks remain independent of surrounding App defaults", async () => {
  function DirectHooks() {
    const [messageApi, messageHolder] = message.useMessage();
    const [notificationApi, notificationHolder] =
      notification.useNotification();
    api = messageApi;
    notices = notificationApi;
    return (
      <>
        {messageHolder}
        {notificationHolder}
      </>
    );
  }
  await render(
    <App message={{ maxCount: 1 }} notification={{ maxCount: 1 }}>
      <DirectHooks />
    </App>,
  );
  await act(() => {
    for (const value of ["one", "two"]) {
      api.info({ content: value, duration: 0 });
      notices.open({ message: value, duration: 0 });
    }
  });
  expect(document.querySelectorAll(".ant-message-notice")).toHaveLength(2);
  expect(document.querySelectorAll(".ant-notification-notice")).toHaveLength(2);
});

it("static holder App settings override global defaults and config updates", async () => {
  ConfigProvider.config({
    holderRender: (children) => (
      <ConfigProvider theme={{ token: { motion: false } }} prefixCls="static">
        <App message={{ maxCount: 1 }} notification={{ maxCount: 1 }}>
          {children}
        </App>
      </ConfigProvider>
    ),
  });
  try {
    await act(() => {
      message.config({ maxCount: 4, duration: 0 });
      notification.config({ maxCount: 4, duration: 0 });
      for (const value of ["one", "two"]) {
        message.info(value);
        notification.open({ message: value });
      }
    });
    expect(document.querySelectorAll(".static-message-notice")).toHaveLength(1);
    expect(
      document.querySelectorAll(".static-notification-notice"),
    ).toHaveLength(1);
    await act(() => {
      message.config({ maxCount: 5 });
      notification.config({ maxCount: 5 });
      message.info("three");
      notification.open({ message: "three" });
    });
    expect(document.querySelectorAll(".static-message-notice")).toHaveLength(1);
    expect(
      document.querySelectorAll(".static-notification-notice"),
    ).toHaveLength(1);
    expect(
      document.querySelector(".static-message-notice")?.textContent,
    ).toContain("three");
    expect(
      document.querySelector(".static-notification-notice")?.textContent,
    ).toContain("three");
  } finally {
    await act(() => {
      message.destroy();
      notification.destroy();
      ConfigProvider.config({ holderRender: undefined });
      message.config({ maxCount: undefined, duration: 3 });
      notification.config({ maxCount: undefined, duration: 4.5 });
    });
  }
});

it("message holder preserves local context across portal and resolves callable thenable", async () => {
  await render(<MessageDemo />);
  let close: ReturnType<MessageInstance["open"]> | undefined;
  await act(() => {
    close = api.open({ content: <ThemeReader />, duration: 0 });
  });
  expect(container.querySelector(".ant-message")).toBeNull();
  expect(
    document.querySelector("[data-color]")?.getAttribute("data-color"),
  ).toBe("#123456");
  expect(
    (
      document.querySelector(".ant-message") as HTMLElement
    ).style.getPropertyValue("--ao-notice-bg"),
  ).toBe("#abc123");
  await act(() => close?.());
  expect(await close).toBe(true);
  expect(document.querySelector(".ant-message")).toBeNull();
});

it("duration pauses on hover and resumes remaining time", async () => {
  vi.useFakeTimers();
  await render(<MessageDemo />);
  await act(() => {
    api.info("timed", 1);
  });
  await act(() => vi.advanceTimersByTime(400));
  const el = document.querySelector(".ant-message-notice") as HTMLElement;
  await act(() => el.dispatchEvent(new MouseEvent("mouseenter")));
  await act(() => vi.advanceTimersByTime(2000));
  expect(document.querySelector(".ant-message")).not.toBeNull();
  await act(() => el.dispatchEvent(new MouseEvent("mouseleave")));
  await act(() => vi.advanceTimersByTime(601));
  expect(document.querySelector(".ant-message")).toBeNull();
});

it("notification supports placement, actions, persistent duration and close", async () => {
  vi.useFakeTimers();
  await render(<NotificationDemo />);
  const close = vi.fn();
  await act(() =>
    notices.success({
      message: "Saved",
      description: "details",
      placement: "bottomLeft",
      duration: null,
      onClose: close,
      actions: <button type="button">action</button>,
    }),
  );
  expect(
    document.querySelector(".ant-notification-bottomLeft")?.textContent,
  ).toContain("details");
  await act(() => vi.advanceTimersByTime(10000));
  expect(document.querySelector(".ant-notification")).not.toBeNull();
  await act(() =>
    document
      .querySelector<HTMLButtonElement>(".ant-notification-notice-close")
      ?.click(),
  );
  expect(close).toHaveBeenCalledOnce();
  expect(document.querySelector(".ant-notification")).toBeNull();
});

it("unmount removes portals and timers, retained API cannot leak new notices", async () => {
  vi.useFakeTimers();
  await render(<MessageDemo />);
  await act(() => {
    api.info("pending", 10);
  });
  const clear = vi.spyOn(globalThis, "clearTimeout");
  await act(() => root?.unmount());
  expect(document.querySelector(".ant-message")).toBeNull();
  expect(clear).toHaveBeenCalled();
  await act(() => vi.advanceTimersByTime(10001));
  clear.mockRestore();
  expect(await api.info("after unmount")).toBe(true);
});

it("only hover pauses notification duration; keyboard focus does not pause", async () => {
  vi.useFakeTimers();
  await render(<NotificationDemo />);
  await act(() =>
    notices.open({
      message: "actions",
      duration: 1,
      actions: <button type="button">action</button>,
    }),
  );
  const el = document.querySelector(".ant-notification-notice") as HTMLElement;
  const button = el.querySelector("button") as HTMLButtonElement;
  await act(() => el.dispatchEvent(new MouseEvent("mouseenter")));
  await act(() => button.focus());
  await act(() => el.dispatchEvent(new MouseEvent("mouseleave")));
  await act(() => vi.advanceTimersByTime(1500));
  expect(document.querySelector(".ant-notification")).toBeNull();
});

it("same key updates in place and maxCount evicts earliest with callback", async () => {
  await render(<MessageDemo />);
  const close = vi.fn();
  await act(() => {
    api.open({ key: "one", content: "first", duration: 0, onClose: close });
    api.open({ key: "one", content: "updated", duration: 0, onClose: close });
  });
  expect(document.querySelectorAll(".ant-message-notice")).toHaveLength(1);
  expect(document.querySelector(".ant-message")?.textContent).toContain(
    "updated",
  );
  await act(() => {
    api.info({ key: "two", content: "second", duration: 0 });
    api.info({ key: "three", content: "third", duration: 0 });
  });
  expect(document.querySelectorAll(".ant-message-notice")).toHaveLength(2);
  expect(close).toHaveBeenCalledOnce();
  await act(() => api.destroy());
  expect(document.querySelector(".ant-message")).toBeNull();
});

it("same key restarts duration and settles all outstanding close handles", async () => {
  vi.useFakeTimers();
  await render(<MessageDemo />);
  let first: ReturnType<MessageInstance["open"]> | undefined;
  let second: typeof first;
  await act(() => {
    first = api.open({ key: "job", content: "before", duration: 1 });
  });
  await act(() => vi.advanceTimersByTime(800));
  await act(() => {
    second = api.open({ key: "job", content: "after", duration: 1 });
  });
  await act(() => vi.advanceTimersByTime(300));
  expect(document.querySelector(".ant-message")?.textContent).toContain(
    "after",
  );
  await act(() => vi.advanceTimersByTime(701));
  expect(document.querySelector(".ant-message")).toBeNull();
  expect(await first).toBe(true);
  expect(await second).toBe(true);
});
