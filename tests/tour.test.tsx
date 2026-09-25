import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Tour } from "../packages/antd-octane/src/tour";

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
async function click(text: string) {
  const button = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".ant-tour button"),
  ).find((n) => n.textContent === text);
  expect(button).toBeTruthy();
  await act(() => button?.click());
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
  document.querySelectorAll("[data-tour-test]").forEach((n) => {
    n.remove();
  });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it("steps advance and finish closes uncontrolled tour, previous goes back", async () => {
  const change = vi.fn(),
    finish = vi.fn();
  await render(
    <Tour
      steps={[{ title: "First" }, { title: "Second" }]}
      onChange={change}
      onFinish={finish}
    />,
  );
  await click("下一步");
  expect(document.querySelector(".ant-tour-title")?.textContent).toBe("Second");
  expect(change).toHaveBeenLastCalledWith(1);
  await click("上一步");
  expect(change).toHaveBeenLastCalledWith(0);
  await click("下一步");
  await click("完成");
  expect(finish).toHaveBeenCalledOnce();
  expect(document.querySelector(".ant-tour")).toBeNull();
  expect(document.body.style.overflow).toBe("");
});
it("controlled state reports changes without advancing or closing itself", async () => {
  const change = vi.fn(),
    close = vi.fn();
  await render(
    <Tour
      open
      current={0}
      steps={[{ title: "One" }, { title: "Two" }]}
      onChange={change}
      onClose={close}
    />,
  );
  await click("下一步");
  expect(change).toHaveBeenCalledWith(1);
  expect(document.querySelector(".ant-tour-title")?.textContent).toBe("One");
  await act(() =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(close).toHaveBeenCalledWith(0);
  expect(document.querySelector(".ant-tour")).not.toBeNull();
});
it("custom next handler can cancel transition and missing steps never mount", async () => {
  const finish = vi.fn();
  await render(
    <Tour
      steps={[
        {
          title: "Stay",
          nextButtonProps: { onClick: (e) => e.preventDefault() },
        },
      ]}
      onFinish={finish}
    />,
  );
  await click("完成");
  expect(finish).not.toHaveBeenCalled();
  await render(<Tour steps={[]} />);
  expect(document.querySelector(".ant-tour")).toBeNull();
});
it("tracks target gap geometry, scroll updates and cleans observers", async () => {
  const target = document.createElement("div");
  target.dataset.tourTest = "";
  document.body.append(target);
  let top = 100;
  vi.spyOn(target, "getBoundingClientRect").mockImplementation(
    () =>
      ({
        left: 50,
        top,
        width: 100,
        height: 30,
        right: 150,
        bottom: top + 30,
      }) as DOMRect,
  );
  const disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect = disconnect;
    },
  );
  await render(
    <Tour
      gap={{ offset: [8, 4] }}
      steps={[{ target: () => target, title: "Target" }]}
    />,
  );
  await act(async () => {
    await new Promise((r) => setTimeout(r, 30));
  });
  const spot = document.querySelector<HTMLElement>(".ant-tour-spotlight");
  expect(spot?.style.left).toBe("42px");
  expect(spot?.style.top).toBe("96px");
  expect(spot?.style.width).toBe("116px");
  top = 150;
  await act(async () => {
    window.dispatchEvent(new Event("scroll"));
    await new Promise((r) => setTimeout(r, 30));
  });
  expect(spot?.style.top).toBe("146px");
  await act(() => root?.unmount());
  root = undefined;
  expect(disconnect).toHaveBeenCalled();
});
it("scrolls offscreen targets into view and centers missing targets without scrolling", async () => {
  const target = document.createElement("div");
  target.dataset.tourTest = "";
  document.body.append(target);
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
    left: 10,
    top: 2000,
    width: 40,
    height: 30,
    right: 50,
    bottom: 2030,
  } as DOMRect);
  const scroll = vi.spyOn(target, "scrollIntoView");
  await render(
    <Tour
      steps={[{ title: "Outside", target }]}
      scrollIntoViewOptions={{ block: "nearest" }}
    />,
  );
  expect(scroll).toHaveBeenCalledWith({ block: "nearest" });
  await render(<Tour steps={[{ title: "No target", target: () => null }]} />);
  await act(async () => {
    await new Promise((r) => setTimeout(r, 30));
  });
  expect(document.querySelector(".ant-tour-spotlight")).toBeNull();
  expect(document.querySelector(".ant-tour-full-mask")).not.toBeNull();
});
