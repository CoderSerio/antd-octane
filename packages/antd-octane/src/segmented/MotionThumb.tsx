/** @jsxImportSource octane */
import { useLayoutEffect, useRef, useState } from "octane";
import type { SegmentedValue } from ".";

interface ThumbStyle {
  left: number;
  right: number;
  width: number;
  top: number;
  height: number;
}

function measure(node: HTMLElement): ThumbStyle {
  return {
    left: node.offsetLeft,
    right:
      (node.parentElement?.clientWidth ?? 0) -
      node.clientWidth -
      node.offsetLeft,
    width: node.clientWidth,
    top: node.offsetTop,
    height: node.clientHeight,
  };
}

/** rc-segmented/MotionThumb geometry, rendered by the native Octane tree. */
export default function MotionThumb({
  prefixCls,
  motionName,
  containerRef,
  value,
  getValueIndex,
  vertical,
  direction,
  motion,
  onMotionStart,
  onMotionEnd,
}: {
  prefixCls: string;
  motionName: string;
  containerRef: { current: HTMLDivElement | null };
  value: SegmentedValue | undefined;
  getValueIndex: (value: SegmentedValue | undefined) => number;
  vertical?: boolean;
  direction: "ltr" | "rtl";
  motion: boolean;
  onMotionStart: () => void;
  onMotionEnd: () => void;
}) {
  const previous = useRef(value);
  const [positions, setPositions] = useState<{
    start: ThumbStyle;
    end: ThumbStyle;
    active: boolean;
  }>();
  const finish = () => {
    setPositions(undefined);
    onMotionEnd();
  };
  useLayoutEffect(() => {
    if (previous.current === value) {
      finish();
      return;
    }
    const labels = containerRef.current?.querySelectorAll<HTMLElement>(
      ".ant-segmented-item",
    );
    const start = labels?.[getValueIndex(previous.current)];
    const end = labels?.[getValueIndex(value)];
    previous.current = value;
    if (!motion || !start?.offsetParent || !end?.offsetParent) {
      finish();
      return;
    }
    setPositions({ start: measure(start), end: measure(end), active: false });
    onMotionStart();
    // Two frames give the browser an initial geometry before interpolation.
    let activeFrame = 0;
    const startFrame = requestAnimationFrame(() => {
      activeFrame = requestAnimationFrame(() =>
        setPositions((previous) => previous && { ...previous, active: true }),
      );
    });
    const timer = setTimeout(finish, 1000);
    return () => {
      cancelAnimationFrame(startFrame);
      cancelAnimationFrame(activeFrame);
      clearTimeout(timer);
    };
  }, [value, motion, vertical, direction]);
  if (!positions) return null;
  const current = positions.active ? positions.end : positions.start;
  const offset = vertical
    ? current.top
    : direction === "rtl"
      ? -current.right
      : current.left;
  return (
    <div
      className={[
        `${prefixCls}-thumb`,
        "ant-segmented-thumb",
        `${prefixCls}-${motionName}-appear`,
        positions.active && `${prefixCls}-${motionName}-appear-active`,
        motionName === "thumb-motion" &&
          positions.active &&
          "ant-segmented-thumb-motion-appear-active",
      ]}
      style={{
        transform: `translate${vertical ? "Y" : "X"}(${offset}px)`,
        width: vertical ? "100%" : current.width,
        height: vertical ? current.height : "100%",
      }}
      onTransitionEnd={(event) => {
        if (
          event.propertyName === "transform" ||
          event.propertyName === "width" ||
          event.propertyName === "height"
        )
          finish();
      }}
    />
  );
}
