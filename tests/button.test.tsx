import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ButtonRef } from "../packages/antd-octane/src";
import { Button, ConfigProvider, theme } from "../packages/antd-octane/src";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
  return container;
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
  vi.useRealTimers();
});

describe("Button native behavior", () => {
  it("spaces Chinese labels used in Tour and allows opting out", async () => {
    await render(
      <>
        <Button>完成</Button>
        <Button autoInsertSpace={false}>完成</Button>
        <Button type="text">完成</Button>
        <Button icon={<span>→</span>}>完成</Button>
      </>,
    );
    expect(
      Array.from(
        container.querySelectorAll("button"),
        (node) => node.textContent,
      ),
    ).toEqual(["完 成", "完成", "完成", "→完成"]);
  });
  it("preserves zero content and native Octane class composition", async () => {
    await render(<Button className={["custom", { active: true }]}>{0}</Button>);
    const button = container.querySelector("button");
    expect(button?.textContent).toBe("0");
    expect(button?.classList.contains("custom")).toBe(true);
    expect(button?.classList.contains("active")).toBe(true);
    expect(button?.classList.contains("ant-btn-icon-only")).toBe(false);
  });
  it("defaults to a non-submitting button and sends a native click", async () => {
    const click = vi.fn();
    await render(<Button onClick={click}>Save</Button>);
    const button = container.querySelector("button");
    expect(button?.type).toBe("button");
    await act(() => button?.click());
    expect(click).toHaveBeenCalledOnce();
    expect(click.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
  });
  it("blocks disabled and loading clicks without turning a loading button into a submit", async () => {
    const click = vi.fn();
    await render(
      <>
        <Button disabled onClick={click}>
          Disabled
        </Button>
        <Button loading onClick={click}>
          Loading
        </Button>
      </>,
    );
    await act(() => {
      for (const node of container.querySelectorAll("button")) node.click();
    });
    expect(click).not.toHaveBeenCalled();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    const status = [
      ...document.body.querySelectorAll(
        '.ao-btn-loading-status[role="status"]',
      ),
    ].find((node) => node.textContent === "Loading");
    expect(status?.textContent).toBe("Loading");
    expect(status?.parentElement).toBe(document.body);
  });
  it("places the icon after content when requested", async () => {
    await render(
      <Button icon={<span data-icon="arrow">→</span>} iconPlacement="end">
        Continue
      </Button>,
    );
    const button = container.querySelector("button");
    expect(button?.children[0]?.textContent).toBe("Continue");
    expect(button?.children[1]?.querySelector("[data-icon]"))?.not.toBeNull();
  });
  it("accepts the Ant Design 5.x iconPosition alias", async () => {
    await render(
      <Button icon={<span data-icon="arrow">→</span>} iconPosition="end">
        Continue
      </Button>,
    );
    expect(
      container
        .querySelector("button")
        ?.lastElementChild?.querySelector("[data-icon]"),
    ).not.toBeNull();
  });
  it("delays loading, prevents clicks once active, and restores clicks when cleared", async () => {
    vi.useFakeTimers();
    const click = vi.fn();
    function Example() {
      const [loading, setLoading] = useState(true);
      return (
        <>
          <Button
            loading={
              loading ? { delay: 200, icon: <span data-icon="wait" /> } : false
            }
            onClick={click}
          >
            Save
          </Button>
          <button type="button" onClick={() => setLoading(false)}>
            Clear
          </button>
        </>
      );
    }
    await render(<Example />);
    const button = container.querySelector(".ant-btn") as HTMLButtonElement;
    expect(button.getAttribute("aria-busy")).toBeNull();
    await act(() => button.click());
    expect(click).toHaveBeenCalledOnce();
    await act(() => vi.advanceTimersByTime(199));
    expect(button.getAttribute("aria-busy")).toBeNull();
    await act(() => vi.advanceTimersByTime(1));
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.querySelector("[data-icon='wait']")).not.toBeNull();
    await act(() => button.click());
    expect(click).toHaveBeenCalledOnce();
    await act(() =>
      (container.querySelectorAll("button")[1] as HTMLButtonElement).click(),
    );
    expect(button.getAttribute("aria-busy")).toBeNull();
    await act(() => button.click());
    expect(click).toHaveBeenCalledTimes(2);
  });
  it("cancels a pending loading delay when loading clears", async () => {
    vi.useFakeTimers();
    function Example() {
      const [loading, setLoading] = useState(true);
      return (
        <>
          <Button loading={loading ? { delay: 200 } : false}>Save</Button>
          <button type="button" onClick={() => setLoading(false)}>
            Clear
          </button>
        </>
      );
    }
    await render(<Example />);
    const button = container.querySelector(".ant-btn") as HTMLButtonElement;
    await act(() => vi.advanceTimersByTime(100));
    await act(() =>
      (container.querySelectorAll("button")[1] as HTMLButtonElement).click(),
    );
    await act(() => vi.advanceTimersByTime(500));
    expect(button.getAttribute("aria-busy")).toBeNull();
    expect(button.querySelector(".ao-btn-spinner")).toBeNull();
  });
  it("exposes focus, blur and the native element", async () => {
    const ref = { current: null as ButtonRef | null };
    await render(<Button ref={ref}>Focus me</Button>);
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
    ref.current?.blur();
    expect(document.activeElement).not.toBe(ref.current);
  });
  it("removes navigation from a disabled link", async () => {
    await render(
      <Button href="https://example.com" disabled>
        Go
      </Button>,
    );
    const link = container.querySelector("a");
    expect(link?.hasAttribute("href")).toBe(false);
    expect(link?.getAttribute("aria-disabled")).toBe("true");
    expect(link?.tabIndex).toBe(-1);
  });
  it("honors native submit and caller style overrides", async () => {
    await render(
      <Button
        htmlType="submit"
        name="intent"
        value="save"
        style={{ marginTop: 12 }}
      >
        Save
      </Button>,
    );
    const button = container.querySelector("button");
    expect(button?.type).toBe("submit");
    expect(button?.name).toBe("intent");
    expect(button?.style.marginTop).toBe("12px");
  });
  it("reacts to theme changes and keeps nested independent providers isolated", async () => {
    function Example() {
      const [dark, setDark] = useState(false);
      return (
        <ConfigProvider
          theme={{
            algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { colorPrimary: "#722ed1" },
          }}
        >
          <Button onClick={() => setDark(!dark)}>Switch</Button>
          <ConfigProvider theme={{ inherit: false }}>
            <Button>Independent</Button>
          </ConfigProvider>
        </ConfigProvider>
      );
    }
    await render(<Example />);
    const [outer, inner] = container.querySelectorAll("button");
    const before = outer.style.getPropertyValue("--ao-btn-bg");
    const independent = inner.style.getPropertyValue("--ao-btn-bg");
    await act(() => outer.click());
    expect(outer.style.getPropertyValue("--ao-btn-bg")).not.toBe(before);
    expect(inner.style.getPropertyValue("--ao-btn-bg")).toBe(independent);
    expect(inner.style.getPropertyValue("--ao-btn-primary")).toBe("#1677ff");
  });
  it("applies component tokens and provider defaults with local overrides", async () => {
    await render(
      <ConfigProvider
        componentDisabled
        componentSize="large"
        theme={{
          components: { Button: { primaryColor: "#123456", fontWeight: 700 } },
        }}
      >
        <Button type="primary" disabled={false}>
          Enabled
        </Button>
      </ConfigProvider>,
    );
    const button = container.querySelector("button");
    expect(button?.disabled).toBe(false);
    expect(button?.classList.contains("ant-btn-large")).toBe(true);
    expect(button?.style.getPropertyValue("--ao-btn-primary-color")).toBe(
      "#123456",
    );
    expect(button?.style.getPropertyValue("--ao-btn-weight")).toBe("700");
  });
});
