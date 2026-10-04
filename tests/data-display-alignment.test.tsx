import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import { Card, ConfigProvider, Form } from "../packages/antd-octane/src";

let root: Root | undefined;
let container: HTMLDivElement;

async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}

function element<T extends HTMLElement = HTMLElement>(selector: string): T {
  const node = container.querySelector<T>(selector);
  if (!node) throw Error(`Missing ${selector}`);
  return node;
}

afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});


it("Card resolves its variant before deprecated bordered, then Form before provider defaults", async () => {
  await render(
    <ConfigProvider variant="outlined" card={{ variant: "outlined" }}>
      <Form variant="borderless">
        <Card data-card="inherited">Inherited</Card>
        <Card data-card="explicit" variant="outlined" bordered={false}>
          Explicit
        </Card>
        <Card data-card="legacy-true" bordered>
          Legacy true
        </Card>
      </Form>
      <Card data-card="provider">Provider</Card>
      <Card data-card="legacy-false" bordered={false}>
        Legacy false
      </Card>
    </ConfigProvider>,
  );
  for (const name of ["inherited", "legacy-true", "legacy-false"])
    expect(
      element(`[data-card="${name}"]`).classList.contains(
        "ant-card-borderless",
      ),
    ).toBe(true);
  for (const name of ["explicit", "provider"])
    expect(
      element(`[data-card="${name}"]`).classList.contains("ant-card-bordered"),
    ).toBe(true);
});
