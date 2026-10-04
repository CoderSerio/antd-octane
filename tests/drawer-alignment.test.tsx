import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { Drawer } from "../packages/antd-octane/src/drawer";

let root: Root | undefined;
let host: HTMLDivElement;
async function render(node: ElementDescriptor) {
  if (!root) {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  }
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  host?.remove();
});
const part = (name: string) =>
  host.querySelector<HTMLElement>(`.ant-drawer${name}`);

it("splits the root, motion wrapper and accessible content panel with the upstream defaults", async () => {
  const ref = { current: null as HTMLDivElement | null };
  await render(
    <Drawer open getContainer={false} title="Title" panelRef={ref}>
      Body
    </Drawer>,
  );
  expect(part("")?.classList.contains("ant-drawer-inline")).toBe(true);
  expect(part("")?.classList.contains("ant-drawer-open")).toBe(true);
  expect(part("-content-wrapper")?.style.width).toBe("378px");
  expect(part("-content-wrapper")?.getAttribute("role")).toBeNull();
  expect(ref.current).toBe(part("-content"));
  expect(ref.current?.getAttribute("role")).toBe("dialog");
  expect(ref.current?.getAttribute("aria-modal")).toBe("true");
  expect(host.querySelectorAll("[data-sentinel]")).toHaveLength(2);
});

it("omits an extra-only header and falsy footer but preserves upstream zero-title text", async () => {
  await render(
    <Drawer
      open
      getContainer={false}
      closable={false}
      extra="Extra"
      footer={0}
      title={0}
    >
      Body
    </Drawer>,
  );
  expect(part("-header")).toBeNull();
  expect(part("-footer")).toBeNull();
  await render(
    <Drawer open getContainer={false} title={0} footer={[]}>
      Body
    </Drawer>,
  );
  expect(
    part("-header")?.classList.contains("ant-drawer-header-close-only"),
  ).toBe(true);
  expect(part("-title")).toBeNull();
  expect(part("-header-title")?.textContent).toBe("0");
  expect(part("-footer")).not.toBeNull();
});

it("merges Provider and prop semantic class names without losing either", async () => {
  const classes = {
    header: "provider-header",
    body: "provider-body",
    footer: "provider-footer",
    wrapper: "provider-wrapper",
    content: "provider-content",
    mask: "provider-mask",
  };
  const local = {
    header: "local-header",
    body: "local-body",
    footer: "local-footer",
    wrapper: "local-wrapper",
    content: "local-content",
    mask: "local-mask",
  };
  await render(
    <ConfigProvider drawer={{ classNames: classes }}>
      <Drawer
        open
        getContainer={false}
        title="Title"
        footer="Footer"
        classNames={local}
      >
        Body
      </Drawer>
    </ConfigProvider>,
  );
  for (const name of Object.keys(classes) as (keyof typeof classes)[]) {
    const node = part(name === "wrapper" ? "-content-wrapper" : `-${name}`);
    expect(node?.classList.contains(classes[name])).toBe(true);
    expect(node?.classList.contains(local[name])).toBe(true);
  }
});

it("merges local and Provider close configurations and labels", async () => {
  await render(
    <ConfigProvider drawer={{ closable: false, closeIcon: "C" }}>
      <Drawer open getContainer={false}>
        Body
      </Drawer>
    </ConfigProvider>,
  );
  expect(part("-close")).toBeNull();
  await render(
    <ConfigProvider drawer={{ closable: false, closeIcon: "C" }}>
      <Drawer
        open
        getContainer={false}
        closable={{ placement: "end", "aria-label": "Dismiss" }}
      >
        Body
      </Drawer>
    </ConfigProvider>,
  );
  expect(part("-close")?.querySelector('[aria-label="close"]')).not.toBeNull();
  expect(part("-close")?.getAttribute("aria-label")).toBe("Dismiss");
  expect(part("-close")?.classList.contains("ant-drawer-close-end")).toBe(true);
  await render(
    <Drawer open getContainer={false} closable closeIcon={null}>
      Body
    </Drawer>,
  );
  expect(part("-close")?.querySelector('[aria-label="close"]')).not.toBeNull();
});

it("keeps an explicitly null object icon empty and preserves the documented disabled close behavior", async () => {
  await render(
    <Drawer open getContainer={false} closable={{ closeIcon: null }}>
      Body
    </Drawer>,
  );
  expect(part("-header")).not.toBeNull();
  expect(part("-close")).toBeNull();
  const onClose = vi.fn();
  await render(
    <Drawer
      open
      getContainer={false}
      closable={{ disabled: true }}
      onClose={onClose}
    >
      Body
    </Drawer>,
  );
  const button = part("-close") as HTMLButtonElement;
  expect(button.disabled).toBe(true);
  await act(() => button.click());
  expect(onClose).not.toHaveBeenCalled();
});

