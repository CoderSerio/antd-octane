import dayjs from "dayjs";
import "dayjs/locale/fr";
import { act, createRoot, type Root, useState } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import type { PickerRef } from "../packages/antd-octane/src/date-picker";
import { DatePicker } from "../packages/antd-octane/src/date-picker";
import { Form, type FormInstance } from "../packages/antd-octane/src/form";
import { TimePicker } from "../packages/antd-octane/src/time-picker";

let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
});
function required<T>(value: T | null | undefined): T {
  if (value == null) throw Error("Missing fixture element");
  return value;
}
function input() {
  const element = container.querySelector("input");
  if (!element) throw Error("Missing input");
  return element;
}
async function enter(text: string) {
  await act(() => {
    input().value = text;
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
}
it("rejects impossible and disabled dates, accepts leap dates and clears", async () => {
  const change = vi.fn();
  await act(() =>
    root.render(
      <DatePicker
        onChange={change}
        disabledDate={(date) => date.date() === 1}
      />,
    ),
  );
  await enter("2025-02-31");
  expect(change).not.toHaveBeenCalled();
  expect(input().getAttribute("aria-invalid")).toBe("true");
  await enter("2024-02-01");
  expect(change).not.toHaveBeenCalled();
  await enter("2024-02-29");
  expect(change.mock.lastCall?.[1]).toBe("2024-02-29");
  expect(input().value).toBe("2024-02-29");
  await act(() =>
    required(
      container.querySelector<HTMLButtonElement>('[aria-label="Clear"]'),
    ).click(),
  );
  expect(change.mock.lastCall).toEqual([null, ""]);
  expect(input().value).toBe("");
});
it("preserves controlled null and controlled closed state when parent rejects changes", async () => {
  const change = vi.fn(),
    open = vi.fn();
  await act(() =>
    root.render(
      <DatePicker
        value={null}
        defaultValue={dayjs("2020-01-01")}
        open={false}
        onChange={change}
        onOpenChange={open}
      />,
    ),
  );
  await act(() => input().click());
  expect(open).toHaveBeenCalledWith(true);
  expect(input().getAttribute("aria-expanded")).toBe("false");
  await enter("2025-05-10");
  expect(change.mock.lastCall?.[1]).toBe("2025-05-10");
  expect(input().value).toBe("");
});
it("syncs parent value updates and supports controlled Form-style values", async () => {
  function Fixture() {
    const [value, setValue] = useState<dayjs.Dayjs | null>(null);
    return <DatePicker value={value} onChange={setValue} />;
  }
  await act(() => root.render(<Fixture />));
  await enter("2025-06-15");
  expect(input().value).toBe("2025-06-15");
  await act(() => root.render(<DatePicker value={dayjs("2030-01-02")} />));
  expect(input().value).toBe("2030-01-02");
});
it("does not commit IME Enter, restores draft on Escape and navigates date buttons", async () => {
  const change = vi.fn();
  await act(() =>
    root.render(
      <DatePicker defaultValue={dayjs("2025-01-15")} onChange={change} />,
    ),
  );
  await act(() =>
    input().dispatchEvent(
      new CompositionEvent("compositionstart", { bubbles: true }),
    ),
  );
  await enter("2025-02-10");
  expect(change).not.toHaveBeenCalled();
  await act(() =>
    input().dispatchEvent(
      new CompositionEvent("compositionend", { bubbles: true }),
    ),
  );
  await act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    ),
  );
  const date = required(
    document.querySelector<HTMLButtonElement>('[data-date="2025-01-15"]'),
  );
  await act(() =>
    date.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(
    document.querySelector('[data-active="true"]')?.getAttribute("data-date"),
  ).toBe("2025-01-16");
  await act(() =>
    date.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  expect(input().value).toBe("2025-01-15");
  expect(input().getAttribute("aria-expanded")).toBe("false");
});
it("parses localized month names without changing global dayjs locale", async () => {
  const change = vi.fn();
  await act(() =>
    root.render(
      <DatePicker
        locale={{ locale: "fr" }}
        format="DD MMMM YYYY"
        onChange={change}
      />,
    ),
  );
  await enter("12 février 2025");
  expect(change.mock.lastCall?.[1]).toBe("12 février 2025");
  expect(dayjs.locale()).toBe("en");
});
it("uses provider locale and disabled state", async () => {
  await act(() =>
    root.render(
      <ConfigProvider
        componentDisabled
        locale={{
          locale: "custom",
          DatePicker: { placeholder: "Choose locally" },
        }}
      >
        <DatePicker />
      </ConfigProvider>,
    ),
  );
  expect(input().disabled).toBe(true);
  expect(input().placeholder).toBe("Choose locally");
});
it("validates time steps and disabled hours before committing", async () => {
  const change = vi.fn();
  await act(() =>
    root.render(
      <TimePicker
        minuteStep={15}
        secondStep={30}
        disabledTime={() => ({ disabledHours: () => [12] })}
        onChange={change}
      />,
    ),
  );
  for (const text of ["25:00:00", "12:00:00", "11:11:00", "11:15:01"]) {
    await enter(text);
    expect(change).not.toHaveBeenCalled();
  }
  await enter("11:15:30");
  expect(change.mock.lastCall?.[1]).toBe("11:15:30");
});
it("time panel edits stay draft until confirmation and Escape discards them", async () => {
  const change = vi.fn();
  await act(() =>
    root.render(
      <TimePicker
        defaultValue={dayjs("2025-01-01T10:00:00")}
        onChange={change}
      />,
    ),
  );
  await act(() => input().click());
  const hour = required(
    document.querySelector<HTMLSelectElement>('[aria-label="Hour"]'),
  );
  await act(() => {
    hour.value = "11";
    hour.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(change).not.toHaveBeenCalled();
  await act(() =>
    hour.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    ),
  );
  expect(input().value).toBe("10:00:00");
  await act(() => input().click());
  const next = required(
    document.querySelector<HTMLSelectElement>('[aria-label="Hour"]'),
  );
  await act(() => {
    next.value = "11";
    next.dispatchEvent(new Event("change", { bubbles: true }));
  });
  const ok = required(
    [...document.querySelectorAll("button")].find(
      (button) => button.textContent === "OK",
    ),
  );
  await act(() => ok.click());
  expect(change.mock.lastCall?.[1]).toBe("11:00:00");
});

it("collects and resets Dayjs values through Form.Item and exposes the input ref", async () => {
  let form: FormInstance | undefined;
  let picker: PickerRef | null = null;
  const changed = vi.fn();
  function Fixture() {
    const [instance] = Form.useForm();
    form = instance;
    return (
      <Form form={instance} onValuesChange={changed}>
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DatePicker
            ref={(value) => {
              picker = value;
            }}
          />
        </Form.Item>
      </Form>
    );
  }
  await act(() => root.render(<Fixture />));
  required<PickerRef>(picker).focus();
  expect(document.activeElement).toBe(input());
  await enter("2025-08-12");
  expect(dayjs.isDayjs(form?.getFieldValue("date"))).toBe(true);
  expect(changed).toHaveBeenCalled();
  await act(() => form?.resetFields());
  expect(input().value).toBe("");
});
it("retains the draft while focus enters the panel and closes on leaving the widget", async () => {
  await act(() =>
    root.render(<DatePicker defaultValue={dayjs("2025-06-15")} />),
  );
  await act(() => input().click());
  const cell = required(
    document.querySelector<HTMLButtonElement>('[data-date="2025-06-15"]'),
  );
  await act(() =>
    input().dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: cell }),
    ),
  );
  expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  await act(() =>
    cell.dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        relatedTarget: document.body,
      }),
    ),
  );
  expect(input().getAttribute("aria-expanded")).toBe("false");
});

