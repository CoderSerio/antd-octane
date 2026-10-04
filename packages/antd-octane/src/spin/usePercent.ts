// Adapted from Ant Design 5.29.3 components/spin/usePercent.ts (MIT).
import { useEffect, useState } from "octane";

const STEP_BUCKETS: [number, number][] = [
  [30, 0.05],
  [70, 0.03],
  [96, 0.01],
];

export default function usePercent(
  spinning: boolean,
  percent?: number | "auto",
) {
  const [mockPercent, setMockPercent] = useState(0);
  const isAuto = percent === "auto";
  useEffect(() => {
    if (!isAuto || !spinning) return;
    setMockPercent(0);
    const timer = setInterval(
      () =>
        setMockPercent((previous) => {
          for (const [limit, step] of STEP_BUCKETS) {
            if (previous <= limit) return previous + (100 - previous) * step;
          }
          return previous;
        }),
      200,
    );
    return () => clearInterval(timer);
  }, [isAuto, spinning]);
  return isAuto ? mockPercent : percent;
}
