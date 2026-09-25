import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Slider } from "../packages/antd-octane/src/slider";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
  vi.restoreAllMocks();
});
function handle(index = 0) {
  const node =
    container.querySelectorAll<HTMLElement>('[role="slider"]')[index];
  if (!node) throw Error("Missing handle");
  return node;
}
async function key(key: string, index = 0) {
  await act(() =>
    handle(index).dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true }),
    ),
  );
  await act(() =>
    handle(index).dispatchEvent(
      new KeyboardEvent("keyup", { key, bubbles: true }),
    ),
  );
}
function geometry() {
  const node = container.querySelector<HTMLElement>(".ant-slider");
  if (!node) throw Error("Missing slider");
  vi.spyOn(node, "getBoundingClientRect").mockReturnValue({
    left: 0,
    right: 100,
    top: 0,
    bottom: 100,
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  return node;
}
function pointer(type: string, x: number, y = 50, id = 1) {
  return new PointerEvent(type, {
    clientX: x,
    clientY: y,
    button: 0,
    pointerId: id,
    pointerType: "touch",
    bubbles: true,
  });
}
it("uncontrolled keyboard snaps decimal steps and completes once", async () => {
  const change = vi.fn(),
    complete = vi.fn();
  await render(
    <Slider
      min={0}
      max={1}
      step={0.1}
      defaultValue={0.2}
      onChange={change}
      onChangeComplete={complete}
    />,
  );
  await key("ArrowRight");
  expect(handle().getAttribute("aria-valuenow")).toBe("0.3");
  expect(complete).toHaveBeenCalledWith(0.3);
  expect(complete).toHaveBeenCalledTimes(1);
  await key("End");
  expect(change).toHaveBeenLastCalledWith(1);
});
it("controlled value does not optimistically move", async () => {
  const change = vi.fn();
  await render(<Slider value={20} onChange={change} />);
  await key("ArrowRight");
  expect(change).toHaveBeenCalledWith(21);
  expect(handle().getAttribute("aria-valuenow")).toBe("20");
});
it("range handles cannot cross and advertise bounded accessible values", async () => {
  await render(<Slider range defaultValue={[20, 40]} />);
  await key("End", 0);
  expect(handle(0).getAttribute("aria-valuenow")).toBe("40");
  await key("Home", 1);
  expect(handle(1).getAttribute("aria-valuenow")).toBe("40");
  expect(handle(1).getAttribute("aria-valuemin")).toBe("40");
});
it("null step navigates only marks while reverse changes arrow direction", async () => {
  await render(
    <Slider
      step={null}
      marks={{ 0: "低", 35: "中", 100: "高" }}
      defaultValue={35}
      reverse
    />,
  );
  await key("ArrowRight");
  expect(handle().getAttribute("aria-valuenow")).toBe("0");
  await key("ArrowLeft");
  expect(handle().getAttribute("aria-valuenow")).toBe("35");
});
it("touch pointer drag tracks outside bounds, ignores foreign pointers and completes", async () => {
  const complete = vi.fn();
  await render(<Slider onChangeComplete={complete} />);
  const slider = geometry();
  await act(() => slider.dispatchEvent(pointer("pointerdown", 20)));
  await act(() => window.dispatchEvent(pointer("pointermove", 70, 50, 2)));
  expect(handle().getAttribute("aria-valuenow")).toBe("20");
  await act(() => window.dispatchEvent(pointer("pointermove", 130)));
  expect(handle().getAttribute("aria-valuenow")).toBe("100");
  await act(() => window.dispatchEvent(pointer("pointerup", 130)));
  expect(complete).toHaveBeenCalledWith(100);
  expect(complete).toHaveBeenCalledTimes(1);
});
it("vertical reverse maps top to minimum and bottom to maximum", async () => {
  await render(<Slider vertical reverse />);
  const slider = geometry();
  await act(() => slider.dispatchEvent(pointer("pointerdown", 50, 20)));
  expect(handle().getAttribute("aria-valuenow")).toBe("20");
  await act(() => window.dispatchEvent(pointer("pointerup", 50, 20)));
});
it("disabled ignores keyboard and pointer and unmount clears drag listeners", async () => {
  const change = vi.fn();
  await render(<Slider disabled onChange={change} />);
  const slider = geometry();
  await key("ArrowRight");
  await act(() => slider.dispatchEvent(pointer("pointerdown", 50)));
  expect(change).not.toHaveBeenCalled();
  await act(() => root?.render(<Slider onChange={change} />));
  await act(() => slider.dispatchEvent(pointer("pointerdown", 20)));
  const count = change.mock.calls.length;
  await act(() => root?.unmount());
  root = undefined;
  await act(() => window.dispatchEvent(pointer("pointermove", 60)));
  expect(change).toHaveBeenCalledTimes(count);
});
it("coincident range handles can open a range from a rail click", async () => {
  await render(<Slider range />);
  const slider = geometry();
  await act(() => slider.dispatchEvent(pointer("pointerdown", 60)));
  expect(handle(0).getAttribute("aria-valuenow")).toBe("0");
  expect(handle(1).getAttribute("aria-valuenow")).toBe("60");
  await act(() => window.dispatchEvent(pointer("pointerup", 60)));
});
