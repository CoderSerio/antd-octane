import { act, createRoot, type Root, useContext } from "octane";
import { afterEach, beforeEach, expect, it } from "vitest";
import { App } from "../packages/antd-octane/src/app";
import { ConfigProvider } from "../packages/antd-octane/src/config-provider";
import {
  ConfigContext,
  type CSPConfig,
} from "../packages/antd-octane/src/config-provider/context";

let root: Root;
let container: HTMLDivElement;
const observed: Record<string, CSPConfig | undefined> = {};
function Read({ name }: { name: string }) {
  observed[name] = useContext(ConfigContext).csp;
  return <span>{name}</span>;
}
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
});

it("CSP is absent by default, inherits undefined and uses an explicit nested object", async () => {
  const parent = { nonce: "parent-nonce" };
  const child = { nonce: "child-nonce" };
  await act(() =>
    root.render(
      <>
        <Read name="default" />
        <ConfigProvider csp={parent}>
          <Read name="parent" />
          <ConfigProvider csp={undefined}>
            <Read name="inherited" />
          </ConfigProvider>
          <ConfigProvider csp={child}>
            <Read name="child" />
          </ConfigProvider>
          <ConfigProvider csp={{}}>
            <Read name="empty" />
          </ConfigProvider>
          <ConfigProvider csp={null as never}>
            <Read name="null" />
          </ConfigProvider>
        </ConfigProvider>
      </>,
    ),
  );
  expect(observed.default).toBeUndefined();
  expect(observed.parent).toBe(parent);
  expect(observed.inherited).toBe(parent);
  expect(observed.child).toBe(child);
  expect(observed.empty).toEqual({});
  expect(observed.null).toBe(parent);
});

it("App style rules receive inherited nonce and keep distinct policies separate", async () => {
  await act(() =>
    root.render(
      <ConfigProvider csp={{ nonce: "parent-nonce" }}>
        <App>outer</App>
        <ConfigProvider>
          <App>inherited</App>
        </ConfigProvider>
        <ConfigProvider csp={{ nonce: "child-nonce" }}>
          <App>child</App>
        </ConfigProvider>
        <ConfigProvider csp={{}}>
          <App>empty</App>
        </ConfigProvider>
      </ConfigProvider>,
    ),
  );
  const styles = [
    ...document.querySelectorAll<HTMLStyleElement>("style[data-ao-app-style]"),
  ];
  expect(styles).toHaveLength(3);
  expect(styles.map((style) => style.nonce ?? "").sort()).toEqual([
    "",
    "child-nonce",
    "parent-nonce",
  ]);
  expect(new Set(styles.map((style) => style.textContent)).size).toBe(1);
});

it("changing nonce replaces the owned style without leaking the previous policy", async () => {
  function Tree({ nonce }: { nonce: string }) {
    return (
      <ConfigProvider csp={{ nonce }}>
        <App>current policy</App>
      </ConfigProvider>
    );
  }
  await act(() => root.render(<Tree nonce="first" />));
  await act(() => root.render(<Tree nonce="second" />));
  const styles = [
    ...document.querySelectorAll<HTMLStyleElement>("style[data-ao-app-style]"),
  ];
  expect(styles).toHaveLength(1);
  expect(styles[0].nonce).toBe("second");
  await act(() => root.unmount());
  expect(document.querySelectorAll("style[data-ao-app-style]")).toHaveLength(0);
});
