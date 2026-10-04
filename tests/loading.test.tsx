import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Card } from "../packages/antd-octane/src/card";
import { List } from "../packages/antd-octane/src/list";
import { Skeleton } from "../packages/antd-octane/src/skeleton";
import { Spin } from "../packages/antd-octane/src/spin";

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
  vi.useRealTimers();
});

it("Spin delays activation, cancels short requests and cleans pending timers", async () => {
  vi.useFakeTimers();
  await render(
    <Spin spinning delay={200}>
      <button type="button">content</button>
    </Spin>,
  );
  expect(container.querySelector(".ant-spin-spinning")).toBeNull();
  await act(() => vi.advanceTimersByTime(100));
  await render(
    <Spin spinning={false} delay={200}>
      <button type="button">content</button>
    </Spin>,
  );
  await act(() => vi.advanceTimersByTime(200));
  expect(container.querySelector(".ant-spin-spinning")).toBeNull();
  await render(
    <Spin delay={200}>
      <button type="button">content</button>
    </Spin>,
  );
  await act(() => vi.advanceTimersByTime(200));
  expect(
    container
      .querySelector(".ant-spin-container")
      ?.classList.contains("ant-spin-blur"),
  ).toBe(true);
  expect(container.querySelector("button")?.textContent).toBe("content");
  await render(
    <Spin spinning={false} delay={200}>
      <button type="button">content</button>
    </Spin>,
  );
  expect(
    container
      .querySelector(".ant-spin-container")
      ?.classList.contains("ant-spin-blur"),
  ).toBe(false);
  const cancel = vi.spyOn(globalThis, "clearTimeout");
  await render(<Spin delay={200} />);
  await act(() => root?.unmount());
  root = undefined;
  expect(cancel).toHaveBeenCalled();
  cancel.mockRestore();
});

it("Spin supports custom indicators and nested tips without replacing child state", async () => {
  await render(
    <Spin tip="获取数据" indicator={<span>custom</span>}>
      <input defaultValue="kept" />
    </Spin>,
  );
  const input = container.querySelector("input");
  expect(container.textContent).toContain("获取数据");
  expect(container.textContent).toContain("custom");
  await render(
    <Spin spinning={false}>
      <input defaultValue="kept" />
    </Spin>,
  );
  expect(container.querySelector("input")).toBe(input);
  await render(<Spin tip="standalone" />);
  expect(container.querySelector(".ant-spin")?.getAttribute("aria-live")).toBe(
    "polite",
  );
  expect(container.querySelector(".ant-spin-text")).toBeNull();
  expect(container.querySelector('[role="status"]')).toBeNull();
});

it("Skeleton exposes row widths and restores children when loading completes", async () => {
  await render(
    <Skeleton avatar active paragraph={{ rows: 2, width: [100, "50%"] }}>
      <button type="button">ready</button>
    </Skeleton>,
  );
  expect(container.querySelectorAll('[role="status"]')).toHaveLength(0);
  expect(container.querySelectorAll(".ant-skeleton")).toHaveLength(1);
  expect(container.querySelectorAll("li")).toHaveLength(2);
  expect(container.querySelector("li")?.style.width).toBe("100px");
  expect(container.querySelectorAll("li")[1].style.width).toBe("50%");
  expect(container.querySelector("button")).toBeNull();
  await render(
    <Skeleton loading={false}>
      <button type="button">ready</button>
    </Skeleton>,
  );
  expect(container.querySelector("button")?.textContent).toBe("ready");
  await render(<Skeleton paragraph={{ rows: 0 }} />);
  expect(container.querySelectorAll("li")).toHaveLength(0);
});

it("Skeleton variants honor geometry and custom nodes", async () => {
  await render(
    <div>
      <Skeleton.Avatar size={48} />
      <Skeleton.Button block shape="round" />
      <Skeleton.Input size="small" />
      <Skeleton.Image />
      <Skeleton.Node>
        <span>custom node</span>
      </Skeleton.Node>
    </div>,
  );
  expect(
    container.querySelector<HTMLElement>(".ant-skeleton-avatar")?.style.width,
  ).toBe("48px");
  expect(
    container
      .querySelector(".ant-skeleton-button")
      ?.parentElement?.classList.contains("ant-skeleton-block"),
  ).toBe(true);
  expect(container.querySelector(".ant-skeleton-input-sm")).not.toBeNull();
  expect(container.textContent).toContain("custom node");
});

it("Card uses Skeleton and List forwards Spin options retaining existing rows", async () => {
  await render(
    <div>
      <Card loading>secret content</Card>
      <List
        loading={{ tip: "加载列表", size: "small" }}
        dataSource={["row"]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </div>,
  );
  expect(container.querySelector(".ant-card .ant-skeleton")).not.toBeNull();
  expect(container.textContent).not.toContain("secret content");
  expect(container.querySelector(".ant-list .ant-spin-sm")).not.toBeNull();
  expect(container.textContent).toContain("row");
  expect(container.textContent).toContain("加载列表");
});
