import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { Spin, type SpinProps } from "../packages/antd-octane/src/spin";

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
  Spin.setDefaultIndicator(undefined);
  vi.useRealTimers();
});
it("retains inactive standalone and fullscreen nodes without invented status semantics", async () => {
  await render(<Spin spinning={false} />);
  const spin = container.querySelector(".ant-spin");
  expect(spin?.getAttribute("aria-busy")).toBe("false");
  expect(spin?.getAttribute("aria-live")).toBe("polite");
  expect(spin?.hasAttribute("role")).toBe(false);
  expect(spin?.hasAttribute("aria-label")).toBe(false);
  expect(spin?.hasAttribute("hidden")).toBe(false);
  await render(<Spin spinning={false} fullscreen rootClassName="root" />);
  const fullscreen = container.querySelector(".ant-spin-fullscreen");
  expect(fullscreen?.classList.contains("root")).toBe(true);
  expect(fullscreen?.classList.contains("ant-spin-fullscreen-show")).toBe(
    false,
  );
  expect(fullscreen?.hasAttribute("hidden")).toBe(false);
  expect(container.querySelector(".ant-spin")?.classList.contains("root")).toBe(
    false,
  );
});
it("uses the nested pattern for null children and retains focusable content during loading", async () => {
  await render(<Spin>{null}</Spin>);
  expect(container.querySelector(".ant-spin-nested-loading")).not.toBeNull();
  await render(
    <Spin tip="Loading">
      <button type="button">Child</button>
    </Spin>,
  );
  const child = container.querySelector("button");
  expect(
    container.querySelector(".ant-spin-container")?.hasAttribute("inert"),
  ).toBe(false);
  child?.focus();
  expect(document.activeElement).toBe(child);
  await render(
    <Spin spinning={false}>
      <button type="button">Child</button>
    </Spin>,
  );
  expect(container.querySelector("button")).toBe(child);
  expect(container.querySelector(".ant-spin-blur")).toBeNull();
  expect(container.querySelector(".ant-spin-text")).toBeNull();
});
it("lazily mounts percentage rings and retains both indicator holders when reset", async () => {
  await render(<Spin percent={0} />);
  expect(container.querySelector("svg")).toBeNull();
  expect(container.querySelectorAll("i")).toHaveLength(4);
  await render(<Spin percent={45} />);
  const svg = container.querySelector("svg");
  expect(svg?.getAttribute("aria-valuenow")).toBe("45");
  expect(container.querySelectorAll(".ant-spin-dot-holder")).toHaveLength(2);
  expect(container.querySelectorAll("i")).toHaveLength(4);
  await render(<Spin percent={0} />);
  expect(container.querySelector("svg")).toBe(svg);
  expect(svg?.getAttribute("aria-valuenow")).toBe("0");
  expect(
    svg?.parentElement?.classList.contains("ant-spin-dot-holder-hidden"),
  ).toBe(true);
  expect(
    container
      .querySelector(".ant-spin-dot-holder")
      ?.classList.contains("ant-spin-dot-holder-hidden"),
  ).toBe(false);
  await render(<Spin percent={150} />);
  expect(svg?.getAttribute("aria-valuenow")).toBe("100");
  await render(<Spin percent={-10} />);
  expect(svg?.getAttribute("aria-valuenow")).toBe("0");
});
it("preserves custom indicator undefined percent and local/context/default priority", async () => {
  function Indicator({
    className,
    percent,
  }: {
    className?: string;
    percent?: number;
  }) {
    return (
      <span className={className} data-percent={String(percent)}>
        Local
      </span>
    );
  }
  Spin.setDefaultIndicator(<span>Default</span>);
  await render(<Spin />);
  expect(container.textContent).toBe("Default");
  await render(
    <ConfigProvider spin={{ indicator: <span>Context</span> }}>
      <Spin />
    </ConfigProvider>,
  );
  expect(container.textContent).toBe("Context");
  await render(
    <ConfigProvider spin={{ indicator: <span>Context</span> }}>
      <Spin
        prefixCls="custom-spin"
        indicator={<Indicator className="authored" />}
      />
    </ConfigProvider>,
  );
  const indicator = container.querySelector(".authored");
  expect(indicator?.classList.contains("custom-spin-dot")).toBe(true);
  expect(indicator?.getAttribute("data-percent")).toBe("undefined");
  await render(<Spin indicator={<Indicator />} percent={42} />);
  expect(
    container.querySelector("[data-percent]")?.getAttribute("data-percent"),
  ).toBe("42");
});
it("applies nested classes, style precedence and component tokens to their proper wrappers", async () => {
  await render(
    <ConfigProvider
      direction="rtl"
      spin={{ className: "provider", style: { color: "red", marginTop: 8 } }}
      theme={{
        components: {
          Spin: {
            contentHeight: "120px",
            dotSize: 28,
            colorFillSecondary: "#aabbcc",
          },
        },
      }}
    >
      <Spin
        prefixCls="custom-spin"
        size="large"
        tip="Loading"
        className="local"
        rootClassName="root"
        wrapperClassName="wrapper"
        style={{ color: "blue" }}
      >
        <span>Child</span>
      </Spin>
    </ConfigProvider>,
  );
  const wrapper = container.querySelector<HTMLElement>(
    ".custom-spin-nested-loading",
  );
  const spin = container.querySelector<HTMLElement>(".custom-spin");
  expect(wrapper?.classList.contains("wrapper")).toBe(true);
  expect(wrapper?.classList.contains("root")).toBe(false);
  expect(wrapper?.style.color).toBe("");
  expect(wrapper?.style.marginTop).toBe("");
  expect(spin?.style.color).toBe("blue");
  expect(spin?.style.marginTop).toBe("8px");
  expect(spin?.classList.contains("provider")).toBe(true);
  for (const name of [
    "local",
    "root",
    "custom-spin-lg",
    "custom-spin-rtl",
    "custom-spin-show-text",
  ])
    expect(spin?.classList.contains(name)).toBe(true);
  expect(spin?.style.getPropertyValue("--ao-spin-height")).toBe("120px");
  expect(spin?.style.getPropertyValue("--ao-spin-default-size")).toBe("28px");
  expect(spin?.style.getPropertyValue("--ao-spin-fill")).toBe("#aabbcc");
});
it("forwards runtime rest attributes to nested wrapper and spinner like upstream", async () => {
  const props = {
    title: "Runtime attribute",
    "data-extra": "value",
  } as SpinProps;
  await render(
    <Spin {...props}>
      <span>Child</span>
    </Spin>,
  );
  expect(
    container.querySelector(".ant-spin-nested-loading")?.getAttribute("title"),
  ).toBe("Runtime attribute");
  expect(container.querySelector(".ant-spin")?.getAttribute("data-extra")).toBe(
    "value",
  );
});
it("does not normalize negative delays before scheduling their trailing activation", async () => {
  vi.useFakeTimers();
  await render(<Spin delay={-1} />);
  expect(container.querySelector(".ant-spin-spinning")).toBeNull();
  await act(() => vi.advanceTimersByTime(0));
  expect(container.querySelector(".ant-spin-spinning")).not.toBeNull();
});
it("uses upstream automatic progress buckets and stops intervals when spinning ends", async () => {
  vi.useFakeTimers();
  await render(<Spin percent="auto" />);
  await act(() => vi.advanceTimersByTime(200));
  expect(container.querySelector("svg")?.getAttribute("aria-valuenow")).toBe(
    "5",
  );
  await act(() => vi.advanceTimersByTime(200));
  expect(container.querySelector("svg")?.getAttribute("aria-valuenow")).toBe(
    "9.75",
  );
  await render(<Spin percent="auto" spinning={false} />);
  await act(() => vi.advanceTimersByTime(1000));
  expect(container.querySelector("svg")?.getAttribute("aria-valuenow")).toBe(
    "9.75",
  );
  await render(<Spin percent="auto" />);
  await act(() => vi.advanceTimersByTime(0));
  expect(container.querySelector("svg")?.getAttribute("aria-valuenow")).toBe(
    "0",
  );
});
