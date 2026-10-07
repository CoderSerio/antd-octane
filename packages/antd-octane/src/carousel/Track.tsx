/** @jsxImportSource octane */

import type { CSSProperties, OctaneNode, Ref } from "octane";
import { cloneElement, isValidElement } from "octane";
import type { SlideSpec } from "./types";
import { getPostClones, getPreClones, getSlideClasses, modulo } from "./utils";

export interface TrackProps {
  spec: SlideSpec;
  slides: OctaneNode[];
  slideWidth: number | string;
  slideHeight: number;
  lazyLoadedList: number[];
  lazyLoad?: string;
  useCSS: boolean;
  speed: number;
  cssEase: string;
  vertical: boolean;
  instant: boolean;
  trackStyle: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  onSelect?: (index: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: (event: FocusEvent) => void;
  onImageError?: () => void;
}

/** Track, slide classes and pre/post clones mirror react-slick's Track. */
export default function Track(props: TrackProps) {
  const { spec, slides } = props;
  const pre = getPreClones(spec);
  const post = getPostClones(spec);
  const indexes = Array.from(
    { length: pre + slides.length + post },
    (_, i) => i - pre,
  );
  if (spec.rtl) indexes.reverse();
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Track events manage autoplay while descendants retain their native controls.
    <div
      ref={props.ref}
      className="slick-track"
      style={props.trackStyle}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onErrorCapture={props.onImageError}
    >
      {indexes.map((index, position) => {
        const classes = getSlideClasses(spec, index);
        const original = modulo(index, slides.length);
        const loaded =
          !props.lazyLoad ||
          props.lazyLoadedList.includes(index) ||
          props.lazyLoadedList.includes(original);
        const slide = loaded ? slides[original] : <div />;
        const childStyle = isValidElement<{ style?: CSSProperties }>(slide)
          ? slide.props.style
          : undefined;
        const style: CSSProperties = {
          outline: "none",
          ...childStyle,
          width: spec.variableWidth ? childStyle?.width : props.slideWidth,
          flexBasis: spec.variableWidth ? "auto" : props.slideWidth,
          ...(spec.fade
            ? {
                position: "relative",
                left: props.vertical
                  ? undefined
                  : typeof props.slideWidth === "number"
                    ? -position * props.slideWidth
                    : `calc(-${position} * ${props.slideWidth})`,
                top: props.vertical ? -position * props.slideHeight : undefined,
                opacity: classes.active ? 1 : 0,
                zIndex: classes.active ? 999 : 998,
                transition:
                  props.useCSS && !props.instant
                    ? `opacity ${props.speed}ms ${props.cssEase}, visibility ${props.speed}ms ${props.cssEase}`
                    : "none",
              }
            : {}),
        };
        const slideProps = {
          key: `${classes.cloned ? "cloned" : "original"}-${index}`,
          "data-index": index,
          className: [
            "slick-slide",
            classes.active && "slick-active",
            classes.current && "slick-current",
            classes.center && "slick-center",
            classes.cloned && "slick-cloned",
          ],
          style,
          tabIndex: -1,
          "aria-hidden": !classes.active,
          inert: !classes.active,
          onClick: () => props.onSelect?.(index),
        };
        return isValidElement(slide) ? (
          cloneElement(slide, slideProps)
        ) : (
          <div {...slideProps}>{slide}</div>
        );
      })}
    </div>
  );
}
