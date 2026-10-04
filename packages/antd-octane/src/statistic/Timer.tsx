/** @jsxImportSource octane */
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "octane";
import type { StatisticProps } from "./Statistic";
import { Statistic } from "./Statistic";
import type { FormatConfig, valueType } from "./utils";
import { formatCounter } from "./utils";

export type TimerType = "countdown" | "countup";

export interface StatisticTimerProps extends FormatConfig, StatisticProps {
  type: TimerType;
  format?: string;
  /** Called after a countdown reaches its end time. */
  onFinish?: () => void;
  onChange?: (value?: valueType) => void;
}

function getTimestamp(value?: valueType) {
  return new Date(value as valueType).getTime();
}

export function Timer({
  value,
  format = "HH:mm:ss",
  onChange,
  onFinish,
  type,
  ...rest
}: StatisticTimerProps) {
  const countdown = type === "countdown";
  const [showTime, setShowTime] = useState<null | object>(null);
  const onChangeRef = useRef(onChange);
  const onFinishRef = useRef(onFinish);
  onChangeRef.current = onChange;
  onFinishRef.current = onFinish;

  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    const timestamp = getTimestamp(value);
    const update = () => {
      const now = Date.now();
      setShowTime({});
      const difference = countdown ? timestamp - now : now - timestamp;
      onChangeRef.current?.(difference);
      if (countdown && timestamp < now) {
        onFinishRef.current?.();
        return false;
      }
      return true;
    };
    const loop = () => {
      frame = window.requestAnimationFrame(() => {
        if (!cancelled && update()) loop();
      });
    };
    loop();
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [value, countdown]);

  // The placeholder is stable for server rendering; start displaying time after mount.
  useEffect(() => {
    setShowTime({});
  }, []);
  const formatter = (formatValue: valueType, config?: FormatConfig) =>
    showTime
      ? formatCounter(formatValue, { ...config, format }, countdown)
      : "-";
  const valueRender: StatisticProps["valueRender"] = (node) =>
    isValidElement(node) ? cloneElement(node, { title: undefined }) : node;

  return (
    <Statistic
      {...rest}
      value={value}
      formatter={formatter}
      valueRender={valueRender}
    />
  );
}
