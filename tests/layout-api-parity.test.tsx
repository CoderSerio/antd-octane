import type { ElementDescriptor, HTMLAttributes, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Col,
  ConfigProvider,
  Divider,
  Flex,
  Layout,
  Menu,
  Row,
  Space,
  Splitter,
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
  root = undefined;
  container?.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("Divider supports size inheritance, variants and default margins", async () => {
  await render(
    <ConfigProvider componentSize="small" divider={{ className: "provider" }}>
      <Divider variant="dotted" rootClassName="root" />
      <Divider size="middle" />
      <Divider size="large" dashed />
      <Divider size="large">Text</Divider>
    </ConfigProvider>,
  );
  const dividers = [...container.querySelectorAll<HTMLElement>(".ant-divider")];
  expect(
    dividers.map((node) => node.style.getPropertyValue("--ao-divider-margin")),
  ).toEqual(["8px", "16px", "24px", "16px"]);
  expect(dividers[0].classList.contains("ant-divider-sm")).toBe(true);
  expect(dividers[0].classList.contains("provider")).toBe(true);
  expect(dividers[0].classList.contains("root")).toBe(true);
  expect(dividers[0].style.getPropertyValue("--ao-divider-style")).toBe(
    "dotted",
  );
  expect(dividers[2].style.getPropertyValue("--ao-divider-style")).toBe(
    "dashed",
  );
});

it("Divider maps physical positions in RTL and applies numeric strings to the text", async () => {
  await render(
    <ConfigProvider direction="rtl">
      <Divider orientation="left" orientationMargin="0">
        Left
      </Divider>
      <Divider orientation="start" orientationMargin={50}>
        Start
      </Divider>
      <Divider orientation="center" orientationMargin={50}>
        Center
      </Divider>
    </ConfigProvider>,
  );
  const dividers = [...container.querySelectorAll<HTMLElement>(".ant-divider")];
  const texts = [
    ...container.querySelectorAll<HTMLElement>(".ant-divider-inner-text"),
  ];
  expect(dividers[0].classList.contains("ant-divider-with-text-end")).toBe(
    true,
  );
  expect(dividers[0].classList.contains("ant-divider-rtl")).toBe(true);
  expect(dividers[0].style.direction).toBe("");
  expect(texts[0].style.marginInlineEnd).toMatch(/^0(?:px)?$/);
  expect(texts[0].style.paddingInlineEnd).toMatch(/^0(?:px)?$/);
  expect(dividers[0].style.getPropertyValue("--ao-divider-edge")).toBe("0%");
  expect(dividers[1].classList.contains("ant-divider-with-text-start")).toBe(
    true,
  );
  expect(texts[1].style.marginInlineStart).toBe("50px");
  expect(texts[2].style.marginInlineStart).toBe("");
  expect(dividers[2].style.getPropertyValue("--ao-divider-edge")).toBe("5%");
});

function splitterDimension() {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(600);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(300);
}
