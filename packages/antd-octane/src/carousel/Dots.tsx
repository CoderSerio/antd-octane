/** @jsxImportSource octane */

import type { OctaneNode } from "octane";
import { cloneElement, isValidElement } from "octane";
import type { DotPosition, SlideSpec } from "./types";
import { clamp, getDotCount } from "./utils";

interface DotsProps {
  spec: SlideSpec;
  position: DotPosition;
  className?: string;
  dotsClass?: string;
  customPaging?: (index: number) => OctaneNode;
  appendDots?: (dots: OctaneNode) => OctaneNode;
  onSelect: (index: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function Dots(props: DotsProps) {
  const { spec } = props;
  const dots = Array.from({ length: getDotCount(spec) }, (_, i) => {
    const right = spec.infinite
      ? (i + 1) * spec.slidesToScroll - 1
      : clamp((i + 1) * spec.slidesToScroll - 1, 0, spec.slideCount - 1);
    const left = spec.infinite
      ? right - spec.slidesToScroll + 1
      : clamp(right - spec.slidesToScroll + 1, 0, spec.slideCount - 1);
    const active = spec.infinite
      ? spec.currentSlide >= left && spec.currentSlide <= right
      : spec.currentSlide === left;
    const paging = props.customPaging?.(i) ?? (
      <button type="button">{i + 1}</button>
    );
    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      props.onSelect(i * spec.slidesToScroll);
    };
    return (
      <li key={i} className={active ? "slick-active" : undefined}>
        {isValidElement(paging) ? (
          cloneElement(paging, {
            onClick,
            "aria-label": `切换至第 ${i * spec.slidesToScroll + 1} 张幻灯片`,
            "aria-current": active ? "true" : undefined,
          })
        ) : (
          <button type="button" onClick={onClick}>
            {paging}
          </button>
        )}
      </li>
    );
  });
  const container = props.appendDots?.(dots) ?? <ul>{dots}</ul>;
  const attributes = {
    className:
      props.dotsClass ??
      ["slick-dots", `slick-dots-${props.position}`, props.className]
        .filter(Boolean)
        .join(" "),
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
  };
  return isValidElement(container) ? (
    cloneElement(container, attributes)
  ) : (
    <ul {...attributes}>{container}</ul>
  );
}