it("forwards panel events and ARIA to content, data attributes to the motion wrapper", async () => {
  const click = vi.fn(),
    keyup = vi.fn();
  await render(
    <Drawer
      open
      getContainer={false}
      id="panel"
      aria-label="Authored"
      aria-labelledby="label"
      data-authored="wrapper"
      onClick={click}
      onKeyUp={keyup}
    >
      Body
    </Drawer>,
  );
  expect(part("-content")?.id).toBe("panel");
  expect(part("-content")?.getAttribute("aria-label")).toBe("Authored");
  expect(part("-content")?.getAttribute("aria-labelledby")).toBe("label");
  expect(part("-content-wrapper")?.getAttribute("data-authored")).toBe(
    "wrapper",
  );
  await act(() => {
    part("-content")?.click();
    part("-content")?.dispatchEvent(
      new KeyboardEvent("keyup", { key: "a", bubbles: true }),
    );
  });
  expect(click).toHaveBeenCalledOnce();
  expect(keyup).toHaveBeenCalledOnce();
});

it("adds the configured prefix to every Drawer slot including loading Skeleton", async () => {
  await render(
    <Drawer
      open
      getContainer={false}
      prefixCls="custom-drawer"
      loading
      title="Title"
      footer="Footer"
    />,
  );
  for (const name of [
    "",
    "-mask",
    "-content-wrapper",
    "-content",
    "-header",
    "-header-title",
    "-title",
    "-close",
    "-body",
    "-body-skeleton",
    "-footer",
  ])
    expect(part(name)?.classList.contains(`custom-drawer${name}`)).toBe(true);
});

it("wraps the complete accessible content panel in drawerRender", async () => {
  await render(
    <Drawer
      open
      getContainer={false}
      drawerRender={(node) => <section data-render="custom">{node}</section>}
    >
      Body
    </Drawer>,
  );
  expect(part("-content")?.parentElement?.dataset.render).toBe("custom");
  expect(part("-content")?.parentElement?.parentElement).toBe(
    part("-content-wrapper"),
  );
});

it("only locks body scrolling for body-portal drawers with a mask", async () => {
  const previous = document.body.style.overflow;
  await render(
    <Drawer open getContainer={false}>
      Inline
    </Drawer>,
  );
  expect(document.body.style.overflow).toBe(previous);
  await render(
    <Drawer open mask={false}>
      No mask
    </Drawer>,
  );
  expect(document.body.style.overflow).toBe(previous);
  await render(<Drawer open>Masked</Drawer>);
  expect(document.body.style.overflowY).toBe("hidden");
  await render(<Drawer open={false}>Masked</Drawer>);
  expect(document.body.style.overflow).toBe(previous);
});

it("uses click for mask closure and does not prevent the Escape event", async () => {
  const close = vi.fn();
  await render(
    <Drawer open getContainer={false} onClose={close}>
      Body
    </Drawer>,
  );
  await act(() => part("-mask")?.click());
  expect(close.mock.calls[0][0].type).toBe("click");
  const key = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  await act(() => part("")?.dispatchEvent(key));
  expect(close).toHaveBeenCalledTimes(2);
  expect(key.defaultPrevented).toBe(false);
});

it("stacks nested Drawer z-index and pushes the parent panel", async () => {
  await render(
    <Drawer open getContainer={false} push={{ distance: 80 }}>
      <Drawer open getContainer={false}>
        Nested
      </Drawer>
    </Drawer>,
  );
  expect(part("-content-wrapper")?.style.transform).toBe("translateX(-80px)");
  const drawers = host.querySelectorAll<HTMLElement>(".ant-drawer");
  expect(drawers[1].style.zIndex).toBe("1200");
  await render(
    <Drawer open getContainer={false} push={false}>
      <Drawer open getContainer={false}>
        Nested
      </Drawer>
    </Drawer>,
  );
  expect(part("-content-wrapper")?.style.transform).toBe("");
});

it("parses canonical numeric dimension strings and preserves CSS dimensions", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    await render(<Drawer open getContainer={false} width="300.5" />);
    expect(part("-content-wrapper")?.style.width).toBe("300.5px");
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("Invalid value type"),
    );
    await render(
      <Drawer open getContainer={false} placement="top" height="70%" />,
    );
    expect(part("-content-wrapper")?.style.height).toBe("70%");
    await render(
      <Drawer open getContainer={false} placement="bottom" height="240" />,
    );
    expect(part("-content-wrapper")?.style.height).toBe("240px");
  } finally {
    error.mockRestore();
  }
});
