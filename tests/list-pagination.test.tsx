import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { List } from "../packages/antd-octane/src/list";

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
const data = ["A", "B", "C", "D", "E"];
const visible = () =>
  [...container.querySelectorAll(".ant-list-items > li")].map(
    (node) => node.textContent,
  );
async function next() {
  const buttons = [...container.querySelectorAll<HTMLButtonElement>("button")];
  const button = buttons.find(
    (node) => node.getAttribute("aria-label") === "下一页",
  );
  if (!button) throw Error("Missing next");
  await act(() => button.click());
}
it("paginates local data and keeps top/bottom pagers synchronized", async () => {
  const change = vi.fn();
  await render(
    <List
      dataSource={data}
      pagination={{ defaultPageSize: 2, position: "both", onChange: change }}
    />,
  );
  expect(visible()).toEqual(["A", "B"]);
  await next();
  expect(visible()).toEqual(["C", "D"]);
  expect(change).toHaveBeenCalledWith(2, 2);
  expect(
    [...container.querySelectorAll("[aria-current=page]")].map(
      (node) => node.textContent,
    ),
  ).toEqual(["2", "2"]);
  await next();
  expect(visible()).toEqual(["E"]);
});
it("rejects controlled navigation until parent accepts it", async () => {
  const change = vi.fn();
  await render(
    <List
      dataSource={data}
      pagination={{ pageSize: 2, current: 1, onChange: change }}
    />,
  );
  await next();
  expect(change).toHaveBeenCalledWith(2, 2);
  expect(visible()).toEqual(["A", "B"]);
  await act(() =>
    root?.render(
      <List
        dataSource={data}
        pagination={{ pageSize: 2, current: 2, onChange: change }}
      />,
    ),
  );
  expect(visible()).toEqual(["C", "D"]);
});
it("retains server page data and clamps a shrinking local dataset", async () => {
  await render(
    <List
      dataSource={["Remote A", "Remote B"]}
      pagination={{ total: 100, pageSize: 2, current: 4 }}
    />,
  );
  expect(visible()).toEqual(["Remote A", "Remote B"]);
  await act(() =>
    root?.render(
      <List dataSource={data} pagination={{ pageSize: 2, current: 10 }} />,
    ),
  );
  expect(visible()).toEqual(["E"]);
});
