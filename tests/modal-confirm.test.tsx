import type { Root } from "octane";
import { act, createRoot, useEffect } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import {
  Modal,
  type ModalFooterRender,
  type ModalInstance,
} from "../packages/antd-octane/src/modal";

let root: Root | undefined;
let container: HTMLDivElement;
let api: ModalInstance;
function Demo() {
  const [instance, holder] = Modal.useModal();
  api = instance;
  return holder;
}
async function setup() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() =>
    root?.render(
      <ConfigProvider prefixCls="local" theme={{ token: { motion: false } }}>
        <Demo />
      </ConfigProvider>,
    ),
  );
}
afterEach(async () => {
  await act(() => {
    Modal.destroyAll();
    root?.unmount();
  });
  await flushStatic();
  root = undefined;
  container?.remove();
  ConfigProvider.config({ theme: {}, holderRender: undefined });
});
it("confirm keeps its actions in the body, preserves falsy title content and context prefix", async () => {
  await setup();
  await act(() => {
    api.confirm({ title: 0, content: "Details" });
  });
  const panel = document.querySelector<HTMLElement>(".local-modal-confirm");
  expect(panel?.querySelector(".local-modal-confirm-title")?.textContent).toBe(
    "0",
  );
  expect(
    panel?.querySelector(".ant-modal-body .local-modal-confirm-btns"),
  ).not.toBeNull();
  expect(panel?.querySelector(".ant-modal-footer")).toBeNull();
  const labelId = panel?.getAttribute("aria-labelledby");
  // Normal Modal titles use truthiness for the accessible header; confirm body keeps zero.
  expect(labelId).toBeNull();
  expect(
    panel
      ?.closest<HTMLElement>(".ant-modal-root")
      ?.style.getPropertyValue("--ao-dialog-z"),
  ).toBe("2000");
});
it("info uses one action and a falsy icon falls back while null hides it", async () => {
  await setup();
  let modal: ReturnType<ModalInstance["info"]>;
  await act(() => {
    modal = api.info({ content: "Info", icon: false });
  });
  expect(
    document.querySelector(".local-modal-confirm-body > .anticon"),
  ).not.toBeNull();
  expect(
    document.querySelectorAll(".local-modal-confirm-btns button"),
  ).toHaveLength(1);
  await act(() => modal.update({ icon: null }));
  expect(
    document.querySelector(".local-modal-confirm-body > .anticon"),
  ).toBeNull();
});
it("confirm footer renderers receive working actions and async confirmation blocks repeats", async () => {
  await setup();
  let finish: () => void = () => {};
  const action = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  let modal!: ReturnType<ModalInstance["confirm"]>;
  const footer: ModalFooterRender = (_origin, { OkBtn }) => (
    <div className="custom-confirm-footer">
      <OkBtn />
    </div>
  );
  await act(() => {
    modal = api.confirm({
      content: "Async",
      onOk: action,
      footer,
    });
  });
  const button = document.querySelector<HTMLButtonElement>(
    ".custom-confirm-footer button",
  );
  await act(() => button?.click());
  expect(document.querySelector(".custom-confirm-footer button")).toBe(button);
  await act(() => button?.click());
  expect(action).toHaveBeenCalledOnce();
  await act(() => finish());
  expect(await modal).toBe(true);
  expect(document.querySelector(".local-modal-confirm")).toBeNull();
});
it("zero-arity handlers receive no close argument and false still closes", async () => {
  await setup();
  const action = vi.fn(() => false);
  let modal!: ReturnType<ModalInstance["confirm"]>;
  await act(() => {
    modal = api.confirm({ onOk: action });
  });
  await act(() =>
    document
      .querySelector<HTMLButtonElement>(
        ".local-modal-confirm-btns button:last-child",
      )
      ?.click(),
  );
  expect(action).toHaveBeenCalledWith();
  expect(await modal).toBe(true);
});
it("callback handlers keep the dialog open until their close callback runs", async () => {
  await setup();
  let close!: (...args: unknown[]) => void;
  let modal!: ReturnType<ModalInstance["confirm"]>;
  const action = vi.fn((callback: typeof close) => {
    close = callback;
    return false;
  });
  await act(() => {
    modal = api.confirm({ onOk: action });
  });
  await act(() =>
    document
      .querySelector<HTMLButtonElement>(
        ".local-modal-confirm-btns button:last-child",
      )
      ?.click(),
  );
  expect(document.querySelector(".local-modal-confirm")).not.toBeNull();
  await act(() => close("payload"));
  expect(await modal).toBe(true);
});
it("Cancel owns its loading state and does not load the OK button", async () => {
  await setup();
  let finish!: () => void;
  let modal!: ReturnType<ModalInstance["confirm"]>;
  await act(() => {
    modal = api.confirm({
      onCancel: () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    });
  });
  const buttons = [
    ...document.querySelectorAll<HTMLButtonElement>(
      ".local-modal-confirm-btns button",
    ),
  ];
  await act(() => buttons[0].click());
  expect(buttons[0].classList.contains("ant-btn-loading")).toBe(true);
  expect(buttons[1].classList.contains("ant-btn-loading")).toBe(false);
  await act(() => finish());
  expect(await modal).toBe(false);
});
it("buttonProps handlers replace the action instead of invoking both", async () => {
  await setup();
  const action = vi.fn(),
    override = vi.fn();
  await act(() => {
    api.confirm({ onOk: action, okButtonProps: { onClick: override } });
  });
  await act(() =>
    document
      .querySelector<HTMLButtonElement>(
        ".local-modal-confirm-btns button:last-child",
      )
      ?.click(),
  );
  expect(override).toHaveBeenCalledOnce();
  expect(action).not.toHaveBeenCalled();
  expect(document.querySelector(".local-modal-confirm")).not.toBeNull();
});
it("hook updates merge function results and authored open cannot close the instance", async () => {
  await setup();
  let modal!: ReturnType<ModalInstance["confirm"]>;
  await act(() => {
    modal = api.confirm({
      title: "Original",
      content: "Retained",
      open: false,
    });
  });
  await act(() => modal.update(() => ({ title: "Updated", open: false })));
  expect(
    document.querySelector(".local-modal-confirm-title")?.textContent,
  ).toBe("Updated");
  expect(
    document.querySelector(".local-modal-confirm-content")?.textContent,
  ).toBe("Retained");
  expect(document.querySelector<HTMLElement>(".local-modal")?.hidden).toBe(
    false,
  );
});
it("destroy does not resolve hook promises, while destroyAll removes hook confirmations", async () => {
  await setup();
  let modal!: ReturnType<ModalInstance["confirm"]>;
  let settled = false;
  await act(() => {
    modal = api.confirm({ afterClose: () => {} });
  });
  void modal.then(() => {
    settled = true;
  });
  await act(() => modal.destroy());
  expect(settled).toBe(false);
  const afterClose = vi.fn();
  await act(() => {
    api.confirm({ afterClose });
  });
  await act(() => Modal.destroyAll());
  expect(document.querySelector(".local-modal")).toBeNull();
  expect(afterClose).not.toHaveBeenCalled();
});
it("await mode suppresses an action rejection and allows another attempt", async () => {
  await setup();
  let reject!: (reason: unknown) => void;
  let finish!: () => void;
  let modal!: ReturnType<ModalInstance["confirm"]>;
  const action = vi.fn(
    () =>
      new Promise<void>((resolve, rejectPromise) => {
        finish = resolve;
        reject = rejectPromise;
      }),
  );
  await act(() => {
    modal = api.confirm({ onOk: action });
  });
  const settled = modal.then((confirmed) => confirmed);
  const button = document.querySelector<HTMLButtonElement>(
    ".local-modal-confirm-btns button:last-child",
  );
  if (!button) throw new Error("Missing confirm button");
  await act(() => button.click());
  await act(() => reject(new Error("retry")));
  expect(button.classList.contains("ant-btn-loading")).toBe(false);
  expect(document.querySelector(".local-modal-confirm")).not.toBeNull();
  await act(() => button.click());
  expect(action).toHaveBeenCalledTimes(2);
  await act(() => finish());
  expect(await settled).toBe(true);
});
async function flushStatic() {
  await act(() => new Promise<void>((resolve) => setTimeout(resolve, 10)));
}
it("static results are not thenable, render asynchronously and coalesce pre-render updates", async () => {
  ConfigProvider.config({ theme: { token: { motion: false } } });
  let modal!: ReturnType<typeof Modal.confirm>;
  await act(() => {
    modal = Modal.confirm({ title: "Initial", open: false });
    modal.update({ title: "Latest" });
    expect(document.querySelector(".ant-modal-confirm")).toBeNull();
  });
  expect("then" in modal).toBe(false);
  await flushStatic();
  expect(document.querySelector(".ant-modal-confirm-title")?.textContent).toBe(
    "Latest",
  );
  await act(() => modal.destroy());
  await flushStatic();
  expect(document.querySelector(".ant-modal-confirm")).toBeNull();
});
it("defers static root unmount beyond the afterClose commit", async () => {
  const events: string[] = [];
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  function Content() {
    useEffect(
      () => () => {
        events.push("unmount");
      },
      [],
    );
    return <p data-static-content>Details</p>;
  }
  ConfigProvider.config({ theme: { token: { motion: false } } });
  try {
    const modal = Modal.confirm({
      content: <Content />,
      afterClose: () => {
        events.push("afterClose");
        expect(
          document.querySelector("[data-static-content]")?.isConnected,
        ).toBe(true);
      },
    });
    await flushStatic();
    await act(() => modal.destroy());
    await flushStatic();
    expect(events).toEqual(["afterClose", "unmount"]);
    expect(document.querySelector(".ant-modal-confirm")).toBeNull();
    expect(error.mock.calls.flat().join(" ")).not.toContain(
      "synchronously unmount a root",
    );
  } finally {
    error.mockRestore();
  }
});
it("static function updates replace config while object updates merge", async () => {
  ConfigProvider.config({ theme: { token: { motion: false } } });
  let modal!: ReturnType<typeof Modal.confirm>;
  await act(() => {
    modal = Modal.confirm({
      title: "Initial",
      content: "Old",
      autoFocusButton: null,
    });
  });
  await flushStatic();
  await act(() => modal.update({ content: "Merged" }));
  await flushStatic();
  expect(document.querySelector(".ant-modal-confirm-title")?.textContent).toBe(
    "Initial",
  );
  const updater = vi.fn((previous) => ({
    ...previous,
    title: undefined,
    content: "Replaced",
  }));
  await act(() => modal.update(updater));
  await flushStatic();
  expect(updater.mock.calls[0][0]).toMatchObject({
    open: true,
    type: "confirm",
    content: "Merged",
    close: expect.any(Function),
  });
  expect(document.querySelector(".ant-modal-confirm-title")).toBeNull();
  expect(
    document.querySelector(".ant-modal-confirm-content")?.textContent,
  ).toBe("Replaced");
  await act(() => modal.destroy());
  await flushStatic();
});
it("static close-button cancellation uses original callbacks after the exit", async () => {
  ConfigProvider.config({ theme: { token: { motion: false } } });
  const events: string[] = [];
  const cancel = vi.fn(() => {
    events.push("cancel:original");
  });
  let modal!: ReturnType<typeof Modal.confirm>;
  await act(() => {
    modal = Modal.confirm({
      title: "Close",
      closable: true,
      onCancel: cancel,
      afterClose: () => {
        events.push("afterClose:original");
      },
    });
  });
  await flushStatic();
  await act(() =>
    modal.update({
      onCancel: () => {
        events.push("cancel:updated");
      },
      afterClose: () => {
        events.push("afterClose:updated");
      },
    }),
  );
  await flushStatic();
  await act(() => {
    document.querySelector<HTMLButtonElement>(".ant-modal-close")?.click();
    expect(events).toEqual([]);
  });
  await flushStatic();
  expect(events).toEqual(["afterClose:original", "cancel:original"]);
  expect(cancel).toHaveBeenCalledWith(expect.any(Function));
});
