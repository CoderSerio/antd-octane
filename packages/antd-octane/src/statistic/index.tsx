/** @jsxImportSource octane */
import type { CountdownProps } from "./Countdown";
import { Countdown } from "./Countdown";
import type { StatisticProps } from "./Statistic";
import { Statistic } from "./Statistic";
import type { StatisticTimerProps } from "./Timer";
import { Timer } from "./Timer";

export type { StatisticRef } from "./Statistic";
export type { TimerType } from "./Timer";
export type { CountdownProps, StatisticProps, StatisticTimerProps };

export const StatisticWithTimer = Object.assign(Statistic, {
  Timer,
  /** @deprecated Use Timer with type="countdown" instead. */
  Countdown,
});

export { StatisticWithTimer as Statistic };
export default StatisticWithTimer;
