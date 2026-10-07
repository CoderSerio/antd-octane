import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useEffect } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { resetWarned } from "../packages/antd-octane/src/_util/warning";
import { App } from "../packages/antd-octane/src/app";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import {
  type MessageConfig,
  type MessageInstance,
  message,
} from "../packages/antd-octane/src/message";

let root: Root;
let container: HTMLDivElement;
let api: MessageInstance;
let staticUsed = false;
async function render(node: ElementDescriptor) {
  await act(() => root.render(node));
}
function Hooks({
  config = {},
  missing = false,
}: {
  config?: MessageConfig;
  missing?: boolean;
}) {
  const [instance, holder] = message.useMessage(config);
  api = instance;
  return missing ? null : holder;
}
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  resetWarned();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(async () => {
  if (staticUsed)
    await act(() => {
      message.destroy();
      message.config({ duration: 3, maxCount: undefined });
      ConfigProvider.config({ holderRender: undefined });
    });
  await act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  resetWarned();
});
it("cold static cancellation skips opening and leaves its thenable unsettled", async () => {
  staticUsed = true;
  const close = vi.fn();
  const settled = vi.fn();
  await act(() => {
    const handle = message.info({
      content: "never displayed",
      duration: 0,
      onClose: close,
    });
    handle.then(settled);
    handle();
  });
  expect(document.querySelector(".ant-message-notice")).toBeNull();
  expect(close).not.toHaveBeenCalled();
  expect(settled).not.toHaveBeenCalled();
  let result: ReturnType<MessageInstance["open"]> | undefined;
  await act(() => {
    result = message.success({ content: "ready", duration: 0, onClose: close });
  });
  expect(document.querySelector(".ant-message-notice")?.textContent).toBe(
    "ready",
  );
  await act(() => result?.());
  expect(await result).toBe(true);
  expect(close).toHaveBeenCalledOnce();
});
it("render-time and missing-holder calls are inert while effect calls work", async () => {
  const settled = vi.fn();
  function DuringRender() {
    const [instance, holder] = message.useMessage();
    const invalid = instance.info("render", 0);
    invalid.then(settled);
    invalid();
    useEffect(() => {
      instance.success("effect", 0);
    }, [instance]);
    return holder;
  }
  await render(<DuringRender />);
  expect(document.querySelector(".ant-message-notice")?.textContent).toBe(
    "effect",
  );
  expect(console.error).toHaveBeenCalledWith(
    expect.stringContaining("before contextHolder is mounted"),
  );
  await render(<Hooks missing />);
  await act(() => {
    api.info("missing").then(settled);
  });
  expect(document.querySelector(".ant-message-notice")).toBeNull();
  expect(settled).not.toHaveBeenCalled();
});
it("production readiness calls are silent", async () => {
  vi.stubEnv("NODE_ENV", "production");
  await render(<Hooks missing />);
  await act(() => {
    api.info("missing")();
  });
  expect(console.error).not.toHaveBeenCalled();
  expect(console.warn).not.toHaveBeenCalled();
});
it("object duration and onClose override positional arguments, including undefined", async () => {
  vi.useFakeTimers();
  await render(<Hooks config={{ duration: 0.5 }} />);
  const objectClose = vi.fn();
  const positionalClose = vi.fn();
  await act(() => {
    api.info(
      {
        key: "object",
        content: "persistent",
        duration: 0,
        onClose: objectClose,
      },
      0.1,
      positionalClose,
    );
  });
  await act(() => vi.advanceTimersByTime(200));
  expect(document.querySelector(".ant-message-notice")?.textContent).toBe(
    "persistent",
  );
  await act(() => api.destroy("object"));
  expect(objectClose).toHaveBeenCalledOnce();
  expect(positionalClose).not.toHaveBeenCalled();
  await act(() => {
    api.info(
      { content: "holder default", duration: undefined, onClose: undefined },
      0.1,
      positionalClose,
    );
  });
  await act(() => vi.advanceTimersByTime(200));
  expect(document.querySelector(".ant-message-notice")?.textContent).toBe(
    "holder default",
  );
  await act(() => vi.advanceTimersByTime(301));
  expect(document.querySelector(".ant-message-notice")).toBeNull();
  expect(positionalClose).not.toHaveBeenCalled();
});
it("a function second argument is onClose; the typed method overrides object type", async () => {
  await render(<Hooks config={{ duration: 0 }} />);
  const close = vi.fn();
  let result: ReturnType<MessageInstance["open"]> | undefined;
  await act(() => {
    result = api.success({ key: 0, content: "success", type: "error" }, close);
  });
  expect(document.querySelector(".ant-message-notice-success")).not.toBeNull();
  expect(document.querySelector(".ant-message-notice-error")).toBeNull();
  await act(() => result?.());
  expect(await result).toBe(true);
  expect(close).toHaveBeenCalledOnce();
});
it("snapshots provider class/style when opening; the API is stable across updates", async () => {
  const node = (name: string) => (
    <ConfigProvider
      message={{
        className: `provider-${name}`,
        style: { color: name === "one" ? "red" : "blue", padding: 20 },
      }}
    >
      <Hooks config={{ duration: 0 }} />
    </ConfigProvider>
  );
  await render(node("one"));
  const initial = api;
  await act(() => {
    api.open({
      key: "snapshot",
      content: "snapshot",
      className: "notice-class",
      style: { padding: 12 },
    });
  });
  await render(node("two"));
  expect(api).toBe(initial);
  const notice = document.querySelector<HTMLElement>(".ant-message-notice");
  expect(notice?.className).toContain("notice-class provider-one");
  expect(notice?.className).not.toContain("provider-two");
  expect(notice?.style.color).toBe("red");
  expect(notice?.style.padding).toBe("12px");
  await act(() => {
    api.open({ key: "snapshot", content: "updated" });
  });
  expect(notice?.className).toContain("provider-two");
  expect(notice?.style.color).toBe("blue");
});
it("onClose runs before then; replacing a displayed key and closing uses its previous callback", async () => {
  await render(<Hooks config={{ duration: 0 }} />);
  const events: string[] = [];
  await act(() => {
    api
      .open({
        key: "job",
        content: "old",
        onClose: () => events.push("old-close"),
      })
      .then(() => events.push("old-then"));
  });
  const replacementSettled = vi.fn();
  await act(() => {
    api
      .open({
        key: "job",
        content: "replacement",
        onClose: () => events.push("new-close"),
      })
      .then(replacementSettled);
    api.destroy("job");
  });
  expect(events).toEqual(["old-close", "old-then"]);
  expect(replacementSettled).not.toHaveBeenCalled();
  expect(document.querySelector(".ant-message-notice")).toBeNull();
});
it("closing a pending notice is silent; close then reopen preserves task order", async () => {
  await render(<Hooks config={{ duration: 0 }} />);
  const pendingClose = vi.fn();
  const pendingSettled = vi.fn();
  const oldClose = vi.fn();
  await act(() => {
    const pending = api.info({
      content: "never displayed",
      onClose: pendingClose,
    });
    pending.then(pendingSettled);
    pending();
  });
  expect(document.querySelector(".ant-message-notice")).toBeNull();
  expect(pendingClose).not.toHaveBeenCalled();
  expect(pendingSettled).not.toHaveBeenCalled();
  await act(() => {
    api.open({ key: "job", content: "old", onClose: oldClose });
  });
  await act(() => {
    api.destroy("job");
    api.open({ key: "job", content: "new" });
  });
  expect(oldClose).toHaveBeenCalledOnce();
  expect(document.querySelector(".ant-message-notice")?.textContent).toBe(
    "new",
  );
});
it("clear and maxCount eviction are silent and leave promises unsettled", async () => {
  await render(<Hooks config={{ duration: 0, maxCount: 1 }} />);
  const close = vi.fn();
  const settled = vi.fn();
  await act(() => {
    api.info({ content: "evicted", onClose: close }).then(settled);
  });
  await act(() => {
    api.info({ content: "remaining", onClose: close }).then(settled);
  });
  expect(document.querySelectorAll(".ant-message-notice")).toHaveLength(1);
  await act(() => api.destroy());
  expect(close).not.toHaveBeenCalled();
  expect(settled).not.toHaveBeenCalled();
});
it("custom icon replaces the filled type icon and no role is invented", async () => {
  await render(<Hooks config={{ duration: 0, prefixCls: "custom-message" }} />);
  let clickTarget: HTMLDivElement | undefined;
  const onClick = vi.fn(
    (event: MouseEvent & { currentTarget: HTMLDivElement }) => {
      clickTarget = event.currentTarget;
    },
  );
  await act(() => {
    api.success({
      content: "custom",
      icon: <span data-custom-icon>!</span>,
      onClick,
    });
  });
  const notice = document.querySelector<HTMLElement>(".custom-message-notice");
  expect(notice?.hasAttribute("role")).toBe(false);
  expect(notice?.querySelector("[data-custom-icon]")).not.toBeNull();
  expect(notice?.querySelector(".anticon")).toBeNull();
  await act(() => notice?.click());
  expect(onClick).toHaveBeenCalledOnce();
  expect(clickTarget).toBe(notice);
});
it("updated holder duration applies to new notices", async () => {
  vi.useFakeTimers();
  await render(<Hooks config={{ duration: 0 }} />);
  await render(<Hooks config={{ duration: 0.2 }} />);
  await act(() => {
    api.info("timed");
  });
  await act(() => vi.advanceTimersByTime(201));
  expect(document.querySelector(".ant-message-notice")).toBeNull();
});
it("static open merges global duration over App defaults; typed static uses App defaults", async () => {
  staticUsed = true;
  vi.useFakeTimers();
  ConfigProvider.config({
    holderRender: (children) => (
      <App message={{ duration: 0.2 }}>{children}</App>
    ),
  });
  await act(() => message.config({ duration: 0 }));
  await act(() => {
    message.open({ content: "global duration" });
    message.info("app duration");
  });
  await act(() => vi.advanceTimersByTime(201));
  expect(
    [...document.querySelectorAll(".ant-message-notice")].map(
      (notice) => notice.textContent,
    ),
  ).toEqual(["global duration"]);
});

