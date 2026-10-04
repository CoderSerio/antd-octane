import dayjs from "dayjs";
import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Calendar } from "../packages/antd-octane/src/calendar";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";

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
});
function header() {
  const element = container.querySelector<HTMLElement>(
    ".ant-picker-calendar-header",
  );
  if (!element) throw Error("Missing Calendar header");
  return element;
}
function variable(name: string) {
  return header().style.getPropertyValue(`--ao-calendar-select-${name}`);
}

it("uses the upstream small Select dimensions in mini Calendar headers", async () => {
  await render(
    <Calendar fullscreen={false} defaultValue={dayjs("2025-12-10")} />,
  );
  expect(variable("height")).toBe("24px");
  expect(variable("radius")).toBe("4px");
  expect(variable("padding")).toBe("7px");
  expect(variable("arrow-padding")).toBe("21px");
  expect(variable("arrow-end")).toBe("11px");
  expect(variable("arrow-size")).toBe("12px");
  expect(header().querySelectorAll("[role=combobox]")).toHaveLength(2);
  expect(header().querySelector("select")).toBeNull();
});

it("uses provider size and nested Select alias tokens for fullscreen controls", async () => {
  await render(
    <ConfigProvider
      componentSize="large"
      theme={{
        token: { paddingSM: 20, lineWidth: 2 },
        components: {
          Select: { controlHeightLG: 44, borderRadiusLG: 9, fontSizeIcon: 15 },
        },
      }}
    >
      <Calendar defaultValue={dayjs("2025-12-10")} />
    </ConfigProvider>,
  );
  expect(variable("height")).toBe("44px");
  expect(variable("radius")).toBe("9px");
  expect(variable("padding")).toBe("19px");
  expect(variable("line-width")).toBe("2px");
  expect(variable("arrow-end")).toBe("19px");
  expect(variable("arrow-size")).toBe("15px");
});

it("keeps year selection clamping and mode switching through native controls", async () => {
  const select = vi.fn();
  const panel = vi.fn();
  await render(
    <Calendar
      fullscreen={false}
      defaultValue={dayjs("2025-12-10")}
      validRange={[dayjs("2025-06-01"), dayjs("2026-02-28")]}
      onSelect={select}
      onPanelChange={panel}
    />,
  );
  const year = header().querySelector<HTMLInputElement>(
    ".ant-picker-calendar-year-select [role=combobox]",
  );
  if (!year) throw Error("Missing year control");
  await act(() => year.click());
  const option = [
    ...header().querySelectorAll<HTMLElement>("[role=option]"),
  ].find((element) => element.textContent === "2026");
  if (!option) throw Error("Missing 2026 option");
  await act(() => option.click());
  expect(select.mock.lastCall?.[0].format("YYYY-MM-DD")).toBe("2026-02-10");
  expect(select.mock.lastCall?.[1]).toEqual({ source: "year" });
  const yearMode = header().querySelector<HTMLInputElement>(
    'input[type=radio][value="year"]',
  );
  if (!yearMode) throw Error("Missing year mode control");
  await act(() => yearMode.click());
  expect(
    header().querySelector(".ant-picker-calendar-month-select"),
  ).toBeNull();
  expect(panel.mock.lastCall?.[1]).toBe("year");
});
