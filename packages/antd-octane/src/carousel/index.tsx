/** @jsxImportSource octane */
import { descriptorChildren } from "octane";
import InnerSlider from "./InnerSlider";

export type {
  CarouselEffect,
  CarouselInnerSliderRef,
  CarouselProps,
  CarouselRef,
  CarouselSettings,
  CustomArrowProps,
  DotPosition,
  LazyLoadTypes,
  ResponsiveObject,
  SwipeDirection,
} from "./types";

export const Carousel = descriptorChildren(InnerSlider);
