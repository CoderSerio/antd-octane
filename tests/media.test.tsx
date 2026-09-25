import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Carousel,
  type CarouselRef,
} from "../packages/antd-octane/src/carousel";
import { Image } from "../packages/antd-octane/src/image";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function button(label: string) {
  const node = document.querySelector<HTMLButtonElement>(
    `button[aria-label="${label}"]`,
  );
  if (!node) throw Error(`Missing ${label}`);
  return node;
}
async function click(label: string) {
  await act(() => button(label).click());
}
it("Image falls back once and preserves native lazy loading", async () => {
  await render(
    <Image src="bad.jpg" fallback="fallback.jpg" alt="图" loading="lazy" />,
  );
  const img = container.querySelector("img");
  if (!img) throw Error("Missing image");
  expect(img.loading).toBe("lazy");
  await act(() => img.dispatchEvent(new Event("error")));
  expect(img.getAttribute("src")).toBe("fallback.jpg");
  await act(() => img.dispatchEvent(new Event("error")));
  expect(img.getAttribute("src")).toBe("fallback.jpg");
});
it("single preview supports zoom bounds, Escape, and restores focus", async () => {
  await render(<Image src="image.svg" alt="山" />);
  await act(() => button("预览：山").focus());
  await click("预览：山");
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  expect(button("缩小图片").disabled).toBe(true);
  await click("放大图片");
  expect(
    document.querySelector<HTMLElement>(".ant-image-preview-img")?.style
      .transform,
  ).toBe("scale(1.5)");
  await act(() =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  expect(
    document.querySelector<HTMLElement>(".ant-image-preview-root")?.hidden,
  ).toBe(true);
  expect(document.activeElement).toBe(button("预览：山"));
});
it("PreviewGroup registers images and moves without reopening the dialog", async () => {
  await render(
    <Image.PreviewGroup>
      <Image src="one.svg" alt="一" />
      <Image src="two.svg" alt="二" />
    </Image.PreviewGroup>,
  );
  await click("预览：一");
  expect(button("上一张图片").disabled).toBe(true);
  await click("下一张图片");
  expect(
    document
      .querySelector<HTMLImageElement>(".ant-image-preview-img")
      ?.getAttribute("src"),
  ).toBe("two.svg");
  expect(button("下一张图片").disabled).toBe(true);
});
it("controlled preview emits close intent without overriding visible", async () => {
  const visible = vi.fn();
  await render(
    <Image
      src="one.svg"
      preview={{ visible: true, onVisibleChange: visible }}
    />,
  );
  await click("关闭图片预览");
  expect(visible).toHaveBeenCalledWith(false);
  expect(
    document.querySelector<HTMLElement>(".ant-image-preview-root")?.hidden,
  ).toBe(false);
});
it("Carousel dots, arrows, ref and inert offscreen slides behave consistently", async () => {
  const ref: { current: CarouselRef | null } = { current: null };
  const before = vi.fn(),
    after = vi.fn();
  await render(
    <Carousel
      ref={ref}
      arrows
      infinite={false}
      speed={0}
      beforeChange={before}
      afterChange={after}
    >
      <div>A</div>
      <div>B</div>
      <div>C</div>
    </Carousel>,
  );
  expect(button("上一张幻灯片").disabled).toBe(true);
  await click("切换至第 3 张幻灯片");
  expect(button("下一张幻灯片").disabled).toBe(true);
  expect(before).toHaveBeenCalledWith(0, 2);
  expect(after).toHaveBeenCalledWith(2);
  expect(container.querySelectorAll(".slick-slide[inert]")).toHaveLength(2);
  await act(() => ref.current?.prev());
  expect(
    container.querySelector(".slick-slide.slick-active")?.textContent,
  ).toBe("B");
  await act(() => ref.current?.goTo(0, true));
  expect(
    container.querySelector(".slick-slide.slick-active")?.textContent,
  ).toBe("A");
});
it("Carousel autoplay pauses by control and respects reduced motion", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  await render(
    <Carousel autoplay autoplaySpeed={1000} speed={0}>
      <div>A</div>
      <div>B</div>
    </Carousel>,
  );
  await act(() => vi.advanceTimersByTime(1000));
  expect(
    container.querySelector(".slick-slide.slick-active")?.textContent,
  ).toBe("B");
  await click("暂停自动播放");
  await act(() => vi.advanceTimersByTime(3000));
  expect(
    container.querySelector(".slick-slide.slick-active")?.textContent,
  ).toBe("B");
  await act(() => root?.unmount());
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  root = createRoot(container);
  await act(() =>
    root?.render(
      <Carousel autoplay autoplaySpeed={1000}>
        <div>A</div>
        <div>B</div>
      </Carousel>,
    ),
  );
  await act(() => vi.advanceTimersByTime(3000));
  expect(
    container.querySelector(".slick-slide.slick-active")?.textContent,
  ).toBe("A");
});
it("Carousel touch swipe moves one slide", async () => {
  await render(
    <Carousel speed={0}>
      <div>A</div>
      <div>B</div>
    </Carousel>,
  );
  const list = container.querySelector(".slick-list");
  if (!list) throw Error("Missing list");
  await act(() =>
    list.dispatchEvent(
      new PointerEvent("pointerdown", {
        button: 0,
        pointerId: 1,
        clientX: 100,
        clientY: 10,
        bubbles: true,
      }),
    ),
  );
  await act(() =>
    list.dispatchEvent(
      new PointerEvent("pointerup", {
        pointerId: 1,
        clientX: 40,
        clientY: 10,
        bubbles: true,
      }),
    ),
  );
  expect(
    container.querySelector(".slick-slide.slick-active")?.textContent,
  ).toBe("B");
});
it("PreviewGroup preserves order when an existing source changes", async () => {
  await render(
    <Image.PreviewGroup>
      <Image src="old.svg" alt="一" />
      <Image src="two.svg" alt="二" />
    </Image.PreviewGroup>,
  );
  await act(() =>
    root?.render(
      <Image.PreviewGroup>
        <Image src="new.svg" alt="一" />
        <Image src="two.svg" alt="二" />
      </Image.PreviewGroup>,
    ),
  );
  await click("预览：一");
  expect(button("上一张图片").disabled).toBe(true);
  expect(
    document
      .querySelector<HTMLImageElement>(".ant-image-preview-img")
      ?.getAttribute("src"),
  ).toBe("new.svg");
  await click("下一张图片");
  expect(
    document
      .querySelector<HTMLImageElement>(".ant-image-preview-img")
      ?.getAttribute("src"),
  ).toBe("two.svg");
});
