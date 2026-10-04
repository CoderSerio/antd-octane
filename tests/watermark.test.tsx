/** @jsxImportSource octane */
import { act, createRoot, type Root, useContext } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { WatermarkProps } from "../packages/antd-octane/src/watermark";
import { Watermark } from "../packages/antd-octane/src/watermark";
import { WatermarkContext } from "../packages/antd-octane/src/watermark/context";

let root: Root;
let container: HTMLDivElement;
let ctx: CanvasRenderingContext2D;
let dataURL: ReturnType<typeof vi.spyOn>;
const props: WatermarkProps = {
  className: "watermark-case",
  content: "Ant Design",
};
async function render(next: WatermarkProps = props) {
  await act(() =>
    root.render(
      <Watermark {...next}>
        <button type="button">Child</button>
      </Watermark>,
    ),
  );
}
const mark = () =>
  container.querySelector<HTMLDivElement>(".watermark-case > div");
const holder = () =>
  container.querySelector<HTMLDivElement>(".watermark-case") as HTMLDivElement;
const settle = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
};
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  ctx = {
    measureText: vi.fn(() => ({
      width: 42.1,
      fontBoundingBoxAscent: 8.2,
      fontBoundingBoxDescent: 2.2,
    })),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    fillText: vi.fn(),
    drawImage: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx);
  dataURL = vi
    .spyOn(HTMLCanvasElement.prototype, "toDataURL")
    .mockReturnValue("data:image/png;base64,watermark");
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});
it("uses only the explicit upstream root properties and class names", async () => {
  await render({
    ...props,
    rootClassName: "root-name",
    ...{ id: "ignored", title: "ignored" },
  });
  expect(holder().className).toBe("watermark-case root-name");
  expect(holder().id).toBe("");
  expect(holder().getAttribute("title")).toBeNull();
  expect(holder().style.position).toBe("relative");
  expect(holder().style.overflow).toBe("hidden");
  expect(mark()?.style.visibility).toBe("visible");
  expect(mark()?.style.getPropertyPriority("visibility")).toBe("important");
});
it("measures font bounding boxes instead of using fontSize as a minimum height", async () => {
  await render({
    ...props,
    content: ["First", "Second"],
    rotate: 0,
    font: { fontSize: 40 },
    gap: [10, 20],
  });
  // ceil(8.2 + 2.2) * 2 + FontGap = 25; width ceil(42.1) = 43.
  expect(ctx.drawImage).toHaveBeenCalledWith(
    expect.any(HTMLCanvasElement),
    (-43 * window.devicePixelRatio) / 2,
    (-25 * window.devicePixelRatio) / 2,
  );
  expect(ctx.fillText).toHaveBeenCalledWith(
    "Second",
    (43 * window.devicePixelRatio) / 2,
    43 * window.devicePixelRatio,
  );
  expect(mark()?.style.backgroundSize).toBe("106px");
});
it("positions positive and negative offsets and defaults missing gap entries", async () => {
  await render({
    ...props,
    rotate: 0,
    gap: [undefined, 40] as unknown as [number, number],
    offset: [80, 10],
  });
  expect(mark()?.style.left).toBe("30px");
  expect(mark()?.style.top).toBe("0px");
  expect(mark()?.style.width).toBe("calc(100% - 30px)");
  expect(mark()?.style.height).toBe("100%");
  expect(mark()?.style.backgroundPosition).toBe("0px -10px");
  expect(mark()?.style.backgroundSize).toBe("286px");
});
it("restores overlay removal, hide attributes and styles without rasterizing again", async () => {
  await render();
  await settle();
  const original = mark();
  original?.remove();
  await settle();
  expect(mark()).toBe(original);
  expect(dataURL).toHaveBeenCalledTimes(1);
  if (original) {
    original.hidden = true;
    original.className = "hidden-watermark";
    original.style.visibility = "hidden";
    original.style.backgroundImage = "none";
  }
  await settle();
  expect(mark()?.hidden).toBe(false);
  expect(mark()?.className).toBe("");
  expect(mark()?.style.visibility).toBe("visible");
  expect(mark()?.style.backgroundImage).toContain("base64,watermark");
  expect(dataURL).toHaveBeenCalledTimes(1);
});
it("restores the declared container position and overflow but leaves other styles alone", async () => {
  await render({
    ...props,
    style: { position: "absolute", overflow: "visible", background: "white" },
  });
  holder().style.position = "fixed";
  holder().style.overflow = "scroll";
  holder().style.background = "red";
  await settle();
  expect(holder().style.position).toBe("absolute");
  expect(holder().style.overflow).toBe("visible");
  expect(holder().style.background).toBe("red");
  await render({ ...props, style: { position: "sticky", overflow: "clip" } });
  holder().style.position = "fixed";
  holder().style.overflow = "scroll";
  await settle();
  expect(holder().style.position).toBe("sticky");
  expect(holder().style.overflow).toBe("clip");
});
it("observes style and class changes as in the upstream mutation observer", async () => {
  await render();
  await settle();
  const original = mark() as HTMLDivElement;
  original.hidden = true;
  await settle();
  expect(original.hidden).toBe(true);
  original.className = "changed";
  await settle();
  expect(original.hidden).toBe(false);
  expect(original.className).toBe("");
});
it("reuses equal content arrays but redraws changed content and fonts", async () => {
  await render({ ...props, content: ["First", "Second"] });
  await settle();
  await render({ ...props, content: ["First", "Second"], zIndex: 12 });
  await settle();
  expect(dataURL).toHaveBeenCalledTimes(1);
  expect(mark()?.style.zIndex).toBe("12");
  await render({ ...props, content: ["New", "Second"] });
  await settle();
  expect(dataURL).toHaveBeenCalledTimes(2);
  await render({
    ...props,
    content: ["New", "Second"],
    font: { color: "red" },
  });
  await settle();
  expect(dataURL).toHaveBeenCalledTimes(3);
});
it("adds and removes inherited holders without forcing their container styles", async () => {
  const panel = document.createElement("div");
  panel.style.position = "absolute";
  panel.style.overflow = "visible";
  document.body.append(panel);
  let api:
    | { add(node: HTMLElement): void; remove(node: HTMLElement): void }
    | undefined;
  function Reader() {
    api = useContext(WatermarkContext);
    return <span>Panel context</span>;
  }
  await act(() =>
    root.render(
      <Watermark {...props}>
        <Reader />
      </Watermark>,
    ),
  );
  await act(() => api?.add(panel));
  expect(panel.children).toHaveLength(1);
  await settle();
  panel.style.position = "fixed";
  panel.style.overflow = "scroll";
  panel.firstElementChild?.remove();
  await settle();
  expect(panel.children).toHaveLength(1);
  expect(panel.style.position).toBe("fixed");
  expect(panel.style.overflow).toBe("scroll");
  await act(() => api?.remove(panel));
  expect(panel.children).toHaveLength(0);
  panel.remove();
});
it("inherit false does not provide an outer watermark to descendants", async () => {
  const panel = document.createElement("div");
  let api: { add(node: HTMLElement): void } | undefined;
  function Reader() {
    api = useContext(WatermarkContext);
    return null;
  }
  await act(() =>
    root.render(
      <Watermark {...props} inherit={false}>
        <Reader />
      </Watermark>,
    ),
  );
  await act(() => api?.add(panel));
  expect(panel.children).toHaveLength(0);
});
