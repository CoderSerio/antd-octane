import type { ElementDescriptor, Root } from "octane";
import { act, cloneElement, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Anchor,
  Breadcrumb,
  ConfigProvider,
  Dropdown,
  Menu,
  Pagination,
  Steps,
  Tabs,
  type TabsProps,
  theme,
} from "../packages/antd-octane/src";

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
  root = undefined;
  vi.restoreAllMocks();
  vi.useRealTimers();
});
function button(text: string) {
  const node = [...document.querySelectorAll<HTMLButtonElement>("button")].find(
    (node) => node.textContent?.trim() === text,
  );
  if (!node) throw Error(`Missing ${text}`);
  return node;
}
async function key(node: HTMLElement, value: string) {
  await act(() =>
    node.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: value,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
}
it("Anchor accepts legacy links, per-item replace, fixed ink and provider style", async () => {
  const replace = vi.spyOn(history, "replaceState");
  await render(
    <ConfigProvider
      direction="rtl"
      prefixCls="custom"
      anchor={{ className: "provider" }}
    >
      <Anchor affix={false} showInkInFixed rootClassName="root">
        <Anchor.Link href="#native-anchor" title="Target" replace />
      </Anchor>
    </ConfigProvider>,
  );
  const link = container.querySelector("a");
  await act(() => link?.click());
  expect(replace).toHaveBeenCalledWith(null, "", "#native-anchor");
  expect(
    container
      .querySelector(".custom-anchor-wrapper")
      ?.classList.contains("provider"),
  ).toBe(true);
  expect(container.querySelector(".ant-anchor-fixed")).toBeNull();
});
it("Anchor onChange receives the source link while getCurrentAnchor customizes the highlight", async () => {
  const change = vi.fn();
  await render(
    <Anchor
      affix={false}
      getCurrentAnchor={() => "#highlight"}
      onChange={change}
      items={[
        { key: "source", href: "#source", title: "Source" },
        { key: "highlight", href: "#highlight", title: "Highlight" },
      ]}
    />,
  );
  await act(() =>
    container.querySelector<HTMLAnchorElement>('a[href="#source"]')?.click(),
  );
  expect(change).toHaveBeenLastCalledWith("#source");
  expect(
    container.querySelector('[aria-current="location"]')?.textContent,
  ).toBe("Highlight");
});