it("portals outside clipping parents and inherits provider popup containers", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  try {
    await act(() =>
      root.render(
        <ConfigProvider getPopupContainer={() => host}>
          <DatePicker defaultOpen />
        </ConfigProvider>,
      ),
    );
    expect(host.querySelector('[role="dialog"]')).not.toBeNull();
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
});
it("keeps keyboard focus on the intended date across month boundaries", async () => {
  const change = vi.fn();
  await act(() =>
    root.render(
      <DatePicker
        defaultValue={dayjs("2024-02-29")}
        disabledDate={(date) => date.date() === 1}
        onChange={change}
      />,
    ),
  );
  await act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    ),
  );
  expect(document.activeElement?.getAttribute("data-date")).toBe("2024-02-29");
  await act(() =>
    document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(document.activeElement?.getAttribute("data-date")).toBe("2024-03-01");
  await act(() =>
    required(
      document.activeElement instanceof HTMLButtonElement
        ? document.activeElement
        : null,
    ).click(),
  );
  expect(change).not.toHaveBeenCalled();
  await act(() =>
    document.activeElement?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
  expect(document.activeElement?.getAttribute("data-date")).toBe("2024-03-02");
  await act(() =>
    required(
      document.activeElement instanceof HTMLButtonElement
        ? document.activeElement
        : null,
    ).click(),
  );
  expect(change.mock.lastCall?.[1]).toBe("2024-03-02");
});
it("syncs external values into an open time panel without retaining stale confirmation", async () => {
  const change = vi.fn();
  await act(() =>
    root.render(
      <TimePicker
        open
        value={dayjs("2025-01-01T10:00:00")}
        onChange={change}
      />,
    ),
  );
  const hour = () =>
    required(document.querySelector<HTMLSelectElement>('[aria-label="Hour"]'));
  await act(() => {
    hour().value = "11";
    hour().dispatchEvent(new Event("change", { bubbles: true }));
  });
  // An unrelated rerender must preserve the in-progress draft.
  await act(() =>
    root.render(
      <TimePicker
        open
        value={dayjs("2025-01-01T10:00:00")}
        onChange={change}
        size="large"
      />,
    ),
  );
  expect(hour().value).toBe("11");
  await act(() =>
    root.render(
      <TimePicker
        open
        value={dayjs("2030-06-15T15:30:00")}
        onChange={change}
      />,
    ),
  );
  expect(hour().value).toBe("15");
  await act(() =>
    required(
      [...document.querySelectorAll("button")].find(
        (button) => button.textContent === "OK",
      ),
    ).click(),
  );
  expect(change).not.toHaveBeenCalled();
});
it("resets drafts when a parent closes and reopens the picker", async () => {
  const value = dayjs("2025-01-15");
  await act(() => root.render(<DatePicker open value={value} />));
  await act(() =>
    required(
      document.querySelector<HTMLButtonElement>('[aria-label="Next month"]'),
    ).click(),
  );
  expect(
    document.querySelector(".ao-picker-grid")?.getAttribute("aria-label"),
  ).toBe("2025-02");
  await act(() => root.render(<DatePicker open={false} value={value} />));
  await act(() => root.render(<DatePicker open value={value} />));
  expect(
    document.querySelector(".ao-picker-grid")?.getAttribute("aria-label"),
  ).toBe("2025-01");
});
it("keeps an open input editable when clicked again", async () => {
  const open = vi.fn();
  await act(() => root.render(<DatePicker onOpenChange={open} />));
  await act(() => input().click());
  expect(input().getAttribute("aria-expanded")).toBe("true");
  await act(() => input().click());
  expect(input().getAttribute("aria-expanded")).toBe("true");
  expect(open.mock.calls).toEqual([[true]]);
});
it("prevents panel chrome mouse presses from blurring the picker", async () => {
  await act(() =>
    root.render(<DatePicker defaultOpen defaultValue={dayjs("2025-01-15")} />),
  );
  for (const selector of ["header span", '[data-date="2025-01-16"]']) {
    const target = required(
      document.querySelector<HTMLElement>(
        `.ao-single-picker-panel ${selector}`,
      ),
    );
    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    await act(() => target.dispatchEvent(event));
    expect(event.defaultPrevented).toBe(true);
  }
  expect(input().getAttribute("aria-expanded")).toBe("true");
});
it("retains native mouse focus for time columns and dismisses outside", async () => {
  await act(() => root.render(<TimePicker defaultOpen />));
  const target = required(
    document.querySelector<HTMLSelectElement>('[aria-label="Hour"]'),
  );
  const event = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
  });
  await act(() => target.dispatchEvent(event));
  expect(event.defaultPrevented).toBe(false);
  await act(() =>
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true }),
    ),
  );
  expect(input().getAttribute("aria-expanded")).toBe("false");
});
