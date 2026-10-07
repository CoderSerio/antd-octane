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
