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
  await act(() => button("Preview: 山").focus());
  await click("Preview: 山");
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  expect(button("缩小图片").disabled).toBe(true);
  await click("放大图片");
  expect(
    document.querySelector<HTMLElement>(".ant-image-preview-img")?.style
      .transform,
  ).toContain("scale3d(1.5, 1.5, 1)");
  await act(() =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 350));
  });
  expect(
    document.querySelector<HTMLElement>(
      ".ant-image-preview-root .ao-dialog-wrap",
    )?.style.display,
  ).toBe("none");
  expect(document.activeElement).toBe(button("Preview: 山"));
  expect(
    document.querySelector(".ant-image-preview-root .ao-dialog-mask"),
  ).toBeNull();
  await click("Preview: 山");
  expect(
    document.querySelector<HTMLElement>(
      ".ant-image-preview-root .ao-dialog-wrap",
    )?.style.display,
  ).not.toBe("none");
  expect(button("关闭图片预览")).not.toBeNull();
});

it("PreviewGroup registers images and moves without reopening the dialog", async () => {
  await render(
    <Image.PreviewGroup>
      <Image src="one.svg" alt="一" />
      <Image src="two.svg" alt="二" />
    </Image.PreviewGroup>,
  );
  await click("Preview: 一");
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
  expect(visible).toHaveBeenCalledWith(false, true);
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

it("Carousel goTo without animation still completes after navigating grouped slides", async () => {
  vi.useFakeTimers();
  const ref: { current: CarouselRef | null } = { current: null };
  const before = vi.fn();
  const after = vi.fn();
  await render(
    <Carousel
      ref={ref}
      slidesToShow={2}
      slidesToScroll={2}
      infinite={false}
      speed={160}
      beforeChange={before}
      afterChange={after}
    >
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div key={index}>{index}</div>
      ))}
    </Carousel>,
  );
  // antd's initial count/initialSlide effect calls slickGoTo(0).
  expect(before).toHaveBeenCalledWith(0, 0);
  await act(() => vi.advanceTimersByTime(160));
  for (const [method, expected] of [
    ["next", 2],
    ["next", 4],
    ["prev", 2],
  ] as const) {
    await act(() => ref.current?.[method]());
    await act(() => vi.advanceTimersByTime(160));
    expect(after).toHaveBeenLastCalledWith(expected);
  }
  before.mockClear();
  after.mockClear();
  await act(() => ref.current?.goTo(0, true));
  const track = container.querySelector<HTMLElement>(".slick-track");
  expect(track?.style.transition).toBe("");
  expect(ref.current?.innerSlider.state.currentSlide).toBe(0);
  expect(
    container
      .querySelector(".slick-current:not(.slick-cloned)")
      ?.getAttribute("data-index"),
  ).toBe("0");
  expect(before).toHaveBeenCalledExactlyOnceWith(2, 0);
  expect(after).not.toHaveBeenCalled();
  await act(() => vi.advanceTimersByTime(159));
  expect(after).not.toHaveBeenCalled();
  await act(() => vi.advanceTimersByTime(1));
  expect(after).toHaveBeenCalledExactlyOnceWith(0);
  expect(track?.style.transition).toBe("");
});

it("Carousel resize cancels completion timers while later instant navigation still completes", async () => {
  vi.useFakeTimers();
  let notifyResize: (() => void) | undefined;
  const observe = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        notifyResize = callback;
      }
      observe = observe;
      disconnect() {}
    },
  );
  const ref: { current: CarouselRef | null } = { current: null };
  const before = vi.fn();
  const after = vi.fn();
  await render(
    <Carousel
      ref={ref}
      slidesToShow={2}
      slidesToScroll={2}
      infinite={false}
      speed={160}
      beforeChange={before}
      afterChange={after}
    >
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div key={index}>{index}</div>
      ))}
    </Carousel>,
  );
  expect(before).toHaveBeenCalledWith(0, 0);
  expect(ref.current?.innerSlider.state.animating).toBe(true);
  await act(() => notifyResize?.());
  await act(() => vi.advanceTimersByTime(49));
  expect(ref.current?.innerSlider.state.animating).toBe(true);
  await act(() => vi.advanceTimersByTime(1));
  expect(ref.current?.innerSlider.state.animating).toBe(false);
  await act(() => vi.advanceTimersByTime(160));
  expect(after).not.toHaveBeenCalled();

  await act(() => ref.current?.next());
  expect(ref.current?.innerSlider.state.currentSlide).toBe(2);
  await act(() => notifyResize?.());
  await act(() => vi.advanceTimersByTime(210));
  expect(ref.current?.innerSlider.state.animating).toBe(false);
  expect(after).not.toHaveBeenCalled();
  // Observing each newly active slide would cancel every ordinary transition.
  expect(observe).toHaveBeenCalledExactlyOnceWith(
    ref.current?.innerSlider.list,
  );

  before.mockClear();
  await act(() => ref.current?.goTo(0, true));
  expect(
    container.querySelector<HTMLElement>(".slick-track")?.style.transition,
  ).toBe("");
  expect(before).toHaveBeenCalledExactlyOnceWith(2, 0);
  await act(() => vi.advanceTimersByTime(160));
  expect(after).toHaveBeenCalledExactlyOnceWith(0);

  after.mockClear();
  await act(() => ref.current?.next());
  await act(() => window.dispatchEvent(new Event("resize")));
  await act(() => vi.advanceTimersByTime(50));
  expect(ref.current?.innerSlider.state.animating).toBe(false);
  expect(
    container.querySelector<HTMLElement>(".slick-track")?.style.transition,
  ).toBe("");
  await act(() => vi.advanceTimersByTime(110));
  expect(after).not.toHaveBeenCalled();
});

it("Carousel autoplay uses slick timing and can pause through innerSlider ref", async () => {
  const ref: { current: CarouselRef | null } = { current: null };
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  await render(
    <Carousel ref={ref} autoplay autoplaySpeed={1000} speed={0}>
      <div>A</div>
      <div>B</div>
    </Carousel>,
  );
  // react-slick uses autoplaySpeed + 50ms in the antd 5 baseline.
  await act(() => vi.advanceTimersByTime(1050));
  expect(
    container.querySelector(".slick-slide.slick-active")?.textContent,
  ).toBe("B");
  await act(() => ref.current?.innerSlider.pause("paused"));
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
      <Carousel autoplay autoplaySpeed={1000} speed={0}>
        <div>A</div>
        <div>B</div>
      </Carousel>,
    ),
  );
  // The upstream slider does not suppress autoplay for reduced motion.
  await act(() => vi.advanceTimersByTime(1050));
  expect(
    container.querySelector(".slick-slide.slick-active")?.textContent,
  ).toBe("B");
});

it("Carousel touch swipe moves one slide", async () => {
  await render(
    <Carousel speed={0} draggable>
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
  await click("Preview: 一");
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
