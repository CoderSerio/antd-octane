/** @jsxImportSource octane */

import type { OctaneNode } from "octane";
import { cloneElement, isValidElement } from "octane";
import type { SlideSpec } from "./types";
import { canGoNext } from "./utils";

interface ArrowProps {
  spec: SlideSpec;
  direction: "previous" | "next";
  arrow?: OctaneNode;
  onSelect: (direction: "previous" | "next") => void;
}
export default function Arrow({
  spec,
  direction,
  arrow,
  onSelect,
}: ArrowProps) {
  const previous = direction === "previous";
  const disabled = previous
    ? !spec.infinite &&
      (spec.currentSlide === 0 || spec.slideCount <= spec.slidesToShow)
    : !canGoNext(spec);
  const attributes = {
    "data-role": "none",
    className: [
      "slick-arrow",
      previous ? "slick-prev" : "slick-next",
      disabled && "slick-disabled",
    ]
      .filter(Boolean)
      .join(" "),
    style: { display: "block" },
    onClick: disabled
      ? undefined
      : (event: MouseEvent) => {
          event.preventDefault();
          onSelect(direction);
        },
  };
  if (isValidElement(arrow))
    return cloneElement(arrow, {
      ...attributes,
      currentSlide: spec.currentSlide,
      slideCount: spec.slideCount,
    });
  return (
    <button
      {...attributes}
      type="button"
      disabled={disabled}
      aria-label={previous !== spec.rtl ? "上一张幻灯片" : "下一张幻灯片"}
    >
      {arrow}
    </button>
  );
}
