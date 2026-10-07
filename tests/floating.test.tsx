import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Floating,
  positionPopup,
  type TooltipRef,
} from "../packages/antd-octane/src/_util/floating";
import getLayoutSize from "../packages/antd-octane/src/_util/getLayoutSize";
import getPopupContainerSize from "../packages/antd-octane/src/_util/getPopupContainerSize";
import {
  ConfigProvider,
  useConfig,
} from "../packages/antd-octane/src/config-provider";
import { Popover } from "../packages/antd-octane/src/popover";
import { Tooltip } from "../packages/antd-octane/src/tooltip";

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
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it("popup layout dimensions preserve fractions and include content-box borders", () => {
  const popup = document.createElement("div");
  document.body.append(popup);
  popup.style.cssText =
    "box-sizing: border-box; width: 87.95px; height: 64px; transform: scale(0.2)";
  vi.spyOn(popup, "offsetWidth", "get").mockReturnValue(88);
  vi.spyOn(popup, "offsetHeight", "get").mockReturnValue(64);
  expect(getLayoutSize(popup)).toEqual({ width: 87.95, height: 64 });
  popup.style.cssText =
    "box-sizing: content-box; width: 80.25px; height: 60.5px; padding: 1.25px 2.5px; border: 1px solid";
  expect(getLayoutSize(popup)).toEqual({ width: 87.25, height: 65 });
  popup.style.cssText = "width: auto; height: auto";
  expect(getLayoutSize(popup)).toEqual({ width: 88, height: 64 });
  popup.remove();
});

it("fixed popup mirrors preserve the fractional containing block and restore styles", () => {
  const popup = document.createElement("div");
  popup.style.cssText =
    "left: auto; right: 27px; top: 295px; transform: scale(0.5)";
  vi.spyOn(popup, "getBoundingClientRect").mockImplementation(
    () =>
      ({
        left: popup.style.left === "0px" ? 0 : 192.8,
        top: popup.style.top === "0px" ? 0 : 684.8,
        right: popup.style.right === "0px" ? 390.4 : 197.6,
        bottom: popup.style.bottom === "0px" ? 844 : 159.2,
      }) as DOMRect,
  );
  expect(getPopupContainerSize(popup)).toEqual({ width: 390.4, height: 844 });
  expect(popup.style.left).toBe("auto");
  expect(popup.style.right).toBe("27px");
  expect(popup.style.top).toBe("295px");
  expect(popup.style.transform).toBe("scale(0.5)");
  expect(popup.style.getPropertyPriority("transform")).toBe("");
});

