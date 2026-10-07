// Adapted from Ant Design 5.29.3 components/modal/Modal.tsx (MIT).
let position: { x: number; y: number } | null = null;
let timestamp = 0;

if (typeof document !== "undefined") {
  document.documentElement.addEventListener(
    "click",
    (event) => {
      position = { x: event.pageX, y: event.pageY };
      timestamp = Date.now();
    },
    true,
  );
}

export function getClickPosition() {
  return Date.now() - timestamp < 100 ? position : null;
}
