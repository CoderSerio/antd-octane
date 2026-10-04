import type { RefObject } from "octane";
import { useEffect, useRef } from "octane";
import { useConfig } from "../../config-provider";
import { resolveComponentAlias } from "../../theme/resolve";
import { TARGET_CLS, type WaveComponent } from "./interface";
import { isVisible } from "./util";
import showWaveEffect from "./WaveEffect";

export default function useWave(
  nodeRef: RefObject<HTMLElement | null>,
  component: WaveComponent,
  disabled = false,
) {
  const config = useConfig();
  const current = useRef(config);
  current.current = config;
  useEffect(() => {
    const node = nodeRef.current;
    if (!node || disabled) return;
    let frame: number | undefined;
    const cleanups = new Set<() => void>();
    const click = (event: MouseEvent) => {
      if (
        !isVisible(event.target) ||
        node.getAttribute("disabled") ||
        (node as HTMLInputElement).disabled ||
        (node.className.includes("disabled") &&
          !node.className.includes("disabled:")) ||
        node.getAttribute("aria-disabled") === "true" ||
        node.className.includes("-leave")
      )
        return;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = undefined;
        const { wave, token, theme, getPrefixCls } = current.current;
        if (wave?.disabled || !nodeRef.current) return;
        const target =
          node.querySelector<HTMLElement>(`.${TARGET_CLS}`) || node;
        const info = {
          className: getPrefixCls("wave"),
          token,
          component,
          event,
          hashId: "",
        };
        if (wave?.showEffect) wave.showEffect(target, info);
        else {
          const cleanup = showWaveEffect(
            target,
            info,
            () => {
              if (cleanup) cleanups.delete(cleanup);
            },
            resolveComponentAlias(theme, token, "Wave"),
          );
          if (cleanup) {
            cleanups.add(cleanup);
          }
        }
      });
    };
    node.addEventListener("click", click, true);
    return () => {
      node.removeEventListener("click", click, true);
      if (frame !== undefined) cancelAnimationFrame(frame);
      for (const cleanup of cleanups) cleanup();
      cleanups.clear();
    };
  }, [nodeRef, component, disabled]);
}
