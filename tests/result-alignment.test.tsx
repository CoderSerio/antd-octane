import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import {
  ExceptionMap,
  IconMap,
  Result,
} from "../packages/antd-octane/src/result";

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
});
it("uses info by default and always renders an empty title wrapper", async () => {
  await render(<Result />);
  expect(container.querySelector(".ant-result-info")).not.toBeNull();
  expect(container.querySelector(".ant-result-title")?.textContent).toBe("");
  expect(container.querySelector(".ant-result-subtitle")).toBeNull();
  expect(container.querySelector(".ant-result-extra")).toBeNull();
  expect(container.querySelector(".ant-result-content")).toBeNull();
  expect(
    container.querySelector('[role="img"]')?.getAttribute("aria-label"),
  ).toBe("exclamation-circle");
});
it("keeps zero subtitle/content outside wrappers and suppresses zero extra", async () => {
  await render(
    <Result title={0} subTitle={0} extra={0}>
      {0}
    </Result>,
  );
  expect(container.querySelector(".ant-result-title")?.textContent).toBe("0");
  expect(container.querySelector(".ant-result")?.textContent).toBe("000");
  expect(container.querySelector(".ant-result-subtitle")).toBeNull();
  expect(container.querySelector(".ant-result-extra")).toBeNull();
  expect(container.querySelector(".ant-result-content")).toBeNull();
});
it("suppresses false/null/empty-string sections but retains empty-array sections", async () => {
  for (const empty of [false, null, ""]) {
    await render(
      <Result title={empty} subTitle={empty} extra={empty}>
        {empty}
      </Result>,
    );
    expect(container.querySelector(".ant-result-title")).not.toBeNull();
    expect(container.querySelector(".ant-result-subtitle")).toBeNull();
    expect(container.querySelector(".ant-result-extra")).toBeNull();
    expect(container.querySelector(".ant-result-content")).toBeNull();
  }
  await render(
    <Result title={[]} subTitle={[]} extra={[]}>
      {[]}
    </Result>,
  );
  expect(container.querySelector(".ant-result-subtitle")).not.toBeNull();
  expect(container.querySelector(".ant-result-extra")).not.toBeNull();
  expect(container.querySelector(".ant-result-content")).not.toBeNull();
});
it("selects the four upstream status icons and their accessible labels", async () => {
  for (const [status, label] of [
    ["success", "check-circle"],
    ["error", "close-circle"],
    ["info", "exclamation-circle"],
    ["warning", "warning"],
  ] as const) {
    await render(<Result status={status} />);
    expect(
      container
        .querySelector(".ant-result-icon > .anticon")
        ?.getAttribute("aria-label"),
    ).toBe(label);
  }
  expect(Object.keys(IconMap)).toEqual(["success", "error", "info", "warning"]);
});
it("treats numeric/string exceptions alike and ignores custom/hidden icons for them", async () => {
  for (const status of [403, "403", 404, "404", 500, "500"] as const) {
    await render(<Result status={status} icon={null} />);
    expect(container.querySelector(".ant-result-image svg")).not.toBeNull();
    await render(<Result status={status} icon={<span>Override</span>} />);
    expect(container.querySelector(".ant-result-image svg")).not.toBeNull();
    expect(container.textContent).not.toContain("Override");
  }
  expect(Result.PRESENTED_IMAGE_403).toBe(ExceptionMap["403"]);
  expect(Result.PRESENTED_IMAGE_404).toBe(ExceptionMap["404"]);
  expect(Result.PRESENTED_IMAGE_500).toBe(ExceptionMap["500"]);
});
it("hides null/false status icons and falls back for zero/empty-string icons", async () => {
  for (const icon of [null, false]) {
    await render(<Result icon={icon} />);
    expect(container.querySelector(".ant-result-icon")).toBeNull();
  }
  for (const icon of [0, ""]) {
    await render(<Result icon={icon} />);
    expect(
      container.querySelector(".ant-result-icon > .anticon"),
    ).not.toBeNull();
  }
});
it("merges provider/local styles and applies custom prefix to every part", async () => {
  await render(
    <ConfigProvider
      direction="rtl"
      result={{
        className: "provider",
        style: { color: "red", backgroundColor: "pink" },
      }}
    >
      <Result
        prefixCls="demo-result"
        className="local"
        rootClassName="root"
        style={{ color: "blue" }}
        title="Title"
        subTitle="Subtitle"
        extra="Extra"
      >
        Details
      </Result>
    </ConfigProvider>,
  );
  const result = container.querySelector<HTMLElement>(".demo-result");
  expect(result?.classList.contains("demo-result-info")).toBe(true);
  expect(result?.classList.contains("demo-result-rtl")).toBe(true);
  for (const cls of ["provider", "local", "root"])
    expect(result?.classList.contains(cls)).toBe(true);
  expect(result?.style.color).toBe("blue");
  expect(result?.style.backgroundColor).toBe("pink");
  for (const part of ["icon", "title", "subtitle", "extra", "content"])
    expect(result?.querySelector(`.demo-result-${part}`)).not.toBeNull();
  expect(new Set(result?.classList).size).toBe(result?.classList.length);
});
it("serializes numeric extra margin and keeps action padding separate from title margin", async () => {
  await render(
    <ConfigProvider
      theme={{
        token: { paddingXS: 3, marginXS: 12 },
        components: { Result: { extraMargin: 12, iconFontSize: 64 } },
      }}
    >
      <Result extra="Extra" />
    </ConfigProvider>,
  );
  const style = container.querySelector<HTMLElement>(".ant-result")?.style;
  expect(style?.getPropertyValue("--ao-result-extra-margin")).toBe("12px");
  expect(style?.getPropertyValue("--ao-result-extra-gap")).toBe("3px");
  expect(style?.getPropertyValue("--ao-result-gap")).toBe("12px");
  expect(style?.getPropertyValue("--ao-result-icon-size")).toBe("64px");
});
it("does not forward unsupported arbitrary div props", async () => {
  const props = { title: "Title", id: "unsupported", onClick: () => {} };
  await render(<Result {...props} />);
  expect(container.querySelector(".ant-result")?.getAttribute("id")).toBeNull();
});