it("Floating keeps a fractional submenu on the fitting side and floors unscaled insets", async () => {
  const ref: { current: TooltipRef | null } = { current: null };
  await render(
    <Floating
      kind="popover"
      popupStyle={{}}
      open
      arrow={false}
      placement="rightTop"
      align={{
        points: ["tl", "tr"],
        offset: [0, 0],
        overflow: { adjustX: true, adjustY: true },
        htmlRegion: "visible",
      }}
      overlayStyle={{ width: 87.95, height: 64, boxSizing: "border-box" }}
      ref={ref}
      content="submenu"
    >
      <button type="button">Parent item</button>
    </Floating>,
  );
  const popup = ref.current?.popupElement;
  const trigger = container.querySelector("button");
  expect(popup).toBeDefined();
  expect(trigger).not.toBeNull();
  if (!popup || !trigger) return;
  vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(
    1024,
  );
  vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(
    720,
  );
  vi.spyOn(popup, "offsetWidth", "get").mockReturnValue(88);
  vi.spyOn(popup, "offsetHeight", "get").mockReturnValue(64);
  vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
    left: 764.400024,
    top: 232.912506,
    width: 171.600006,
    height: 28,
  } as DOMRect);
  await act(() => ref.current?.forceAlign());
  expect(popup.className).toContain("placement-rightTop");
  expect(popup.style.left).toBe("936px");
  expect(popup.style.top).toBe("232px");
  await render(
    <Floating
      kind="popover"
      popupStyle={{}}
      open
      arrow={false}
      placement="rightTop"
      align={{
        points: ["tr", "tr"],
        offset: [0, 0],
        useCssRight: true,
        useCssBottom: true,
      }}
      overlayStyle={{ width: 87.95, height: 64, boxSizing: "border-box" }}
      ref={ref}
      content="submenu"
    >
      <button type="button">Parent item</button>
    </Floating>,
  );
  await act(() => ref.current?.forceAlign());
  expect(popup.style.right).toBe("87px");
  expect(popup.style.bottom).toBe("423px");
});
function ThemeReader() {
  return <span data-color={useConfig().token.colorPrimary}>context</span>;
}
it("Tooltip uses raw title availability and preserves explicit controlled open", async () => {
  await render(
    <Tooltip open>
      <button type="button">Empty controlled</button>
    </Tooltip>,
  );
  expect(document.querySelector<HTMLElement>(".ant-tooltip")?.hidden).toBe(
    false,
  );
  await render(
    <Tooltip title="Title" overlay="Overlay" open>
      <button type="button">Overlay</button>
    </Tooltip>,
  );
  expect(document.querySelector(".ant-tooltip-inner")?.textContent).toBe(
    "Overlay",
  );
  await render(
    <Tooltip title={0} overlay="Overlay" open>
      <button type="button">Zero</button>
    </Tooltip>,
  );
  expect(document.querySelector(".ant-tooltip-inner")?.textContent).toBe("0");
  const change = vi.fn();
  await render(
    <Tooltip title={() => null} trigger="click" onOpenChange={change}>
      <button type="button">Function title</button>
    </Tooltip>,
  );
  await act(() =>
    container.querySelector<HTMLButtonElement>("button")?.click(),
  );
  expect(change).toHaveBeenCalledWith(true);
  expect(document.querySelector<HTMLElement>(".ant-tooltip")?.hidden).toBe(
    false,
  );
});
it("Tooltip forwards container, align and ref and puts openClassName on the actual trigger", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const ref: { current: TooltipRef | null } = { current: null };
  const onPopupAlign = vi.fn();
  const getTooltipContainer = vi.fn(() => target);
  await render(
    <Tooltip
      title="Aligned"
      open
      forceRender
      ref={ref}
      getTooltipContainer={getTooltipContainer}
      openClassName="custom-open"
      onPopupAlign={onPopupAlign}
      builtinPlacements={{
        top: {
          points: ["bc", "tc"],
          offset: [7, -12],
          overflow: { adjustX: false, adjustY: false },
        },
      }}
    >
      <button type="button" className="original">
        Aligned trigger
      </button>
    </Tooltip>,
  );
  const trigger = container.querySelector<HTMLButtonElement>("button");
  expect(trigger?.classList.contains("custom-open")).toBe(true);
  expect(trigger?.classList.contains("original")).toBe(true);
  expect(getTooltipContainer).toHaveBeenCalledWith(trigger);
  expect(ref.current?.nativeElement).toBe(trigger);
  expect(ref.current?.popupElement).toBe(target.querySelector(".ant-tooltip"));
  expect(onPopupAlign).toHaveBeenCalledWith(
    ref.current?.popupElement,
    expect.objectContaining({ offset: [7, -12] }),
  );
  const calls = onPopupAlign.mock.calls.length;
  await act(() => ref.current?.forceAlign());
  expect(onPopupAlign.mock.calls.length).toBeGreaterThan(calls);
  await act(() => root?.unmount());
  target.remove();
});
it("Popover wireframe and explicit colors retain source text and spacing defaults", async () => {
  await render(
    <ConfigProvider
      theme={{ token: { wireframe: true, colorText: "#123456", lineWidth: 2 } }}
    >
      <Popover title="Title" content="Content" color="yellow" open>
        <button type="button">Wireframe</button>
      </Popover>
    </ConfigProvider>,
  );
  const popup = document.querySelector<HTMLElement>(".ant-popover");
  expect(popup?.style.getPropertyValue("--ao-popup-color")).toBe("#123456");
  expect(popup?.style.getPropertyValue("--ao-popup-padding")).toBe("0px");
  expect(popup?.style.getPropertyValue("--ao-popup-title-gap")).toBe("0px");
  expect(popup?.style.getPropertyValue("--ao-popup-title-border")).toContain(
    "2px solid",
  );
});
it("native portal retains provider context and cleans DOM on unmount", async () => {
  await render(
    <ConfigProvider theme={{ token: { colorPrimary: "#123456" } }}>
      <Popover open title="Title" content={<ThemeReader />}>
        <button type="button">trigger</button>
      </Popover>
    </ConfigProvider>,
  );
  expect(container.querySelector(".ant-popover")).toBeNull();
  expect(
    document.body.querySelector("[data-color]")?.getAttribute("data-color"),
  ).toBe("#123456");
  await act(() => root?.unmount());
  expect(document.body.querySelector(".ant-popover")).toBeNull();
});
it("click keeps original handler and closes outside or Escape", async () => {
  const click = vi.fn();
  await render(
    <Popover
      trigger="click"
      title="Details"
      content={<button type="button">inside</button>}
    >
      <button type="button" onClick={click}>
        open
      </button>
    </Popover>,
  );
  const trigger = container.querySelector("button") as HTMLButtonElement;
  await act(() => trigger.click());
  expect(click).toHaveBeenCalledOnce();
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(document.querySelector(".ant-popover")?.hasAttribute("hidden")).toBe(
    false,
  );
  await act(() =>
    document.querySelector<HTMLButtonElement>(".ant-popover button")?.click(),
  );
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  document.querySelector<HTMLButtonElement>(".ant-popover button")?.focus();
  await act(() =>
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })),
  );
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
  await act(() => trigger.click());
  await act(() =>
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true })),
  );
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
});
it("nested popup portals keep their parent open during child interactions", async () => {
  await render(
    <Popover
      trigger="click"
      content={
        <Popover trigger="click" content={<button type="button">Leaf</button>}>
          <button type="button">Child</button>
        </Popover>
      }
    >
      <button type="button">Parent</button>
    </Popover>,
  );
  const parent = container.querySelector<HTMLButtonElement>("button");
  await act(() => parent?.click());
  const child = document.querySelector<HTMLButtonElement>(
    ".ant-popover button",
  );
  await act(() => child?.click());
  const popups = document.querySelectorAll<HTMLElement>(".ant-popover");
  expect(popups).toHaveLength(2);
  expect(popups[1]?.dataset.aoFloatingParent).toBe(popups[0]?.id);
  const leaf = popups[1]?.querySelector<HTMLButtonElement>("button");
  await act(() => {
    leaf?.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    leaf?.click();
  });
  expect(parent?.getAttribute("aria-expanded")).toBe("true");
  expect(child?.getAttribute("aria-expanded")).toBe("true");
  await act(() =>
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true })),
  );
  expect(parent?.getAttribute("aria-expanded")).toBe("false");
  expect(child?.getAttribute("aria-expanded")).toBe("false");
});

