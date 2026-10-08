import dayjs from "dayjs";
import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import {
  DatePicker,
  type DateRange,
} from "../packages/antd-octane/src/date-picker";
import { Form } from "../packages/antd-octane/src/form";

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
function required<T>(value: T | null | undefined): T {
  if (value == null) throw Error("Missing fixture element");
  return value;
}
function input(index: 0 | 1) {
  return required(container.querySelectorAll("input")[index]);
}
async function type(index: 0 | 1, value: string) {
  await act(() => {
    input(index).value = value;
    input(index).dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function key(index: 0 | 1, key: string) {
  await act(() =>
    input(index).dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
    ),
  );
}
async function date(value: string) {
  await act(() =>
    required(
      document.querySelector<HTMLButtonElement>(`[data-date="${value}"]`),
    ).click(),
  );
}
async function ok() {
  await act(() =>
    required(
      [...document.querySelectorAll("button")].find(
        (button) => button.textContent === "OK",
      ),
    ).click(),
  );
}
const initial: DateRange = [dayjs("2025-06-10"), dayjs("2025-06-20")];
it("automatically commits only after the second endpoint, with original tuple callbacks", async () => {
  const change = vi.fn(),
    calendar = vi.fn();
  await render(
    <DatePicker.RangePicker
      defaultValue={initial}
      defaultOpen
      onChange={change}
      onCalendarChange={calendar}
    />,
  );
  await date("2025-06-12");
  expect(change).not.toHaveBeenCalled();
  expect(calendar.mock.lastCall?.[2]).toEqual({ range: "start" });
  await date("2025-06-22");
  expect(change.mock.lastCall?.[1]).toEqual(["2025-06-12", "2025-06-22"]);
  expect(input(0).value).toBe("2025-06-12");
  expect(input(1).getAttribute("aria-expanded")).toBe("false");
});
it("keeps needConfirm drafts separate, rejects inverse ranges without swapping, then confirms", async () => {
  const change = vi.fn();
  await render(
    <DatePicker.RangePicker
      defaultValue={initial}
      defaultOpen
      needConfirm
      onChange={change}
    />,
  );
  await date("2025-06-25");
  await date("2025-06-22");
  await ok();
  expect(change).not.toHaveBeenCalled();
  expect(input(0).getAttribute("aria-invalid")).toBe("true");
  await date("2025-06-28");
  expect(change).not.toHaveBeenCalled();
  await ok();
  expect(change.mock.lastCall?.[1]).toEqual(["2025-06-25", "2025-06-28"]);
});
it("strictly parses input dates and rejects disabled input dates", async () => {
  const change = vi.fn();
  await render(
    <DatePicker.RangePicker
      onChange={change}
      disabledDate={(value) => value.date() === 1}
    />,
  );
  await type(0, "2025-02-31");
  await type(1, "2025-03-05");
  await key(1, "Enter");
  expect(change).not.toHaveBeenCalled();
  await type(0, "2025-03-01");
  await key(1, "Enter");
  expect(change).not.toHaveBeenCalled();
  await type(0, "2025-03-02");
  await key(1, "Enter");
  expect(change.mock.lastCall?.[1]).toEqual(["2025-03-02", "2025-03-05"]);
});
it("preserves a controlled null when the parent rejects a valid tuple", async () => {
  const change = vi.fn();
  await render(<DatePicker.RangePicker value={null} onChange={change} />);
  await type(0, "2025-05-10");
  await type(1, "2025-05-20");
  await key(1, "Enter");
  expect(change.mock.lastCall?.[1]).toEqual(["2025-05-10", "2025-05-20"]);
  expect(input(0).value).toBe("");
  expect(input(1).value).toBe("");
});
it("syncs parent values into an open panel without clobbering unrelated drafts", async () => {
  await render(<DatePicker.RangePicker value={initial} open needConfirm />);
  await date("2025-06-12");
  await render(
    <DatePicker.RangePicker
      value={[...initial]}
      open
      needConfirm
      size="large"
    />,
  );
  expect(input(0).value).toBe("2025-06-12");
  await render(
    <DatePicker.RangePicker
      value={[dayjs("2030-01-10"), dayjs("2030-01-20")]}
      open
      needConfirm
    />,
  );
  expect(input(0).value).toBe("2030-01-10");
  expect(
    document.querySelector(".ao-picker-grid")?.getAttribute("aria-label"),
  ).toBe("2030-01");
});
it("supports a frozen endpoint and does not clear it", async () => {
  const change = vi.fn();
  await render(
    <DatePicker.RangePicker
      defaultValue={initial}
      disabled={[true, false]}
      defaultOpen
      onChange={change}
    />,
  );
  expect(input(0).disabled).toBe(true);
  expect(container.querySelector('[aria-label="Clear"]')).toBeNull();
  await date("2025-06-25");
  expect(change.mock.lastCall?.[1]).toEqual(["2025-06-10", "2025-06-25"]);
});
it("requires explicit completion for an allowed empty endpoint", async () => {
  const change = vi.fn();
  await render(
    <DatePicker.RangePicker
      defaultValue={initial}
      allowEmpty={[true, false]}
      defaultOpen
      onChange={change}
    />,
  );
  await type(0, "");
  await ok();
  expect(change.mock.lastCall?.[0]?.[0]).toBeNull();
  expect(change.mock.lastCall?.[1]).toEqual(["", "2025-06-20"]);
});
it("clears the entire range and collects tuples through Form.Item", async () => {
  const values = vi.fn();
  await render(
    <Form onValuesChange={values}>
      <Form.Item name="period">
        <DatePicker.RangePicker />
      </Form.Item>
    </Form>,
  );
  await type(0, "2025-04-10");
  await type(1, "2025-04-20");
  await key(1, "Enter");
  expect(dayjs.isDayjs(values.mock.lastCall?.[0].period[0])).toBe(true);
  await act(() =>
    required(
      container.querySelector<HTMLButtonElement>('[aria-label="Clear"]'),
    ).click(),
  );
  expect(values.mock.lastCall?.[0]).toEqual({ period: null });
});
it("keeps IME Enter uncommitted and discards drafts on Escape", async () => {
  const change = vi.fn();
  await render(
    <DatePicker.RangePicker
      defaultValue={initial}
      defaultOpen
      onChange={change}
    />,
  );
  await type(0, "2025-06-11");
  await act(() =>
    input(0).dispatchEvent(
      new CompositionEvent("compositionstart", { bubbles: true }),
    ),
  );
  await key(0, "Enter");
  expect(change).not.toHaveBeenCalled();
  await act(() =>
    input(0).dispatchEvent(
      new CompositionEvent("compositionend", { bubbles: true }),
    ),
  );
  await key(0, "Escape");
  expect(input(0).value).toBe("2025-06-10");
});
it("inherits a popup container and navigates keyboard dates across months", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  try {
    await render(
      <ConfigProvider getPopupContainer={() => target}>
        <DatePicker.RangePicker
          defaultValue={[dayjs("2024-02-29"), null]}
          needConfirm
        />
      </ConfigProvider>,
    );
    await key(0, "ArrowDown");
    expect(target.querySelector('[role="dialog"]')).not.toBeNull();
    await act(() =>
      document.activeElement?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
          cancelable: true,
        }),
      ),
    );
    expect(document.activeElement?.getAttribute("data-date")).toBe(
      "2024-03-01",
    );
  } finally {
    await act(() => root?.unmount());
    root = undefined;
    target.remove();
  }
});
it("switches the open calendar when keyboard focus moves to the other endpoint", async () => {
  await render(
    <DatePicker.RangePicker
      defaultOpen
      defaultValue={[dayjs("2025-06-10"), dayjs("2030-01-20")]}
    />,
  );
  await act(() => input(0).focus());
  await act(() => input(1).focus());
  expect(document.querySelector("table")?.getAttribute("aria-label")).toBe(
    "2030-01",
  );
  expect(input(1).getAttribute("aria-expanded")).toBe("true");
  expect(input(0).getAttribute("aria-expanded")).toBe("false");
});
