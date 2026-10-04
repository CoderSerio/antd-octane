// rc-progress 4.0.0 es/common.js (MIT), adapted to Octane.
import { useEffect, useRef } from "octane";
export default function useTransitionDuration(dependencies: unknown[]) {
  const paths = useRef<(SVGCircleElement | null)[]>([]);
  const previous = useRef<number | null>(null);
  useEffect(() => {
    const now = Date.now();
    let updated = false;
    for (const path of paths.current) {
      if (!path) continue;
      updated = true;
      path.style.transitionDuration =
        previous.current && now - previous.current < 100
          ? "0s, 0s"
          : ".3s, .3s, .3s, .06s";
    }
    if (updated) previous.current = now;
  }, dependencies);
  return paths;
}
