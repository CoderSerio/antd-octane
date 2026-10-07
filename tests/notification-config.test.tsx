import type { ElementDescriptor, OctaneNode, Root } from "octane";
import { act, createRoot, useEffect } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { resetWarned } from "../packages/antd-octane/src/_util/warning";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import {
  type MessageInstance,
  message,
} from "../packages/antd-octane/src/message";
import {
  type NotificationConfig,
  type NotificationInstance,
  notification,
} from "../packages/antd-octane/src/notification";

let root: Root;
let container: HTMLDivElement;
let api: NotificationInstance;
let msg: MessageInstance;
async function render(node: ElementDescriptor) {
  await act(() => root.render(node));
}
function Hooks({ config = {} }: { config?: NotificationConfig }) {
  const [instance, holder] = notification.useNotification(config);
  const [messages, messageHolder] = message.useMessage();
  api = instance;
  msg = messages;
  return (
    <>
      {holder}
      {messageHolder}
    </>
  );
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
  await act(() => root.unmount());
  container.remove();
  resetWarned();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
it("ignores calls before holder mount and accepts calls in effects", async () => {
  function DuringRender() {
    const [instance, holder] = notification.useNotification();
    instance.open({ message: "render", duration: 0 });
    useEffect(
      () => instance.open({ message: "effect", duration: 0 }),
      [instance],
    );
    return holder;
  }
  await render(<DuringRender />);
  expect(console.error).toHaveBeenCalledWith(
    expect.stringContaining("before contextHolder is mounted"),
  );
  expect(document.querySelectorAll(".ant-notification-notice")).toHaveLength(1);
  expect(
    document.querySelector(".ant-notification-notice")?.textContent,
  ).toContain("effect");
  expect(
    document.querySelector(".ant-notification-notice")?.textContent,
  ).not.toContain("render");
});
it("warns through the hook caller's policy and actions take priority over btn", async () => {
  await render(
    <ConfigProvider warning={{ strict: false }}>
      <Hooks />
    </ConfigProvider>,
  );
  await act(() =>
    api.open({
      message: "title",
      duration: 0,
      btn: "legacy",
      actions: "modern",
    }),
  );
  expect(console.warn).toHaveBeenCalledWith(
    "[antd-octane] There exists deprecated usage in your code:",
    {
      Notification: ["`btn` is deprecated. Please use `actions` instead."],
    },
  );
  expect(
    document.querySelector(".ant-notification-notice-actions")?.textContent,
  ).toBe("modern");
  expect(console.error).not.toHaveBeenCalled();
});
it("false/empty btn is silent and false actions suppress the legacy fallback", async () => {
  await render(<Hooks />);
  await act(() => {
    api.open({ key: "empty", message: "empty", btn: false, duration: 0 });
    api.open({
      key: "legacy",
      message: "legacy",
      btn: "fallback",
      actions: false,
      duration: 0,
    });
  });
  expect(console.error).toHaveBeenCalledTimes(1);
  expect(document.querySelector(".ant-notification-notice-actions")).toBeNull();
});
it("production calls do not emit deprecation or readiness warnings", async () => {
  vi.stubEnv("NODE_ENV", "production");
  function MissingHolder() {
    [api] = notification.useNotification();
    return null;
  }
  await render(<MissingHolder />);
  await act(() => api.open({ message: "unused", btn: "legacy" }));
  expect(console.warn).not.toHaveBeenCalled();
  expect(console.error).not.toHaveBeenCalled();
});
it.each([
  {
    name: "notice",
    provider: "provider",
    hook: "hook",
    notice: "notice",
    expected: "notice",
  },
  {
    name: "hook",
    provider: "provider",
    hook: "hook",
    notice: undefined,
    expected: "hook",
  },
  {
    name: "provider",
    provider: "provider",
    hook: undefined,
    notice: undefined,
    expected: "provider",
  },
  {
    name: "null",
    provider: "provider",
    hook: null,
    notice: undefined,
    expected: null,
  },
  {
    name: "false",
    provider: "provider",
    hook: "hook",
    notice: false,
    expected: null,
  },
])("closeIcon priority: $name", async ({
  provider,
  hook,
  notice,
  expected,
}) => {
  await render(
    <ConfigProvider notification={{ closeIcon: provider }}>
      <Hooks config={{ closeIcon: hook }} />
    </ConfigProvider>,
  );
  await act(() =>
    api.open({ message: "priority", closeIcon: notice, duration: 0 }),
  );
  const close = document.querySelector(".ant-notification-notice-close");
  expect(close?.textContent ?? null).toBe(expected);
});
it("closable object supplies its own icon and aria attributes; Enter closes without notice click", async () => {
  await render(<Hooks />);
  const onClose = vi.fn();
  const onClick = vi.fn();
  await act(() =>
    api.open({
      message: "object",
      duration: 0,
      closeIcon: "outer",
      closable: {
        closeIcon: "object",
        "aria-label": "Dismiss notification",
        "aria-disabled": true,
        disabled: true,
      },
      onClose,
      onClick,
    }),
  );
  const close = document.querySelector<HTMLElement>(
    ".ant-notification-notice-close",
  );
  if (!close) throw Error("Missing close control");
  expect(close.tagName).toBe("A");
  expect(close.textContent).toBe("object");
  expect(close.getAttribute("aria-label")).toBe("Dismiss notification");
  expect(close.getAttribute("aria-disabled")).toBe("true");
  expect(close.hasAttribute("disabled")).toBe(false);
  await act(() =>
    close.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(onClose).toHaveBeenCalledOnce();
  expect(onClick).not.toHaveBeenCalled();
  expect(document.querySelector(".ant-notification-notice")).toBeNull();
});
it("explicit closable true can retain an empty close control; false hides it", async () => {
  await render(<Hooks />);
  await act(() => {
    api.open({
      key: "empty",
      message: "empty",
      closeIcon: false,
      closable: true,
      duration: 0,
    });
    api.open({
      key: "hidden",
      message: "hidden",
      closable: false,
      duration: 0,
    });
  });
  expect(
    document.querySelectorAll(".ant-notification-notice-close"),
  ).toHaveLength(1);
  expect(
    document.querySelector(".ant-notification-notice-close")?.textContent,
  ).toBe("");
});
it("numeric offsets include zero and update with the holder configuration", async () => {
  await render(<Hooks />);
  await act(() => {
    api.open({ key: "top", message: "top", placement: "topLeft", duration: 0 });
    api.open({
      key: "bottom",
      message: "bottom",
      placement: "bottomRight",
      duration: 0,
    });
  });
  const top = document.querySelector<HTMLElement>(".ant-notification-topLeft");
  const bottom = document.querySelector<HTMLElement>(
    ".ant-notification-bottomRight",
  );
  expect(top?.style.top).toBe("24px");
  expect(bottom?.style.bottom).toBe("24px");
  await render(<Hooks config={{ top: 0, bottom: 48 }} />);
  expect(top?.style.top).toBe("0px");
  expect(bottom?.style.bottom).toBe("48px");
});
it("notice clicks call the public callback and preserve native event forwarding", async () => {
  await render(<Hooks />);
  const onClick = vi.fn(() => {});
  await act(() => api.open({ message: "click", duration: 0, onClick }));
  const notice = document.querySelector<HTMLDivElement>(
    ".ant-notification-notice",
  );
  await act(() => notice?.click());
  expect(onClick).toHaveBeenCalledOnce();
  expect(onClick.mock.calls[0]).toEqual([expect.any(MouseEvent)]);
});
it("snapshots provider class/style/closeIcon at open and ignores props class/style overrides", async () => {
  const node = (label: string) => (
    <ConfigProvider
      notification={{
        className: `provider-${label}`,
        style: { color: label === "one" ? "red" : "blue", padding: 20 },
        closeIcon: label,
      }}
    >
      <Hooks />
    </ConfigProvider>
  );
  await render(node("one"));
  await act(() =>
    api.open({
      message: "snapshot",
      duration: 0,
      className: "notice-class",
      style: { padding: 12 },
      props: {
        id: "snapshot",
        className: "ignored",
        style: { color: "green" },
      },
    }),
  );
  await render(node("two"));
  const notice = document.getElementById("snapshot");
  if (!notice) throw Error("Missing notification");
  expect(notice.className).toContain("notice-class provider-one");
  expect(notice.className).not.toContain("provider-two");
  expect(notice.className).not.toContain("ignored");
  expect(notice.style.color).toBe("red");
  expect(notice.style.padding).toBe("12px");
  expect(
    notice.querySelector(".ant-notification-notice-close")?.textContent,
  ).toBe("one");
});
it("inherits getPopupContainer for notification/message and an explicit container overrides it", async () => {
  const portal = document.createElement("div");
  const explicit = document.createElement("div");
  document.body.append(portal, explicit);
  try {
    await render(
      <ConfigProvider getPopupContainer={() => portal}>
        <Hooks config={{ getContainer: () => explicit }} />
      </ConfigProvider>,
    );
    await act(() => {
      api.open({ message: "explicit", duration: 0 });
      msg.info({ content: "provider", duration: 0 });
    });
    expect(
      explicit.querySelector(".ant-notification-notice")?.textContent,
    ).toContain("explicit");
    expect(portal.querySelector(".ant-message-notice")?.textContent).toContain(
      "provider",
    );
    await act(() => {
      api.destroy();
      msg.destroy();
    });
    await render(
      <ConfigProvider getPopupContainer={() => portal}>
        <Hooks />
      </ConfigProvider>,
    );
    await act(() => api.open({ message: "inherited", duration: 0 }));
    expect(
      portal.querySelector(".ant-notification-notice")?.textContent,
    ).toContain("inherited");
  } finally {
    portal.remove();
    explicit.remove();
  }
});
it("supports a ShadowRoot target and puts role on the content", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const shadow = host.attachShadow({ mode: "open" });
  try {
    await render(<Hooks config={{ getContainer: () => shadow }} />);
    await act(() =>
      api.success({
        message: "success",
        role: "status",
        description: false,
        actions: 0,
        duration: 0,
      }),
    );
    const notice = shadow.querySelector(".ant-notification-notice");
    if (!notice) throw Error("Missing shadow notification");
    expect(
      notice.querySelector(
        '.ant-notification-notice-content > [role="status"]',
      ),
    ).not.toBeNull();
    expect(
      notice.querySelector(".ant-notification-notice-description"),
    ).toBeNull();
    expect(notice.querySelector(".ant-notification-notice-actions")).toBeNull();
    expect(
      notice.querySelector(
        ".ant-notification-notice-icon.anticon-check-circle svg path",
      ),
    ).not.toBeNull();
  } finally {
    host.remove();
  }
});
it("stable hook API keeps its initial closeIcon/placement while holder defaults update", async () => {
  await render(
    <ConfigProvider notification={{ closeIcon: "provider" }}>
      <Hooks
        config={{ closeIcon: "initial", placement: "bottomLeft", duration: 0 }}
      />
    </ConfigProvider>,
  );
  await render(
    <ConfigProvider notification={{ closeIcon: "updated-provider" }}>
      <Hooks
        config={{
          closeIcon: "updated-hook",
          placement: "topRight",
          duration: 0,
        }}
      />
    </ConfigProvider>,
  );
  await act(() => api.open({ message: "captured" }));
  expect(
    document.querySelector(".ant-notification-bottomLeft")?.textContent,
  ).toContain("captured");
  expect(
    document.querySelector(".ant-notification-notice-close")?.textContent,
  ).toBe("initial");
  await act(() =>
    api.open({
      key: "override",
      message: "override",
      closeIcon: "notice",
      placement: "top",
    }),
  );
  expect(
    document.querySelector(".ant-notification-top")?.textContent,
  ).toContain("override");
});
it("queues API close/reopen in order and only closes displayed records", async () => {
  await render(<Hooks />);
  const oldClose = vi.fn();
  const newClose = vi.fn();
  const pendingClose = vi.fn();
  await act(() =>
    api.open({ key: "job", message: "old", duration: 0, onClose: oldClose }),
  );
  await act(() => {
    api.destroy("job");
    api.open({ key: "job", message: "new", duration: 0, onClose: newClose });
    api.open({
      key: "pending",
      message: "never displayed",
      duration: 0,
      onClose: pendingClose,
    });
    api.destroy("pending");
  });
  expect(document.querySelectorAll(".ant-notification-notice")).toHaveLength(1);
  expect(
    document.querySelector(".ant-notification-notice")?.textContent,
  ).toContain("new");
  expect(oldClose).toHaveBeenCalledOnce();
  expect(newClose).not.toHaveBeenCalled();
  expect(pendingClose).not.toHaveBeenCalled();
  await act(() => api.destroy("job"));
  expect(newClose).toHaveBeenCalledOnce();
});
it("static calls queue until holder/App config is ready and merge global closable/props", async () => {
  ConfigProvider.config({
    holderRender: (children: OctaneNode) => (
      <ConfigProvider warning={{ strict: false }}>{children}</ConfigProvider>
    ),
  });
  try {
    await act(() => {
      notification.config({
        duration: 0,
        closable: { closeIcon: "global", "aria-label": "Global close" },
        props: { id: "static-notice" },
      });
      notification.open({ message: "queued", btn: "legacy" });
    });
    expect(document.getElementById("static-notice")?.textContent).toContain(
      "queued",
    );
    expect(
      document.querySelector('[aria-label="Global close"]')?.textContent,
    ).toBe("global");
    expect(console.error).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("deprecated usage"),
      expect.objectContaining({
        Notification: [expect.stringContaining("`btn`")],
      }),
    );
  } finally {
    await act(() => {
      notification.destroy();
      notification.config({
        duration: 4.5,
        closable: undefined,
        props: undefined,
      });
      ConfigProvider.config({ holderRender: undefined });
    });
  }
});
