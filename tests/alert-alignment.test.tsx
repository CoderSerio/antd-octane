import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Alert,
  type AlertRef,
  ConfigProvider,
} from "../packages/antd-octane/src";
import { SmileOutlined } from "../packages/antd-octane/src/_util/feedback-icons";

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
it("defaults to info without an icon; banner defaults to warning with an icon", async () => {
  await render(<Alert message="Notice" />);
  expect(
    container.querySelector(".ant-alert-info.ant-alert-no-icon"),
  ).not.toBeNull();
  expect(container.querySelector(".ant-alert-icon")).toBeNull();
  await render(<Alert message="Notice" banner />);
  expect(
    container.querySelector(".ant-alert-warning.ant-alert-banner"),
  ).not.toBeNull();
  expect(
    container.querySelector(".ant-alert-icon")?.getAttribute("aria-label"),
  ).toBe("exclamation-circle");
  await render(<Alert message="Notice" banner type="error" showIcon={false} />);
  expect(
    container.querySelector(".ant-alert-error.ant-alert-no-icon"),
  ).not.toBeNull();
});
it("omits all falsy content instead of rendering bare zero text", async () => {
  for (const value of [0, false, null, ""]) {
    await render(<Alert message={value} description={value} action={value} />);
    expect(container.querySelector(".ant-alert")?.textContent).toBe("");
    for (const part of ["message", "description", "action"])
      expect(container.querySelector(`.ant-alert-${part}`)).toBeNull();
  }
  await render(<Alert message={[]} description={[]} action={[]} />);
  expect(container.querySelector(".ant-alert-with-description")).not.toBeNull();
  for (const part of ["message", "description", "action"])
    expect(container.querySelector(`.ant-alert-${part}`)).not.toBeNull();
});
it("clones custom element icons directly and preserves authored class/style", async () => {
  await render(
    <Alert
      showIcon
      icon={
        <SmileOutlined
          className="custom"
          style={{ color: "purple" }}
          aria-label="smile"
        />
      }
    />,
  );
  const icon = container.querySelector<HTMLElement>(
    ".ant-alert > .ant-alert-icon",
  );
  expect(icon?.classList.contains("anticon-smile")).toBe(true);
  expect(icon?.classList.contains("custom")).toBe(true);
  expect(icon?.style.color).toBe("purple");
  expect(icon?.getAttribute("role")).toBe("img");
  await render(
    <Alert
      showIcon
      icon={
        <svg width={30} height={20}>
          <title>Custom</title>
        </svg>
      }
    />,
  );
  expect(
    container.querySelector(".ant-alert > svg.ant-alert-icon"),
  ).not.toBeNull();
  await render(<Alert showIcon icon="!" />);
  expect(
    container.querySelector(".ant-alert > span.ant-alert-icon")?.textContent,
  ).toBe("!");
});
it("uses filled status icons for both message and description modes", async () => {
  for (const [type, label] of [
    ["success", "check-circle"],
    ["info", "info-circle"],
    ["warning", "exclamation-circle"],
    ["error", "close-circle"],
  ] as const) {
    for (const description of [undefined, "Details"]) {
      await render(
        <Alert type={type} description={description} showIcon icon={0} />,
      );
      expect(
        container
          .querySelector(".ant-alert > .anticon")
          ?.getAttribute("aria-label"),
      ).toBe(label);
    }
  }
});
it("preserves upstream close option precedence and renders empty/zero close icons", async () => {
  await render(<Alert closable={false} closeIcon="X" />);
  expect(container.querySelector("button")).toBeNull();
  for (const closeIcon of [0, ""]) {
    await render(<Alert closeIcon={closeIcon} />);
    expect(container.querySelector("button")?.textContent).toBe(
      String(closeIcon),
    );
  }
  await render(
    <Alert
      closable={{ closeIcon: "X", "aria-label": "Dismiss" }}
      closeIcon={false}
    />,
  );
  expect(container.querySelector("button")?.textContent).toBe("X");
  expect(container.querySelector("button")?.getAttribute("aria-label")).toBe(
    "Dismiss",
  );
  await render(<Alert closable={{ "aria-label": "No icon" }} />);
  expect(container.querySelector("button")).toBeNull();
});
it("resolves provider close settings and lets a local boolean override disabled aria props", async () => {
  const close = vi.fn();
  await render(
    <ConfigProvider
      alert={{
        closable: {
          closeIcon: "C",
          disabled: true,
          "aria-label": "Provider close",
        },
      }}
    >
      <Alert onClose={close} />
    </ConfigProvider>,
  );
  const button = container.querySelector("button");
  expect(button?.disabled).toBe(true);
  await act(() => button?.click());
  expect(close).not.toHaveBeenCalled();
  await render(
    <ConfigProvider alert={{ closable: { closeIcon: "C", disabled: true } }}>
      <Alert closable closeIcon onClose={close} />
    </ConfigProvider>,
  );
  expect(container.querySelector("button")?.disabled).toBe(false);
  expect(
    container.querySelector(".anticon-close")?.getAttribute("aria-label"),
  ).toBe("close");
});
it("serializes numeric padding tokens and keeps heading/icon gaps independent", async () => {
  await render(
    <ConfigProvider
      theme={{
        token: { marginXS: 12, marginSM: 18, colorTextHeading: "#722ed1" },
        components: {
          Alert: {
            defaultPadding: 20,
            withDescriptionPadding: 16,
            withDescriptionIconSize: 32,
          },
        },
      }}
      alert={{ style: { maxHeight: 100 } }}
    >
      <Alert showIcon />
    </ConfigProvider>,
  );
  let style = container.querySelector<HTMLElement>(".ant-alert")?.style;
  expect(style?.getPropertyValue("--ao-alert-padding")).toBe("20px");
  expect(style?.getPropertyValue("--ao-alert-icon-gap")).toBe("12px");
  expect(style?.maxHeight).toBe("100px");
  await render(
    <ConfigProvider
      theme={{
        token: { marginXS: 12, marginSM: 18, colorTextHeading: "#722ed1" },
        components: {
          Alert: { withDescriptionPadding: 16, withDescriptionIconSize: 32 },
        },
      }}
    >
      <Alert description="Details" />
    </ConfigProvider>,
  );
  style = container.querySelector<HTMLElement>(".ant-alert")?.style;
  expect(style?.getPropertyValue("--ao-alert-padding")).toBe("16px");
  expect(style?.getPropertyValue("--ao-alert-icon-size")).toBe("32px");
  expect(style?.getPropertyValue("--ao-alert-icon-gap")).toBe("18px");
  expect(style?.getPropertyValue("--ao-alert-heading-color")).toBe("#722ed1");
});
it("applies a custom prefix to every part and modifier while preserving static aliases", async () => {
  await render(
    <ConfigProvider
      direction="rtl"
      alert={{ className: "provider", style: { color: "red", maxHeight: 100 } }}
    >
      <Alert
        prefixCls="demo-alert"
        rootClassName="root"
        className="local"
        style={{ color: "blue" }}
        description="Details"
        banner
        showIcon={false}
        action="Action"
        closable
      />
    </ConfigProvider>,
  );
  const element = container.querySelector<HTMLElement>(".demo-alert");
  for (const suffix of [
    "warning",
    "rtl",
    "banner",
    "no-icon",
    "with-description",
  ])
    expect(element?.classList.contains(`demo-alert-${suffix}`)).toBe(true);
  for (const part of ["content", "description", "action", "close-icon"])
    expect(element?.querySelector(`.demo-alert-${part}`)).not.toBeNull();
  for (const cls of ["provider", "root", "local"])
    expect(element?.classList.contains(cls)).toBe(true);
  expect(element?.style.color).toBe("blue");
  expect(element?.style.maxHeight).toBe("100px");
});
it("forwards explicit mouse events, id, role, aria/data only", async () => {
  const click = vi.fn();
  const props = {
    title: "ignored",
    tabIndex: 3,
    hidden: true,
    onKeyDown: vi.fn(),
    "data-show": "authored",
  };
  await render(
    <Alert
      {...props}
      id="notice"
      role="status"
      aria-label="Update"
      data-custom="kept"
      onClick={click}
    />,
  );
  const element = container.querySelector<HTMLElement>(".ant-alert");
  for (const attr of ["title", "tabindex", "hidden"])
    expect(element?.getAttribute(attr)).toBeNull();
  expect(element?.id).toBe("notice");
  expect(element?.getAttribute("role")).toBe("status");
  expect(element?.getAttribute("aria-label")).toBe("Update");
  expect(element?.getAttribute("data-custom")).toBe("kept");
  expect(element?.getAttribute("data-show")).toBe("authored");
  await act(() => element?.click());
  expect(click).toHaveBeenCalledTimes(1);
});
it("calls afterClose before removal, exposes the native ref, and ignores preventDefault", async () => {
  const ref: { current: AlertRef | null } = { current: null };
  const onClose = vi.fn((event: MouseEvent) => event.preventDefault());
  const afterClose = vi.fn(() =>
    expect(ref.current?.nativeElement?.isConnected).toBe(true),
  );
  await render(
    <Alert ref={ref} closable onClose={onClose} afterClose={afterClose} />,
  );
  expect(ref.current?.nativeElement).toBe(
    container.querySelector(".ant-alert"),
  );
  await act(() => container.querySelector("button")?.click());
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(afterClose).toHaveBeenCalledTimes(1);
  expect(container.querySelector(".ant-alert")).toBeNull();
});
it("removes without invoking afterClose when motion is disabled upstream", async () => {
  const afterClose = vi.fn();
  await render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Alert closable afterClose={afterClose} />
    </ConfigProvider>,
  );
  await act(() => container.querySelector("button")?.click());
  expect(container.querySelector(".ant-alert")).toBeNull();
  expect(afterClose).not.toHaveBeenCalled();
});
it("uses an Octane error boundary and preserves authored fallback content", async () => {
  function ThrowError() {
    const [error, setError] = useState(false);
    if (error) throw Error("Native failure");
    return (
      <button type="button" onClick={() => setError(true)}>
        Throw
      </button>
    );
  }
  await render(
    <Alert.ErrorBoundary
      id="boundary"
      message="Failure"
      description="Custom details"
    >
      <ThrowError />
    </Alert.ErrorBoundary>,
  );
  await act(() => container.querySelector("button")?.click());
  expect(container.querySelector("#boundary.ant-alert-error")).not.toBeNull();
  expect(container.querySelector(".ant-alert-message")?.textContent).toBe(
    "Failure",
  );
  expect(
    container.querySelector(".ant-alert-description > pre")?.textContent,
  ).toBe("Custom details");
});
