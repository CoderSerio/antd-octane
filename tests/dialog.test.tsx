import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Button } from "../packages/antd-octane/src/button";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { Drawer } from "../packages/antd-octane/src/drawer";
import { Dropdown } from "../packages/antd-octane/src/dropdown";
import { Modal } from "../packages/antd-octane/src/modal";

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
  document.querySelectorAll("[data-test-target]").forEach((n) => {
    n.remove();
  });
});
async function key(key: string, shiftKey = false) {
  await act(() =>
    document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        shiftKey,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
}
function dialog() {
  const node = document.querySelector<HTMLElement>('[role="dialog"]');
  if (!node) throw Error("Missing dialog");
  return node;
}
it("portals preserve context, wrap Tab at sentinels, close with Escape and restore trigger focus", async () => {
  function Demo() {
    const [open, setOpen] = useState(false);
    return (
      <ConfigProvider theme={{ token: { colorPrimary: "#123456" } }}>
        <button type="button" onClick={() => setOpen(true)}>
          open
        </button>
        <Modal open={open} title="Details" onCancel={() => setOpen(false)}>
          <Button>content</Button>
        </Modal>
      </ConfigProvider>
    );
  }
  await render(<Demo />);
  const trigger = container.querySelector("button");
  await act(() => {
    trigger?.focus();
    trigger?.click();
  });
  expect(
    dialog().parentElement?.closest(".ant-modal-root")?.parentElement,
  ).toBe(document.body);
  expect(dialog().querySelector(".ant-btn")?.getAttribute("style")).toContain(
    "#123456",
  );
  expect(document.body.style.overflowY).toBe("hidden");
  const start = dialog().querySelector<HTMLElement>('[data-sentinel="start"]');
  const end = dialog().querySelector<HTMLElement>('[data-sentinel="end"]');
  await act(() => end?.focus());
  await key("Tab");
  expect(document.activeElement).toBe(start);
  await key("Tab", true);
  expect(document.activeElement).toBe(end);
  await key("Escape");
  expect(
    document.querySelector<HTMLElement>(".ant-modal-wrap")?.style.display,
  ).toBe("none");
  expect(document.activeElement).toBe(trigger);
  expect(document.body.style.overflowY).not.toBe("hidden");
});
it("only the topmost dialog handles Escape and nested locks survive one closure", async () => {
  const outer = vi.fn(),
    inner = vi.fn();
  await render(
    <Modal open title="outer" onCancel={outer}>
      <Drawer open title="inner" onClose={inner}>
        nested
      </Drawer>
    </Modal>,
  );
  await key("Escape");
  expect(inner).toHaveBeenCalledOnce();
  expect(outer).not.toHaveBeenCalled();
  await render(
    <Modal open title="outer" onCancel={outer}>
      <Drawer open={false} title="inner" onClose={inner} />
    </Modal>,
  );
  expect(document.body.style.overflowY).toBe("hidden");
  await key("Escape");
  expect(outer).toHaveBeenCalledOnce();
  await act(() => root?.unmount());
  root = undefined;
  expect(document.body.style.overflowY).not.toBe("hidden");
});
it("preserves children while closed and destroys on request", async () => {
  await render(
    <Modal open title="retain">
      <input defaultValue="initial" />
    </Modal>,
  );
  const field = dialog().querySelector("input");
  if (!field) throw Error("Missing input");
  field.value = "changed";
  await render(
    <Modal open={false} title="retain">
      <input defaultValue="initial" />
    </Modal>,
  );
  expect(document.querySelector(".ant-modal input")).toBe(field);
  await render(
    <Modal open title="retain">
      <input defaultValue="initial" />
    </Modal>,
  );
  expect(field.value).toBe("changed");
  await render(
    <Modal open={false} destroyOnHidden title="retain">
      <input />
    </Modal>,
  );
  expect(document.querySelector(".ant-modal input")).toBeNull();
});
it("mask and keyboard switches respect controlled dismissal without mutating open", async () => {
  const close = vi.fn();
  await render(
    <Modal open onCancel={close} keyboard={false} maskClosable={false}>
      body
    </Modal>,
  );
  await key("Escape");
  await act(() =>
    document
      .querySelector(".ao-dialog-wrap")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true })),
  );
  expect(close).not.toHaveBeenCalled();
  await render(
    <Modal open onCancel={close}>
      body
    </Modal>,
  );
  await act(() =>
    document
      .querySelector(".ao-dialog-wrap")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true })),
  );
  expect(close).toHaveBeenCalledOnce();
  expect(
    document.querySelector(".ant-modal-root")?.hasAttribute("hidden"),
  ).toBe(false);
});
it("confirm loading blocks repeated confirmations and footer=null removes actions", async () => {
  const ok = vi.fn();
  await render(
    <Modal open confirmLoading onOk={ok}>
      body
    </Modal>,
  );
  const button = [...dialog().querySelectorAll("button")].find((n) =>
    n.textContent?.includes("确定"),
  );
  await act(() => button?.click());
  expect(ok).not.toHaveBeenCalled();
  await render(
    <Modal open footer={null}>
      body
    </Modal>,
  );
  expect(dialog().querySelector(".ant-modal-footer")).toBeNull();
});
it("supports inline containers, Drawer placement and lifecycle callbacks", async () => {
  const changed = vi.fn();
  await render(
    <Drawer
      open
      getContainer={false}
      placement="bottom"
      height={240}
      title="local"
      afterOpenChange={changed}
    >
      body
    </Drawer>,
  );
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  expect(dialog().parentElement?.style.height).toBe("240px");
  expect(changed).toHaveBeenCalledWith(true);
  await render(
    <Drawer open={false} getContainer={false} afterOpenChange={changed} />,
  );
  expect(changed).toHaveBeenLastCalledWith(false);
});
it("allows focus inside an owned Dropdown portal and Escape closes it before Modal", async () => {
  const cancel = vi.fn();
  await render(
    <Modal open title="With menu" onCancel={cancel}>
      <Dropdown
        trigger={["click"]}
        menu={{
          items: [
            { key: "edit", label: "Edit" },
            { key: "remove", label: "Remove" },
          ],
        }}
      >
        <button type="button">Actions</button>
      </Dropdown>
    </Modal>,
  );
  const trigger = [...dialog().querySelectorAll("button")].find(
    (n) => n.textContent === "Actions",
  );
  await act(() => trigger?.click());
  const item = document.querySelector<HTMLElement>('[role="menuitem"]');
  if (!item) throw Error("Missing dropdown item");
  await act(() => item.focus());
  expect(document.activeElement).toBe(item);
  await key("Escape");
  expect(cancel).not.toHaveBeenCalled();
  expect(
    document.querySelector('[role="menuitem"]')?.closest("[hidden]"),
  ).not.toBeNull();
  expect(document.activeElement).toBe(trigger);
  await key("Escape");
  expect(cancel).toHaveBeenCalledOnce();
});
it("unmounting nested dialogs restores existing body styles and releases document handlers", async () => {
  const overflow = document.body.style.overflow,
    padding = document.body.style.paddingRight;
  document.body.style.overflow = "scroll";
  document.body.style.paddingRight = "7px";
  const close = vi.fn();
  await render(
    <Modal open onCancel={close}>
      <Drawer open onClose={close}>
        nested
      </Drawer>
    </Modal>,
  );
  expect(document.body.style.overflowY).toBe("hidden");
  await act(() => root?.unmount());
  root = undefined;
  expect(document.body.style.overflow).toBe("scroll");
  expect(document.body.style.paddingRight).toBe("7px");
  await act(() =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  expect(close).not.toHaveBeenCalled();
  document.body.style.overflow = overflow;
  document.body.style.paddingRight = padding;
});
