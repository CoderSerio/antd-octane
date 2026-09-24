import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CheckboxRef, InputRef } from "../packages/antd-octane/src";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Input,
  theme,
} from "../packages/antd-octane/src";

let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
  return container;
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
});
function getInput() {
  const node = container.querySelector("input");
  if (!node) throw new Error("Expected an input");
  return node;
}
async function type(input: HTMLInputElement, value: string) {
  await act(() => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("Input behavior", () => {
  it("updates controlled values on every input with the native target", async () => {
    const change = vi.fn();
    function Example() {
      const [value, set] = useState("");
      return (
        <>
          <Input
            value={value}
            onChange={(event) => {
              change(event);
              set(event.target.value);
            }}
          />
          <output>{value}</output>
        </>
      );
    }
    await render(<Example />);
    const input = getInput();
    await type(input, "中");
    await type(input, "中文");
    expect(change).toHaveBeenCalledTimes(2);
    expect(change.mock.calls[0][0]).toBeInstanceOf(Event);
    expect(change.mock.calls[0][0].target).toBe(input);
    expect(container.querySelector("output")?.textContent).toBe("中文");
  });
  it("restores a controlled value when the owner rejects an edit", async () => {
    await render(<Input value="fixed" onChange={() => {}} />);
    const input = getInput();
    await type(input, "rejected");
    expect(input.value).toBe("fixed");
  });
  it("keeps uncontrolled edits across unrelated renders and supports native form reset", async () => {
    function Example() {
      const [count, set] = useState(0);
      return (
        <form>
          <Input defaultValue="seed" />
          <Button onClick={() => set(count + 1)}>{count}</Button>
        </form>
      );
    }
    await render(<Example />);
    const input = getInput();
    await type(input, "edited");
    await act(() => container.querySelector("button")?.click());
    expect(input.value).toBe("edited");
    await act(() => container.querySelector("form")?.reset());
    expect(input.value).toBe("seed");
  });
  it("does not submit through onPressEnter during composition or a cancelled keydown", async () => {
    const enter = vi.fn();
    await render(
      <Input
        onPressEnter={enter}
        onKeyDown={(event) => {
          if (event.shiftKey) event.preventDefault();
        }}
      />,
    );
    const input = getInput();
    await act(() => {
      input.dispatchEvent(new Event("compositionstart", { bubbles: true }));
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      input.dispatchEvent(new Event("compositionend", { bubbles: true }));
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    });
    expect(enter).not.toHaveBeenCalled();
    await act(() =>
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      ),
    );
    expect(enter).toHaveBeenCalledOnce();
  });
  it("exposes focus/select and clears object refs on unmount", async () => {
    const ref = { current: null as InputRef | null };
    await render(<Input ref={ref} defaultValue="select me" />);
    ref.current?.focus();
    ref.current?.select();
    expect(document.activeElement).toBe(ref.current?.input);
    expect(ref.current?.input?.selectionEnd).toBe(9);
    expect(ref.current?.nativeElement).toBe(ref.current?.input);
    await act(() => root?.unmount());
    root = undefined;
    expect(ref.current).toBeNull();
  });
  it("inherits provider defaults while honoring local overrides and input semantics", async () => {
    await render(
      <ConfigProvider componentSize="large" componentDisabled>
        <Input
          disabled={false}
          status="error"
          readOnly
          name="name"
          placeholder="Your name"
        />
        <Input />
      </ConfigProvider>,
    );
    const [local, inherited] = container.querySelectorAll("input");
    expect(local.disabled).toBe(false);
    expect(local.readOnly).toBe(true);
    expect(local.name).toBe("name");
    expect(local.getAttribute("aria-invalid")).toBe("true");
    expect(local.classList.contains("ant-input-large")).toBe(true);
    expect(inherited.disabled).toBe(true);
  });
});
describe("Checkbox behavior", () => {
  it("reports antd-style checked/value and a native event", async () => {
    const change = vi.fn();
    await render(
      <Checkbox value="agree" onChange={change}>
        同意
      </Checkbox>,
    );
    const input = getInput();
    await act(() => input.click());
    expect(input.checked).toBe(true);
    expect(change).toHaveBeenCalledOnce();
    expect(change.mock.calls[0][0].target).toMatchObject({
      value: "agree",
      checked: true,
    });
    expect(change.mock.calls[0][0].nativeEvent).toBeInstanceOf(Event);
  });
  it("supports controlled accept/reject and programmatic updates", async () => {
    function Example() {
      const [checked, set] = useState(false);
      return (
        <>
          <Checkbox
            checked={checked}
            onChange={(event) => set(event.target.checked)}
          >
            Accept
          </Checkbox>
          <Checkbox checked={false} onChange={() => {}}>
            Reject
          </Checkbox>
          <Button onClick={() => set(false)}>Reset</Button>
        </>
      );
    }
    await render(<Example />);
    const [accept, reject] = container.querySelectorAll("input");
    await act(() => {
      accept.click();
      reject.click();
    });
    expect(accept.checked).toBe(true);
    expect(reject.checked).toBe(false);
    await act(() => container.querySelector("button")?.click());
    expect(accept.checked).toBe(false);
  });
  it("respects defaults, disabled inputs and native reset", async () => {
    const change = vi.fn();
    await render(
      <form>
        <Checkbox defaultChecked name="choice" value="yes">
          Choice
        </Checkbox>
        <Checkbox disabled onChange={change}>
          Disabled
        </Checkbox>
      </form>,
    );
    const [input, disabled] = container.querySelectorAll("input");
    await act(() => {
      input.click();
      disabled.click();
    });
    expect(input.checked).toBe(false);
    expect(change).not.toHaveBeenCalled();
    await act(() => container.querySelector("form")?.reset());
    expect(input.checked).toBe(true);
  });
  it("sets native indeterminate and exposes the input and component ref", async () => {
    const ref = { current: null as CheckboxRef | null };
    await render(
      <Checkbox ref={ref} indeterminate>
        Partial
      </Checkbox>,
    );
    expect(ref.current?.input?.indeterminate).toBe(true);
    expect(ref.current?.nativeElement?.classList.contains("ant-checkbox")).toBe(
      true,
    );
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current?.input);
    ref.current?.blur();
    expect(document.activeElement).not.toBe(ref.current?.input);
  });
  it("merges component theme overrides and isolates nested scopes", async () => {
    await render(
      <ConfigProvider
        theme={{
          token: { colorPrimary: "#722ed1" },
          components: {
            Input: { activeBorderColor: "#123456" },
            Checkbox: { colorPrimary: "#654321" },
          },
        }}
      >
        <Input />
        <Checkbox>Outer</Checkbox>
        <ConfigProvider
          theme={{ components: { Input: { inputFontSize: 18 } } }}
        >
          <Input />
        </ConfigProvider>
        <ConfigProvider
          theme={{ inherit: false, algorithm: theme.darkAlgorithm }}
        >
          <Input />
          <Checkbox>Inner</Checkbox>
        </ConfigProvider>
      </ConfigProvider>,
    );
    const inputs = container.querySelectorAll<HTMLInputElement>(".ant-input");
    expect(inputs[0].style.getPropertyValue("--ao-input-active")).toBe(
      "#123456",
    );
    expect(inputs[1].style.getPropertyValue("--ao-input-active")).toBe(
      "#123456",
    );
    expect(inputs[1].style.getPropertyValue("--ao-input-font-size")).toBe(
      "18px",
    );
    expect(inputs[2].style.getPropertyValue("--ao-input-bg")).toBe("#141414");
    expect(
      container
        .querySelector<HTMLElement>(".ant-checkbox-wrapper")
        ?.style.getPropertyValue("--ao-check-primary"),
    ).toBe("#654321");
  });
});
