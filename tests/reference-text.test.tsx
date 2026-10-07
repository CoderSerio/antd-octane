import type { Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it } from "vitest";
import { ApiTable } from "../site/src/docs-ui";

let root: Root | undefined;
let host: HTMLDivElement;
async function table(description: string) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(() =>
    root?.render(
      <ApiTable
        markdown
        rows={[["getContainer", description, "HTMLElement", "body"]]}
      />,
    ),
  );
}
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  host?.remove();
});

it("renders upstream API emphasis rather than its literal Markdown markers", async () => {
  await table("指定挂载的节点，**并在容器内展现**，`false` 为挂载在当前位置");
  expect(host.querySelector("strong")?.textContent).toBe("并在容器内展现");
  expect(host.textContent).not.toContain("**");
  expect(host.querySelectorAll("th")).toHaveLength(4);
});

it("keeps inline code and reference links inside emphasis and escapes HTML", async () => {
  await table("**使用 `body` 与 [参考](#api)** <script>plain text</script>");
  expect(host.querySelector("strong code")?.textContent).toBe("body");
  expect(host.querySelector("strong a")?.getAttribute("href")).toBe(
    "https://5x.ant.design/#api",
  );
  expect(host.querySelector("script")).toBeNull();
  expect(host.textContent).toContain("<script>plain text</script>");
});

it("routes upstream component links to the available local document", async () => {
  await table(
    "更多布局和导航的使用可以参考：[通用布局](/components/layout-cn)。",
  );
  const link = host.querySelector("a");
  expect(link?.getAttribute("href")).toBe("#layout");
  expect(link?.getAttribute("target")).toBeNull();
  expect(link?.classList.contains("reference-link")).toBe(true);
});

it("retains external destinations and formats code inside link labels", async () => {
  await table(
    "[`li` 以及 `script-supporting` 子元素](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element)",
  );
  const link = host.querySelector("a");
  expect(link?.getAttribute("href")).toBe(
    "https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element",
  );
  expect(link?.getAttribute("target")).toBe("_blank");
  expect(
    [...host.querySelectorAll("a code")].map((node) => node.textContent),
  ).toEqual(["li", "script-supporting"]);
});

it("keeps unavailable components external and routes available API sections locally", async () => {
  await table(
    "[日期选择](/components/date-picker-cn) [参数](/components/layout-cn#api)",
  );
  expect(
    [...host.querySelectorAll("a")].map((node) => node.getAttribute("href")),
  ).toEqual(["https://5x.ant.design/components/date-picker-cn", "#layout/api"]);
});

it("routes Radio.Button's upstream demo fragment to the local button example", async () => {
  await table("[Radio.Button](/components/radio-cn/#radio-demo-radiobutton)");
  expect(host.querySelector("a")?.getAttribute("href")).toBe(
    "#radio/button-sizes",
  );
  expect(host.querySelector("a")?.getAttribute("target")).toBeNull();
});

it("translates a same-page upstream demo fragment to its local anchor", async () => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(() =>
    root?.render(
      <ApiTable
        markdown
        referenceUrl="https://5x.ant.design/components/anchor-cn/"
        rows={[
          ["targetOffset", "[例子](#anchor-demo-targetoffset)", "number", "-"],
        ]}
      />,
    ),
  );
  expect(host.querySelector("a")?.getAttribute("href")).toBe(
    "#anchor/targetOffset",
  );
});
