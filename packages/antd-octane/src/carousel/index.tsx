import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";
import {
  Children,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "octane";
import { useMediaQuery } from "../_util/responsive";
import { useComponentTokens } from "../_util/tokens";
export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void;
  prev: () => void;
  next: () => void;
}
export interface CarouselProps extends HTMLAttributes<HTMLElement> {
  children?: OctaneNode;
  autoplay?: boolean;
  autoplaySpeed?: number;
  speed?: number;
  dots?: boolean;
  arrows?: boolean;
  infinite?: boolean;
  initialSlide?: number;
  beforeChange?: (current: number, next: number) => void;
  afterChange?: (current: number) => void;
  dotPosition?: "top" | "bottom" | "left" | "right";
  vertical?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  ref?: Ref<CarouselRef>;
  style?: CSSProperties;
}
export function Carousel({
  children,
  autoplay = false,
  autoplaySpeed = 3000,
  speed = 500,
  dots = true,
  arrows = false,
  infinite = true,
  initialSlide = 0,
  beforeChange,
  afterChange,
  dotPosition = "bottom",
  vertical = false,
  draggable = true,
  pauseOnHover = true,
  pauseOnFocus = true,
  ref,
  className,
  style,
  ...rest
}: CarouselProps) {
  const { token: t, component: c, base } = useComponentTokens("Carousel");
  const slides = Children.toArray(children).filter(
    (item) => item !== null && item !== undefined && typeof item !== "boolean",
  );
  const total = slides.length;
  const [index, setIndex] = useState(
      Number.isFinite(initialSlide) ? Math.max(0, Math.floor(initialSlide)) : 0,
    ),
    [hover, setHover] = useState(false),
    [focused, setFocused] = useState(false),
    [paused, setPaused] = useState(false),
    [hidden, setHidden] = useState(
      typeof document !== "undefined" && document.hidden,
    ),
    [instant, setInstant] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const current = Math.max(0, Math.min(total - 1, index));
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const go = (next: number, dontAnimate = false) => {
    if (!total) return;
    const destination = infinite
      ? ((Math.floor(next) % total) + total) % total
      : Math.max(0, Math.min(total - 1, Math.floor(next)));
    if (!Number.isFinite(destination) || destination === current) return;
    if (timer.current !== undefined) clearTimeout(timer.current);
    beforeChange?.(current, destination);
    setInstant(dontAnimate);
    setIndex(destination);
    const duration = dontAnimate || reduced ? 0 : Math.max(0, speed);
    if (duration)
      timer.current = setTimeout(() => afterChange?.(destination), duration);
    else afterChange?.(destination);
  };
  useImperativeHandle(
    ref,
    () => ({
      goTo: go,
      prev: () => go(current - 1),
      next: () => go(current + 1),
    }),
    [current, total, infinite, speed, reduced, beforeChange, afterChange],
  );
  useEffect(
    () => () => {
      if (timer.current !== undefined) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (
      !autoplay ||
      paused ||
      hidden ||
      reduced ||
      total < 2 ||
      (pauseOnHover && hover) ||
      (pauseOnFocus && focused)
    )
      return;
    const interval = setInterval(
      () => go(current + 1),
      Math.max(100, autoplaySpeed),
    );
    return () => clearInterval(interval);
  }, [
    autoplay,
    autoplaySpeed,
    paused,
    hidden,
    reduced,
    total,
    pauseOnHover,
    hover,
    pauseOnFocus,
    focused,
    current,
  ]);
  return (
    <section
      {...rest}
      aria-roledescription="轮播"
      aria-label={rest["aria-label"] ?? "图片轮播"}
      className={[
        "ant-carousel",
        vertical && "ant-carousel-vertical",
        `ant-carousel-dots-${dotPosition}`,
        className,
      ]}
      style={{
        ...base,
        "--ao-carousel-dot-width": `${c?.dotWidth ?? 16}px`,
        "--ao-carousel-dot-active-width": `${c?.dotActiveWidth ?? 24}px`,
        "--ao-carousel-dot-height": `${c?.dotHeight ?? 3}px`,
        "--ao-carousel-dot-gap": `${c?.dotGap ?? t.marginXXS}px`,
        "--ao-carousel-arrow-size": `${c?.arrowSize ?? 16}px`,
        "--ao-carousel-arrow-offset": `${c?.arrowOffset ?? t.marginXS}px`,
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (
          !(event.currentTarget as HTMLElement).contains(
            event.relatedTarget as Node | null,
          )
        )
          setFocused(false);
      }}
    >
      <div
        className="slick-list"
        onPointerDown={(event) => {
          if (
            !draggable ||
            event.button !== 0 ||
            (event.target as HTMLElement).closest(
              "button,a,input,select,textarea",
            )
          )
            return;
          drag.current = {
            x: event.clientX,
            y: event.clientY,
            id: event.pointerId,
          };
          (event.currentTarget as HTMLElement).setPointerCapture?.(
            event.pointerId,
          );
        }}
        onPointerUp={(event) => {
          const start = drag.current;
          drag.current = null;
          if (!start || start.id !== event.pointerId) return;
          const distance = vertical
            ? event.clientY - start.y
            : event.clientX - start.x;
          if (Math.abs(distance) > 30) go(current + (distance < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        style={{ touchAction: vertical ? "pan-x" : "pan-y" }}
      >
        <div
          className="slick-track"
          style={{
            transform: vertical
              ? `translateY(-${current * 100}%)`
              : `translateX(-${current * 100}%)`,
            transitionDuration: `${instant || reduced ? 0 : Math.max(0, speed)}ms`,
          }}
        >
          {slides.map((slide, i) => (
            // biome-ignore lint/a11y/useSemanticElements: A slide is an ARIA group, not a form fieldset.
            <div
              key={i}
              className={["slick-slide", current === i && "slick-active"]}
              role="group"
              aria-roledescription="幻灯片"
              aria-label={`${i + 1} / ${total}`}
              aria-hidden={i !== current}
              inert={i !== current}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      {arrows && total > 1 && (
        <>
          <button
            className="slick-prev"
            type="button"
            aria-label="上一张幻灯片"
            disabled={!infinite && current === 0}
            onClick={() => go(current - 1)}
          >
            ‹
          </button>
          <button
            className="slick-next"
            type="button"
            aria-label="下一张幻灯片"
            disabled={!infinite && current === total - 1}
            onClick={() => go(current + 1)}
          >
            ›
          </button>
        </>
      )}
      {dots && total > 1 && (
        <ul className="slick-dots">
          {slides.map((_, i) => (
            <li key={i} className={current === i ? "slick-active" : undefined}>
              <button
                type="button"
                aria-label={`切换至第 ${i + 1} 张幻灯片`}
                aria-current={current === i ? "true" : undefined}
                onClick={() => go(i)}
              />
            </li>
          ))}
        </ul>
      )}
      {autoplay && (
        <button
          className="ant-carousel-pause"
          type="button"
          aria-label={paused ? "继续自动播放" : "暂停自动播放"}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? "播放" : "暂停"}
        </button>
      )}
    </section>
  );
}
