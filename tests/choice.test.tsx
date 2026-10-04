import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Rate } from "../packages/antd-octane/src/rate";
import { Segmented } from "../packages/antd-octane/src/segmented";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  if (!root) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
});
async function key(element: Element | null, key: string) {
  if (!element) throw Error("Missing keyboard target");
  await act(() =>
    element.dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
    ),
  );
}
it("Segmented selects numeric values, keeps a form name and matches rc-segmented arrow navigation", async () => {
  const change = vi.fn();
  await render(
    <Segmented
      name="period"
      options={[1, { value: 2, label: "two", disabled: true }, 3]}
      onChange={change}
    />,
  );
  const inputs = container.querySelectorAll("input");
  expect(inputs[0].checked).toBe(true);
  expect(inputs[0].name).toBe("period");
  await key(inputs[0], "ArrowRight");
  // rc-segmented 2.7.1 moves by index, including a disabled option.
  expect(change).toHaveBeenLastCalledWith(2);
  expect(inputs[1].checked).toBe(true);
  await key(inputs[1], "ArrowRight");
  expect(inputs[2].checked).toBe(true);
  await key(inputs[2], "End");
  expect(change).toHaveBeenCalledTimes(2);
  expect(inputs[2].checked).toBe(true);
  await key(inputs[2], "ArrowRight");
  expect(inputs[0].checked).toBe(true);
});
it("Segmented respects controlled rejection and disabled groups", async () => {
  const change = vi.fn();
  await render(<Segmented options={["A", "B"]} value="A" onChange={change} />);
  await key(container.querySelector("input"), "ArrowRight");
  expect(change).toHaveBeenCalledWith("B");
  expect(container.querySelector("input")?.checked).toBe(true);
  await act(() => container.querySelectorAll("input")[1].click());
  expect(container.querySelectorAll("input")[0].checked).toBe(true);
  expect(container.querySelectorAll("input")[1].checked).toBe(false);
  await render(<Segmented options={["A", "B"]} disabled onChange={change} />);
  change.mockClear();
  await key(container.firstElementChild, "End");
  expect(change).not.toHaveBeenCalled();
  expect(
    [...container.querySelectorAll("input")].every((i) => i.disabled),
  ).toBe(true);
});
it("Segmented with disabled default option keeps an enabled tab stop and unnamed groups independent", async () => {
  await render(
    <div>
      <Segmented options={[{ value: "A", disabled: true }, "B"]} />
      <Segmented options={["A", "B"]} />
    </div>,
  );
  const inputs = container.querySelectorAll("input");
  expect(inputs[1].tabIndex).toBe(0);
  expect(inputs[0].name).not.toBe(inputs[2].name);
});
it("Rate keyboard changes half values with bounds and supports controlled rejection", async () => {
  const change = vi.fn();
  await render(<Rate allowHalf defaultValue={2} onChange={change} />);
  const rate = container.firstElementChild;
  if (!rate) throw Error("Missing Rate");
  await key(rate, "ArrowRight");
  expect(rate.getAttribute("aria-valuenow")).toBe("2.5");
  await key(rate, "End");
  expect(rate.getAttribute("aria-valuenow")).toBe("5");
  await key(rate, "ArrowRight");
  expect(change).toHaveBeenCalledTimes(2);
  await key(rate, "Home");
  expect(rate.getAttribute("aria-valuenow")).toBe("0");
  await render(<Rate value={3} allowHalf onChange={change} />);
  await key(rate, "ArrowLeft");
  expect(change).toHaveBeenLastCalledWith(2.5);
  expect(rate.getAttribute("aria-valuenow")).toBe("3");
});
it("Rate pointer half selection, hover clearing and allowClear", async () => {
  const hover = vi.fn();
  await render(<Rate allowHalf onHoverChange={hover} />);
  const star = container.querySelectorAll<HTMLElement>(".ant-rate-star")[1];
  vi.spyOn(star, "getBoundingClientRect").mockReturnValue({
    left: 20,
    width: 20,
  } as DOMRect);
  await act(() =>
    star.dispatchEvent(
      new MouseEvent("mousemove", { bubbles: true, clientX: 25 }),
    ),
  );
  expect(hover).toHaveBeenCalledWith(1.5);
  expect(star.className).toContain("half");
  await act(() =>
    star.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 25 })),
  );
  expect(container.firstElementChild?.getAttribute("aria-valuenow")).toBe(
    "1.5",
  );
  await act(() =>
    star.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 25 })),
  );
  expect(container.firstElementChild?.getAttribute("aria-valuenow")).toBe("0");
  await render(<Rate allowClear={false} defaultValue={0} />);
  await act(() => star.click());
  await act(() => star.click());
  expect(container.firstElementChild?.getAttribute("aria-valuenow")).toBe("2");
});
it("Rate disabled and keyboard=false prevent editing; custom characters and tooltip descriptions remain", async () => {
  const change = vi.fn();
  await render(
    <Rate
      value={2}
      disabled
      count={3}
      character={({ index }: { index: number }) => String(index + 1)}
      tooltips={["差", "好", "优秀"]}
      onChange={change}
    />,
  );
  const rate = container.firstElementChild;
  if (!rate) throw Error("Missing Rate");
  await key(rate, "End");
  await act(() =>
    container.querySelector<HTMLElement>(".ant-rate-star")?.click(),
  );
  expect(change).not.toHaveBeenCalled();
  expect(rate.getAttribute("aria-valuetext")).toBe("好");
  expect(container.querySelectorAll(".ant-rate-star")).toHaveLength(3);
  await render(<Rate keyboard={false} onChange={change} />);
  await key(rate, "End");
  expect(change).not.toHaveBeenCalled();
});

it("Rate only displays a half star when allowHalf is enabled", async () => {
  await render(<Rate value={2.5} />);
  expect(container.querySelectorAll(".ant-rate-star-full")).toHaveLength(2);
  expect(container.querySelectorAll(".ant-rate-star-half")).toHaveLength(0);
  await render(<Rate allowHalf value={2.5} />);
  expect(container.querySelectorAll(".ant-rate-star-half")).toHaveLength(1);
});
