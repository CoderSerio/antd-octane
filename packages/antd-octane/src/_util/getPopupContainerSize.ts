/** Measure the containing block without integer clientWidth/Height rounding. */
export default function getPopupContainerSize(element: HTMLElement) {
  const { style } = element;
  const properties = ["left", "top", "right", "bottom", "transform"] as const;
  const saved = properties.map(
    (name) =>
      [
        name,
        style.getPropertyValue(name),
        style.getPropertyPriority(name),
      ] as const,
  );
  try {
    style.left = "0";
    style.top = "0";
    style.right = "auto";
    style.bottom = "auto";
    // The fixed containing block can have a fractional CSS size under zoom.
    // Exclude the popup's motion transform from the two mirror measurements.
    style.setProperty("transform", "none", "important");
    const origin = element.getBoundingClientRect();
    style.left = "auto";
    style.top = "auto";
    style.right = "0";
    style.bottom = "0";
    const mirror = element.getBoundingClientRect();
    return {
      width: mirror.right - origin.left,
      height: mirror.bottom - origin.top,
    };
  } finally {
    for (const [name, value, priority] of saved) {
      if (value) style.setProperty(name, value, priority);
      else style.removeProperty(name);
    }
  }
}
