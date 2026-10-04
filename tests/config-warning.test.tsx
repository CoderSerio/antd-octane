import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { resetWarned } from "../packages/antd-octane/src/_util/warning";
import { Alert } from "../packages/antd-octane/src/alert";
import { Button } from "../packages/antd-octane/src/button";
import {
  ConfigProvider,
  useConfig,
} from "../packages/antd-octane/src/config-provider";
import { Input } from "../packages/antd-octane/src/input";

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
