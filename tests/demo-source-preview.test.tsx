import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src";
import { buildDemoSource } from "../site/demo-source-plugin";
import { cleanDemoSource, selectDemoSource } from "../site/src/demo-source";
import { Demo, DemoCodePreview } from "../site/src/docs-ui";
import FlexPage from "../site/src/pages/flex";

vi.mock("../site/src/demo-frame", () => ({
  DemoIframe: ({
    title,
    demo,
    height,
  }: {
    title: string;
    demo: string;
    height: number;
  }) => (
    <iframe
      title={title}
      data-src={`?demo=${encodeURIComponent(demo)}`}
      style={{ height }}
    />
  ),
}));

let root: Root | undefined;
let container: HTMLDivElement | undefined;
async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}
afterEach(async () => {
  await act(() => root?.unmount());
  container?.remove();
  vi.restoreAllMocks();
});

describe("demo source presentation", () => {
  it.each([
    "layout-side",
    "development/layout/side",
    "anchor/basic",
  ])("wraps %s in the upstream document browser frame", async (demo) => {
    await render(
      <Demo
        title="Frame"
        description=""
        source={async () => ({ default: "" })}
        iframe={{ demo, height: 360 }}
      >
        <span />
      </Demo>,
    );
    const frame = container?.querySelector(".demo-browser-frame > iframe");
    expect(frame?.getAttribute("data-src")).toBe(
      `?demo=${encodeURIComponent(demo)}`,
    );
    expect((frame as HTMLElement).style.height).toBe("360px");
  });

  it("uses nested theme tokens for the document frame radius", async () => {
    await render(
      <ConfigProvider theme={{ token: { borderRadiusSM: 10 } }}>
        <Demo
          title="Frame"
          description=""
          source={async () => ({ default: "" })}
          iframe={{ demo: "layout-side", height: 360 }}
        >
          <span />
        </Demo>
      </ConfigProvider>,
    );
    expect(
      container
        ?.querySelector<HTMLElement>(".demo-browser-frame")
        ?.style.getPropertyValue("--demo-frame-radius"),
    ).toBe("10px");
  });

  it("keeps the Flex documentation examples in one column on wide screens", async () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1600);
    await render(<FlexPage />);
    expect(
      container?.querySelectorAll(".demo-grid > .demo-column"),
    ).toHaveLength(1);
    expect(
      [...(container?.querySelectorAll(".demo-card") ?? [])].map(
        (node) => node.id,
      ),
    ).toEqual(["basic", "alignment", "gap", "wrapping", "combination"]);
    expect(
      container?.querySelector<HTMLElement>(".demo-grid")?.style
        .gridTemplateColumns,
    ).toBe("minmax(0, 1fr)");
  });

  it("removes lint directives while retaining sample explanations and literal text", () => {
    const source = `/** @jsxImportSource octane */
/** biome-ignore-all lint/a11y/useValidAnchor: Upstream demo. */
import { Divider } from "antd-octane";
// Explain the separator.
const note = "biome-ignore is literal text";
export function Demo() {
  return <>
    <Divider type="vertical" />
    {/* biome-ignore lint/a11y/useValidAnchor: Upstream placeholder. */}
    <a href="#">Link</a>
  </>;
}`;
    const cleaned = cleanDemoSource(source);
    expect(cleaned).not.toContain("biome-ignore lint/");
    expect(cleaned).not.toContain("@jsxImportSource");
    expect(cleaned).toContain("// Explain the separator.");
    expect(cleaned).toContain('"biome-ignore is literal text"');
    expect(cleaned).toContain('<a href="#">Link</a>');
  });

  it("builds JavaScript without types while preserving native JSX and imports", () => {
    const result = buildDemoSource(`import { Divider } from "antd-octane";
import type { DividerProps } from "antd-octane";
export function Demo(props: DividerProps) { return <Divider {...props}>Text</Divider>; }`);
    expect(result.typescript).toContain("props: DividerProps");
    expect(result.javascript).not.toContain("props: DividerProps");
    expect(result.javascript).not.toContain("import type");
    expect(result.javascript).toContain("<Divider {...props}>Text</Divider>");
    expect(result.javascript).toContain('from "antd-octane"');
    expect(result.typescriptTokens.map((token) => token.text).join("")).toBe(
      result.typescript,
    );
    expect(result.javascriptTokens.map((token) => token.text).join("")).toBe(
      result.javascript,
    );
    expect(
      result.typescriptTokens.some(
        (token) => token.kind === "tag" && token.text === "Divider",
      ),
    ).toBe(true);
  });

  it("selects the same exported example for both language views", () => {
    const source = `import { Divider } from "antd-octane";
export function First() { return <Divider>First</Divider>; }
export function Second() { return <Divider>Second</Divider>; }`;
    const result = buildDemoSource(source, "Second");
    expect(result.typescript).toBe(selectDemoSource(source, "Second"));
    expect(result.typescript).not.toContain("function First");
    expect(result.javascript).not.toContain("function First");
    expect(result.javascript).toContain("function Second");
  });

  it("switches the code language, copies the selected source and collapses", async () => {
    const clipboard = { writeText: vi.fn(async () => {}) };
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue(
      clipboard as unknown as Clipboard,
    );
    const variants = buildDemoSource(
      "export function Example(value: number) { return <span>{value}</span>; }",
    );
    const collapse = vi.fn();
    await render(
      <DemoCodePreview
        source={variants.typescript}
        variants={variants}
        onCollapse={collapse}
      />,
    );
    const javascriptTab = [
      ...(container?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []),
    ].find((node) => node.textContent === "JavaScript");
    if (!javascriptTab) throw new Error("Missing JavaScript tab");
    await act(() => javascriptTab.click());
    const copy = container?.querySelector<HTMLButtonElement>(
      '[aria-label="复制JavaScript代码"]',
    );
    if (!copy) throw new Error("Missing JavaScript copy button");
    await act(() => copy.click());
    expect(clipboard.writeText).toHaveBeenCalledWith(variants.javascript);
    expect(javascriptTab.getAttribute("aria-selected")).toBe("true");
    const hide = container?.querySelector<HTMLButtonElement>(
      ".demo-code-collapse",
    );
    await act(() => hide?.click());
    expect(collapse).toHaveBeenCalledOnce();
  });

  it("copies the active language from the demo toolbar too", async () => {
    const clipboard = { writeText: vi.fn(async () => {}) };
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue(
      clipboard as unknown as Clipboard,
    );
    const variants = buildDemoSource(
      "export function Example(value: number) { return <span>{value}</span>; }",
    );
    await render(
      <Demo
        id="preview"
        title="Example"
        description="Example"
        source={async () => ({ default: variants.typescript, code: variants })}
      >
        <span>Preview</span>
      </Demo>,
    );
    const view = container?.querySelector<HTMLButtonElement>(
      '[aria-label="查看Example代码"]',
    );
    await act(() => view?.click());
    const javascriptTab = [
      ...(container?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []),
    ].find((node) => node.textContent === "JavaScript");
    if (!javascriptTab) throw new Error("Missing JavaScript tab");
    await act(() => javascriptTab.click());
    const copy = container?.querySelector<HTMLButtonElement>(
      '[aria-label="复制Example代码"]',
    );
    await act(() => copy?.click());
    expect(clipboard.writeText).toHaveBeenCalledWith(variants.javascript);
  });
});
