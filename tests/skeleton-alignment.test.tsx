import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, beforeEach, expect, it } from "vitest";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import { Skeleton } from "../packages/antd-octane/src/skeleton";
import Paragraph from "../packages/antd-octane/src/skeleton/Paragraph";

let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
});
async function render(node: ElementDescriptor) {
  await act(() => root.render(node));
}
it("distinguishes an absent loading key from an explicit undefined value", async () => {
  await render(<Skeleton>Ready</Skeleton>);
  expect(container.querySelector(".ant-skeleton")).not.toBeNull();
  await render(<Skeleton loading={undefined}>Ready</Skeleton>);
  expect(container.querySelector(".ant-skeleton")).toBeNull();
  expect(container.textContent).toBe("Ready");
  await render(<Skeleton loading>Ready</Skeleton>);
  expect(container.querySelector(".ant-skeleton")).not.toBeNull();
});
it("uses a direct avatar span and the upstream title and paragraph elements", async () => {
  await render(
    <Skeleton
      avatar
      title={{ className: "heading", width: 130 }}
      paragraph={{ className: "lines", rows: 2, width: [120, "75%"] }}
    />,
  );
  expect(container.querySelectorAll(".ant-skeleton")).toHaveLength(1);
  expect(
    container.querySelector(
      ".ant-skeleton-header > span.ant-skeleton-avatar-lg",
    ),
  ).not.toBeNull();
  expect(container.querySelector(".ant-skeleton-title.heading")?.tagName).toBe(
    "H3",
  );
  expect(container.querySelector<HTMLElement>(".heading")?.style.width).toBe(
    "130px",
  );
  expect(
    container.querySelector(".ant-skeleton-paragraph.lines")?.tagName,
  ).toBe("UL");
  const rows = container.querySelectorAll<HTMLElement>("li");
  expect([...rows].map((row) => row.style.width)).toEqual(["120px", "75%"]);
  expect(container.querySelector('[role="status"]')).toBeNull();
});
it("lets explicit undefined part options override their inferred defaults", async () => {
  await render(
    <Skeleton
      title={{ width: undefined }}
      paragraph={{ rows: 1, width: undefined }}
    />,
  );
  expect(container.querySelector<HTMLElement>("h3")?.style.width).toBe("");
  expect(container.querySelector<HTMLElement>("li")?.style.width).toBe("");
  await render(<Skeleton paragraph={{ rows: undefined }} />);
  expect(container.querySelectorAll("li")).toHaveLength(0);
  expect(() => Paragraph({ rows: Infinity })).toThrow(RangeError);
});
it("preserves part prefixes and wrapper/inner class placement", async () => {
  await render(
    <>
      <Skeleton
        prefixCls="custom-skeleton"
        avatar={{ prefixCls: "custom-avatar", size: 42 }}
        title={{ prefixCls: "custom-title" }}
        paragraph={{ prefixCls: "custom-lines", rows: 1 }}
      />
      <Skeleton.Avatar
        className="avatar-class"
        rootClassName="avatar-root"
        size={42}
      />
      <Skeleton.Button className="button-class" rootClassName="button-root" />
      <Skeleton.Input className="input-class" />
      <Skeleton.Image className="image-class" />
      <Skeleton.Node className="node-class">Node</Skeleton.Node>
    </>,
  );
  expect(
    container.querySelector(".custom-skeleton .custom-avatar")?.tagName,
  ).toBe("SPAN");
  expect(container.querySelector("h3.custom-title")).not.toBeNull();
  expect(container.querySelector("ul.custom-lines")).not.toBeNull();
  expect(
    container
      .querySelector(".avatar-root > .ant-skeleton-avatar")
      ?.classList.contains("avatar-class"),
  ).toBe(false);
  expect(
    container.querySelector(".button-root > .ant-skeleton-button.button-class"),
  ).not.toBeNull();
  expect(
    container.querySelector(".input-class > .ant-skeleton-input.input-class"),
  ).not.toBeNull();
  expect(
    container.querySelector(
      ".image-class > div.ant-skeleton-image.image-class > svg > title",
    )?.textContent,
  ).toBe("Image placeholder");
  expect(
    container.querySelector(".node-class > div.ant-skeleton-image.node-class")
      ?.textContent,
  ).toBe("Node");
});
it("preserves the upstream explicit undefined avatar shape override", async () => {
  await render(
    <>
      <Skeleton.Avatar />
      <Skeleton.Avatar shape={undefined} />
    </>,
  );
  const avatars = container.querySelectorAll(".ant-skeleton-avatar");
  expect(avatars[0].classList.contains("ant-skeleton-avatar-circle")).toBe(
    true,
  );
  expect(avatars[1].classList.contains("ant-skeleton-avatar-circle")).toBe(
    false,
  );
});
it("applies provider class/style to the main component and scales element tokens independently of blockRadius", async () => {
  await render(
    <ConfigProvider
      skeleton={{ className: "provider", style: { marginTop: 8 } }}
      theme={{
        token: { controlHeight: 36, borderRadiusSM: 7 },
        components: { Skeleton: { titleHeight: "1.5em", blockRadius: 12 } },
      }}
    >
      <Skeleton />
      <Skeleton.Image />
      <Skeleton.Button />
    </ConfigProvider>,
  );
  const main = container.querySelector<HTMLElement>(
    ".ant-skeleton:not(.ant-skeleton-element)",
  );
  expect(main?.classList.contains("provider")).toBe(true);
  expect(main?.style.marginTop).toBe("8px");
  expect(main?.style.getPropertyValue("--ao-skeleton-title")).toBe("1.5em");
  expect(main?.style.getPropertyValue("--ao-skeleton-radius")).toBe("12px");
  expect(main?.style.getPropertyValue("--ao-skeleton-element-radius")).toBe(
    "7px",
  );
  const image = container.querySelector<HTMLElement>(".ant-skeleton-element");
  expect(image?.classList.contains("provider")).toBe(false);
  expect(image?.style.marginTop).toBe("");
  expect(image?.style.getPropertyValue("--ao-skeleton-image-size")).toBe(
    "54px",
  );
});
