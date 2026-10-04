/** @jsxImportSource octane */
import type { CSSProperties } from "octane";
import { useEffect, useId, useRef, useState } from "octane";

type ElementRef = { current: HTMLDivElement | null };

export interface StickyScrollBarProps {
  rootRef: ElementRef;
  contentRef: ElementRef;
  contentId: string;
  getContainer?: () => Window | HTMLElement;
  offsetScroll?: number;
  direction?: "ltr" | "rtl";
}

interface ScrollbarState {
  hidden: boolean;
  trackWidth: number;
  thumbWidth: number;
  thumbOffset: number;
}

/** Native sticky horizontal scrollbar following rc-table's visibility rules. */
export function StickyScrollBar({
  rootRef,
  contentRef,
  contentId,
  getContainer,
  offsetScroll = 0,
  direction = "ltr",
}: StickyScrollBarProps) {
  const [scrollbar, setScrollbar] = useState<ScrollbarState>({
    hidden: true,
    trackWidth: 0,
    thumbWidth: 0,
    thumbOffset: 0,
  });
  const scrollBarId = useId();
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
  } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    const container = getContainer?.() ?? window;
    const update = () => {
      const trackWidth = content.clientWidth;
      const scrollWidth = content.scrollWidth;
      const maxScroll = Math.max(0, scrollWidth - trackWidth);
      const thumbWidth =
        scrollWidth > 0
          ? Math.min(trackWidth, (trackWidth * trackWidth) / scrollWidth)
          : 0;
      const normalizedScroll =
        direction === "rtl" && maxScroll > 0
          ? Math.max(0, Math.min(maxScroll, maxScroll + content.scrollLeft))
          : Math.max(0, Math.min(maxScroll, content.scrollLeft));
      const thumbOffset =
        maxScroll > 0
          ? (normalizedScroll / maxScroll) *
            Math.max(0, trackWidth - thumbWidth)
          : 0;
      const rootRect = root.getBoundingClientRect();
      const visibleBottom =
        container === window
          ? window.innerHeight
          : (container as HTMLElement).getBoundingClientRect().bottom;
      const hidden =
        scrollWidth <= trackWidth ||
        rootRect.bottom - 8 <= visibleBottom ||
        rootRect.top >= visibleBottom - offsetScroll;

      setScrollbar((current) => {
        const next = { hidden, trackWidth, thumbWidth, thumbOffset };
        return current.hidden === next.hidden &&
          Math.abs(current.trackWidth - next.trackWidth) < 0.5 &&
          Math.abs(current.thumbWidth - next.thumbWidth) < 0.5 &&
          Math.abs(current.thumbOffset - next.thumbOffset) < 0.5
          ? current
          : next;
      });
    };

    update();
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(update);
    resizeObserver?.observe(root);
    resizeObserver?.observe(content);
    const scrollParents: HTMLElement[] = [];
    let parent: HTMLElement | null = root.parentElement;
    while (parent) {
      scrollParents.push(parent);
      parent = parent.parentElement;
    }
    scrollParents.forEach((element) => {
      element.addEventListener("scroll", update, { passive: true });
    });
    content.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    if (container !== window)
      container.addEventListener("scroll", update, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      scrollParents.forEach((element) => {
        element.removeEventListener("scroll", update);
      });
      content.removeEventListener("scroll", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (container !== window) container.removeEventListener("scroll", update);
    };
  }, [contentRef, direction, getContainer, offsetScroll, rootRef]);

  if (scrollbar.hidden) return null;

  const maxScroll = Math.max(
    0,
    (contentRef.current?.scrollWidth ?? 0) - scrollbar.trackWidth,
  );
  const content = contentRef.current;
  const normalizedScroll = content
    ? direction === "rtl"
      ? Math.max(0, Math.min(maxScroll, maxScroll + content.scrollLeft))
      : Math.max(0, Math.min(maxScroll, content.scrollLeft))
    : 0;
  const maxThumbOffset = Math.max(
    0,
    scrollbar.trackWidth - scrollbar.thumbWidth,
  );
  const style: CSSProperties = {
    width: scrollbar.trackWidth,
    bottom: offsetScroll,
  };

  return (
    <div
      id={scrollBarId}
      className="ant-table-sticky-scroll"
      style={style}
      role="scrollbar"
      aria-controls={contentId}
      aria-label="Horizontal scroll"
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={maxScroll}
      aria-valuenow={normalizedScroll}
      aria-valuetext={`${Math.round(normalizedScroll)} pixels scrolled`}
      tabIndex={0}
      onKeyDown={(event) => {
        if (!content || maxScroll <= 0) return;
        const step = event.shiftKey ? content.clientWidth : 40;
        let nextScroll: number | undefined;
        if (event.key === "ArrowLeft") nextScroll = normalizedScroll - step;
        else if (event.key === "ArrowRight")
          nextScroll = normalizedScroll + step;
        else if (event.key === "Home") nextScroll = 0;
        else if (event.key === "End") nextScroll = maxScroll;
        if (nextScroll === undefined) return;
        event.preventDefault();
        const bounded = Math.max(0, Math.min(maxScroll, nextScroll));
        content.scrollLeft =
          direction === "rtl" ? bounded - maxScroll : bounded;
      }}
    >
      <div
        className="ant-table-sticky-scroll-bar"
        style={{
          width: scrollbar.thumbWidth,
          transform: `translate3d(${scrollbar.thumbOffset}px, 0, 0)`,
        }}
        onPointerDown={(event) => {
          const content = contentRef.current;
          if (!content || maxScroll <= 0 || maxThumbOffset <= 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          const normalizedScroll =
            direction === "rtl"
              ? maxScroll + content.scrollLeft
              : content.scrollLeft;
          dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScroll: normalizedScroll,
          };
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          const content = contentRef.current;
          if (!drag || !content || drag.pointerId !== event.pointerId) return;
          const normalizedScroll = Math.max(
            0,
            Math.min(
              maxScroll,
              drag.startScroll +
                ((event.clientX - drag.startX) / maxThumbOffset) * maxScroll,
            ),
          );
          content.scrollLeft =
            direction === "rtl"
              ? normalizedScroll - maxScroll
              : normalizedScroll;
        }}
        onPointerUp={() => {
          dragRef.current = null;
        }}
        onLostPointerCapture={() => {
          dragRef.current = null;
        }}
      />
    </div>
  );
}
