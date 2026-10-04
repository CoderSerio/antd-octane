import type { CSSProperties, HTMLAttributes, OctaneNode, Ref } from "octane";

export type CarouselEffect = "scrollx" | "fade";
export type DotPosition = "top" | "bottom" | "left" | "right";
export type SwipeDirection = "left" | "right" | "up" | "down" | "vertical";
export type LazyLoadTypes = "ondemand" | "progressive" | "anticipated";

export interface CustomArrowProps {
  className?: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent) => void;
  currentSlide?: number;
  slideCount?: number;
}

export interface ResponsiveObject {
  breakpoint: number;
  settings: "unslick" | CarouselSettings;
}

/** Native equivalent of the Settings consumed by antd 5's react-slick wrapper. */
export interface CarouselSettings {
  accessibility?: boolean;
  adaptiveHeight?: boolean;
  afterChange?: (currentSlide: number) => void;
  appendDots?: (dots: OctaneNode) => OctaneNode;
  arrows?: boolean;
  asNavFor?: CarouselRef | null;
  autoplaySpeed?: number;
  autoplay?: boolean | { dotDuration?: boolean };
  beforeChange?: (currentSlide: number, nextSlide: number) => void;
  centerMode?: boolean;
  centerPadding?: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  children?: OctaneNode;
  cssEase?: string;
  customPaging?: (index: number) => OctaneNode;
  dots?: boolean | { className?: string };
  dotsClass?: string;
  draggable?: boolean;
  easing?: string;
  edgeFriction?: number;
  fade?: boolean;
  focusOnSelect?: boolean;
  infinite?: boolean;
  initialSlide?: number;
  lazyLoad?: LazyLoadTypes;
  nextArrow?: OctaneNode;
  onEdge?: (direction: SwipeDirection) => void;
  onInit?: () => void;
  onLazyLoad?: (slidesToLoad: number[]) => void;
  onLazyLoadError?: () => void;
  onReInit?: () => void;
  onSwipe?: (direction: SwipeDirection) => void;
  pauseOnDotsHover?: boolean;
  pauseOnFocus?: boolean;
  pauseOnHover?: boolean;
  prevArrow?: OctaneNode;
  responsive?: ResponsiveObject[];
  rows?: number;
  rtl?: boolean;
  slide?: string;
  slidesPerRow?: number;
  slidesToScroll?: number;
  slidesToShow?: number;
  speed?: number;
  swipeToSlide?: boolean;
  swipe?: boolean;
  swipeEvent?: (direction: SwipeDirection) => void;
  touchMove?: boolean;
  touchThreshold?: number;
  useCSS?: boolean;
  useTransform?: boolean;
  variableWidth?: boolean;
  vertical?: boolean;
  verticalSwiping?: boolean;
  waitForAnimate?: boolean;
}

export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "draggable" | "style">,
    Omit<CarouselSettings, "dotsClass"> {
  style?: CSSProperties;
  children?: OctaneNode;
  autoplay?: boolean | { dotDuration?: boolean };
  dots?: boolean | { className?: string };
  effect?: CarouselEffect;
  dotPosition?: DotPosition;
  slickGoTo?: number;
  prefixCls?: string;
  rootClassName?: string;
  ref?: Ref<CarouselRef>;
}

export interface CarouselInnerSliderRef {
  list: HTMLDivElement | null;
  track: { node: HTMLDivElement | null };
  state: { currentSlide: number; slideCount: number; animating: boolean };
  autoPlay: (playType?: "update" | "leave" | "blur" | "play") => void;
  pause: (pauseType?: "paused" | "hovered" | "focused") => void;
  slickGoTo: (slide: number, dontAnimate?: boolean) => void;
  slickPrev: () => void;
  slickNext: () => void;
  slideHandler: (
    slide: number,
    dontAnimate?: boolean,
    syncing?: boolean,
  ) => void;
}

export interface CarouselRef {
  goTo: (slide: number, dontAnimate?: boolean) => void;
  prev: () => void;
  next: () => void;
  autoPlay: (playType?: "update" | "leave" | "blur") => void;
  innerSlider: CarouselInnerSliderRef;
}

export interface SlideSpec {
  slideCount: number;
  slidesToShow: number;
  slidesToScroll: number;
  currentSlide: number;
  targetSlide: number;
  infinite: boolean;
  centerMode: boolean;
  centerPadding: string;
  variableWidth: boolean;
  fade: boolean;
  rtl: boolean;
  unslick: boolean;
}
