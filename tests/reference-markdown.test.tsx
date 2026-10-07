import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src";
import { readPageToc } from "../site/src/page-toc";
import GridPage from "../site/src/pages/grid";
import MenuPage from "../site/src/pages/menu";
import { ReferenceMarkdown } from "../site/src/reference-markdown";

vi.mock("../site/src/development/layout-navigation", () => ({
  augmentExamples: async (_component: string, children: ElementDescriptor[]) =>
    children,
}));

let root: Root | undefined;
let host: HTMLDivElement;
async function render(node: ElementDescriptor) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  host?.remove();
});

it("preserves Grid's upstream design illustration before its overview and demos", async () => {
  await render(<GridPage />);
  expect(
    [...host.querySelectorAll("h2")]
      .slice(0, 3)
      .map((node) => node.textContent),
  ).toEqual(["设计理念", "概述", "代码演示"]);
  const image = host.querySelector<HTMLImageElement>('img[alt="grid design"]');
  expect(image?.getAttribute("src")).toBe(
    "https://gw.alipayobjects.com/zos/bmw-prod/9189c9ef-c601-40dc-9960-c11dbb681888.svg",
  );
  expect(image?.getAttribute("draggable")).toBe("false");
  expect(host.textContent).toContain(
    "建议横向排列的盒子数量最多四个，最少一个",
  );
  expect(
    readPageToc(host)
      .slice(0, 3)
      .map(({ title }) => title),
  ).toEqual(["设计理念", "概述", "代码演示"]);
});

it("keeps a document image separate from adjacent paragraphs and resolves its URL", async () => {
  await render(
    <ReferenceMarkdown
      markdown={"Before\n![Diagram](../diagram.svg)\nAfter"}
      referenceUrl="https://example.com/docs/grid/"
    />,
  );
  expect(host.querySelector("img")?.getAttribute("src")).toBe(
    "https://example.com/docs/diagram.svg",
  );
  expect(
    [...host.querySelectorAll("p")].map((node) => node.textContent),
  ).toEqual(["Before", "After"]);
});

it("uses inherited link tokens in a nested documentation theme", async () => {
  await render(
    <ConfigProvider
      theme={{ token: { colorLink: "#123456", colorLinkHover: "#345678" } }}
    >
      <ReferenceMarkdown markdown="[通用布局](/components/layout-cn)" />
    </ConfigProvider>,
  );
  const prose = host.querySelector<HTMLElement>(".reference-prose");
  expect(prose?.style.getPropertyValue("--reference-link-color")).toBe(
    "#123456",
  );
  expect(prose?.style.getPropertyValue("--reference-link-hover")).toBe(
    "#345678",
  );
});

it.each([
  "javascript:alert(1)",
  "data:image/svg+xml,example",
  "https://[",
])("does not render %s as an image source", async (source) => {
  await render(<ReferenceMarkdown markdown={`![Diagram](${source})`} />);
  expect(host.querySelector("img")).toBeNull();
});
