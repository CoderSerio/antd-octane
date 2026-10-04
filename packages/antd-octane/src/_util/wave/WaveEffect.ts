import type { AliasToken } from "../../theme/types";
import { type ShowWaveEffect, TARGET_CLS } from "./interface";
import { getTargetWaveColor } from "./util";

function validateNum(value: number) {
  return Number.isNaN(value) ? 0 : value;
}

/** Transient native DOM effect; it never owns the component's public ref. */
export default function showWaveEffect(
  target: HTMLElement,
  info: Parameters<ShowWaveEffect>[1],
  onFinish?: () => void,
  styleToken: AliasToken = info.token,
) {
  const { component, token } = info;
  if (
    component === "Checkbox" &&
    !target.querySelector<HTMLInputElement>("input")?.checked
  )
    return;

  const holder = document.createElement("div");
  Object.assign(holder.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
  });
  target.insertBefore(holder, target.firstChild);
  const wave = document.createElement("div");
  const quick =
    (component === "Checkbox" || component === "Radio") &&
    target.classList.contains(TARGET_CLS);
  wave.className = [
    info.className,
    info.className.split(" ").includes("ant-wave") ? undefined : "ant-wave",
    quick && "wave-quick",
  ]
    .filter(Boolean)
    .join(" ");
  wave.style.setProperty("--ao-wave-primary", styleToken.colorPrimary);
  wave.style.setProperty("--ao-wave-ease-out", styleToken.motionEaseOutCirc);
  wave.style.setProperty("--ao-wave-ease-in-out", styleToken.motionEaseInOut);
  wave.style.setProperty("--ao-wave-duration", styleToken.motionDurationSlow);

  const syncPos = () => {
    const style = getComputedStyle(target);
    const isStatic = style.position === "static";
    const color = getTargetWaveColor(target);
    if (color) wave.style.setProperty("--wave-color", color);
    else wave.style.removeProperty("--wave-color");
    Object.assign(wave.style, {
      left: `${isStatic ? target.offsetLeft : validateNum(-parseFloat(style.borderLeftWidth))}px`,
      top: `${isStatic ? target.offsetTop : validateNum(-parseFloat(style.borderTopWidth))}px`,
      width: `${target.offsetWidth}px`,
      height: `${target.offsetHeight}px`,
      borderRadius: [
        style.borderTopLeftRadius,
        style.borderTopRightRadius,
        style.borderBottomRightRadius,
        style.borderBottomLeftRadius,
      ]
        .map((radius) => `${validateNum(parseFloat(radius))}px`)
        .join(" "),
    });
  };
  let frame: number;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let finished = false;
  const observer =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(syncPos)
      : undefined;
  const cleanup = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    if (timer !== undefined) clearTimeout(timer);
    observer?.disconnect();
    holder.remove();
    onFinish?.();
  };
  wave.addEventListener("transitionend", (event) => {
    if (event.target === wave && event.propertyName === "opacity") cleanup();
  });
  observer?.observe(target);
  frame = requestAnimationFrame(() => {
    syncPos();
    holder.appendChild(wave);
    if (token.motion) {
      wave.classList.add("wave-motion-appear", "wave-motion-appear-start");
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          wave.classList.remove("wave-motion-appear-start");
          wave.classList.add("wave-motion-appear-active");
          timer = setTimeout(cleanup, 5000);
        });
      });
    } else cleanup();
  });
  return cleanup;
}
