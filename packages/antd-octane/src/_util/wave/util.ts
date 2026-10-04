// Adapted from Ant Design 5.29.3 _util/wave (MIT).
export function isValidWaveColor(color: string) {
  return (
    color &&
    color !== "#fff" &&
    color !== "#ffffff" &&
    color !== "rgb(255, 255, 255)" &&
    color !== "rgba(255, 255, 255, 1)" &&
    !/rgba\((?:\d*, ){3}0\)/.test(color) &&
    color !== "transparent" &&
    color !== "canvastext"
  );
}
export function getTargetWaveColor(node: HTMLElement) {
  const { borderTopColor, borderColor, backgroundColor } =
    getComputedStyle(node);
  return (
    [borderTopColor, borderColor, backgroundColor].find(isValidWaveColor) ??
    null
  );
}
export function isVisible(element: EventTarget | null) {
  if (!(element instanceof Element)) return false;
  if (element instanceof HTMLElement && element.offsetParent) return true;
  if (element instanceof SVGGraphicsElement) {
    const { width, height } = element.getBBox();
    if (width || height) return true;
  }
  const { width, height } = element.getBoundingClientRect();
  return Boolean(width || height);
}
