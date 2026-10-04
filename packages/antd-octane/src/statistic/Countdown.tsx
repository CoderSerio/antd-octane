/** @jsxImportSource octane */

import { devUseWarning } from "../_util/warning";
import type { StatisticProps } from "./Statistic";
import { Timer } from "./Timer";
import type { valueType } from "./utils";

export interface CountdownProps extends StatisticProps {
  format?: string;
  onFinish?: () => void;
  onChange?: (value?: valueType) => void;
}

/** @deprecated Use Statistic.Timer with type="countdown" instead. */
export function Countdown(props: CountdownProps) {
  const warning = devUseWarning("Countdown");
  warning.deprecated(
    false,
    "<Statistic.Countdown />",
    '<Statistic.Timer type="countdown" />',
  );
  return <Timer {...props} type="countdown" />;
}
