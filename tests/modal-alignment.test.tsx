import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  ConfigProvider,
  Modal,
  type ModalFooterRender,
} from "../packages/antd-octane/src";
import zhCN from "../packages/antd-octane/src/locale/zh_CN";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  if (!root) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  await act(() =>
    root?.render(
      <ConfigProvider theme={{ token: { motion: false } }}>
        {node}
      </ConfigProvider>,
    ),
  );
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
});
const panel = () => document.querySelector<HTMLElement>(".ant-modal");
const close = () =>
  document.querySelector<HTMLButtonElement>(".ant-modal-close");
const buttons = () => [
  ...document.querySelectorAll<HTMLButtonElement>(".ant-modal-footer button"),
];

it("uses the default dimensions, truthy title, source slot structure and ref", async () => {
  const ref = { current: null as HTMLDivElement | null };
  await render(
    <Modal open title="Details" panelRef={ref}>
      Body
    </Modal>,
  );
  expect(ref.current).toBe(panel());
  expect(panel()?.style.width).toBe("520px");
  expect(panel()?.getAttribute("aria-modal")).toBe("true");
  expect(panel()?.hasAttribute("tabindex")).toBe(false);
  expect(panel()?.querySelectorAll("[data-sentinel]")).toHaveLength(2);
  expect(
    close()?.querySelector(".ant-modal-close-x")?.getAttribute("aria-label"),
  ).toBe("Close");
  await render(
    <Modal open title={0} footer={false}>
      Body
    </Modal>,
  );
  expect(document.querySelector(".ant-modal-header")).toBeNull();
  expect(panel()?.hasAttribute("aria-labelledby")).toBe(false);
  expect(document.querySelector(".ant-modal-footer")).not.toBeNull();
});
it("inherits Provider close/centered config but authored props take priority", async () => {
  await render(
    <ConfigProvider modal={{ closable: false, centered: true }}>
      <Modal open />
    </ConfigProvider>,
  );
  expect(close()).toBeNull();
  expect(
    document
      .querySelector(".ant-modal-wrap")
      ?.classList.contains("ant-modal-centered"),
  ).toBe(true);
  await render(
    <ConfigProvider modal={{ closable: false, centered: true }}>
      <Modal open closable centered={false} />
    </ConfigProvider>,
  );
  expect(close()).not.toBeNull();
  expect(document.querySelector(".ant-modal-centered")).toBeNull();
});
it("normalizes null close icons and disables only the authored close config", async () => {
  await render(<Modal open closable closeIcon={null} />);
  expect(close()?.querySelector(".anticon-close")).not.toBeNull();
  await render(<Modal open closable={{ closeIcon: null, disabled: true }} />);
  expect(close()?.childElementCount).toBe(0);
  expect(close()?.disabled).toBe(true);
  await render(
    <ConfigProvider modal={{ closable: { disabled: true } }}>
      <Modal open />
    </ConfigProvider>,
  );
  expect(close()?.disabled).toBe(false);
});
it("applies ARIA and data to the close button and icon wrapper", async () => {
  await render(
    <Modal open closable={{ "aria-label": "Dismiss", closeIcon: "X" }} />,
  );
  expect(close()?.getAttribute("aria-label")).toBe("Dismiss");
  expect(
    close()?.querySelector(".ant-modal-close-x")?.getAttribute("aria-label"),
  ).toBe("Dismiss");
});
it("footer is enabled under disabled Provider and button props override built-in handlers", async () => {
  const ok = vi.fn(),
    cancel = vi.fn(),
    authoredOk = vi.fn(),
    authoredCancel = vi.fn();
  await render(
    <ConfigProvider componentDisabled>
      <Modal
        open
        onOk={ok}
        onCancel={cancel}
        okButtonProps={{ onClick: authoredOk }}
        cancelButtonProps={{ onClick: authoredCancel }}
      />
    </ConfigProvider>,
  );
  expect(buttons().map((button) => button.disabled)).toEqual([false, false]);
  await act(() => {
    buttons()[0].click();
    buttons()[1].click();
  });
  expect(authoredCancel).toHaveBeenCalledOnce();
  expect(authoredOk).toHaveBeenCalledOnce();
  expect(ok).not.toHaveBeenCalled();
  expect(cancel).not.toHaveBeenCalled();
});
it("empty footer texts fall back to locale and functions receive connected action components", async () => {
  const ok = vi.fn();
  await render(
    <ConfigProvider locale={zhCN}>
      <Modal
        open
        okText=""
        cancelText={0}
        onOk={ok}
        footer={(
          _origin: Parameters<ModalFooterRender>[0],
          { CancelBtn, OkBtn }: Parameters<ModalFooterRender>[1],
        ) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      />
    </ConfigProvider>,
  );
  expect(buttons().map((button) => button.textContent)).toEqual([
    "取 消",
    "确 定",
  ]);
  await act(() => buttons()[1].click());
  expect(ok).toHaveBeenCalledOnce();
  await render(<Modal open footer={() => null} />);
  expect(document.querySelector(".ant-modal-footer")?.childElementCount).toBe(
    0,
  );
});
it("loading uses four skeleton rows without title or footer", async () => {
  await render(
    <Modal open loading>
      Content
    </Modal>,
  );
  expect(
    document.querySelectorAll(
      ".ant-modal-body-skeleton .ant-skeleton-paragraph li",
    ),
  ).toHaveLength(4);
  expect(document.querySelector(".ant-skeleton-title")).toBeNull();
  expect(document.querySelector(".ant-modal-footer")).toBeNull();
  expect(document.querySelector(".ant-modal-body")?.textContent).not.toContain(
    "Content",
  );
});
it("width and height override authored panel dimensions; responsive empty maps use auto", async () => {
  await render(
    <Modal open width={400} height={240} style={{ width: 600, height: 300 }} />,
  );
  expect(panel()?.style.width).toBe("400px");
  expect(panel()?.style.height).toBe("240px");
  await render(<Modal open width={{}} />);
  expect(panel()?.style.width).toBe("auto");
  await render(<Modal open width={{ xs: 300 }} />);
  expect(panel()?.style.width).toBe("300px");
  await render(<Modal open width={{ xs: 300 }} style={{ width: 600 }} />);
  expect(panel()?.style.width).toBe("600px");
});
it("bodyProps, maskProps and wrapProps override their complete authored slots", async () => {
  const click = vi.fn();
  await render(
    <Modal
      open
      bodyProps={{
        className: "authored-body",
        style: { padding: 12 },
        onClick: click,
      }}
      maskProps={{ style: { backgroundColor: "red" } }}
      wrapProps={{ className: "authored-wrapper", style: { paddingTop: 40 } }}
    />,
  );
  const body = document.querySelector<HTMLElement>(".authored-body");
  expect(body?.style.padding).toBe("12px");
  await act(() => body?.click());
  expect(click).toHaveBeenCalledOnce();
  expect(
    document.querySelector<HTMLElement>(".ant-modal-mask")?.style
      .backgroundColor,
  ).toBe("red");
  expect(
    document.querySelector<HTMLElement>(".authored-wrapper")?.style.paddingTop,
  ).toBe("40px");
});
it("passes data to the root and wraps modalRender separately from content", async () => {
  await render(
    <Modal
      open
      data-modal="authored"
      prefixCls="local-modal"
      modalRender={(node) => <section>{node}</section>}
    />,
  );
  expect(
    document.querySelector(".local-modal-root")?.getAttribute("data-modal"),
  ).toBe("authored");
  expect(
    document.querySelector(
      ".local-modal-render > section > .local-modal-content",
    ),
  ).not.toBeNull();
  expect(document.querySelector(".local-modal-close-x")).not.toBeNull();
});
it("backdrop closes on click, ignores a press starting inside, and supports no mask", async () => {
  const cancel = vi.fn();
  await render(<Modal open onCancel={cancel} />);
  const wrapper = document.querySelector<HTMLElement>(".ant-modal-wrap");
  await act(() =>
    wrapper?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
  );
  expect(cancel).not.toHaveBeenCalled();
  await act(() => wrapper?.click());
  expect(cancel).toHaveBeenCalledOnce();
  await act(() => {
    panel()?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    wrapper?.click();
  });
  expect(cancel).toHaveBeenCalledTimes(1);
  await render(<Modal open mask={false} onCancel={cancel} />);
  await act(() =>
    document.querySelector<HTMLElement>(".ant-modal-wrap")?.click(),
  );
  expect(cancel).toHaveBeenCalledTimes(2);
});
it("fires afterClose before afterOpenChange(false) with a connected panel", async () => {
  const events: string[] = [];
  const ref = { current: null as HTMLDivElement | null };
  const afterClose = () => events.push(`close:${ref.current?.isConnected}`);
  const afterOpenChange = (open: boolean) =>
    events.push(`open:${open}:${ref.current?.isConnected}`);
  await render(
    <Modal
      open
      panelRef={ref}
      afterClose={afterClose}
      afterOpenChange={afterOpenChange}
      destroyOnHidden
    />,
  );
  await render(
    <Modal
      open={false}
      panelRef={ref}
      afterClose={afterClose}
      afterOpenChange={afterOpenChange}
      destroyOnHidden
    />,
  );
  expect(events).toEqual(["open:true:true", "close:true", "open:false:true"]);
  expect(panel()).toBeNull();
});
it("retains the previous inner content while closed and resumes updating on open", async () => {
  await render(<Modal open>First</Modal>);
  await render(<Modal open={false}>Second</Modal>);
  expect(document.querySelector(".ant-modal-body")?.textContent).toBe("First");
  await render(<Modal open>Third</Modal>);
  expect(document.querySelector(".ant-modal-body")?.textContent).toBe("Third");
});
it("forceRender updates hidden content and preserves dialog ARIA without a mask", async () => {
  await render(
    <Modal forceRender open={false}>
      First
    </Modal>,
  );
  expect(panel()?.style.display).toBe("none");
  await render(
    <Modal forceRender open={false} mask={false}>
      Second
    </Modal>,
  );
  expect(document.querySelector(".ant-modal-body")?.textContent).toBe("Second");
  expect(panel()?.getAttribute("aria-modal")).toBe("true");
});
