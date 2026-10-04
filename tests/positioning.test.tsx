import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Affix, type AffixRef } from "../packages/antd-octane/src/affix";
import { Anchor } from "../packages/antd-octane/src/anchor";
import { FloatButton } from "../packages/antd-octane/src/float-button";

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
  document.querySelectorAll("[data-position-target]").forEach((n) => {
    n.remove();
  });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function target() {
  const node = document.createElement("div");
  node.dataset.positionTarget = "";
  document.body.append(node);
  return node;
}
it("Affix pins to custom target, preserves placeholder and restores on scrolling back", async () => {
  const scroll = target();
  vi.spyOn(scroll, "getBoundingClientRect").mockReturnValue({
    top: 100,
    bottom: 400,
  } as DOMRect);
  const ref = { current: null as AffixRef | null },
    change = vi.fn();
  await render(
    <Affix ref={ref} target={() => scroll} offsetTop={10} onChange={change}>
      <button type="button">fixed</button>
    </Affix>,
  );
  const holder = container.firstElementChild as HTMLElement,
    content = holder.firstElementChild as HTMLElement;
  let top = 80;
  vi.spyOn(holder, "getBoundingClientRect").mockImplementation(
    () =>
      ({ top, bottom: top + 32, width: 100, height: 32, left: 20 }) as DOMRect,
  );
  vi.spyOn(content, "getBoundingClientRect").mockReturnValue({
    height: 32,
  } as DOMRect);
  await act(async () => {
    ref.current?.updatePosition();
    await new Promise(requestAnimationFrame);
  });
  expect(content.style.top).toBe("110px");
  expect(
    holder.querySelector<HTMLElement>('[aria-hidden="true"]')?.style.height,
  ).toBe("32px");
  top = 130;
  await act(async () => {
    ref.current?.updatePosition();
    await new Promise(requestAnimationFrame);
  });
  expect(content.style.position).toBe("");
  expect(change).toHaveBeenLastCalledWith(false);
});
it("Affix unregisters target scroll and resize observers", async () => {
  const scroll = target();
  const remove = vi.spyOn(scroll, "removeEventListener"),
    disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect = disconnect;
    },
  );
  await render(<Affix target={() => scroll}>content</Affix>);
  await act(() => root?.unmount());
  root = undefined;
  expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
  expect(disconnect).toHaveBeenCalledOnce();
});
it("Anchor tracks custom scroll positions and scrolls clicked links with targetOffset", async () => {
  const scroll = target(),
    section = document.createElement("section");
  section.id = "position-two";
  scroll.append(section);
  vi.spyOn(scroll, "getBoundingClientRect").mockReturnValue({
    top: 100,
  } as DOMRect);
  vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
    top: 115,
  } as DOMRect);
  const move = vi.spyOn(scroll, "scrollTo");
  const change = vi.fn();
  await render(
    <Anchor
      affix={false}
      getContainer={() => scroll}
      targetOffset={20}
      items={[{ key: "two", href: "#position-two", title: "Second" }]}
      onChange={change}
    />,
  );
  expect(container.querySelector("a")?.getAttribute("aria-current")).toBe(
    "location",
  );
  await act(() => container.querySelector("a")?.click());
  expect(move).toHaveBeenCalledWith({ top: -5, behavior: "smooth" });
  expect(change).toHaveBeenCalledWith("#position-two");
});
it("Anchor onClick can prevent navigation, getCurrentAnchor customizes selection", async () => {
  const scroll = target(),
    section = document.createElement("section");
  section.id = "position-custom";
  scroll.append(section);
  const move = vi.spyOn(scroll, "scrollTo");
  await render(
    <Anchor
      affix={false}
      getContainer={() => scroll}
      getCurrentAnchor={() => "#position-custom"}
      onClick={(e) => e.preventDefault()}
      items={[{ key: 1, href: "#position-custom", title: "custom" }]}
    />,
  );
  await act(() => container.querySelector("a")?.click());
  expect(move).not.toHaveBeenCalled();
  expect(container.querySelector("a")?.getAttribute("aria-current")).toBe(
    "location",
  );
});
it("FloatButton group expands by button, Escape collapses and controlled state is respected", async () => {
  const change = vi.fn();
  await render(
    <FloatButton.Group trigger="click" onOpenChange={change}>
      <FloatButton aria-label="child" />
    </FloatButton.Group>,
  );
  const toggle = container.querySelector<HTMLButtonElement>(
    ".ant-float-btn-group-trigger",
  );
  await act(() => toggle?.click());
  expect(container.querySelector('[aria-label="child"]')).not.toBeNull();
  expect(toggle?.getAttribute("aria-expanded")).toBe("true");
  await act(() =>
    toggle?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  expect(container.querySelector('[aria-label="child"]')).toBeNull();
  expect(change).toHaveBeenLastCalledWith(false);
  await render(
    <FloatButton.Group trigger="click" open={false} onOpenChange={change}>
      <FloatButton aria-label="child" />
    </FloatButton.Group>,
  );
  await act(() =>
    container
      .querySelector<HTMLButtonElement>(".ant-float-btn-group-trigger")
      ?.click(),
  );
  expect(container.querySelector('[aria-label="child"]')).toBeNull();
});
it("FloatButton group composes user click and toggle and respects preventDefault", async () => {
  const click = vi.fn(),
    change = vi.fn();
  await render(
    <FloatButton.Group trigger="click" onClick={click} onOpenChange={change}>
      <FloatButton aria-label="composed child" />
    </FloatButton.Group>,
  );
  await act(() =>
    container
      .querySelector<HTMLButtonElement>(".ant-float-btn-group-trigger")
      ?.click(),
  );
  expect(click).toHaveBeenCalledTimes(1);
  expect(change).toHaveBeenCalledExactlyOnceWith(true);
  expect(
    container.querySelector('[aria-label="composed child"]'),
  ).not.toBeNull();

  click.mockImplementation((event: MouseEvent) => event.preventDefault());
  change.mockClear();
  await act(() =>
    container
      .querySelector<HTMLButtonElement>(".ant-float-btn-group-trigger")
      ?.click(),
  );
  expect(click).toHaveBeenCalledTimes(2);
  expect(change).not.toHaveBeenCalled();
  expect(
    container.querySelector('[aria-label="composed child"]'),
  ).not.toBeNull();
});
it("BackTop visibility threshold, target scrolling and cleanup", async () => {
  const scroll = target();
  scroll.scrollTop = 500;
  const move = vi.spyOn(scroll, "scrollTo"),
    remove = vi.spyOn(scroll, "removeEventListener");
  const callbacks: FrameRequestCallback[] = [];
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    callbacks.push(cb);
    return callbacks.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  await render(
    <FloatButton.BackTop
      target={() => scroll}
      duration={0}
      visibilityHeight={100}
    />,
  );
  await act(() => container.querySelector("button")?.click());
  await act(() => callbacks.at(-1)?.(performance.now()));
  expect(move).toHaveBeenCalledWith(0, 0);
  scroll.scrollTop = 0;
  await act(() => scroll.dispatchEvent(new Event("scroll")));
  expect(container.querySelector("button")).toBeNull();
  await act(() => root?.unmount());
  root = undefined;
  expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
});
