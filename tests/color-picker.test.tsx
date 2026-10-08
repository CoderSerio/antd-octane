import { act, createRoot, type ElementDescriptor, type Root } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Color, ColorPicker } from "../packages/antd-octane/src/color-picker";
import { parseColor } from "../packages/antd-octane/src/color-picker/color";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";

let root: Root | undefined;
let host: HTMLDivElement;
const extras: HTMLElement[] = [];
async function render(node: ElementDescriptor) {
  if (!root) {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  }
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  host?.remove();
  for (const node of extras.splice(0)) node.remove();
  vi.restoreAllMocks();
});
function input(label: string) {
  const element = document.querySelector<HTMLInputElement>(
    `input[aria-label="${label}"]`,
  );
  if (!element) throw Error(`Missing ${label}`);
  return element;
}
async function edit(text: string) {
  await act(() => {
    input("Color value").value = text;
    input("Color value").dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function enter() {
  await act(() =>
    input("Color value").dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
}
async function button(text: string) {
  const element = [...document.querySelectorAll("button")].find(
    (e) => e.textContent === text || e.getAttribute("aria-label") === text,
  );
  if (!element) throw Error(`Missing ${text}`);
  await act(() => element.click());
}
it("solid color roundtrips RGB/HSB/alpha and copies values", () => {
  const color = new Color("#ff000080");
  expect(color.toRgb()).toMatchObject({ r: 255, g: 0, b: 0 });
  expect(new Color(color).toHexString()).toBe("#ff000080");
  expect(new Color(color.toHsb()).toHex()).toBe("ff000080");
  expect(new Color(null).cleared).toBe(true);
  expect(parseColor("hsba(120, 100%, 100%, 0.5)")?.toHexString()).toBe(
    "#00ff0080",
  );
  for (const invalid of [
    "#12345",
    "rgb(300, 0, 0)",
    "rgb(1..2,0,0)",
    "hsb(30,2,3)",
    "rgb(1,2,3,.5)",
    "red",
    "rgb(-1,0,0)",
    "rgba(0,0,0,2)",
  ])
    expect(parseColor(invalid)).toBeUndefined();
});
it("uncontrolled edits validate before change and clear has explicit semantics", async () => {
  const change = vi.fn(),
    complete = vi.fn(),
    clear = vi.fn();
  await render(
    <ColorPicker
      defaultOpen
      allowClear
      onChange={change}
      onChangeComplete={complete}
      onClear={clear}
    />,
  );
  await edit("#12345");
  await enter();
  expect(change).not.toHaveBeenCalled();
  expect(input("Color value").getAttribute("aria-invalid")).toBe("true");
  await edit("#00ff00");
  await enter();
  expect(change.mock.calls[0][0].toHexString()).toBe("#00ff00");
  expect(complete).toHaveBeenCalledTimes(1);
  expect(input("Color value").value).toBe("#00ff00");
  await button("Clear");
  expect(change.mock.lastCall?.[0].cleared).toBe(true);
  expect(clear).toHaveBeenCalledOnce();
  expect(input("Color value").value).toBe("");
});
it("controlled values wait for the parent and external updates reset draft", async () => {
  const change = vi.fn();
  await render(<ColorPicker value="#ff0000" open onChange={change} />);
  await edit("#00ff00");
  await enter();
  expect(change.mock.calls[0][0].toHexString()).toBe("#00ff00");
  expect(input("Color value").value).toBe("#ff0000");
  await edit("incomplete");
  await render(<ColorPicker value="#0000ff" open onChange={change} />);
  expect(input("Color value").value).toBe("#0000ff");
  await render(<ColorPicker value={null} open onChange={change} />);
  expect(input("Color value").value).toBe("");
});
it("null default stays empty, alpha controls can be disabled and format can be controlled", async () => {
  const format = vi.fn();
  await render(
    <ColorPicker
      defaultValue={null}
      defaultOpen
      disabledAlpha
      format="hex"
      onFormatChange={format}
    />,
  );
  expect(input("Color value").value).toBe("");
  expect(document.querySelector('[aria-label="Alpha"]')).toBeNull();
  await edit("#ff000080");
  await enter();
  expect(input("Color value").value).toBe("#ff0000");
  const select = document.querySelector("select");
  if (!select) throw Error("Missing format select");
  await act(() => {
    select.value = "rgb";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(format).toHaveBeenCalledWith("rgb");
  expect(select.value).toBe("hex");
});
it("provider disabling, popup container, prefix and Escape focus work together", async () => {
  const portal = document.createElement("div");
  document.body.append(portal);
  extras.push(portal);
  await render(
    <ConfigProvider prefixCls="custom" getPopupContainer={() => portal}>
      <ColorPicker defaultOpen />
    </ConfigProvider>,
  );
  expect(portal.querySelector(".custom-color-picker-panel")).not.toBeNull();
  await act(() => input("Hue").focus());
  await act(() =>
    input("Hue").dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  expect(host.querySelector("button")?.getAttribute("aria-expanded")).toBe(
    "false",
  );
  expect(document.activeElement).toBe(host.querySelector("button"));
  await render(
    <ConfigProvider componentDisabled>
      <ColorPicker open />
    </ConfigProvider>,
  );
  expect(host.querySelector("button")?.disabled).toBe(true);
  expect(
    document.querySelector('[role="dialog"]')?.closest('[aria-hidden="true"]'),
  ).not.toBeNull();
});
it("presets commit once; IME Enter does not commit draft", async () => {
  const change = vi.fn(),
    complete = vi.fn();
  await render(
    <ColorPicker
      defaultOpen
      presets={[{ label: "Brand", colors: ["#ff0000"] }]}
      onChange={change}
      onChangeComplete={complete}
    />,
  );
  await edit("#00ff00");
  await act(() =>
    input("Color value").dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        isComposing: true,
      }),
    ),
  );
  expect(change).not.toHaveBeenCalled();
  await button("#ff0000");
  expect(change).toHaveBeenCalledOnce();
  expect(complete).toHaveBeenCalledOnce();
});
it("drag tracks only its pointer and removes document listeners on unmount", async () => {
  const change = vi.fn(),
    complete = vi.fn();
  await render(
    <ColorPicker defaultOpen onChange={change} onChangeComplete={complete} />,
  );
  const panel = document.querySelector<HTMLElement>(
    ".ant-color-picker-saturation",
  );
  if (!panel) throw Error("Missing color panel");
  vi.spyOn(panel, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100,
    toJSON: () => ({}),
  });
  const pointer = (type: string, id: number, x: number) =>
    new PointerEvent(type, {
      pointerId: id,
      clientX: x,
      clientY: 20,
      button: 0,
      bubbles: true,
    });
  await act(() => panel.dispatchEvent(pointer("pointerdown", 1, 30)));
  expect(change).toHaveBeenCalledOnce();
  await act(() => document.dispatchEvent(pointer("pointerup", 2, 80)));
  expect(complete).not.toHaveBeenCalled();
  await act(() => document.dispatchEvent(pointer("pointerup", 1, 80)));
  expect(complete).toHaveBeenCalledOnce();
  await act(() => panel.dispatchEvent(pointer("pointerdown", 1, 30)));
  await act(() => root?.unmount());
  root = undefined;
  const count = change.mock.calls.length;
  await act(() => document.dispatchEvent(pointer("pointermove", 1, 90)));
  expect(change).toHaveBeenCalledTimes(count);
});

it("external transparent-to-cleared updates discard stale draft and validation", async () => {
  await render(<ColorPicker value="#00000000" open />);
  await edit("invalid");
  await enter();
  expect(input("Color value").getAttribute("aria-invalid")).toBe("true");
  await render(<ColorPicker value={null} open />);
  expect(input("Color value").value).toBe("");
  expect(input("Color value").getAttribute("aria-invalid")).toBeNull();
});
