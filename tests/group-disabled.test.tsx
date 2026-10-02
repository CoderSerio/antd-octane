import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Checkbox } from "../packages/antd-octane/src/checkbox";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { Radio } from "../packages/antd-octane/src/radio";

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

for (const [name, Control] of [
  ["Checkbox", Checkbox],
  ["Radio", Radio],
] as const) {
  it(`${name}.Group options honor an explicit disabled=false inside a disabled provider`, async () => {
    const change = vi.fn();
    const options = [
      "Enabled",
      { label: "Blocked", value: "blocked", disabled: true },
    ];
    await render(
      <ConfigProvider componentDisabled>
        <Control.Group disabled={false} options={options} onChange={change} />
        <Control.Group disabled={false}>
          <Control value="child">Child</Control>
        </Control.Group>
      </ConfigProvider>,
    );
    const inputs = container.querySelectorAll("input");
    expect([...inputs].map((input) => input.disabled)).toEqual([
      false,
      true,
      false,
    ]);
    await act(() => inputs[0].click());
    expect(inputs[0].checked).toBe(true);
    expect(change).toHaveBeenCalledOnce();
    await act(() => inputs[1].click());
    expect(change).toHaveBeenCalledOnce();

    await render(
      <ConfigProvider componentDisabled>
        <Control.Group options={options} onChange={change} />
      </ConfigProvider>,
    );
    expect(
      [...container.querySelectorAll("input")].every((input) => input.disabled),
    ).toBe(true);
    await render(
      <ConfigProvider componentDisabled={false}>
        <Control.Group disabled options={options} onChange={change} />
      </ConfigProvider>,
    );
    expect(
      [...container.querySelectorAll("input")].every((input) => input.disabled),
    ).toBe(true);
  });
}
