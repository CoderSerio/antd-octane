/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import {
  Children,
  cloneElement,
  createElement,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "octane";
import cssSize from "../_util/css-size";
import { useComponentTokens } from "../_util/tokens";
import { useConfig } from "../config-provider";
import Arrow from "./Arrows";
import Dots from "./Dots";
import { defaultProps } from "./default-props";
import Track from "./Track";
import type {
  CarouselProps,
  CarouselRef,
  SlideSpec,
  SwipeDirection,
} from "./types";
import useResponsive from "./useResponsive";
import {
  canGoNext,
  changeSlide,
  checkNavigable,
  clamp,
  getPostClones,
  getPreClones,
  getSwipeDirection,
  lazySlides,
  modulo,
  positiveInteger,
  selectSlide,
  slideDestination,
} from "./utils";

interface DragState {
  x: number;
  y: number;
  id: number;
  scrolling: boolean;
  swiped: boolean;
  edgeDragged: boolean;
  distance: number;
  direction: SwipeDirection;
}

/** Row grouping follows react-slick's Slider; each group becomes one slide. */
function groupSlides(
  children: OctaneNode[],
  rows: number,
  perRow: number,
  variableWidth: boolean,
) {
  const slides: OctaneNode[] = [];
  for (let i = 0; i < children.length; i += rows * perRow) {
    const content: OctaneNode[] = [];
    let width: CSSProperties["width"];
    for (let j = i; j < i + rows * perRow; j += perRow) {
      const row: OctaneNode[] = [];
      for (let k = j; k < Math.min(children.length, j + perRow); k++) {
        const child = children[k];
        if (isValidElement<{ style?: CSSProperties }>(child)) {
          if (variableWidth) width = child.props.style?.width;
          row.push(
            cloneElement(child, {
              key: k,
              tabIndex: -1,
              style: { width: `${100 / perRow}%`, display: "inline-block" },
            }),
          );
        } else
          row.push(
            createElement(
              "div",
              {
                key: k,
                style: { width: `${100 / perRow}%`, display: "inline-block" },
              },
              child,
            ),
          );
      }
      content.push(createElement("div", { key: j }, row));
    }
    slides.push(
      createElement(
        "div",
        { key: i, style: variableWidth ? { width } : undefined },
        content,
      ),
    );
  }
  return slides;
}

export default function InnerSlider(props: CarouselProps) {
  const context = useConfig();
  const responsive = useResponsive(props.responsive);
  const settings = {
    ...defaultProps,
    ...props,
    fade: props.effect === "fade" || Boolean(props.fade),
    ...(responsive === "unslick" ? {} : responsive),
  };
  const {
    accessibility = true,
    adaptiveHeight = false,
    afterChange,
    appendDots,
    arrows = false,
    asNavFor,
    autoplay = false,
    autoplaySpeed = 3000,
    beforeChange,
    centerMode = false,
    centerPadding = "50px",
    children,
    className,
    cssEase = "ease",
    customPaging,
    dotPosition = "bottom",
    dots = true,
    draggable = false,
    edgeFriction = 0.35,
    fade = false,
    focusOnSelect = false,
    id,
    infinite = true,
    initialSlide = 0,
    lazyLoad,
    nextArrow,
    onEdge,
    onInit,
    onLazyLoad,
    onLazyLoadError,
    onReInit,
    onSwipe,
    pauseOnDotsHover = false,
    pauseOnFocus = false,
    pauseOnHover = true,
    prevArrow,
    ref,
    rootClassName,
    rtl,
    slickGoTo,
    speed = 500,
    style,
    swipe = true,
    swipeEvent,
    swipeToSlide = false,
    touchMove = true,
    touchThreshold = 5,
    useCSS = true,
    useTransform = true,
    vertical = dotPosition === "left" || dotPosition === "right",
    waitForAnimate = false,
  } = settings;
  const { token: t, component: c, base } = useComponentTokens("Carousel");
  const prefixCls = context.getPrefixCls("carousel", props.prefixCls);
  const isRTL = (rtl ?? context.direction === "rtl") && !vertical;
  const fadeEffect = fade;
  const rows = positiveInteger(settings.rows ?? 1);
  const perRow = positiveInteger(settings.slidesPerRow ?? 1);
  const variableWidth = Boolean(
    settings.variableWidth && rows === 1 && perRow === 1 && !vertical,
  );
  const slidesToShow = fadeEffect
    ? 1
    : positiveInteger(settings.slidesToShow ?? 1);
  const slidesToScroll =
    fadeEffect || centerMode
      ? 1
      : positiveInteger(settings.slidesToScroll ?? 1);
  const rawSlides = Children.toArray(children).filter((item) =>
    typeof item === "string"
      ? Boolean(item.trim())
      : item !== null && item !== undefined && item !== false,
  );
  const slides = groupSlides(rawSlides, rows, perRow, variableWidth);
  const total = slides.length;
  const unslick =
    responsive === "unslick" || (!infinite && total <= slidesToShow);
  const initial = Number.isFinite(initialSlide) ? Math.floor(initialSlide) : 0;
  const [position, setPosition] = useState(() => ({
    current: isRTL ? Math.max(0, total - initial - 1) : initial,
    animation: isRTL ? Math.max(0, total - initial - 1) : initial,
    target: isRTL ? Math.max(0, total - initial - 1) : initial,
    instant: true,
  }));
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    adaptiveHeight: 0,
    widths: [] as number[],
  });
  const [dragOffset, setDragOffset] = useState(0);
  const [resizeTrackStyle, setResizeTrackStyle] = useState<CSSProperties>();
  const [autoplaying, setAutoplaying] = useState<
    "playing" | "paused" | "hovered" | "focused"
  >("playing");
  const [forcePlay, setForcePlay] = useState(false);
  const [lazyLoadedList, setLazyLoadedList] = useState<number[]>([]);
  const list = useRef<HTMLDivElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const animating = useRef(false);
  const drag = useRef<DragState | null>(null);
  const clickAllowed = useRef(true);
  const live = useRef({ current: position.current, target: position.target });
  live.current = { current: position.current, target: position.target };
  const loaded = useRef(lazyLoadedList);
  loaded.current = lazyLoadedList;
  const spec: SlideSpec = {
    slideCount: total,
    slidesToShow,
    slidesToScroll,
    currentSlide: position.current,
    targetSlide: position.target,
    infinite,
    centerMode,
    centerPadding,
    variableWidth,
    fade: fadeEffect,
    rtl: isRTL,
    unslick,
  };
  const getSpec = () => ({
    ...spec,
    currentSlide: live.current.current,
    targetSlide: live.current.target,
  });
  const loadSlides = (indexes: number[]) => {
    if (!lazyLoad) return;
    const fresh = indexes.filter((index) => !loaded.current.includes(index));
    if (!fresh.length) return;
    loaded.current = [...loaded.current, ...fresh];
    setLazyLoadedList(loaded.current);
    onLazyLoad?.(fresh);
  };
  const go = (next: number, dontAnimate = false, syncing = false) => {
    if (
      !total ||
      !Number.isFinite(next) ||
      (waitForAnimate && animating.current)
    )
      return;
    const nextIndex = Math.floor(next);
    const currentSpec = getSpec();
    if (fadeEffect && !infinite && (nextIndex < 0 || nextIndex >= total))
      return;
    const destination = slideDestination(currentSpec, nextIndex);
    const interrupted = timer.current !== undefined;
    if (interrupted) clearTimeout(timer.current);
    beforeChange?.(live.current.current, destination.currentSlide);
    if (interrupted && !waitForAnimate) afterChange?.(live.current.current);
    // slick retains its completion timer even when useCSS is disabled by
    // dontAnimate. Only the movement is immediate; afterChange still runs.
    const duration = Math.max(0, speed);
    live.current = {
      current: destination.currentSlide,
      target: infinite ? nextIndex : clamp(nextIndex, 0, total - 1),
    };
    loadSlides(lazySlides(currentSpec, destination.animationSlide));
    animating.current =
      duration > 0 && (fadeEffect || (useCSS && !dontAnimate));
    setResizeTrackStyle(undefined);
    setDragOffset(0);
    setPosition({
      current: destination.currentSlide,
      animation:
        dontAnimate || !useCSS
          ? destination.currentSlide
          : destination.animationSlide,
      target: live.current.target,
      instant: dontAnimate || !useCSS || duration === 0,
    });
    if (!syncing)
      asNavFor?.innerSlider.slideHandler(nextIndex, dontAnimate, true);
    const finish = () => {
      timer.current = undefined;
      animating.current = false;
      setPosition((previous) => ({
        ...previous,
        animation: destination.currentSlide,
        instant: true,
      }));
      afterChange?.(destination.currentSlide);
    };
    if (duration) timer.current = setTimeout(finish, duration);
    else finish();
  };
  const navigate = (direction: "next" | "previous") =>
    go(changeSlide(getSpec(), direction));
  const pause = (type: "paused" | "hovered" | "focused" = "paused") => {
    setAutoplaying((previous) =>
      type === "paused" ||
      (type === "focused" &&
        (previous === "hovered" || previous === "playing")) ||
      (type === "hovered" && previous === "playing")
        ? type
        : previous,
    );
  };
  const play = (type?: "update" | "leave" | "blur" | "play") => {
    setForcePlay(true);
    setAutoplaying((previous) => {
      if (type === "update" && previous !== "playing") return previous;
      if (type === "leave" && (previous === "paused" || previous === "focused"))
        return previous;
      if (type === "blur" && (previous === "paused" || previous === "hovered"))
        return previous;
      return "playing";
    });
  };
  const actions = useRef({ go, navigate, play, pause, total, speed, autoplay });
  actions.current = { go, navigate, play, pause, total, speed, autoplay };
  useImperativeHandle(
    ref,
    (): CarouselRef => ({
      goTo: (slide, dontAnimate) =>
        actions.current.go(Number(slide), dontAnimate),
      prev: () => actions.current.navigate("previous"),
      next: () => actions.current.navigate("next"),
      autoPlay: (type) => actions.current.play(type),
      innerSlider: {
        get list() {
          return list.current;
        },
        track: {
          get node() {
            return track.current;
          },
        },
        get state() {
          return {
            currentSlide: live.current.current,
            slideCount: actions.current.total,
            animating: animating.current,
          };
        },
        autoPlay: (type) => actions.current.play(type),
        pause: (type) => actions.current.pause(type),
        slickGoTo: (slide, dontAnimate) =>
          actions.current.go(Number(slide), dontAnimate),
        slickPrev: () => actions.current.navigate("previous"),
        slickNext: () => actions.current.navigate("next"),
        slideHandler: (slide, dontAnimate, syncing) =>
          actions.current.go(slide, dontAnimate, syncing),
      },
    }),
    [],
  );
  useEffect(
    () => () => {
      if (timer.current !== undefined) clearTimeout(timer.current);
    },
    [],
  );
  useLayoutEffect(() => {
    onInit?.();
  }, []);
  useEffect(() => {
    if (!total) return;
    const next = isRTL ? total - initial - 1 : initial;
    go(next, false);
  }, [total, initialSlide, isRTL]);
  useEffect(() => {
    if (slickGoTo !== undefined) go(slickGoTo);
  }, [slickGoTo]);
  useEffect(() => {
    loadSlides(lazySlides(getSpec()));
  }, [position.current, slidesToShow, centerMode, centerPadding, lazyLoad]);
  useEffect(() => {
    if (lazyLoad !== "progressive") return;
    const interval = setInterval(() => {
      const currentSpec = getSpec();
      const preCount = getPreClones(currentSpec);
      const indexes = Array.from(
        { length: total + preCount + getPostClones(currentSpec) },
        (_, index) => index - preCount,
      );
      const forward = indexes.find(
        (index) =>
          index >= live.current.current && !loaded.current.includes(index),
      );
      const backward = indexes
        .reverse()
        .find(
          (index) =>
            index < live.current.current && !loaded.current.includes(index),
        );
      const pending = [forward, backward].filter(
        (index): index is number => index !== undefined,
      );
      if (pending.length) loadSlides(pending);
      else clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [lazyLoad, total]);
  useEffect(() => {
    if (
      (!autoplay && !forcePlay) ||
      autoplaying !== "playing" ||
      unslick ||
      total <= 1
    )
      return;
    const interval = setInterval(() => {
      const currentSpec = getSpec();
      if (isRTL) go(currentSpec.currentSlide - slidesToScroll);
      else if (canGoNext(currentSpec))
        go(currentSpec.currentSlide + slidesToScroll);
    }, Math.max(0, autoplaySpeed) + 50);
    return () => clearInterval(interval);
  }, [
    autoplay,
    forcePlay,
    autoplaying,
    autoplaySpeed,
    unslick,
    total,
    isRTL,
    slidesToScroll,
    position.current,
    waitForAnimate,
    speed,
  ]);
  const priorAutoplay = useRef(Boolean(autoplay));
  useEffect(() => {
    if (priorAutoplay.current !== Boolean(autoplay)) {
      priorAutoplay.current = Boolean(autoplay);
      setForcePlay(false);
      setAutoplaying(autoplay ? "playing" : "paused");
    }
  }, [Boolean(autoplay)]);
  const measure = () => {
    const node = list.current;
    if (!node) return;
    const originals = Array.from(
      node.querySelectorAll<HTMLElement>(".slick-slide:not(.slick-cloned)"),
    );
    const first = originals.find((slide) => slide.dataset.index === "0");
    const active = originals.find((slide) =>
      slide.classList.contains("slick-current"),
    );
    const next = {
      // slick's getWidth/getHeight use layout dimensions (offsetWidth /
      // offsetHeight), not fractional bounding rectangles or transforms.
      width: Math.ceil(node.offsetWidth),
      height: first?.offsetHeight ?? 0,
      adaptiveHeight: active?.offsetHeight ?? 0,
      widths: originals
        .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index))
        .map((slide) => slide.offsetWidth),
    };
    setSize((previous) =>
      previous.width === next.width &&
      previous.height === next.height &&
      previous.adaptiveHeight === next.adaptiveHeight &&
      previous.widths.join() === next.widths.join()
        ? previous
        : next,
    );
  };
  useLayoutEffect(() => {
    measure();
  }, [
    total,
    position.current,
    adaptiveHeight,
    slidesToShow,
    variableWidth,
    vertical,
    children,
  ]);
  useLayoutEffect(() => {
    const node = list.current;
    if (!node) return;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const followUps = new Set<ReturnType<typeof setTimeout>>();
    const onWindowResized = (setTrackStyle = true) => {
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = undefined;
        const trackNode = track.current;
        if (!trackNode) return;
        if (setTrackStyle) {
          setResizeTrackStyle(undefined);
          setPosition((previous) => ({
            ...previous,
            animation: previous.current,
            instant: true,
          }));
        } else {
          // slick updates measured sizes during an animation without replacing
          // trackStyle; its deferred resize later places the canonical slide.
          setResizeTrackStyle({
            width: trackNode.style.width,
            height: trackNode.style.height,
            transform: trackNode.style.transform,
            left: trackNode.style.left,
            top: trackNode.style.top,
            transition: trackNode.style.transition,
          });
        }
        measure();
        animating.current = false;
        if (timer.current !== undefined) clearTimeout(timer.current);
        timer.current = undefined;
        if (actions.current.autoplay) actions.current.play("update");
        else actions.current.pause("paused");
      }, 50);
    };
    const observedResize = () => {
      if (animating.current) {
        onWindowResized(false);
        const followUp = setTimeout(
          () => {
            followUps.delete(followUp);
            onWindowResized();
          },
          Math.max(0, actions.current.speed),
        );
        followUps.add(followUp);
      } else onWindowResized();
    };
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(observedResize);
    observer?.observe(node);
    const windowResize = () => onWindowResized();
    window.addEventListener("resize", windowResize);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", windowResize);
      if (resizeTimer !== undefined) clearTimeout(resizeTimer);
      for (const followUp of followUps) clearTimeout(followUp);
    };
  }, [responsive === "unslick"]);
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) onReInit?.();
    else didInit.current = true;
  });
  useLayoutEffect(() => {
    if (focusOnSelect)
      list.current
        ?.querySelector<HTMLElement>(".slick-current:not(.slick-cloned)")
        ?.focus();
  }, [position.current, focusOnSelect]);
  const pre = getPreClones(spec);
  const count = total + pre + getPostClones(spec);
  const padding = centerMode
    ? Number.parseFloat(centerPadding) *
      (centerPadding.endsWith("%") ? size.width / 100 : 1)
    : 0;
  const slideWidth = vertical
    ? size.width
    : Math.ceil((size.width - padding * 2) / slidesToShow);
  const fallbackWidth = `${100 / Math.max(1, count)}%`;
  let cloneOffset = isRTL ? getPostClones(spec) : pre;
  if (
    !isRTL &&
    !variableWidth &&
    infinite &&
    total % slidesToScroll !== 0 &&
    position.animation + slidesToScroll > total
  ) {
    cloneOffset =
      position.animation > total
        ? slidesToShow - (position.animation - total)
        : total % slidesToScroll;
  }
  const physicalIndex = position.animation + cloneOffset;
  let offset = -(physicalIndex * (vertical ? size.height : slideWidth));
  if (centerMode)
    offset +=
      Math.floor(slidesToShow / 2) * (vertical ? size.height : slideWidth);
  if (variableWidth) {
    const ordered = Array.from({ length: count }, (_, index) =>
      modulo(index - pre, total),
    );
    if (isRTL) ordered.reverse();
    offset = -ordered
      .slice(0, physicalIndex)
      .reduce((sum, index) => sum + (size.widths[index] ?? 0), 0);
    if (centerMode)
      offset +=
        (size.width - (size.widths[ordered[physicalIndex]] ?? 0)) / 2 - padding;
  }
  offset += dragOffset;
  // Slick's CSS track/fade transitions consume cssEase; easing belongs to the
  // separate JavaScript animation setting and must not replace this default.
  const transitionEase = cssEase;
  const duration =
    position.instant || drag.current || !useCSS ? 0 : Math.max(0, speed);
  const trackStyle: CSSProperties = {
    width: vertical
      ? slideWidth || "100%"
      : variableWidth
        ? Array.from(
            { length: count },
            (_, index) => size.widths[modulo(index - pre, total)] ?? 0,
          ).reduce((sum, width) => sum + width, 0) || undefined
        : slideWidth
          ? slideWidth * count
          : `${(100 * count) / slidesToShow}%`,
    height: vertical ? size.height * count : undefined,
    transform:
      fadeEffect || !useTransform
        ? undefined
        : size.width
          ? vertical
            ? `translate3d(0, ${offset}px, 0)`
            : `translate3d(${offset}px, 0, 0)`
          : `translate3d(calc(-${physicalIndex} * ${fallbackWidth}), 0, 0)`,
    left: !fadeEffect && !useTransform && !vertical ? offset : undefined,
    top: !fadeEffect && !useTransform && vertical ? offset : undefined,
    transition:
      !fadeEffect && useCSS && duration > 0
        ? `${useTransform ? "transform" : vertical ? "top" : "left"} ${duration}ms ${transitionEase}`
        : "",
  };
  const startDrag = (event: PointerEvent) => {
    if (
      !swipe ||
      !touchMove ||
      unslick ||
      event.button !== 0 ||
      (event.pointerType === "mouse" && !draggable)
    )
      return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
      scrolling: false,
      swiped: false,
      edgeDragged: false,
      distance: 0,
      direction: "left",
    };
    clickAllowed.current = true;
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  };
  const moveDrag = (event: PointerEvent) => {
    const start = drag.current;
    if (!start || start.id !== event.pointerId || animating.current) return;
    const dx = event.clientX - start.x,
      dy = event.clientY - start.y;
    if (!vertical && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
      start.scrolling = true;
      return;
    }
    if (start.scrolling) return;
    start.direction = getSwipeDirection(
      start.x,
      start.y,
      event.clientX,
      event.clientY,
      vertical,
    );
    start.distance = vertical ? dy : dx;
    const direction = start.direction;
    let delta = start.distance;
    const currentSpec = getSpec();
    const atEdge =
      !infinite &&
      ((currentSpec.currentSlide === 0 &&
        (direction === "right" || direction === "down")) ||
        (!canGoNext(currentSpec) &&
          (direction === "left" || direction === "up")));
    if (atEdge) {
      delta *= edgeFriction;
      if (!start.edgeDragged) {
        start.edgeDragged = true;
        onEdge?.(direction);
      }
    }
    if (!start.swiped && Math.abs(delta) > 0) {
      start.swiped = true;
      swipeEvent?.(direction);
    }
    if (Math.abs(start.distance) > 10) {
      event.preventDefault();
      clickAllowed.current = false;
    }
    setDragOffset(delta);
  };
  const endDrag = (event: PointerEvent) => {
    const start = drag.current;
    drag.current = null;
    if (!start || start.id !== event.pointerId) return;
    setDragOffset(0);
    if (start.scrolling) return;
    const distance =
      start.distance ||
      (vertical ? event.clientY - start.y : event.clientX - start.x);
    const direction = getSwipeDirection(
      start.x,
      start.y,
      event.clientX,
      event.clientY,
      vertical,
    );
    const threshold =
      (vertical ? size.height * slidesToShow : size.width) /
        Math.max(1, touchThreshold) || 30;
    if (Math.abs(distance) <= threshold || direction === "vertical") return;
    event.preventDefault();
    clickAllowed.current = false;
    onSwipe?.(direction);
    let step = swipeToSlide
      ? Math.max(
          1,
          Math.round(
            Math.abs(distance) / ((vertical ? size.height : slideWidth) || 1),
          ),
        )
      : slidesToScroll;
    if (swipeToSlide && size.width) {
      // Use slide geometry rather than assuming equal widths, as slick does.
      const swipeLeft = offset - dragOffset + distance;
      const centerOffset = centerMode
        ? slideWidth * Math.floor(slidesToShow / 2)
        : 0;
      const targetSlide = Array.from(
        list.current?.querySelectorAll<HTMLElement>(".slick-slide") ?? [],
      ).find((slide) =>
        vertical
          ? slide.offsetTop + slide.offsetHeight / 2 > -swipeLeft
          : slide.offsetLeft - centerOffset + slide.offsetWidth / 2 >
            -swipeLeft,
      );
      step = targetSlide
        ? Math.abs(
            Number(targetSlide.dataset.index) -
              (isRTL ? total - live.current.current : live.current.current),
          ) || 1
        : 0;
    }
    if (direction === "right" || direction === "down") step = -step;
    const target = live.current.current + step;
    go(swipeToSlide ? checkNavigable(getSpec(), target) : target);
  };
  const componentStyle = { ...context.carousel?.style, ...style };
  const outerStyle = {
    ...base,
    color: t.colorText,
    fontFamily: t.fontFamily,
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    "--ao-carousel-dot-width": cssSize(c?.dotWidth ?? 16),
    "--ao-carousel-dot-active-width": cssSize(
      c?.dotActiveWidth ?? c?.dotWidthActive ?? 24,
    ),
    "--ao-carousel-dot-height": cssSize(c?.dotHeight ?? 3),
    "--ao-carousel-dot-gap": `${c?.dotGap ?? t.marginXXS}px`,
    "--ao-carousel-vertical-gap": `${t.marginXXS}px`,
    "--ao-carousel-dot-offset": `${c?.dotOffset ?? 12}px`,
    "--ao-carousel-arrow-size": `${c?.arrowSize ?? 16}px`,
    "--ao-carousel-arrow-offset": `${c?.arrowOffset ?? t.marginXS}px`,
    "--ao-carousel-motion-duration": t.motionDurationSlow,
    "--ao-carousel-autoplay-speed": `${autoplaySpeed}ms`,
    "--dot-duration":
      autoplay && typeof autoplay === "object" && autoplay.dotDuration
        ? `${autoplaySpeed}ms`
        : undefined,
  };
  if (responsive === "unslick")
    return (
      <div
        id={id}
        className={[
          prefixCls !== "ant-carousel" && prefixCls,
          "ant-carousel",
          rootClassName,
        ]}
        style={outerStyle}
      >
        <div
          className={["regular slider", context.carousel?.className, className]}
          style={componentStyle}
        >
          {rawSlides}
        </div>
      </div>
    );
  const showDots = Boolean(dots) && total >= slidesToShow && !unslick;
  return (
    <div
      id={id}
      className={[
        prefixCls !== "ant-carousel" && prefixCls,
        "ant-carousel",
        rootClassName,
        isRTL && `${prefixCls}-rtl`,
        isRTL && prefixCls !== "ant-carousel" && "ant-carousel-rtl",
        vertical && `${prefixCls}-vertical`,
        vertical && prefixCls !== "ant-carousel" && "ant-carousel-vertical",
        fadeEffect && "ant-carousel-fade",
        adaptiveHeight && "ant-carousel-adaptive-height",
        autoplay &&
          typeof autoplay === "object" &&
          autoplay.dotDuration &&
          "ant-carousel-dot-duration",
        `ant-carousel-dots-${dotPosition}`,
      ]}
      style={outerStyle}
    >
      <div
        className={[
          "slick-slider",
          "slick-initialized",
          showDots && "slick-dotted",
          vertical && "slick-vertical",
          context.carousel?.className,
          className,
        ]}
        dir="ltr"
        style={componentStyle}
      >
        {arrows && !unslick && (
          <Arrow
            spec={spec}
            direction="previous"
            arrow={prevArrow}
            onSelect={navigate}
          />
        )}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: The viewport handles swipe and keyboard navigation for its slide descendants. */}
        <div
          ref={list}
          className={["slick-list", drag.current && "dragging"]}
          style={{
            height: vertical
              ? size.height * slidesToShow || undefined
              : adaptiveHeight
                ? size.adaptiveHeight || undefined
                : undefined,
            padding: centerMode
              ? vertical
                ? `${centerPadding} 0px`
                : `0px ${centerPadding}`
              : undefined,
            transition: adaptiveHeight
              ? `height ${speed}ms ${transitionEase}`
              : undefined,
            touchAction: vertical ? "pan-x" : "pan-y",
          }}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={() => {
            drag.current = null;
            setDragOffset(0);
          }}
          onClickCapture={(event) => {
            if (!clickAllowed.current) {
              event.preventDefault();
              event.stopPropagation();
              clickAllowed.current = true;
            }
          }}
          onKeyDown={(event) => {
            if (
              !accessibility ||
              /TEXTAREA|INPUT|SELECT/.test(
                (event.target as HTMLElement).tagName,
              )
            )
              return;
            if (event.key === "ArrowLeft")
              navigate(isRTL ? "next" : "previous");
            if (event.key === "ArrowRight")
              navigate(isRTL ? "previous" : "next");
          }}
        >
          <Track
            spec={spec}
            slides={slides}
            slideWidth={slideWidth || fallbackWidth}
            slideHeight={size.height}
            lazyLoadedList={lazyLoadedList}
            lazyLoad={lazyLoad}
            useCSS={useCSS}
            speed={speed}
            cssEase={transitionEase}
            vertical={vertical}
            instant={position.instant}
            trackStyle={resizeTrackStyle ?? trackStyle}
            ref={track}
            onSelect={
              focusOnSelect
                ? (index) =>
                    go(
                      selectSlide(getSpec(), isRTL ? total - 1 - index : index),
                    )
                : undefined
            }
            onMouseEnter={
              pauseOnHover && autoplay ? () => pause("hovered") : undefined
            }
            onMouseLeave={
              pauseOnHover && autoplay ? () => play("leave") : undefined
            }
            onFocus={
              pauseOnFocus && autoplay ? () => pause("focused") : undefined
            }
            onBlur={
              pauseOnFocus && autoplay
                ? (event) => {
                    if (
                      !(event.currentTarget as HTMLElement).contains(
                        event.relatedTarget as Node | null,
                      )
                    )
                      play("blur");
                  }
                : undefined
            }
            onImageError={onLazyLoadError}
          />
        </div>
        {arrows && !unslick && (
          <Arrow
            spec={spec}
            direction="next"
            arrow={nextArrow}
            onSelect={navigate}
          />
        )}
        {showDots && (
          <Dots
            spec={spec}
            position={dotPosition}
            className={typeof dots === "object" ? dots.className : undefined}
            dotsClass={responsive?.dotsClass}
            customPaging={customPaging}
            appendDots={appendDots}
            onSelect={go}
            onMouseEnter={
              pauseOnDotsHover && autoplay ? () => pause("hovered") : undefined
            }
            onMouseLeave={
              pauseOnDotsHover && autoplay ? () => play("leave") : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
