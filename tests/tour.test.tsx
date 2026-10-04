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
  await click("Next");
  expect(document.querySelector(".ant-tour-title")?.textContent).toBe("Second");
  expect(change).toHaveBeenLastCalledWith(1);
  await click("Previous");
  expect(change).toHaveBeenLastCalledWith(0);
  await click("Next");
  await click("Finish");
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
  await click("Next");
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
  // rc-tour has no Escape listener; the explicit close control reports intent.
  expect(close).not.toHaveBeenCalled();
  await act(() =>
    document.querySelector<HTMLElement>(".ant-tour-close")?.click(),
  );
  expect(close).toHaveBeenCalledWith(0);
  expect(document.querySelector(".ant-tour")).not.toBeNull();
});

it("custom next handler runs after finishing and missing steps never mount", async () => {
  const order: string[] = [];
  const finish = vi.fn(() => order.push("finish"));
  const handler = vi.fn(() => order.push("button"));
  await render(
    <Tour
      steps={[
        {
          title: "Stay",
          nextButtonProps: { onClick: handler },
        },
      ]}
      onFinish={finish}
    />,
  );
  await click("Finish");
  expect(finish).toHaveBeenCalledOnce();
  expect(handler).toHaveBeenCalledWith();
  expect(order).toEqual(["finish", "button"]);
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
  const spot = document.querySelector<SVGRectElement>(
    ".ant-tour-placeholder-animated",
  );
  expect(spot?.getAttribute("x")).toBe("42");
  expect(spot?.getAttribute("y")).toBe("96");
  expect(spot?.getAttribute("width")).toBe("116");
  top = 150;
  await act(async () => {
    window.dispatchEvent(new Event("scroll"));
    await new Promise((r) => setTimeout(r, 30));
  });
  expect(spot?.getAttribute("y")).toBe("146");
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
  expect(document.querySelector(".ant-tour-placeholder-animated")).toBeNull();
  expect(document.querySelector(".ant-tour-full-mask")).not.toBeNull();
});

it("uses the opposite inset for a narrow popup after measuring its natural size", async () => {
  vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(390);
  vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(
    840,
  );
  const target = document.createElement("div");
  target.dataset.tourTest = "";
  document.body.append(target);
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
    left: 143.8375,
    top: 57.5,
    width: 102.71875,
    height: 32,
    right: 246.55625,
    bottom: 89.5,
  } as DOMRect);
  const original = HTMLElement.prototype.getBoundingClientRect;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      if (!this.classList.contains("ant-tour")) return original.call(this);
      const left = this.style.right === "0px" ? 253 : 0;
      return {
        left,
        top: 0,
        width: 137,
        height: 116,
        right: left + 137,
        bottom: 116,
      } as DOMRect;
    },
  );
  await render(
    <Tour
      steps={[
        { target, title: "Title", description: "Content", placement: "right" },
      ]}
    />,
  );
  const popup = document.querySelector<HTMLElement>(".ant-tour");
  expect(popup?.classList.contains("ant-tour-placement-left")).toBe(true);
  expect(popup?.style.left).toBe("auto");
  expect(popup?.style.right).toBe("265px");
  expect(popup?.style.top).toBe("15px");
});
