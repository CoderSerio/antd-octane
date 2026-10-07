import { expect, it } from "vitest";
import { findActiveTocAnchor, readPageToc } from "../site/src/page-toc";

it("keeps example TOC entries in source order across independent columns", () => {
  const root = document.createElement("main");
  root.innerHTML = `
    <h2 id="examples">代码演示</h2>
    <div class="demo-grid">
      <div class="demo-column">
        <section class="demo-card" id="basic" data-demo-order="0"><h3>基本</h3><div class="demo-stage"><h3>Live title</h3></div></section>
        <section class="demo-card" id="gap" data-demo-order="2"><h3>间距</h3></section>
      </div>
      <div class="demo-column">
        <section class="demo-card" id="align" data-demo-order="1"><h3>对齐</h3></section>
        <section class="demo-card" id="wrap" data-demo-order="3"><h3>换行</h3></section>
      </div>
    </div>
    <h2 id="api">API</h2><h3>Props</h3>`;
  expect(readPageToc(root)).toEqual([
    {
      id: "examples",
      title: "代码演示",
      children: [
        { id: "basic", title: "基本" },
        { id: "align", title: "对齐" },
        { id: "gap", title: "间距" },
        { id: "wrap", title: "换行" },
      ],
    },
    { id: "api", title: "API", children: [{ id: "props", title: "Props" }] },
  ]);
});

it("preserves ordinary headings and assigns unique anchors", () => {
  const root = document.createElement("main");
  root.innerHTML =
    '<h2>API</h2><h3>Props</h3><h3>Props</h3><div class="demo-code"><h3>Code title</h3></div>';
  expect(readPageToc(root)[0].children.map(({ id }) => id)).toEqual([
    "props",
    "props-2",
  ]);
});

it("selects the closest visible section across columns and keeps a clicked tie", () => {
  const heading = (id: string, top: number) => {
    const node = document.createElement("h3");
    node.id = id;
    node.getBoundingClientRect = () => ({ top }) as DOMRect;
    return node;
  };
  const headings = [
    heading("first", 80),
    heading("second", 80),
    heading("third", 140),
    heading("fourth", 100),
  ];
  expect(findActiveTocAnchor(headings)).toBe("third");
  expect(findActiveTocAnchor(headings.slice(0, 2), "first")).toBe("first");
  expect(findActiveTocAnchor(headings.slice(0, 2), "second")).toBe("second");
});
