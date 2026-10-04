import type { Root } from "octane";
import { act, createRoot, useRef } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import Draggable, {
  type DraggableEventHandler,
} from "../site/src/demos/native-draggable";

let root: Root | undefined;
let container: HTMLDivElement;
async function setup(disabled = false, onStart?: DraggableEventHandler) {
  function Scene() {
    const ref = useRef<HTMLDivElement | null>(null);
    return (
      <Draggable
        nodeRef={ref}
        bounds={{ left: -20, right: 80, top: -10, bottom: 60 }}
        disabled={disabled}
        onStart={onStart}
      >
        <div ref={ref}>Handle</div>
      </Draggable>
    );
  }
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(<Scene />));
  return container.firstElementChild as HTMLDivElement;
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
  document.getElementById("react-draggable-style-el")?.remove();
});
const mouse = (type: string, x: number, y: number, button = 0) =>
  new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    button,
  });
const touch = (type: string, identifier: number, x: number, y: number) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const point = { identifier, clientX: x, clientY: y } as Touch;
  Object.defineProperties(event, {
    targetTouches: { value: type === "touchend" ? [] : [point] },
    changedTouches: { value: [point] },
  });
  return event;
};
it("matches initial transform, drag classes, bounds and out-of-bounds slack", async () => {
  const onStart = vi.fn();
  const node = await setup(false, onStart);
  expect(node.style.transform).toBe("translate(0px,0px)");
  expect(node.className).toBe("react-draggable");
  const down = mouse("mousedown", 100, 100);
  await act(() => node.dispatchEvent(down));
  expect(down.defaultPrevented).toBe(false);
  expect(onStart.mock.calls[0][1]).toEqual({
    node,
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
    lastX: 0,
    lastY: 0,
  });
  expect(node.classList.contains("react-draggable-dragging")).toBe(true);
  expect(
    document.body.classList.contains("react-draggable-transparent-selection"),
  ).toBe(true);
  await act(() => document.dispatchEvent(mouse("mousemove", 200, 180)));
  expect(node.style.transform).toBe("translate(80px,60px)");
  await act(() => document.dispatchEvent(mouse("mousemove", 190, 170)));
  expect(node.style.transform).toBe("translate(80px,60px)");
  await act(() => document.dispatchEvent(mouse("mousemove", 140, 150)));
  expect(node.style.transform).toBe("translate(40px,50px)");
  await act(() => document.dispatchEvent(mouse("mouseup", 140, 150)));
  expect(node.className).toBe("react-draggable react-draggable-dragged");
  expect(
    document.body.classList.contains("react-draggable-transparent-selection"),
  ).toBe(false);
  await act(() => document.dispatchEvent(mouse("mousemove", 0, 0)));
  expect(node.style.transform).toBe("translate(40px,50px)");
});
it("respects disabled, non-left clicks and an onStart false result", async () => {
  const onStart = vi.fn(() => false);
  const node = await setup(false, onStart);
  await act(() => node.dispatchEvent(mouse("mousedown", 100, 100, 2)));
  expect(onStart).not.toHaveBeenCalled();
  await act(() => node.dispatchEvent(mouse("mousedown", 100, 100)));
  await act(() => document.dispatchEvent(mouse("mousemove", 150, 150)));
  expect(onStart).toHaveBeenCalledOnce();
  expect(node.className).toBe("react-draggable");
  expect(node.style.transform).toBe("translate(0px,0px)");
  await act(() => root?.unmount());
  container.remove();
  const disabled = await setup(true, onStart);
  await act(() => disabled.dispatchEvent(mouse("mousedown", 100, 100)));
  expect(onStart).toHaveBeenCalledOnce();
});
it("tracks the starting touch, prevents scrolling and cleans touch listeners", async () => {
  const node = await setup();
  const start = touch("touchstart", 7, 100, 100);
  await act(() => node.dispatchEvent(start));
  expect(start.defaultPrevented).toBe(true);
  await act(() => document.dispatchEvent(touch("touchmove", 8, 140, 130)));
  expect(node.style.transform).toBe("translate(0px,0px)");
  await act(() => document.dispatchEvent(touch("touchmove", 7, 140, 130)));
  expect(node.style.transform).toBe("translate(40px,30px)");
  await act(() => document.dispatchEvent(touch("touchend", 7, 140, 130)));
  expect(node.classList.contains("react-draggable-dragging")).toBe(false);
  await act(() => document.dispatchEvent(touch("touchmove", 7, 160, 150)));
  expect(node.style.transform).toBe("translate(40px,30px)");
});
it("cleans document listeners and selection state when unmounted mid-drag", async () => {
  const node = await setup();
  await act(() => node.dispatchEvent(mouse("mousedown", 100, 100)));
  await act(() => root?.unmount());
  expect(
    document.body.classList.contains("react-draggable-transparent-selection"),
  ).toBe(false);
  await act(() => document.dispatchEvent(mouse("mousemove", 150, 150)));
  expect(node.style.transform).toBe("translate(0px,0px)");
});
