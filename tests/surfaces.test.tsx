import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  resolvePanelSizes,
  Splitter,
} from "../packages/antd-octane/src/splitter";
import { Watermark } from "../packages/antd-octane/src/watermark";

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
});
function dimension() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(600);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(300);
}
it("Splitter inspects direct Panels and resizes neighbors with keyboard/minmax", async () => {
  dimension();
  const resized = vi.fn();
  await render(
    <Splitter onResize={resized}>
      <Splitter.Panel defaultSize="40%" min={100} max={300}>
        first
      </Splitter.Panel>
      <Splitter.Panel>second</Splitter.Panel>
      <Splitter.Panel defaultSize={100}>third</Splitter.Panel>
    </Splitter>,
  );
  expect(container.querySelectorAll(".ant-splitter-panel")).toHaveLength(3);
  const handles = container.querySelectorAll("[role=separator]");
  expect(handles).toHaveLength(2);
  expect(handles[0].getAttribute("aria-valuenow")).toBe("40");
  await act(() =>
    handles[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true }),
    ),
  );
  expect(handles[0].getAttribute("aria-valuenow")).toBe("50");
  expect(resized).toHaveBeenLastCalledWith([300, 200, 100]);
  await act(() =>
    handles[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
    ),
  );
  expect(resized).toHaveBeenLastCalledWith([100, 400, 100]);
});
it("controlled sizes reject changes without drift and disabled neighbor blocks resizing", async () => {
  dimension();
  const resized = vi.fn();
  await render(
    <Splitter onResize={resized}>
      <Splitter.Panel size={200}>first</Splitter.Panel>
      <Splitter.Panel size={400}>second</Splitter.Panel>
    </Splitter>,
  );
  const handle = container.querySelector("[role=separator]") as HTMLElement;
  await act(() =>
    handle.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    ),
  );
  expect(resized).toHaveBeenLastCalledWith([210, 390]);
  expect(handle.getAttribute("aria-valuenow")).toBe("33");
  await render(
    <Splitter onResize={resized}>
      <Splitter.Panel resizable={false}>first</Splitter.Panel>
      <Splitter.Panel>second</Splitter.Panel>
    </Splitter>,
  );
  resized.mockClear();
  await act(() =>
    container
      .querySelector("[role=separator]")
      ?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      ),
  );
  expect(resized).not.toHaveBeenCalled();
});
it("vertical pointer resizing cleans document listeners on unmount", async () => {
  dimension();
  const end = vi.fn();
  await render(
    <Splitter layout="vertical" onResizeEnd={end}>
      <Splitter.Panel>first</Splitter.Panel>
      <Splitter.Panel>second</Splitter.Panel>
    </Splitter>,
  );
  const handle = container.querySelector("[role=separator]") as HTMLElement;
  expect(handle.getAttribute("aria-orientation")).toBe("horizontal");
  await act(() =>
    handle.dispatchEvent(
      new PointerEvent("pointerdown", {
        clientY: 100,
        pointerId: 1,
        button: 0,
        bubbles: true,
      }),
    ),
  );
  await act(() =>
    document.dispatchEvent(
      new PointerEvent("pointermove", { clientY: 130, pointerId: 1 }),
    ),
  );
  expect(handle.getAttribute("aria-valuenow")).toBe("60");
  await act(() =>
    document.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 })),
  );
  expect(end).toHaveBeenCalledWith([180, 120]);
  await act(() =>
    handle.dispatchEvent(
      new PointerEvent("pointerdown", {
        clientY: 100,
        pointerId: 1,
        button: 0,
        bubbles: true,
      }),
    ),
  );
  expect(document.body.style.userSelect).toBe("none");
  await act(() => root?.unmount());
  expect(document.body.style.userSelect).toBe("");
});
it("size allocation matches upstream explicit sizes, constrained empty panels and percent inputs", () => {
  expect(
    resolvePanelSizes([{ defaultSize: "25%", min: 100 }, { max: 400 }], 600),
  ).toEqual([150, 400]);
  expect(resolvePanelSizes([{ size: 200 }, {}], 600)).toEqual([200, 400]);
});
it("watermark draws multiline canvas and keeps children interactive", async () => {
  const fillText = vi.fn();
  const rotate = vi.fn();
  const ctx = {
    font: "",
    fillStyle: "",
    textBaseline: "",
    textAlign: "",
    measureText: () => ({
      width: 80,
      fontBoundingBoxAscent: 13,
      fontBoundingBoxDescent: 3,
    }),
    save: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    rotate,
    fillText,
    drawImage: vi.fn(),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
    "data:image/png;base64,test",
  );
  const click = vi.fn();
  await render(
    <Watermark
      className="test-watermark"
      content={["first", "second"]}
      rotate={-30}
      gap={[80, 90]}
      offset={[10, 20]}
    >
      <button type="button" onClick={click}>
        action
      </button>
    </Watermark>,
  );
  expect(fillText).toHaveBeenCalledTimes(2);
  expect(rotate).toHaveBeenCalledWith(-Math.PI / 6);
  expect(
    (container.querySelector(".test-watermark > div") as HTMLElement).style
      .backgroundPosition,
  ).toBe("-30px -25px");
  await act(() => container.querySelector("button")?.click());
  expect(click).toHaveBeenCalledOnce();
});
it("resize observer remeasures split proportions and disconnects", async () => {
  dimension();
  let callback: ResizeObserverCallback | undefined;
  const disconnect = vi.fn();
  const old = globalThis.ResizeObserver;
  globalThis.ResizeObserver = class {
    constructor(fn: ResizeObserverCallback) {
      callback = fn;
    }
    observe() {}
    unobserve() {}
    disconnect = disconnect;
  } as unknown as typeof ResizeObserver;
  try {
    await render(
      <Splitter>
        <Splitter.Panel>one</Splitter.Panel>
        <Splitter.Panel>two</Splitter.Panel>
      </Splitter>,
    );
    expect(
      container
        .querySelector("[role=separator]")
        ?.getAttribute("aria-valuenow"),
    ).toBe("50");
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(800);
    await act(() => callback?.([], {} as ResizeObserver));
    expect(
      container
        .querySelector("[role=separator]")
        ?.getAttribute("aria-valuenow"),
    ).toBe("50");
    await act(() => root?.unmount());
    expect(disconnect).toHaveBeenCalled();
  } finally {
    globalThis.ResizeObserver = old;
  }
});
it("watermark image failures fall back to text and detach image callbacks", async () => {
  const fillText = vi.fn();
  const ctx = {
    font: "",
    fillStyle: "",
    textBaseline: "",
    textAlign: "",
    measureText: () => ({
      width: 80,
      fontBoundingBoxAscent: 13,
      fontBoundingBoxDescent: 3,
    }),
    save: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    fillText,
    drawImage: vi.fn(),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
    "data:image/png;base64,fallback",
  );
  const old = globalThis.Image;
  let image:
    | { onload: (() => void) | null; onerror: (() => void) | null }
    | undefined;
  globalThis.Image = class {
    onload = null;
    onerror = null;
    crossOrigin = "";
    src = "";
    constructor() {
      image = this;
    }
  } as unknown as typeof Image;
  try {
    await render(
      <Watermark
        className="test-watermark"
        image="https://invalid.example/image.png"
        content="fallback"
      />,
    );
    await act(() => image?.onerror?.());
    expect(fillText).toHaveBeenCalledWith(
      "fallback",
      60 * window.devicePixelRatio,
      0,
    );
    expect(container.querySelector(".test-watermark > div")).not.toBeNull();
    await act(() => root?.unmount());
    expect(image?.onerror).toBeNull();
    expect(image?.onload).toBeNull();
  } finally {
    globalThis.Image = old;
  }
});
