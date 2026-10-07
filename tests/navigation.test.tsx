import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Breadcrumb } from "../packages/antd-octane/src/breadcrumb";
import { Pagination } from "../packages/antd-octane/src/pagination";
import { Steps } from "../packages/antd-octane/src/steps";

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
async function click(label: string) {
  const button = container.querySelector<HTMLButtonElement>(
    `button[aria-label="${label}"]`,
  );
  if (!button) throw Error(label);
  await act(() => button.click());
}
it("changes pages uncontrolled and clamps display after total shrinks", async () => {
  const change = vi.fn();
  await render(<Pagination total={250} onChange={change} />);
  await click("Next Page");
  expect(change).toHaveBeenLastCalledWith(2, 10);
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
    "2",
  );
  await act(() => root?.render(<Pagination total={5} />));
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
    "1",
  );
  expect(
    container.querySelector<HTMLButtonElement>('[aria-label="Next Page"]')
      ?.disabled,
  ).toBe(true);
});
it("controlled page accepts intent without changing displayed selection", async () => {
  const change = vi.fn();
  await render(<Pagination current={3} total={100} onChange={change} />);
  await click("Next Page");
  expect(change).toHaveBeenCalledWith(4, 10);
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
    "3",
  );
});
it("size changer clamps page and emits both callbacks", async () => {
  const change = vi.fn(),
    sizeChange = vi.fn();
  await render(
    <Pagination
      total={100}
      defaultCurrent={10}
      onChange={change}
      onShowSizeChange={sizeChange}
    />,
  );
  const select = container.querySelector<HTMLInputElement>('[role="combobox"]');
  if (!select) throw Error("Missing select");
  await act(() => select.click());
  const option = [
    ...container.querySelectorAll<HTMLElement>('[role="option"]'),
  ].find((node) => node.textContent?.startsWith("50 "));
  if (!option) throw Error("Missing 50 per page");
  await act(() => option.click());
  expect(sizeChange).toHaveBeenCalledWith(10, 50);
  expect(change).toHaveBeenCalledWith(2, 50);
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
    "2",
  );
});
it("quick jumping clamps large pages and ignores invalid input", async () => {
  const change = vi.fn();
  await render(<Pagination total={70} showQuickJumper onChange={change} />);
  const input = container.querySelector<HTMLInputElement>(
    '[aria-label="跳转页码"]',
  );
  if (!input) throw Error("Missing input");
  await act(() => {
    input.value = "999";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(() =>
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(change).toHaveBeenLastCalledWith(7, 10);
  expect(input.value).toBe("");
  await act(() => {
    input.value = "abc";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(() =>
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(change).toHaveBeenCalledTimes(1);
});
it("disabled pagination prevents all intents, single-page can hide", async () => {
  const change = vi.fn();
  await render(<Pagination total={200} disabled onChange={change} />);
  await click("Next Page");
  expect(change).not.toHaveBeenCalled();
  expect(
    container.querySelector<HTMLInputElement>('[role="combobox"]')?.disabled,
  ).toBe(true);
  await act(() => root?.render(<Pagination total={0} hideOnSinglePage />));
  expect(container.querySelector("nav")).toBeNull();
});
it("steps expose current step and only enabled buttons emit changes", async () => {
  const change = vi.fn();
  await render(
    <Steps
      responsive={false}
      current={1}
      onChange={change}
      items={[
        { title: "开始" },
        { title: "处理中" },
        { title: "锁定", disabled: true },
        { title: "完成" },
      ]}
    />,
  );
  expect(
    container.querySelector('[aria-current="step"]')?.textContent,
  ).toContain("处理中");
  const buttons = container.querySelectorAll<HTMLButtonElement>("button");
  await act(() => buttons[2].click());
  expect(change).not.toHaveBeenCalled();
  await act(() => buttons[3].click());
  expect(change).toHaveBeenCalledWith(3);
});
it("breadcrumb preserves links, custom separator and button intent", async () => {
  const click = vi.fn();
  await render(
    <Breadcrumb
      separator=">"
      items={[
        { title: "首页", href: "#overview" },
        { title: "返回", onClick: click },
        { title: "当前" },
      ]}
    />,
  );
  expect(container.querySelector("a")?.getAttribute("href")).toBe("#overview");
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
    "当前",
  );
  expect(container.querySelectorAll(".ant-breadcrumb-separator")).toHaveLength(
    2,
  );
  await act(() => container.querySelector("button")?.click());
  expect(click).toHaveBeenCalledOnce();
});
it("simple page input can be cleared and submitted without losing controlled semantics", async () => {
  const change = vi.fn();
  await render(<Pagination current={2} total={100} simple onChange={change} />);
  const input = container.querySelector("input");
  if (!input) throw Error("Missing page input");
  await act(() => {
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(input.value).toBe("");
  await act(() => {
    input.value = "8";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await act(() =>
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    ),
  );
  expect(change).toHaveBeenCalledWith(8, 10);
  expect(input.value).toBe("2");
});
it("jump controls navigate and expose a bounded page window", async () => {
  await render(<Pagination total={1000} showSizeChanger={false} />);
  expect(container.querySelectorAll(".ant-pagination-item")).toHaveLength(6);
  await click("Next 5 Pages");
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
    "6",
  );
  await click("Previous 5 Pages");
  expect(container.querySelector('[aria-current="page"]')?.textContent).toBe(
    "1",
  );
});
