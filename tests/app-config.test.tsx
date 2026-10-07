import { getStyle as upstreamStyle } from "antd/es/config-provider/cssVariables";
import {
  act,
  createElement,
  createRoot,
  type ElementDescriptor,
  type Root,
  useContext,
  useState,
} from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { App, type AppContextValue } from "../packages/antd-octane/src/app";
import {
  type AppConfig,
  AppConfigContext,
} from "../packages/antd-octane/src/app/context";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { getStyle } from "../packages/antd-octane/src/config-provider/cssVariables";
import { getGlobalConfig } from "../packages/antd-octane/src/config-provider/global";
import { message } from "../packages/antd-octane/src/message";
import { Modal, type ModalResult } from "../packages/antd-octane/src/modal";
import { notification } from "../packages/antd-octane/src/notification";

let root: Root;
let container: HTMLDivElement;
let app: AppContextValue;
const configs: Record<string, AppConfig> = {};
function Read({ name = "inner" }: { name?: string }) {
  app = App.useApp();
  configs[name] = useContext(AppConfigContext);
  return <span>{name}</span>;
}
async function render(node: ElementDescriptor) {
  await act(() => root.render(node));
}
async function flushStatic() {
  await act(() => new Promise<void>((resolve) => setTimeout(resolve, 10)));
}
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  ConfigProvider.config({
    prefixCls: "ant",
    iconPrefixCls: "anticon",
    theme: {},
    holderRender: undefined,
  });
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(async () => {
  await act(() => {
    message.destroy();
    notification.destroy();
    Modal.destroyAll();
    root.unmount();
  });
  await flushStatic();
  container.remove();
  ConfigProvider.config({
    prefixCls: "ant",
    iconPrefixCls: "anticon",
    theme: {},
    holderRender: undefined,
  });
  vi.restoreAllMocks();
});
it("useApp returns stable empty API objects outside App", async () => {
  await render(<Read />);
  const outside = app;
  expect(outside).toEqual({ message: {}, notification: {}, modal: {} });
  await render(<Read name="again" />);
  expect(app).toBe(outside);
});
it("App applies prefix, RTL and component alias tokens in upstream class order", async () => {
  await render(
    <ConfigProvider
      prefixCls="custom"
      direction="rtl"
      theme={{
        token: { fontSize: 16 },
        components: {
          App: { colorText: "#123456", fontSize: 18, lineHeight: 2 },
        },
      }}
    >
      <App component="section" className="user" rootClassName="root">
        <Read />
      </App>
    </ConfigProvider>,
  );
  const element = container.querySelector<HTMLElement>("section");
  if (!element) throw new Error("App section missing");
  expect(element?.className).toMatch(
    /^ao-app-[a-z0-9]+ custom-app user root custom-app-rtl$/,
  );
  const computed = getComputedStyle(element);
  expect(computed.fontSize).toBe("18px");
  expect(computed.lineHeight).toBe("2");
  expect(computed.color).toBe("#123456");
  expect(computed.direction).toBe("rtl");
  expect(element?.getAttribute("style")).toBeNull();
});
it("App explicit inline styles override alias tokens and RTL", async () => {
  await render(
    <ConfigProvider direction="rtl">
      <App style={{ color: "red", fontSize: 20, direction: "ltr" }}>
        <Read />
      </App>
    </ConfigProvider>,
  );
  const element = container.querySelector<HTMLElement>(".ant-app");
  expect(element?.style.fontSize).toBe("20px");
  expect(element?.style.direction).toBe("ltr");
  expect(element?.style.color).toBe("red");
});
it("component=false provides usable holders without an App DOM node", async () => {
  await render(
    <App component={false} message={{ duration: 0 }}>
      <Read />
    </App>,
  );
  expect(container.querySelector(".ant-app")).toBeNull();
  await act(() => {
    app.message.info("fragment message");
  });
  expect(document.querySelector(".ant-message-notice")?.textContent).toBe(
    "fragment message",
  );
});
it("custom App components receive only wrapper classes, styles and children", async () => {
  let received: Record<string, unknown> = {};
  function Custom(props: Record<string, unknown>) {
    received = props;
    return createElement("section", props);
  }
  await render(
    createElement(
      App,
      {
        component: Custom,
        className: "user",
        "data-extra": "ignored",
      } as never,
      <Read />,
    ),
  );
  expect(Object.keys(received).sort()).toEqual([
    "children",
    "className",
    "style",
  ]);
  expect(container.querySelector("[data-extra]")).toBeNull();
  expect(received.style).toBeUndefined();
});
it("class-only custom wrappers retain App resets, nested tokens and RTL", async () => {
  function ClassOnly({ className, children }: Record<string, unknown>) {
    return createElement("article", { className }, children as never);
  }
  await render(
    <ConfigProvider
      direction="rtl"
      theme={{ components: { App: { colorText: "#722ed1", fontSize: 18 } } }}
    >
      <App component={ClassOnly} prefixCls="class-only">
        <Read />
      </App>
    </ConfigProvider>,
  );
  const element = container.querySelector("article");
  if (!element) throw new Error("Custom App article missing");
  expect(element?.getAttribute("style")).toBeNull();
  expect(getComputedStyle(element).fontSize).toBe("18px");
  expect(getComputedStyle(element).color).toBe("#722ed1");
  expect(getComputedStyle(element).direction).toBe("rtl");
});
it("App styles are shared, replace changed tokens and clean up after the last owner", async () => {
  await render(
    <>
      <App>one</App>
      <App>two</App>
    </>,
  );
  expect(document.querySelectorAll("style[data-ao-app-style]")).toHaveLength(1);
  await render(
    <ConfigProvider theme={{ components: { App: { fontSize: 20 } } }}>
      <App>changed</App>
    </ConfigProvider>,
  );
  const styles = document.querySelectorAll("style[data-ao-app-style]");
  expect(styles).toHaveLength(1);
  expect(styles[0].textContent).toContain("font-size:20px");
  await render(<span>unmounted</span>);
  expect(document.querySelectorAll("style[data-ao-app-style]")).toHaveLength(0);
});
it("authored class rules override App resets at equal specificity", async () => {
  const style = document.createElement("style");
  style.textContent = ".app-user-override { color: red; font-size: 20px; }";
  document.head.append(style);
  try {
    await render(<App className="app-user-override">overridden</App>);
    const element = container.querySelector(".ant-app");
    if (!element) throw new Error("App wrapper missing");
    expect(getComputedStyle(element).color).toBe("red");
    expect(getComputedStyle(element).fontSize).toBe("20px");
  } finally {
    style.remove();
  }
});
it("nested App config merges each family and keeps parent instances independent", async () => {
  await render(
    <App
      message={{ maxCount: 2, top: 30, duration: 0 }}
      notification={{ maxCount: 3, bottom: 40 }}
    >
      <Read name="outer" />
      <App message={{ maxCount: 1 }} notification={{ bottom: 50 }}>
        <Read />
      </App>
    </App>,
  );
  expect(configs.outer.message).toEqual({ maxCount: 2, top: 30, duration: 0 });
  expect(configs.inner.message).toEqual({ maxCount: 1, top: 30, duration: 0 });
  expect(configs.inner.notification).toEqual({ maxCount: 3, bottom: 50 });
  await act(() => {
    app.message.info("one");
    app.message.info("two");
  });
  expect(document.querySelectorAll(".ant-message-notice")).toHaveLength(1);
});
it("global undefined prefix, icon and theme retain previous values; holder presence clears", () => {
  const theme = { token: { colorPrimary: "#123456" } };
  const holderRender = (children: unknown) => children as never;
  ConfigProvider.config({
    prefixCls: "custom",
    iconPrefixCls: "icons",
    theme,
    holderRender,
  });
  ConfigProvider.config({
    prefixCls: undefined,
    iconPrefixCls: undefined,
    theme: undefined,
  });
  expect(getGlobalConfig()).toEqual({
    prefixCls: "custom",
    iconPrefixCls: "icons",
    theme,
    holderRender,
  });
  ConfigProvider.config({ holderRender: undefined });
  expect(getGlobalConfig().holderRender).toBeUndefined();
  ConfigProvider.config({ prefixCls: "", iconPrefixCls: "", theme: {} });
  expect(getGlobalConfig()).toMatchObject({
    prefixCls: "ant",
    iconPrefixCls: "anticon",
    theme: {},
  });
});
it("global legacy theme warns, writes compatible CSS and retains modern theme", () => {
  const theme = { token: { colorPrimary: "#123456" } };
  ConfigProvider.config({ theme });
  const legacy = {
    primaryColor: "#722ed1",
    successColor: "rgba(0, 128, 0, .5)",
    warningColor: "orange",
    errorColor: "red",
    infoColor: "blue",
  };
  expect(getStyle("custom", legacy)).toBe(upstreamStyle("custom", legacy));
  ConfigProvider.config({ prefixCls: "custom", theme: legacy });
  expect(getGlobalConfig().theme).toBe(theme);
  const style = document.querySelector("style[data-rc-key$='-dynamic-theme']");
  expect(style?.textContent).toBe(getStyle("custom", legacy));
  expect(console.error).toHaveBeenCalledWith(
    expect.stringContaining("css variable theme is not work in v5"),
  );
  ConfigProvider.config({ theme: { infoColor: "pink" } });
  expect(
    document.querySelectorAll("style[data-rc-key$='-dynamic-theme']"),
  ).toHaveLength(1);
});
it("static message and notification receive global theme; changes apply on API sync", async () => {
  ConfigProvider.config({
    theme: {
      token: {},
      components: {
        Message: { contentBg: "#fffbe6" },
        Notification: { width: 400 },
      },
    },
  });
  await act(() => {
    message.info({ key: "global", content: "themed", duration: 0 });
    notification.open({ message: "notice", duration: 0 });
  });
  expect(
    document.querySelector(".ant-message")?.getAttribute("style"),
  ).toContain("#fffbe6");
  expect(
    document.querySelector(".ant-notification")?.getAttribute("style"),
  ).toContain("400px");
  ConfigProvider.config({
    theme: {
      token: {},
      components: { Message: { contentBg: "#fff0f6" } },
    },
  });
  await act(() => {});
  expect(
    document.querySelector(".ant-message")?.getAttribute("style"),
  ).toContain("#fffbe6");
  await act(() => {
    message.info({ key: "global", content: "updated", duration: 0 });
  });
  expect(
    document.querySelector(".ant-message")?.getAttribute("style"),
  ).toContain("#fff0f6");
});
it("holderRender ConfigProvider merges global theme and local overrides", async () => {
  ConfigProvider.config({
    theme: {
      token: { motion: false, fontSize: 16 },
      components: { Message: { contentBg: "#fffbe6" } },
    },
    holderRender: (children) => (
      <ConfigProvider
        theme={{ components: { Message: { contentPadding: "16px 20px" } } }}
      >
        {children}
      </ConfigProvider>
    ),
  });
  // Sync the existing static holder before opening through its replaced wrapper.
  await act(() => message.config({}));
  await act(() => {
    message.info({ content: "nested", duration: 0 });
  });
  const style = document.querySelector(".ant-message")?.getAttribute("style");
  expect(style).toContain("#fffbe6");
  expect(style).toContain("16px 20px");
  expect(style).toContain("16px");
});
it("static confirmations own independent themes and refresh only on their own update", async () => {
  let first!: ModalResult, second!: ModalResult;
  ConfigProvider.config({
    theme: {
      token: { motion: false },
      components: { Modal: { contentBg: "#fffbe6" } },
    },
  });
  await act(() => {
    first = Modal.info({ title: "first", content: "first body" });
  });
  await flushStatic();
  ConfigProvider.config({
    theme: {
      token: { motion: false },
      components: { Modal: { contentBg: "#fff0f6" } },
    },
  });
  await act(() => {
    second = Modal.info({ title: "second", content: "second body" });
  });
  await flushStatic();
  const dialogs = () => [...document.querySelectorAll(".ant-modal-root")];
  expect(dialogs()[0]?.getAttribute("style")).toContain("#fffbe6");
  expect(dialogs()[1]?.getAttribute("style")).toContain("#fff0f6");
  await act(() => first.update({ content: "updated first" }));
  await flushStatic();
  expect(dialogs()[0]?.getAttribute("style")).toContain("#fff0f6");
  await act(() => {
    first.destroy();
    second.destroy();
  });
  await flushStatic();
  expect(document.querySelectorAll(".ant-modal")).toHaveLength(0);
});
it("static confirmation captures holderRender at creation", async () => {
  let first!: ModalResult;
  ConfigProvider.config({
    theme: { token: { motion: false } },
    holderRender: (children) => (
      <ConfigProvider prefixCls="first">{children}</ConfigProvider>
    ),
  });
  await act(() => {
    first = Modal.info({ title: "first" });
  });
  await flushStatic();
  ConfigProvider.config({
    holderRender: (children) => (
      <ConfigProvider prefixCls="second">{children}</ConfigProvider>
    ),
  });
  await act(() => first.update({ content: "updated" }));
  await flushStatic();
  expect(document.querySelector(".first-modal")).not.toBeNull();
  expect(document.querySelector(".second-modal")).toBeNull();
});
it("motion overrides add a boundary once, then retain child state on later changes", async () => {
  const mounted = vi.fn();
  function Child() {
    const [value] = useState(() => {
      mounted();
      return "stable";
    });
    return <span>{value}</span>;
  }
  const tree = (motion: boolean) => (
    <ConfigProvider theme={{ token: { motion } }}>
      <Child />
    </ConfigProvider>
  );
  await render(tree(true));
  expect(mounted).toHaveBeenCalledTimes(1);
  await render(tree(false));
  expect(mounted).toHaveBeenCalledTimes(2);
  await render(tree(true));
  expect(mounted).toHaveBeenCalledTimes(2);
});
it("a static confirmation survives its theme motion boundary remount", async () => {
  let first!: ModalResult;
  await act(() => {
    first = Modal.info({ title: "motion", content: "before" });
  });
  await flushStatic();
  ConfigProvider.config({
    theme: {
      token: { motion: false },
      components: { Modal: { contentBg: "#fff0f6" } },
    },
  });
  await act(() => first.update({ content: "after" }));
  await flushStatic();
  expect(
    document.querySelector(".ant-modal-root")?.getAttribute("style"),
  ).toContain("#fff0f6");
  expect(
    document.querySelector(".ant-modal-confirm-content")?.textContent,
  ).toBe("after");
});
it("named icons do not repeat the default anticon class", async () => {
  await render(
    <App message={{ duration: 0 }}>
      <Read />
    </App>,
  );
  await act(() => {
    app.message.info("icon");
  });
  expect(document.querySelector('[aria-label="info-circle"]')?.className).toBe(
    "anticon anticon-info-circle",
  );
});
