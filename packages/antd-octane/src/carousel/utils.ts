import type { SlideSpec, SwipeDirection } from "./types";

// Navigation and cloning follow react-slick's innerSliderUtils (MIT).
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
export const modulo = (value: number, count: number) =>
  count ? ((value % count) + count) % count : 0;
export const positiveInteger = (value: number, fallback = 1) =>
  Number.isFinite(value) ? Math.max(1, Math.floor(value)) : fallback;

export function getPreClones(spec: SlideSpec) {
  if (spec.unslick || !spec.infinite || spec.fade || spec.slideCount <= 1)
    return 0;
  return spec.variableWidth
    ? spec.slideCount
    : spec.slidesToShow + (spec.centerMode ? 1 : 0);
}
export function getPostClones(spec: SlideSpec) {
  return spec.unslick || !spec.infinite || spec.fade || spec.slideCount <= 1
    ? 0
    : spec.slideCount;
}
export function canGoNext(spec: SlideSpec) {
  if (spec.infinite) return true;
  return spec.centerMode
    ? spec.currentSlide < spec.slideCount - 1
    : spec.slideCount > spec.slidesToShow &&
        spec.currentSlide < spec.slideCount - spec.slidesToShow;
}
export function getDotCount(spec: SlideSpec) {
  return Math.max(
    1,
    spec.infinite
      ? Math.ceil(spec.slideCount / spec.slidesToScroll)
      : Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) +
          1,
  );
}
export function changeSlide(spec: SlideSpec, message: "next" | "previous") {
  const uneven = spec.slideCount % spec.slidesToScroll !== 0;
  const offset = uneven
    ? 0
    : (spec.slideCount - spec.currentSlide) % spec.slidesToScroll;
  if (!spec.infinite)
    return (
      spec.targetSlide +
      (message === "next" ? spec.slidesToScroll : -spec.slidesToScroll)
    );
  return message === "next"
    ? spec.currentSlide + (offset || spec.slidesToScroll)
    : spec.currentSlide -
        (offset ? spec.slidesToShow - offset : spec.slidesToScroll);
}
export function slideDestination(spec: SlideSpec, index: number) {
  const limit =
    spec.centerMode || spec.fade
      ? spec.slideCount - 1
      : Math.max(0, spec.slideCount - spec.slidesToShow);
  if (!spec.infinite) {
    const currentSlide = clamp(index, 0, limit);
    return { currentSlide, animationSlide: currentSlide };
  }
  let currentSlide = modulo(index, spec.slideCount);
  if (!spec.fade && spec.slideCount % spec.slidesToScroll !== 0) {
    if (index < 0)
      currentSlide = spec.slideCount - (spec.slideCount % spec.slidesToScroll);
    else if (index >= spec.slideCount) currentSlide = 0;
  }
  return {
    currentSlide,
    animationSlide: spec.fade ? currentSlide : index,
  };
}
export function lazySlides(spec: SlideSpec, index = spec.currentSlide) {
  const padding = Number.parseInt(spec.centerPadding, 10) > 0 ? 1 : 0;
  const left = spec.centerMode
    ? Math.floor(spec.slidesToShow / 2) + padding
    : 0;
  const right = spec.centerMode
    ? Math.floor((spec.slidesToShow - 1) / 2) + 1 + padding
    : spec.slidesToShow;
  return Array.from({ length: left + right }, (_, i) => index - left + i);
}
export function getSlideClasses(spec: SlideSpec, dataIndex: number) {
  const index = spec.rtl ? spec.slideCount - 1 - dataIndex : dataIndex;
  const centerOffset = Math.floor(spec.slidesToShow / 2);
  const active = spec.centerMode
    ? index > spec.currentSlide - centerOffset - 1 &&
      index <= spec.currentSlide + centerOffset
    : index >= spec.currentSlide &&
      index < spec.currentSlide + spec.slidesToShow;
  return {
    active: spec.unslick || active,
    center:
      spec.centerMode &&
      modulo(index - spec.currentSlide, spec.slideCount) === 0,
    current: index === modulo(spec.targetSlide, spec.slideCount),
    cloned: dataIndex < 0 || dataIndex >= spec.slideCount,
  };
}
export function getSwipeDirection(
  startX: number,
  startY: number,
  x: number,
  y: number,
  vertical: boolean,
): SwipeDirection {
  let angle = Math.round((Math.atan2(startY - y, startX - x) * 180) / Math.PI);
  if (angle < 0) angle += 360;
  if (angle <= 45 || angle >= 315) return "left";
  if (angle >= 135 && angle <= 225) return "right";
  if (!vertical) return "vertical";
  return angle >= 35 && angle <= 135 ? "up" : "down";
}

export function checkNavigable(spec: SlideSpec, index: number) {
  const max = spec.infinite ? spec.slideCount * 2 : spec.slideCount;
  let breakpoint = spec.infinite ? -spec.slidesToShow : 0;
  let counter = breakpoint;
  const indexes: number[] = [];
  while (breakpoint < max) {
    indexes.push(breakpoint);
    breakpoint = counter + spec.slidesToScroll;
    counter += Math.min(spec.slidesToScroll, spec.slidesToShow);
  }
  if (index > indexes[indexes.length - 1]) return indexes[indexes.length - 1];
  let previous = 0;
  for (const navigable of indexes) {
    if (index < navigable) return previous;
    previous = navigable;
  }
  return index;
}

export function selectSlide(spec: SlideSpec, index: number) {
  if (!spec.infinite) return index;
  const padding = Number.parseInt(spec.centerPadding, 10) > 0 ? 1 : 0;
  const common = (spec.slidesToShow - 1) / 2 + 1 + padding;
  const right = spec.centerMode
    ? common + (spec.rtl && spec.slidesToShow % 2 === 0 ? 1 : 0)
    : spec.rtl
      ? 0
      : spec.slidesToShow - 1;
  const left = spec.centerMode
    ? common + (!spec.rtl && spec.slidesToShow % 2 === 0 ? 1 : 0)
    : spec.rtl
      ? spec.slidesToShow - 1
      : 0;
  if (index > spec.currentSlide && index > spec.currentSlide + right)
    return index - spec.slideCount;
  if (index < spec.currentSlide && index < spec.currentSlide - left)
    return index + spec.slideCount;
  return index;
}
