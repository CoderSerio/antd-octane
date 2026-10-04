/** @jsxImportSource octane */
import type { CSSProperties, OctaneNode } from "octane";
import { useEffect, useState } from "octane";

interface UnitNumberProps {
  prefixCls: string;
  value: string | number;
  offset?: number;
  current?: boolean;
}

function UnitNumber({
  prefixCls,
  value,
  offset = 0,
  current,
}: UnitNumberProps) {
  return (
    <span
      className={[
        `${prefixCls}-only-unit`,
        "ant-scroll-number-only-unit",
        current && "current",
      ]}
      style={
        offset
          ? { position: "absolute", top: `${offset}00%`, left: 0 }
          : undefined
      }
    >
      {value}
    </span>
  );
}

function getOffset(start: number, end: number, unit: -1 | 1) {
  let index = start;
  let offset = 0;
  while ((index + 10) % 10 !== end) {
    index += unit;
    offset += unit;
  }
  return offset;
}

/** Native adaptation of antd 5.29.3 badge/SingleNumber. */
export default function SingleNumber({
  prefixCls,
  value: originValue,
  count: originCount,
  motion,
}: {
  prefixCls: string;
  value: string;
  count: number;
  motion: boolean;
}) {
  const value = Number(originValue);
  const count = Math.abs(originCount);
  const [previous, setPrevious] = useState({ value, count });
  const settle = () => setPrevious({ value, count });

  // Transition events may be skipped when the badge is hidden or detached.
  useEffect(() => {
    const timer = setTimeout(settle, motion ? 1000 : 0);
    return () => clearTimeout(timer);
  }, [value, count, motion]);

  let style: CSSProperties;
  let units: OctaneNode;
  if (
    !motion ||
    previous.value === value ||
    Number.isNaN(value) ||
    Number.isNaN(previous.value)
  ) {
    style = { transition: "none" };
    units = <UnitNumber prefixCls={prefixCls} value={originValue} current />;
  } else {
    const numberList = Array.from({ length: 11 }, (_, index) => value + index);
    const unit = previous.count < count ? 1 : -1;
    const previousIndex = numberList.findIndex(
      (number) => number % 10 === previous.value,
    );
    const visibleNumbers =
      unit < 0
        ? numberList.slice(0, previousIndex + 1)
        : numberList.slice(previousIndex);
    units = visibleNumbers.map((number, index) => (
      <UnitNumber
        key={number}
        prefixCls={prefixCls}
        value={number % 10}
        offset={unit < 0 ? index - previousIndex : index}
        current={index === previousIndex}
      />
    ));
    style = {
      transform: `translateY(${-getOffset(previous.value, value, unit)}00%)`,
    };
  }

  return (
    <span
      className={[`${prefixCls}-only`, "ant-scroll-number-only"]}
      style={style}
      onTransitionEnd={settle}
    >
      {units}
    </span>
  );
}
