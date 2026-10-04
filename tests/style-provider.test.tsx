import { act, createRoot, type Root } from "octane";
import { afterEach, beforeEach, expect, it } from "vitest";
import { App, ConfigProvider, Modal } from "../packages/antd-octane/src";
import { StyleProvider } from "../packages/antd-octane/src/style";
import { useStyleContext } from "../packages/antd-octane/src/style/context";

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
const modalStyles = () => [
  ...document.querySelectorAll<HTMLStyleElement>("style[data-ao-modal-style]"),
];

it("defaults to no layer, inherits an omitted layer and accepts explicit false", async () => {
  const seen: Record<string, boolean> = {};
  function Read({ name }: { name: string }) {
    seen[name] = useStyleContext().layer;
    return <span>{name}</span>;
  }
  await act(() =>
    root.render(
      <>
        <Read name="default" />
        <StyleProvider layer>
          <Read name="layer" />
          <StyleProvider>
            <Read name="inherited" />
          </StyleProvider>
          <StyleProvider layer={false}>
            <Read name="disabled" />
          </StyleProvider>
        </StyleProvider>
      </>,
    ),
  );
  expect(seen).toEqual({
    default: false,
    layer: true,
    inherited: true,
    disabled: false,
  });
});

it("deduplicates owned Modal registrations and removes them on final unmount", async () => {
  await act(() =>
    root.render(
      <>
        <Modal />
        <Modal />
      </>,
    ),
  );
  const styles = modalStyles();
  expect(styles).toHaveLength(1);
  const id = styles[0].getAttribute("data-ao-modal-style");
  expect(styles[0].textContent).toContain(
    `:where(.${id}).ant-modal .ant-modal-body`,
  );
  expect(styles[0].textContent).not.toContain("@layer");
  await act(() => root.render(<Modal />));
  expect(modalStyles()).toEqual(styles);
  await act(() => root.unmount());
  expect(modalStyles()).toHaveLength(0);
});

it("scopes layered and unlayered sibling rules to different panels", async () => {
  await act(() =>
    root.render(
      <ConfigProvider theme={{ token: { motion: false } }}>
        <Modal open title="Default" />
        <StyleProvider layer>
          <Modal open title="Layered" />
        </StyleProvider>
      </ConfigProvider>,
    ),
  );
  const styles = modalStyles();
  expect(styles).toHaveLength(2);
  const layered = styles.find((style) =>
    style.textContent?.startsWith("@layer"),
  );
  const plain = styles.find(
    (style) => !style.textContent?.startsWith("@layer"),
  );
  const layeredId = layered?.getAttribute("data-ao-modal-style");
  const plainId = plain?.getAttribute("data-ao-modal-style");
  expect(layeredId).not.toBe(plainId);
  const panels = [...document.querySelectorAll<HTMLElement>(".ant-modal")];
  expect(panels[0].classList.contains(plainId ?? "missing")).toBe(true);
  expect(panels[1].classList.contains(layeredId ?? "missing")).toBe(true);
  expect(layered?.textContent).toContain(`:where(.${layeredId})`);
  expect(plain?.textContent).not.toContain(`:where(.${layeredId})`);
});

it("changes layer without leaving the previous registration or scope active", async () => {
  const tree = (layer: boolean) => (
    <StyleProvider layer={layer}>
      <Modal />
      <App>App</App>
    </StyleProvider>
  );
  await act(() => root.render(tree(false)));
  const plain = modalStyles()[0];
  await act(() => root.render(tree(true)));
  expect(plain.isConnected).toBe(false);
  expect(modalStyles()).toHaveLength(1);
  expect(modalStyles()[0].textContent).toMatch(/^@layer antd/);
  expect(
    document.querySelector("style[data-ao-app-style]")?.textContent,
  ).toMatch(/^@layer antd/);
});

it("keeps nonce policies separate and shares CSS variables across themes", async () => {
  const tree = (nonce: string, color: string) => (
    <>
      <ConfigProvider
        csp={{ nonce }}
        theme={{ token: { colorPrimary: color } }}
      >
        <Modal />
      </ConfigProvider>
      <ConfigProvider csp={{ nonce: "other" }}>
        <Modal />
      </ConfigProvider>
    </>
  );
  await act(() => root.render(tree("first", "#1677ff")));
  expect(
    modalStyles()
      .map((style) => style.nonce)
      .sort(),
  ).toEqual(["first", "other"]);
  const first = modalStyles().find((style) => style.nonce === "first");
  await act(() => root.render(tree("first", "#722ed1")));
  expect(modalStyles()).toContain(first);
  await act(() => root.render(tree("second", "#722ed1")));
  expect(first?.isConnected).toBe(false);
  expect(
    modalStyles()
      .map((style) => style.nonce)
      .sort(),
  ).toEqual(["other", "second"]);
});

it("registers authored prefixes and prepends before equal-weight user styles", async () => {
  const userStyle = document.createElement("style");
  userStyle.textContent = ".custom-modal{color:purple}";
  document.head.append(userStyle);
  await act(() => root.render(<Modal prefixCls="custom-modal" />));
  const registered = modalStyles()[0];
  expect(registered.textContent).toContain(".custom-modal .custom-modal-body");
  expect(
    registered.compareDocumentPosition(userStyle) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).not.toBe(0);
  userStyle.remove();
});

it("appends layered registrations after the application's layer order", async () => {
  const layers = document.createElement("style");
  layers.textContent = "@layer theme,base,antd,utilities;";
  document.head.append(layers);
  await act(() =>
    root.render(
      <StyleProvider layer>
        <Modal />
        <App>layered</App>
      </StyleProvider>,
    ),
  );
  for (const registered of [
    ...modalStyles(),
    ...document.querySelectorAll("style[data-ao-app-style]"),
  ]) {
    expect(
      layers.compareDocumentPosition(registered) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0);
  }
  layers.remove();
});
