import { useLayoutEffect, useState } from "octane";
import type { ResponsiveObject } from "./types";

export default function useResponsive(responsive?: ResponsiveObject[]) {
  const [breakpoint, setBreakpoint] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (
      !responsive?.length ||
      typeof window === "undefined" ||
      !window.matchMedia
    )
      return;
    const points = responsive
      .map((item) => item.breakpoint)
      .sort((a, b) => a - b);
    const queries = points.map((point, i) =>
      window.matchMedia(
        `(min-width: ${i ? points[i - 1] + 1 : 0}px) and (max-width: ${point}px)`,
      ),
    );
    const full = window.matchMedia(
      `(min-width: ${points[points.length - 1]}px)`,
    );
    const update = () => {
      const index = queries.findIndex((query) => query.matches);
      setBreakpoint(full.matches ? null : index < 0 ? null : points[index]);
    };
    for (const query of [...queries, full])
      query.addEventListener("change", update);
    update();
    return () => {
      for (const query of [...queries, full])
        query.removeEventListener("change", update);
    };
  }, [responsive]);
  return responsive?.find((item) => item.breakpoint === breakpoint)?.settings;
}
