import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useContext, useState } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  devUseWarning,
  resetWarned,
  type TypeWarning,
} from "../packages/antd-octane/src/_util/warning";
import { Alert } from "../packages/antd-octane/src/alert";
import { Button } from "../packages/antd-octane/src/button";
import {
  ConfigProvider,
  useConfig,
} from "../packages/antd-octane/src/config-provider";
import SizeContext from "../packages/antd-octane/src/config-provider/SizeContext";
import { Input, type InputRef } from "../packages/antd-octane/src/input";

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
beforeEach(() => {
  resetWarned();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
  resetWarned();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
function OfficialDemo() {
  return (
    <>
      <Alert closeText="deprecated" />
      <Input.Group />
    </>
  );
}
it("default warning policy emits individual deprecation messages", async () => {
  await render(<OfficialDemo />);
  expect(console.warn).not.toHaveBeenCalled();
  expect(console.error).toHaveBeenCalledTimes(2);
  expect(console.error).toHaveBeenCalledWith(
    "Warning: [antd-octane: Alert] `closeText` is deprecated. Please use `closable.closeIcon` instead.",
  );
  expect(console.error).toHaveBeenCalledWith(
    "Warning: [antd-octane: Input.Group] `Input.Group` is deprecated. Please use `Space.Compact` instead.",
  );
});
it("strict false aggregates unique messages into the first mutable warning", async () => {
  await render(
    <ConfigProvider warning={{ strict: false }}>
      <OfficialDemo />
      <OfficialDemo />
    </ConfigProvider>,
  );
  expect(console.error).not.toHaveBeenCalled();
  expect(console.warn).toHaveBeenCalledOnce();
  expect(console.warn).toHaveBeenCalledWith(
    "[antd-octane] There exists deprecated usage in your code:",
    {
      Alert: [
        "`closeText` is deprecated. Please use `closable.closeIcon` instead.",
      ],
      "Input.Group": [
        "`Input.Group` is deprecated. Please use `Space.Compact` instead.",
      ],
    },
  );
});
it("nested providers inherit warnings and can override their severity", async () => {
  await render(
    <ConfigProvider warning={{ strict: false }}>
      <ConfigProvider componentSize="small">
        <Alert closeText="inherited" />
      </ConfigProvider>
      <ConfigProvider warning={{ strict: true }}>
        <Input.Group />
      </ConfigProvider>
    </ConfigProvider>,
  );
  expect(console.warn).toHaveBeenCalledOnce();
  expect(console.error).toHaveBeenCalledOnce();
  expect(console.error).toHaveBeenCalledWith(
    expect.stringContaining("[antd-octane: Input.Group]"),
  );
});
it("an explicit empty warning config restores default individual warnings", async () => {
  await render(
    <ConfigProvider warning={{ strict: false }}>
      <ConfigProvider warning={{}}>
        <OfficialDemo />
      </ConfigProvider>
    </ConfigProvider>,
  );
  expect(console.warn).not.toHaveBeenCalled();
  expect(console.error).toHaveBeenCalledTimes(2);
});
it("usage and breaking warnings remain individual under strict false", async () => {
  function Probe() {
    const warning = devUseWarning("Probe");
    warning(true, "deprecated", "valid");
    warning(false, "usage", "invalid usage");
    warning(false, "breaking", "removed API");
    return null;
  }
  await render(
    <ConfigProvider warning={{ strict: false }}>
      <Probe />
    </ConfigProvider>,
  );
  expect(console.warn).not.toHaveBeenCalled();
  expect(console.error).toHaveBeenCalledTimes(2);
});
it("development warnings deduplicate until resetWarned", async () => {
  vi.stubEnv("NODE_ENV", "development");
  let probeWarning: TypeWarning | undefined;
  function Probe() {
    probeWarning = devUseWarning("Probe");
    return null;
  }
  await render(<Probe />);
  probeWarning?.deprecated(false, "old", "new", "extra detail");
  probeWarning?.deprecated(false, "old", "new", "extra detail");
  expect(console.error).toHaveBeenCalledOnce();
  expect(console.error).toHaveBeenCalledWith(
    "Warning: [antd-octane: Probe] `old` is deprecated. Please use `new` instead. extra detail",
  );
  resetWarned();
  probeWarning?.deprecated(false, "old", "new", "extra detail");
  expect(console.error).toHaveBeenCalledTimes(2);
});
it("production renders silently and empty Alert omits the message element", async () => {
  vi.stubEnv("NODE_ENV", "production");
  await render(
    <ConfigProvider warning={{ strict: false }}>
      <OfficialDemo />
    </ConfigProvider>,
  );
  expect(console.warn).not.toHaveBeenCalled();
  expect(console.error).not.toHaveBeenCalled();
  expect(container.querySelector(".ant-alert-message")).toBeNull();
  expect(container.querySelector(".ant-alert-no-icon")).not.toBeNull();
  expect(container.querySelector(".ant-alert-close-icon")?.textContent).toBe(
    "deprecated",
  );
  expect(
    container
      .querySelector(".ant-alert-close-icon")
      ?.hasAttribute("aria-label"),
  ).toBe(false);
});
it("Input.Group keeps native inputs, refs, events and controlled updates", async () => {
  const ref = { current: null as InputRef | null };
  const focus = vi.fn();
  const blur = vi.fn();
  const enter = vi.fn();
  const leave = vi.fn();
  function Demo() {
    const [value, setValue] = useState("first");
    return (
      <ConfigProvider direction="rtl" warning={{ strict: false }}>
        <Input.Group
          prefixCls="local-group"
          compact
          size="large"
          className="custom"
          style={{ width: "200px" }}
          onFocus={focus}
          onBlur={blur}
          onMouseEnter={enter}
          onMouseLeave={leave}
        >
          <Input
            ref={ref}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Input disabled value="disabled" />
        </Input.Group>
        <output>{value}</output>
        <button type="button">outside</button>
      </ConfigProvider>
    );
  }
  await render(<Demo />);
  const group = container.querySelector<HTMLSpanElement>(".local-group");
  const input = container.querySelector("input");
  expect(group?.classList.contains("local-group-compact")).toBe(true);
  expect(group?.classList.contains("local-group-lg")).toBe(true);
  expect(group?.classList.contains("local-group-rtl")).toBe(true);
  expect(group?.classList.contains("custom")).toBe(true);
  expect(group?.style.width).toBe("200px");
  expect(group?.hasAttribute("tabindex")).toBe(false);
  expect(ref.current?.input).toBe(input);
  await act(() => {
    input?.focus();
    if (input) input.value = "updated";
    input?.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(focus).toHaveBeenCalledOnce();
  expect(container.querySelector("input")).toBe(input);
  expect(container.querySelector("output")?.textContent).toBe("updated");
  await act(() => {
    container.querySelector("button")?.focus();
    group?.dispatchEvent(new MouseEvent("mouseenter"));
    group?.dispatchEvent(new MouseEvent("mouseleave"));
  });
  expect(blur).toHaveBeenCalledOnce();
  expect(enter).toHaveBeenCalledOnce();
  expect(leave).toHaveBeenCalledOnce();
  expect(container.querySelectorAll("input")[1]?.disabled).toBe(true);
});

it("ConfigProvider checks presence for the button alias and value for the popup alias", async () => {
  await render(
    <ConfigProvider
      autoInsertSpaceInButton={undefined}
      dropdownMatchSelectWidth={undefined}
    />,
  );
  expect(console.error).toHaveBeenCalledOnce();
  expect(console.error).toHaveBeenCalledWith(
    "Warning: [antd-octane: ConfigProvider] `autoInsertSpaceInButton` is deprecated. Please use `{ button: { autoInsertSpace: boolean }}` instead.",
  );
  expect(console.warn).not.toHaveBeenCalled();
});

it("the button alias consumes the enclosing warning policy and the popup alias consumes its own", async () => {
  await render(
    <ConfigProvider
      warning={{ strict: false }}
      autoInsertSpaceInButton={false}
      dropdownMatchSelectWidth={false}
    />,
  );
  expect(console.error).toHaveBeenCalledOnce();
  expect(console.error).toHaveBeenCalledWith(
    expect.stringContaining("autoInsertSpaceInButton"),
  );
  expect(console.warn).toHaveBeenCalledOnce();
  expect(console.warn).toHaveBeenCalledWith(
    "[antd-octane] There exists deprecated usage in your code:",
    {
      ConfigProvider: [
        "`dropdownMatchSelectWidth` is deprecated. Please use `popupMatchSelectWidth` instead.",
      ],
    },
  );
});

it("nested alias warnings honor the distinct parent and child policies", async () => {
  await render(
    <ConfigProvider warning={{ strict: false }}>
      <ConfigProvider
        warning={{ strict: true }}
        autoInsertSpaceInButton
        dropdownMatchSelectWidth
      />
    </ConfigProvider>,
  );
  expect(console.error).toHaveBeenCalledOnce();
  expect(console.error).toHaveBeenCalledWith(
    expect.stringContaining("dropdownMatchSelectWidth"),
  );
  expect(console.warn).toHaveBeenCalledOnce();
  expect(console.warn).toHaveBeenCalledWith(
    "[antd-octane] There exists deprecated usage in your code:",
    {
      ConfigProvider: [
        "`autoInsertSpaceInButton` is deprecated. Please use `{ button: { autoInsertSpace: boolean }}` instead.",
      ],
    },
  );
});

function ConfigValue() {
  const { button, popupMatchSelectWidth, prefixCls } = useConfig();
  return (
    <output>
      {JSON.stringify({
        autoInsertSpace: button?.autoInsertSpace,
        popupMatchSelectWidth,
        prefixCls,
      })}
    </output>
  );
}

function PopupOverflowValue() {
  return <output>{useConfig().popupOverflow}</output>;
}

function PopupRootValue() {
  const config = useConfig();
  return (
    <output>
      {String(
        config.getPopupContainer?.() instanceof ShadowRoot &&
          config.getTargetContainer?.() instanceof ShadowRoot,
      )}
    </output>
  );
}

it("popupOverflow defaults to viewport and inherits or overrides through nested providers", async () => {
  await render(
    <>
      <PopupOverflowValue />
      <ConfigProvider popupOverflow="scroll">
        <PopupOverflowValue />
        <ConfigProvider>
          <PopupOverflowValue />
        </ConfigProvider>
        <ConfigProvider popupOverflow="viewport">
          <PopupOverflowValue />
        </ConfigProvider>
      </ConfigProvider>
    </>,
  );
  expect(
    [...container.querySelectorAll("output")].map((node) => node.textContent),
  ).toEqual(["viewport", "scroll", "scroll", "viewport"]);
});

it("ConfigProvider accepts ShadowRoot popup and target containers", async () => {
  const host = document.createElement("div");
  const shadow = host.attachShadow({ mode: "open" });
  document.body.append(host);
  await render(
    <ConfigProvider
      getPopupContainer={() => shadow}
      getTargetContainer={() => shadow}
    >
      <PopupRootValue />
    </ConfigProvider>,
  );
  expect(container.querySelector("output")?.textContent).toBe("true");
  host.remove();
});

it.each([
  false,
  true,
])("legacy values %s drive the button and modern popup context", async (value) => {
  await render(
    <ConfigProvider
      autoInsertSpaceInButton={value}
      dropdownMatchSelectWidth={value}
    >
      <ConfigValue />
      <Button>确定</Button>
    </ConfigProvider>,
  );
  expect(
    JSON.parse(container.querySelector("output")?.textContent ?? "{}"),
  ).toMatchObject({ autoInsertSpace: value, popupMatchSelectWidth: value });
  expect(container.querySelector("button")?.textContent).toBe(
    value ? "确 定" : "确定",
  );
});

it("modern button defaults and popup width override their legacy aliases", async () => {
  await render(
    <ConfigProvider
      autoInsertSpaceInButton={false}
      dropdownMatchSelectWidth={true}
      button={{ autoInsertSpace: true }}
      popupMatchSelectWidth={false}
    >
      <ConfigValue />
      <Button>确定</Button>
    </ConfigProvider>,
  );
  expect(
    JSON.parse(container.querySelector("output")?.textContent ?? "{}"),
  ).toMatchObject({ autoInsertSpace: true, popupMatchSelectWidth: false });
  expect(container.querySelector("button")?.textContent).toBe("确 定");
});

it("inherited modern button configuration takes precedence over an inner alias", async () => {
  await render(
    <ConfigProvider
      prefixCls="outer"
      button={{ autoInsertSpace: false }}
      popupMatchSelectWidth={false}
    >
      <ConfigProvider
        prefixCls=""
        autoInsertSpaceInButton={true}
        dropdownMatchSelectWidth={true}
      >
        <ConfigValue />
        <Button>确定</Button>
      </ConfigProvider>
    </ConfigProvider>,
  );
  expect(
    JSON.parse(container.querySelector("output")?.textContent ?? "{}"),
  ).toEqual({
    autoInsertSpace: false,
    popupMatchSelectWidth: true,
    prefixCls: "outer",
  });
  expect(container.querySelector("button")?.textContent).toBe("确定");
});

it("an empty inner button config replaces the parent and undefined popup values inherit", async () => {
  await render(
    <ConfigProvider
      button={{ autoInsertSpace: false }}
      popupMatchSelectWidth={false}
    >
      <ConfigProvider
        button={{}}
        popupMatchSelectWidth={undefined}
        dropdownMatchSelectWidth={undefined}
      >
        <ConfigValue />
        <Button>确定</Button>
      </ConfigProvider>
    </ConfigProvider>,
  );
  expect(
    JSON.parse(container.querySelector("output")?.textContent ?? "{}"),
  ).toEqual({ popupMatchSelectWidth: false, prefixCls: "ant" });
  expect(container.querySelector("button")?.textContent).toBe("确 定");
});

it("deprecated SizeContext preserves its identity, value and direct warning", async () => {
  expect(ConfigProvider.SizeContext).toBe(SizeContext);
  expect(console.error).toHaveBeenCalledWith(
    "Warning: [antd-octane: ConfigProvider] ConfigProvider.SizeContext is deprecated. Please use `ConfigProvider.useConfig().componentSize` instead.",
  );
  function SizeValue() {
    return <output>{useContext(ConfigProvider.SizeContext)}</output>;
  }
  await render(
    <ConfigProvider componentSize="small" warning={{ strict: false }}>
      <SizeValue />
    </ConfigProvider>,
  );
  expect(container.querySelector("output")?.textContent).toBe("small");
  expect(console.warn).not.toHaveBeenCalled();
});

it("legacy aliases and SizeContext remain functional without production diagnostics", async () => {
  vi.stubEnv("NODE_ENV", "production");
  expect(ConfigProvider.SizeContext).toBe(SizeContext);
  await render(
    <ConfigProvider
      autoInsertSpaceInButton={false}
      dropdownMatchSelectWidth={false}
    >
      <ConfigValue />
      <Button>确定</Button>
    </ConfigProvider>,
  );
  expect(container.querySelector("button")?.textContent).toBe("确定");
  expect(console.error).not.toHaveBeenCalled();
  expect(console.warn).not.toHaveBeenCalled();
});
