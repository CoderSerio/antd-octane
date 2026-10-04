/** Read fractional layout dimensions without the popup's motion transform. */
export default function getLayoutSize(element: HTMLElement) {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  const read = (axis: "width" | "height", fallback: number) => {
    if (!style) return fallback;
    const size = Number.parseFloat(style[axis]);
    if (!Number.isFinite(size)) return fallback;
    if (style.boxSizing === "border-box") return size;
    const sides = axis === "width" ? ["Left", "Right"] : ["Top", "Bottom"];
    return sides.reduce(
      (value, side) =>
        value +
        (Number.parseFloat(
          style.getPropertyValue(`padding-${side.toLowerCase()}`),
        ) || 0) +
        (Number.parseFloat(
          style.getPropertyValue(`border-${side.toLowerCase()}-width`),
        ) || 0),
      size,
    );
  };
  return {
    width: read("width", element.offsetWidth),
    height: read("height", element.offsetHeight),
  };
}
