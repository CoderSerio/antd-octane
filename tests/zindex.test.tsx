import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider, Drawer, Modal } from "../packages/antd-octane/src";
import { useZIndex } from "../packages/antd-octane/src/_util/hooks/useZIndex";
import { resetWarned } from "../packages/antd-octane/src/_util/warning";
import ZIndexContext from "../packages/antd-octane/src/_util/zindexContext";

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
  resetWarned();
  vi.restoreAllMocks();
});
function Probe({ custom }: { custom?: number }) {
  const [modal, modalContext] = useZIndex("Modal", custom);
  const [select, selectContext] = useZIndex("SelectLike", custom);
  return (
    <output>
      {JSON.stringify({ modal, modalContext, select, selectContext })}
    </output>
  );
}
function read() {
  return JSON.parse(host.querySelector("output")?.textContent ?? "{}");
}

it("keeps top-level CSS defaults while supplying the container context offset", async () => {
  await render(<Probe />);
  expect(read()).toEqual({ modalContext: 1100, selectContext: 50 });
  await render(
    <ConfigProvider theme={{ token: { zIndexPopupBase: 3000 } }}>
      <Probe />
    </ConfigProvider>,
  );
  expect(read()).toEqual({ modalContext: 3100, selectContext: 50 });
});

it("uses inherited offsets and preserves explicit zero values", async () => {
  await render(
    <ZIndexContext value={1100}>
      <Probe />
    </ZIndexContext>,
  );
  expect(read()).toEqual({
    modal: 1200,
    modalContext: 1200,
    select: 1150,
    selectContext: 1150,
  });
  await render(
    <ZIndexContext value={0}>
      <Probe />
    </ZIndexContext>,
  );
  expect(read()).toEqual({
    modal: 1100,
    modalContext: 1100,
    select: 50,
    selectContext: 50,
  });
  await render(<Probe custom={0} />);
  expect(read()).toEqual({
    modal: 0,
    modalContext: 0,
    select: 0,
    selectContext: 0,
  });
});

it("warns for excessive inherited offsets but accepts an explicit authored z-index", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  await render(
    <ZIndexContext value={2100}>
      <Probe />
    </ZIndexContext>,
  );
  expect(error).toHaveBeenCalledWith(
    expect.stringContaining("`zIndex` is over design token"),
  );
  error.mockClear();
  await render(<Probe custom={9999} />);
  expect(error).not.toHaveBeenCalled();
});

it("shares context from Drawer to Modal and back to Drawer across portals", async () => {
  await render(
    <Drawer open getContainer={false}>
      <Modal open footer={null}>
        <Drawer open>Nested Drawer</Drawer>
      </Modal>
    </Drawer>,
  );
  const modal = document.querySelector<HTMLElement>(".ant-modal-root");
  const drawers = document.querySelectorAll<HTMLElement>(".ant-drawer");
  expect(modal?.style.getPropertyValue("--ao-dialog-z")).toBe("1200");
  expect(drawers[1].style.zIndex).toBe("1300");
});

it("shares a Modal context with Drawer and nested Modal containers", async () => {
  await render(
    <Modal open getContainer={false} zIndex={2500}>
      <Drawer open>
        <Modal open footer={null}>
          Nested Modal
        </Modal>
      </Drawer>
    </Modal>,
  );
  expect(document.querySelector<HTMLElement>(".ant-drawer")?.style.zIndex).toBe(
    "2600",
  );
  const modals = document.querySelectorAll<HTMLElement>(".ant-modal-root");
  expect(modals[1].style.getPropertyValue("--ao-dialog-z")).toBe("2700");
});

it("keeps an initially open child above its parent for focus and Escape", async () => {
  const parentCancel = vi.fn();
  const childClose = vi.fn();
  await render(
    <Modal open getContainer={false} onCancel={parentCancel}>
      <Drawer open onClose={childClose}>
        Child
      </Drawer>
    </Modal>,
  );
  const child = document.querySelector<HTMLElement>(".ant-drawer");
  expect(document.activeElement).toBe(child);
  const escapeEvent = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  await act(() => child?.dispatchEvent(escapeEvent));
  expect(childClose).toHaveBeenCalledTimes(1);
  expect(parentCancel).not.toHaveBeenCalled();
  expect(escapeEvent.defaultPrevented).toBe(false);
});

it("captures a Modal trigger before its nested Drawer takes focus", async () => {
  function Scene() {
    const [childOpen, setChildOpen] = useState(false);
    const [thirdOpen, setThirdOpen] = useState(true);
    return (
      <ConfigProvider theme={{ token: { motion: false } }}>
        <Drawer open title="Parent">
          <button type="button" onClick={() => setChildOpen(true)}>
            Open child
          </button>
          <Modal
            open={childOpen}
            title="Child"
            footer={null}
            onCancel={() => setChildOpen(false)}
          >
            <input aria-label="Child field" />
            <Drawer
              open={thirdOpen}
              title="Third"
              onClose={() => setThirdOpen(false)}
            >
              Third content
            </Drawer>
          </Modal>
        </Drawer>
      </ConfigProvider>
    );
  }
  await render(<Scene />);
  const trigger = [...document.querySelectorAll("button")].find(
    (node) => node.textContent === "Open child",
  );
  await act(() => {
    trigger?.focus();
    trigger?.click();
  });
  const third = [...document.querySelectorAll<HTMLElement>(".ant-drawer")].find(
    (node) => node.textContent?.includes("Third content"),
  );
  expect(document.activeElement).toBe(third);
  await act(() =>
    third?.querySelector<HTMLButtonElement>(".ant-drawer-close")?.click(),
  );
  const field = document.querySelector<HTMLInputElement>(
    '[aria-label="Child field"]',
  );
  await act(() => {
    field?.focus();
    field?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
  });
  expect(document.activeElement).toBe(trigger);
});

it("does not prevent the upstream Modal Escape close event", async () => {
  const cancel = vi.fn();
  await render(
    <Modal open getContainer={false} onCancel={cancel}>
      Content
    </Modal>,
  );
  const escapeEvent = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  await act(() => host.querySelector(".ant-modal")?.dispatchEvent(escapeEvent));
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(escapeEvent.defaultPrevented).toBe(false);
});

it("does not lock body for inline or custom-container Modal portals", async () => {
  const previous = document.body.style.overflowY;
  await render(
    <Modal open getContainer={false}>
      Inline
    </Modal>,
  );
  expect(document.body.style.overflowY).toBe(previous);
  const custom = document.createElement("div");
  document.body.append(custom);
  try {
    await render(
      <Modal open getContainer={custom}>
        Custom container
      </Modal>,
    );
    expect(custom.querySelector(".ant-modal")).not.toBeNull();
    expect(document.body.style.overflowY).toBe(previous);
    await render(
      <Modal open mask={false}>
        Body portal
      </Modal>,
    );
    expect(document.body.style.overflowY).toBe("hidden");
  } finally {
    custom.remove();
  }
});

it("keeps zero in context while rc-drawer uses its default root stacking", async () => {
  await render(
    <Drawer open getContainer={false} zIndex={0}>
      <Drawer open>Nested Drawer</Drawer>
    </Drawer>,
  );
  const drawers = document.querySelectorAll<HTMLElement>(".ant-drawer");
  expect(drawers[0].style.zIndex).toBe("");
  expect(drawers[1].style.zIndex).toBe("1100");
});
