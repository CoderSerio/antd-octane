import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  ConfigProvider,
  getMentions,
  Mentions,
  type MentionsOption,
  type MentionsRef,
} from "../packages/antd-octane/src";

import enUS from "../packages/antd-octane/src/locale/en_US";
import zhCN from "../packages/antd-octane/src/locale/zh_CN";

let root: Root | undefined;
let container: HTMLDivElement;
const options: MentionsOption[] = [
  { value: "alice", label: "Alice" },
  { value: "alex", label: "Alex", disabled: true },
  { value: "bob", label: "Bob" },
];
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
function field() {
  const element = container.querySelector<HTMLTextAreaElement>("textarea");
  if (!element) throw Error("Missing Mentions textarea");
  return element;
}
async function type(value: string, cursor = value.length) {
  await act(() => {
    field().value = value;
    field().setSelectionRange(cursor, cursor);
    field().dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function key(name: string, isComposing = false) {
  const event = new KeyboardEvent("keydown", {
    key: name,
    isComposing,
    bubbles: true,
    cancelable: true,
  });
  await act(() => field().dispatchEvent(event));
  return event;
}
async function choose(label: string) {
  const element = [
    ...document.querySelectorAll<HTMLElement>('[role="option"]'),
  ].find((node) => node.textContent === label);
  if (!element) throw Error(`Missing ${label}`);
  await act(() => element.click());
}

it("filters from the caret and replaces only the active mention", async () => {
  const change = vi.fn();
  const search = vi.fn();
  const select = vi.fn();
  await render(
    <Mentions
      options={options}
      onChange={change}
      onSearch={search}
      onSelect={select}
    />,
  );
  await type("Hello @al world", 9);
  expect(search).toHaveBeenLastCalledWith("al", "@");
  expect(document.querySelectorAll('[role="option"]')).toHaveLength(2);
  await choose("Alice");
  expect(field().value).toBe("Hello @alice world");
  expect(change).toHaveBeenLastCalledWith("Hello @alice world");
  expect(select).toHaveBeenCalledWith(options[0], "@");
  expect(field().selectionStart).toBe("Hello @alice ".length);
  expect(field().getAttribute("aria-expanded")).toBe("false");
});

it("does not duplicate a matching suffix when the caret is inside a mention", async () => {
  await render(<Mentions options={options} />);
  await type("Before @al|ice after".replace("|", ""), "Before @al".length);
  await choose("Alice");
  expect(field().value).toBe("Before @alice after");
  expect(field().selectionStart).toBe("Before @alice ".length);
});

it("supports multiple prefixes, custom split, disabled options, and keyboard selection", async () => {
  const select = vi.fn();
  await render(
    <Mentions
      options={options}
      prefix={["@", "#"]}
      split=";"
      filterOption={false}
      onSelect={select}
    />,
  );
  await type("Topic #a");
  expect(field().getAttribute("aria-expanded")).toBe("true");
  await choose("Alex");
  expect(select).not.toHaveBeenCalled();
  expect(field().value).toBe("Topic #a");
  await key("ArrowDown");
  expect(field().getAttribute("aria-activedescendant")).toContain("option-2");
  await key("Enter");
  expect(field().value).toBe("Topic ;#bob;");
  expect(select).toHaveBeenCalledWith(options[2], "#");
});

it("keeps owner-controlled text authoritative and clears only when accepted", async () => {
  const rejected = vi.fn();
  await render(
    <Mentions
      options={options}
      value="Fixed @a"
      onChange={rejected}
      allowClear
    />,
  );
  await type("Different @a");
  expect(rejected).toHaveBeenCalledWith("Different @a");
  expect(field().value).toBe("Fixed @a");
  await act(() =>
    container.querySelector<HTMLButtonElement>(".ant-mentions-clear")?.click(),
  );
  expect(rejected).toHaveBeenLastCalledWith("");
  expect(field().value).toBe("Fixed @a");

  function Accepted() {
    const [value, setValue] = useState("@al");
    return <Mentions options={options} value={value} onChange={setValue} />;
  }
  await render(<Accepted />);
  await type("@bo");
  await choose("Bob");
  expect(field().value).toBe("@bob ");
});

it("blocks selection during composition and preserves native Enter when suggestions close", async () => {
  const search = vi.fn();
  const select = vi.fn();
  const press = vi.fn();
  await render(
    <Mentions
      options={options}
      onSearch={search}
      onSelect={select}
      onPressEnter={press}
    />,
  );
  await act(() =>
    field().dispatchEvent(new Event("compositionstart", { bubbles: true })),
  );
  await type("@al");
  expect(search).not.toHaveBeenCalled();
  await key("Enter", true);
  expect(select).not.toHaveBeenCalled();
  await act(() =>
    field().dispatchEvent(new Event("compositionend", { bubbles: true })),
  );
  expect(search).toHaveBeenCalledWith("al", "@");
  await key("Escape");
  expect(field().getAttribute("aria-expanded")).toBe("false");
  expect((await key("Enter")).defaultPrevented).toBe(false);
  expect(press).toHaveBeenCalledOnce();
});

it("exposes focus/blur and native textarea through ref", async () => {
  const ref = { current: null as MentionsRef | null };
  await render(<Mentions ref={ref} options={options} />);
  expect(ref.current?.nativeElement).toBe(container.firstElementChild);
  expect(ref.current?.textarea).toBe(field());
  await act(() => ref.current?.focus());
  expect(document.activeElement).toBe(field());
  await act(() => ref.current?.blur());
  expect(document.activeElement).not.toBe(field());
});

it("extracts completed mentions with configured prefixes and separator", () => {
  expect(
    getMentions("hello @alice and #topic", { prefix: ["@", "#"] }),
  ).toEqual([
    { prefix: "@", value: "alice" },
    { prefix: "#", value: "topic" },
  ]);
  expect(
    Mentions.getMentions("@alice;#topic", { prefix: ["@", "#"], split: ";" }),
  ).toEqual([
    { prefix: "@", value: "alice" },
    { prefix: "#", value: "topic" },
  ]);
});

it("drops stale suggestions when a controlled owner replaces the text", async () => {
  const change = vi.fn();
  await render(<Mentions options={options} value="@al" onChange={change} />);
  await type("@al");
  expect(field().getAttribute("aria-expanded")).toBe("true");
  await render(<Mentions options={options} value="Reset" onChange={change} />);
  expect(document.querySelector('[role="listbox"]')).toBeNull();
  await key("Enter");
  expect(change).not.toHaveBeenCalled();
  expect(field().value).toBe("Reset");
});

it("does not select suggestions measured from a rejected controlled edit", async () => {
  const change = vi.fn();
  await render(<Mentions options={options} value="Fixed" onChange={change} />);
  await type("@al");
  expect(field().value).toBe("Fixed");
  expect(document.querySelector('[role="listbox"]')).toBeNull();
  await key("Enter");
  expect(change).toHaveBeenCalledTimes(1);
});

it("inherits disabled, size, variant and popup container, and cleans up on unmount", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const getPopupContainer = () => target;
  try {
    await render(
      <ConfigProvider
        componentDisabled
        componentSize="small"
        variant="filled"
        getPopupContainer={getPopupContainer}
      >
        <Mentions options={options} />
      </ConfigProvider>,
    );
    expect(field().disabled).toBe(true);
    expect(
      container.querySelector(".ant-mentions-small.ant-mentions-filled"),
    ).not.toBeNull();
    await render(
      <ConfigProvider componentDisabled getPopupContainer={getPopupContainer}>
        <Mentions options={options} disabled={false} />
      </ConfigProvider>,
    );
    await type("@al");
    expect(target.querySelector('[role="listbox"]')).not.toBeNull();
    await act(() => root?.unmount());
    root = undefined;
    expect(target.childElementCount).toBe(0);
  } finally {
    target.remove();
  }
});

it("updates empty and clear labels when the provider locale changes", async () => {
  let switchLocale!: () => void;
  function Demo() {
    const [english, setEnglish] = useState(true);
    switchLocale = () => setEnglish(false);
    return (
      <ConfigProvider locale={english ? enUS : zhCN}>
        <Mentions allowClear options={[]} />
      </ConfigProvider>
    );
  }
  await render(<Demo />);
  await type("@missing");
  expect(document.querySelector(".ant-mentions-empty")?.textContent).toBe(
    "No matches found",
  );
  expect(
    container.querySelector(".ant-mentions-clear")?.getAttribute("aria-label"),
  ).toBe("Clear mention content");
  await act(() => switchLocale());
  expect(document.querySelector(".ant-mentions-empty")?.textContent).toBe(
    "无匹配结果",
  );
  expect(
    container.querySelector(".ant-mentions-clear")?.getAttribute("aria-label"),
  ).toBe("清除提及内容");
});
it("honors custom locale text and explicit notFoundContent, including null", async () => {
  const locale = {
    ...enUS,
    Mentions: { notFoundContent: "Nobody here", clear: "Remove mention" },
  };
  await render(
    <ConfigProvider locale={locale}>
      <Mentions allowClear />
    </ConfigProvider>,
  );
  await type("@missing");
  expect(document.querySelector(".ant-mentions-empty")?.textContent).toBe(
    "Nobody here",
  );
  expect(
    container.querySelector(".ant-mentions-clear")?.getAttribute("aria-label"),
  ).toBe("Remove mention");
  await render(
    <ConfigProvider locale={locale}>
      <Mentions notFoundContent="Custom empty" />
    </ConfigProvider>,
  );
  await type("@missing");
  expect(document.querySelector(".ant-mentions-empty")?.textContent).toBe(
    "Custom empty",
  );
  await render(
    <ConfigProvider locale={locale}>
      <Mentions notFoundContent={null} />
    </ConfigProvider>,
  );
  await type("@missing");
  expect(document.querySelector(".ant-mentions-empty")?.textContent).toBe("");
});