it("typed statics warn after a theme is configured; open and holderRender calls are silent", async () => {
  staticUsed = true;
  await render(
    <ConfigProvider theme={{ token: { colorPrimary: "#123456" } }}>
      <Hooks />
    </ConfigProvider>,
  );
  await act(() => {
    message.open({ content: "open", duration: 0 });
  });
  expect(console.error).not.toHaveBeenCalled();
  await act(() => {
    message.info({ content: "static", duration: 0 });
  });
  expect(console.error).toHaveBeenCalledWith(
    expect.stringContaining("Static function can not consume context"),
  );
  vi.mocked(console.error).mockClear();
  ConfigProvider.config({ holderRender: (children) => children });
  await act(() => {
    message.success({ content: "wrapped", duration: 0 });
  });
  expect(console.error).not.toHaveBeenCalled();
});

it("default status icons expose upstream labels and loading spins on the icon wrapper", async () => {
  await render(<Hooks config={{ duration: 0 }} />);
  await act(() => {
    api.info("info");
    api.loading("loading");
  });
  expect(
    document.querySelector('[role="img"][aria-label="info-circle"]'),
  ).not.toBeNull();
  const loading = document.querySelector('[role="img"][aria-label="loading"]');
  expect(loading?.classList.contains("anticon-spin")).toBe(true);
  expect(loading?.querySelector(".ao-icon-spin")).toBeNull();
});