it("controlled open may be rejected and existing descriptions survive", async () => {
  const change = vi.fn();
  await render(
    <Tooltip open={false} trigger="focus" title="help" onOpenChange={change}>
      <button type="button" aria-describedby="existing">
        focus
      </button>
    </Tooltip>,
  );
  await act(() =>
    container
      .querySelector("button")
      ?.dispatchEvent(new FocusEvent("focusin", { bubbles: true })),
  );
  expect(change).toHaveBeenCalledWith(true);
  expect(document.querySelector("[role=tooltip]")).toBeNull();
  await render(
    <Tooltip open title="help">
      <button type="button" aria-describedby="existing">
        focus
      </button>
    </Tooltip>,
  );
  expect(
    container.querySelector("button")?.getAttribute("aria-describedby"),
  ).toContain("existing ao-tooltip-");
  await render(
    <Tooltip open={false} title="help">
      <button type="button" aria-describedby="existing">
        focus
      </button>
    </Tooltip>,
  );
  expect(
    container.querySelector("button")?.getAttribute("aria-describedby"),
  ).toBe("existing");
});
it("hover delays cancel before entry and survive pointer movement to popup", async () => {
  vi.useFakeTimers();
  await render(
    <Tooltip title="help" mouseEnterDelay={0.2} mouseLeaveDelay={0.2}>
      <button type="button">hover</button>
    </Tooltip>,
  );
  const host = container.querySelector("span") as HTMLSpanElement;
  await act(() => host.dispatchEvent(new MouseEvent("mouseenter")));
  await act(() => vi.advanceTimersByTime(100));
  await act(() => host.dispatchEvent(new MouseEvent("mouseleave")));
  await act(() => vi.advanceTimersByTime(250));
  expect(document.querySelector("[role=tooltip]")).toBeNull();
  await act(() => host.dispatchEvent(new MouseEvent("mouseenter")));
  await act(() => vi.advanceTimersByTime(250));
  expect(document.querySelector("[role=tooltip]")).not.toBeNull();
  await act(() => host.dispatchEvent(new MouseEvent("mouseleave")));
  await act(() =>
    document
      .querySelector("[role=tooltip]")
      ?.dispatchEvent(new MouseEvent("mouseenter")),
  );
  await act(() => vi.advanceTimersByTime(250));
  expect(document.querySelector("[role=tooltip]")?.hasAttribute("hidden")).toBe(
    false,
  );
});
it("positions edge variants, flips overflow and clamps viewport", () => {
  const r = { left: 100, top: 100, width: 40, height: 30 };
  const box = { width: 80, height: 40 };
  const viewport = { width: 400, height: 300 };
  expect(positionPopup(r, box, viewport, "topLeft")).toMatchObject({
    x: 100,
    y: 48,
    placement: "topLeft",
  });
  expect(positionPopup(r, box, viewport, "rightBottom")).toMatchObject({
    x: 152,
    y: 90,
    placement: "rightBottom",
  });
  expect(
    positionPopup({ ...r, top: 0, left: 0 }, box, viewport, "topRight"),
  ).toMatchObject({ x: 0, y: 42, placement: "bottomLeft" });
  expect(positionPopup({ ...r, top: 0 }, box, viewport, "top", false).y).toBe(
    -52,
  );
});
it("Dropdown edge alignment keeps the placement with more visible area without shifting", () => {
  const anchor = { left: 884, top: 272.9, width: 20, height: 30 };
  const box = { width: 198, height: 289 };
  const viewport = { width: 1024, height: 576 };
  expect(
    positionPopup(anchor, box, viewport, "bottomRight", true, 4, {
      align: { htmlRegion: undefined },
      scrollRegion: { left: 0, top: -570, width: 1024, height: 1232 },
    }),
  ).toMatchObject({ x: 706, y: 306.9, placement: "bottomRight" });
});
it("keeps the placement offset when shifting a popup against a viewport edge", () => {
  expect(
    positionPopup(
      { left: 137.8375, top: 51.5, width: 114.71875, height: 44 },
      { width: 136.89375, height: 116 },
      { width: 390, height: 840 },
      "right",
      true,
      12,
    ),
  ).toMatchObject({ x: -12, y: 15.5, placement: "left" });
});

