import {
  act,
  createRoot,
  type ElementDescriptor,
  type Root,
  useState,
} from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider, Transfer } from "../packages/antd-octane/src";

let root: Root | undefined;
let host: HTMLDivElement;
const data = [
  { key: "a", title: "Alice" },
  { key: "b", title: "Bob" },
  { key: "c", title: "Carol", disabled: true },
];
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
});
function checkbox(title: string) {
  const input = [...host.querySelectorAll("label")]
    .find((label) => label.textContent === title)
    ?.querySelector("input");
  if (!input) throw Error(`Missing checkbox ${title}`);
  return input;
}
function button(title: string) {
  const found = [...host.querySelectorAll("button")].find(
    (button) => button.textContent === title,
  );
  if (!found) throw Error(`Missing button ${title}`);
  return found;
}
it("moves accepted target keys and reports selections on both sides", async () => {
  const change = vi.fn(),
    select = vi.fn();
  function Demo() {
    const [keys, setKeys] = useState<string[]>([]);
    return (
      <Transfer
        dataSource={data}
        targetKeys={keys}
        onChange={(next, direction, moved) => {
          change(next, direction, moved);
          setKeys(next);
        }}
        onSelectChange={select}
      />
    );
  }
  await render(<Demo />);
  await act(() => checkbox("Alice").click());
  expect(select).toHaveBeenLastCalledWith(["a"], []);
  await act(() => button("Move right").click());
  expect(change).toHaveBeenLastCalledWith(["a"], "right", ["a"]);
  expect(select).toHaveBeenLastCalledWith([], []);
  expect(
    host.querySelector('[aria-label="right transfer list"]')?.textContent,
  ).toContain("Alice");
  await act(() => checkbox("Alice").click());
  await act(() => button("Move left").click());
  expect(change).toHaveBeenLastCalledWith([], "left", ["a"]);
});
it("keeps owner-controlled target and selected keys authoritative", async () => {
  const change = vi.fn(),
    select = vi.fn();
  await render(
    <Transfer
      dataSource={data}
      targetKeys={[]}
      selectedKeys={["a"]}
      onChange={change}
      onSelectChange={select}
    />,
  );
  await act(() => checkbox("Alice").click());
  expect(checkbox("Alice").checked).toBe(true);
  expect(select).toHaveBeenLastCalledWith([], []);
  await act(() => button("Move right").click());
  expect(change).toHaveBeenCalledWith(["a"], "right", ["a"]);
  expect(
    host.querySelector('[aria-label="left transfer list"]')?.textContent,
  ).toContain("Alice");
});
it("search/select-all affect only visible enabled rows and inherit disabled", async () => {
  const select = vi.fn(),
    search = vi.fn();
  await render(
    <Transfer
      dataSource={data}
      showSearch
      onSearch={search}
      onSelectChange={select}
    />,
  );
  const input = host.querySelector<HTMLInputElement>(
    '[aria-label="Search left"]',
  );
  if (!input) throw Error("Missing search");
  await act(() => {
    input.value = "ali";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(search).toHaveBeenCalledWith("left", "ali");
  await act(() =>
    host
      .querySelector<HTMLInputElement>('[aria-label="Select all left"]')
      ?.click(),
  );
  expect(select).toHaveBeenLastCalledWith(["a"], []);
  await render(
    <ConfigProvider componentDisabled>
      <Transfer dataSource={data} selectedKeys={["a", "c"]} />
    </ConfigProvider>,
  );
  expect(checkbox("Alice").disabled).toBe(true);
  expect(button("Move right").disabled).toBe(true);
});
