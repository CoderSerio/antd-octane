import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, useState } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  getMentions,
  Mentions,
  type MentionsOption,
  type MentionsRef,
} from "../packages/antd-octane/src";

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
