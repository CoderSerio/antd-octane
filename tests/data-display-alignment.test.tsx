import type { ElementDescriptor, Root } from "octane";
import { act, createRoot, Fragment } from "octane";
import { afterEach, expect, it, vi } from "vitest";
import {
  Card,
  Carousel,
  Collapse,
  ConfigProvider,
  Descriptions,
  Form,
} from "../packages/antd-octane/src";
import type {
  LegacyPanelProps,
} from "../packages/antd-octane/src/collapse/CollapsePanel";

let root: Root | undefined;

let container: HTMLDivElement;

async function render(node: ElementDescriptor) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(() => root?.render(node));
}

async function update(node: ElementDescriptor) {
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

it("Collapse flattens legacy Panel Fragments and passes active state and click handling through custom wrappers", async () => {
  const change = vi.fn();
  const wrapperClick = vi.fn();
  function WrappedPanel(props: LegacyPanelProps) {
    return <Collapse.Panel {...props} />;
  }
  await render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <Collapse defaultActiveKey={["a"]} onChange={change}>
        <Fragment key="panels-fragment">
          <Collapse.Panel key="a" header="First">
            First body
          </Collapse.Panel>
          <Fragment key="wrapper-fragment">
            <WrappedPanel key="b" header="Wrapped" onItemClick={wrapperClick}>
              Wrapped body
            </WrappedPanel>
          </Fragment>
          <p data-raw="kept">Raw child</p>
        </Fragment>
      </Collapse>
    </ConfigProvider>,
  );
  const headers = [
    ...container.querySelectorAll<HTMLElement>(".ant-collapse-header"),
  ];
  expect(headers).toHaveLength(2);
  expect(headers[0].getAttribute("aria-expanded")).toBe("true");
  expect(headers[1].getAttribute("aria-expanded")).toBe("false");
  expect(container.textContent).not.toContain("Wrapped body");
  expect(element("[data-raw]").textContent).toBe("Raw child");
  await act(() => headers[1].click());
  expect(change).toHaveBeenCalledWith(["a", "b"]);
  expect(wrapperClick).toHaveBeenCalledWith("b");
  expect(headers[1].getAttribute("aria-expanded")).toBe("true");
  expect(container.textContent).toContain("Wrapped body");
});

it("Descriptions consumes nested Fragment Items, including filled spans", async () => {
  await render(
    <Descriptions column={2} bordered>
      <Fragment key="items-fragment">
        <Descriptions.Item key="a" label="Name">
          Ada
        </Descriptions.Item>
        <Fragment key="nested-item-fragment">
          <Descriptions.Item key="b" label="Role" span="filled">
            Developer
          </Descriptions.Item>
        </Fragment>
      </Fragment>
    </Descriptions>,
  );
  expect(
    container.querySelectorAll(".ant-descriptions-item-label"),
  ).toHaveLength(2);
  expect(container.textContent).toContain("NameAda");
  expect(container.textContent).toContain("RoleDeveloper");
  expect(container.querySelectorAll("tbody tr")).toHaveLength(1);
});

it("Carousel uses cssEase ease by default independently from the JavaScript easing prop", async () => {
  await render(
    <Carousel easing="linear">
      <div>First</div>
      <div>Second</div>
    </Carousel>,
  );
  expect(element(".slick-track").style.transition).toBe("transform 500ms ease");
  await update(
    <Carousel easing="linear" cssEase="ease-in">
      <div>First</div>
      <div>Second</div>
    </Carousel>,
  );
  expect(element(".slick-track").style.transition).toBe(
    "transform 500ms ease-in",
  );
});
