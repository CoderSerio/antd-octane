import { act, createRoot, type Root } from "octane";
import { afterEach, expect, it } from "vitest";
import { Alert, theme } from "../packages/antd-octane/src";
import { IsolatedDemo } from "../site/src/demo-frame";

let root: Root | undefined;
let container: HTMLDivElement;
const bodyStyle = document.body.getAttribute("style");
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
  if (bodyStyle === null) document.body.removeAttribute("style");
  else document.body.setAttribute("style", bodyStyle);
});
async function render() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() =>
    root?.render(
      <IsolatedDemo Demo={() => <Alert message="Notice" banner closable />} />,
    ),
  );
}
function tokenStyle() {
  return container
    .querySelector<HTMLElement>(".ant-alert")
    ?.style.getPropertyValue("--ao-alert-bg");
}
it("updates a demo's resolved theme through its same-origin parent without remounting", async () => {
  await render();
  const element = container.querySelector(".ant-alert");
  const dark = theme.getDesignToken({ algorithm: theme.darkAlgorithm });
  await act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        origin: location.origin,
        source: window.parent,
        data: { type: "antd-octane:demo-theme", token: dark },
      }),
    ),
  );
  expect(container.querySelector(".ant-alert")).toBe(element);
  expect(tokenStyle()).toBe(dark.colorWarningBg);
  expect(document.body.style.backgroundColor).toBe(dark.colorBgContainer);
  await act(() => container.querySelector("button")?.click());
  expect(container.querySelector(".ant-alert")).toBeNull();
  await act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        origin: location.origin,
        source: window.parent,
        data: { type: "antd-octane:demo-theme", token: theme.getDesignToken() },
      }),
    ),
  );
  expect(container.querySelector(".ant-alert")).toBeNull();
});
it("ignores theme messages from a different origin or window", async () => {
  await render();
  const original = tokenStyle();
  const data = {
    type: "antd-octane:demo-theme",
    token: theme.getDesignToken({ algorithm: theme.darkAlgorithm }),
  };
  await act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        origin: "https://example.com",
        source: window.parent,
        data,
      }),
    ),
  );
  expect(tokenStyle()).toBe(original);
  await act(() =>
    window.dispatchEvent(
      new MessageEvent("message", {
        origin: location.origin,
        source: null,
        data,
      }),
    ),
  );
  expect(tokenStyle()).toBe(original);
});