it("custom target is used and destroyOnHidden removes content", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const get = () => target;
  await render(
    <Floating
      kind="tooltip"
      popupStyle={{}}
      getPopupContainer={get}
      open
      content="hello"
      destroyOnHidden
    >
      <button type="button">x</button>
    </Floating>,
  );
  expect(target.querySelector("[role=tooltip]")).not.toBeNull();
  await render(
    <Floating
      kind="tooltip"
      popupStyle={{}}
      getPopupContainer={get}
      open={false}
      content="hello"
      destroyOnHidden
    >
      <button type="button">x</button>
    </Floating>,
  );
  expect(
    target.querySelector("[role=tooltip]")?.getAttribute("data-motion-phase"),
  ).toBe("leave");
  await act(() =>
    target.querySelector("[role=tooltip]")?.dispatchEvent(
      Object.assign(new Event("animationend", { bubbles: true }), {
        animationName: "ao-floating-zoom-out",
      }),
    ),
  );
  expect(target.querySelector("[role=tooltip]")).toBeNull();
  target.remove();
});
it("hover-only closes after focused trigger leaves", async () => {
  vi.useFakeTimers();
  await render(
    <Tooltip title="help" mouseEnterDelay={0} mouseLeaveDelay={0.1}>
      <button type="button">hover</button>
    </Tooltip>,
  );
  const host = container.querySelector("span") as HTMLSpanElement;
  await act(() => container.querySelector("button")?.focus());
  await act(() => host.dispatchEvent(new MouseEvent("mouseenter")));
  await act(() => host.dispatchEvent(new MouseEvent("mouseleave")));
  await act(() => vi.advanceTimersByTime(120));
  await act(() =>
    document.querySelector("[role=tooltip]")?.dispatchEvent(
      Object.assign(new Event("animationend", { bubbles: true }), {
        animationName: "ao-floating-zoom-out",
      }),
    ),
  );
  expect(document.querySelector("[role=tooltip]")?.hasAttribute("hidden")).toBe(
    true,
  );
});
it("finishes the initial appear motion after the portal host is resolved", async () => {
  const afterOpenChange = vi.fn();
  await render(
    <Tooltip open title="help" afterOpenChange={afterOpenChange}>
      <button type="button">trigger</button>
    </Tooltip>,
  );
  const popup = document.querySelector("[role=tooltip]");
  expect(popup?.getAttribute("data-motion-phase")).toBe("appear");
  await act(() =>
    popup?.dispatchEvent(
      Object.assign(new Event("animationend", { bubbles: true }), {
        animationName: "ao-floating-zoom-in",
      }),
    ),
  );
  expect(popup?.getAttribute("data-motion-phase")).toBe("idle");
  expect(afterOpenChange).toHaveBeenCalledWith(true);
});
it("pending hover request is invalidated by controlled state changes", async () => {
  vi.useFakeTimers();
  const change = vi.fn();
  await render(
    <Tooltip
      open={false}
      title="help"
      onOpenChange={change}
      mouseEnterDelay={0.2}
    >
      <button type="button">hover</button>
    </Tooltip>,
  );
  await act(() =>
    container
      .querySelector("span")
      ?.dispatchEvent(new MouseEvent("mouseenter")),
  );
  await render(
    <Tooltip open title="help" onOpenChange={change} mouseEnterDelay={0.2}>
      <button type="button">hover</button>
    </Tooltip>,
  );
  await act(() => vi.advanceTimersByTime(250));
  expect(change).not.toHaveBeenCalled();
});
it("resolves all twelve alignments without overflow adjustment", () => {
  const cases = {
    top: [80, 48],
    topLeft: [100, 48],
    topRight: [60, 48],
    bottom: [80, 142],
    bottomLeft: [100, 142],
    bottomRight: [60, 142],
    left: [8, 95],
    leftTop: [8, 100],
    leftBottom: [8, 90],
    right: [152, 95],
    rightTop: [152, 100],
    rightBottom: [152, 90],
  } as const;
  for (const [placement, [x, y]] of Object.entries(cases))
    expect(
      positionPopup(
        { left: 100, top: 100, width: 40, height: 30 },
        { width: 80, height: 40 },
        { width: 400, height: 300 },
        placement as keyof typeof cases,
        false,
      ),
    ).toMatchObject({ x, y, placement });
});
