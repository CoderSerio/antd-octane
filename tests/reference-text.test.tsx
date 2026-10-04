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
