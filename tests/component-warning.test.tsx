import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  Card,
  Collapse,
  ConfigProvider,
  Descriptions,
  Drawer,
  Image,
  Modal,
  Popconfirm,
  Popover,
  Progress,
  Result,
  Spin,
  Statistic,
  Tag,
  Timeline,
  Tooltip,
  type TooltipRef,
} from "../packages/antd-octane/src";
import { resetWarned } from "../packages/antd-octane/src/_util/warning";

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
beforeEach(() => {
  resetWarned();
  vi.stubEnv("NODE_ENV", "development");
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(async () => {
  await act(() => root?.unmount());
  root = undefined;
  container?.remove();
  resetWarned();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
const deprecation = (oldProp: string, newProp: string) =>
  `\`${oldProp}\` is deprecated. Please use \`${newProp}\` instead.`;
const matrix = [
  {
    name: "Tag",
    node: <Tag visible={undefined}>tag</Tag>,
    messages: [deprecation("visible", "visible && <Tag />")],
  },
  {
    name: "Card",
    node: <Card headStyle={undefined} bodyStyle={undefined} bordered={false} />,
    messages: [
      deprecation("headStyle", "styles.header"),
      deprecation("bodyStyle", "styles.body"),
      deprecation("bordered", "variant"),
    ],
  },
  {
    name: "Collapse",
    node: <Collapse expandIconPosition="left" destroyInactivePanel={false} />,
    messages: [
      "`expandIconPosition` with `left` or `right` is deprecated. Please use `start` or `end` instead.",
      deprecation("destroyInactivePanel", "destroyOnHidden"),
    ],
  },
  {
    name: "Collapse.Panel",
    node: (
      <Collapse>
        <Collapse.Panel key="a" header="legacy" disabled={undefined}>
          content
        </Collapse.Panel>
      </Collapse>
    ),
    messages: [deprecation("disabled", 'collapsible="disabled"')],
  },
  {
    name: "Descriptions",
    node: (
      <Descriptions
        column={2}
        labelStyle={undefined}
        contentStyle={undefined}
        items={[{ label: "oversize", span: 3, children: "content" }]}
      />
    ),
    messages: [
      deprecation("labelStyle", "styles={{ label: {} }}"),
      deprecation("contentStyle", "styles={{ content: {} }}"),
      "Sum of column `span` in a line not match `column` of Descriptions.",
    ],
  },
  {
    name: "Image",
    node: <Image preview={{ destroyOnClose: undefined }} />,
    messages: [deprecation("destroyOnClose", "destroyOnHidden")],
  },
  {
    name: "Timeline",
    node: (
      <Timeline>
        <Timeline.Item>legacy</Timeline.Item>
      </Timeline>
    ),
    messages: [deprecation("Timeline.Item", "items")],
  },
  {
    name: "Countdown",
    node: <Statistic.Countdown value={0} />,
    messages: [
      deprecation(
        "<Statistic.Countdown />",
        '<Statistic.Timer type="countdown" />',
      ),
    ],
  },
  {
    name: "Progress",
    node: (
      <Progress
        width={undefined}
        successPercent={undefined}
        success={{ progress: undefined }}
        strokeWidth={undefined}
      />
    ),
    messages: [
      deprecation("successPercent", "success.percent"),
      deprecation("width", "size"),
      deprecation("success.progress", "success.percent"),
      deprecation("strokeWidth", "size"),
    ],
  },
  {
    name: "Progress",
    node: <Progress type="circle" size={[100, 20]} strokeWidth={4} />,
    messages: [
      'Type "circle" and "dashboard" do not accept array as `size`, please use number or preset size instead.',
    ],
  },
  {
    name: "Progress",
    node: <Progress type="dashboard" size={{ width: 100, height: 20 }} />,
    messages: [
      'Type "circle" and "dashboard" do not accept object as `size`, please use number or preset size instead.',
    ],
  },
  {
    name: "Spin",
    node: <Spin tip="unusable" />,
    messages: ["`tip` only work in nest or fullscreen pattern."],
  },
  {
    name: "Modal",
    node: (
      <Modal
        visible={undefined}
        bodyStyle={undefined}
        maskStyle={undefined}
        destroyOnClose={false}
      />
    ),
    messages: [
      deprecation("visible", "open"),
      deprecation("bodyStyle", "styles.body"),
      deprecation("maskStyle", "styles.mask"),
      deprecation("destroyOnClose", "destroyOnHidden"),
    ],
  },
  {
    name: "Drawer",
    node: (
      <Drawer
        visible={undefined}
        afterVisibleChange={undefined}
        headerStyle={undefined}
        bodyStyle={undefined}
        footerStyle={undefined}
        contentWrapperStyle={undefined}
        maskStyle={undefined}
        drawerStyle={undefined}
      />
    ),
    messages: [
      deprecation("visible", "open"),
      deprecation("afterVisibleChange", "afterOpenChange"),
      deprecation("headerStyle", "styles.header"),
      deprecation("bodyStyle", "styles.body"),
      deprecation("footerStyle", "styles.footer"),
      deprecation("contentWrapperStyle", "styles.wrapper"),
      deprecation("maskStyle", "styles.mask"),
      deprecation("drawerStyle", "styles.content"),
    ],
  },
  {
    name: "Drawer",
    node: <Drawer getContainer={false} style={{ position: "absolute" }} />,
    messages: [
      "`style` is replaced by `rootStyle` in v5. Please check that `position: absolute` is necessary.",
    ],
  },
  {
    name: "Tooltip",
    node: (
      <Tooltip
        title="help"
        visible={undefined}
        defaultVisible={undefined}
        onVisibleChange={undefined}
        afterVisibleChange={undefined}
        destroyTooltipOnHide={undefined}
        arrowPointAtCenter={false}
        overlayStyle={undefined}
        overlayInnerStyle={undefined}
        overlayClassName={undefined}
      >
        <button type="button">trigger</button>
      </Tooltip>
    ),
    messages: [
      deprecation("visible", "open"),
      deprecation("defaultVisible", "defaultOpen"),
      deprecation("onVisibleChange", "onOpenChange"),
      deprecation("afterVisibleChange", "afterOpenChange"),
      deprecation("destroyTooltipOnHide", "destroyOnHidden"),
      deprecation("arrowPointAtCenter", "arrow={{ pointAtCenter: true }}"),
      deprecation("overlayStyle", "styles={{ root: {} }}"),
      deprecation("overlayInnerStyle", "styles={{ body: {} }}"),
      deprecation("overlayClassName", 'classNames={{ root: "" }}'),
    ],
  },
  {
    name: "Tooltip",
    node: (
      <Tooltip
        title="help"
        destroyTooltipOnHide={{ keepParent: true }}
        arrow={{ arrowPointAtCenter: false }}
      >
        <button type="button">trigger</button>
      </Tooltip>
    ),
    messages: [
      deprecation("destroyTooltipOnHide", "destroyOnHidden"),
      "`destroyTooltipOnHide` no need config `keepParent` anymore. Please use `boolean` value directly.",
      "`arrowPointAtCenter` in `arrow` is deprecated. Please use `pointAtCenter` instead.",
    ],
  },
];
it.each(
  matrix,
)("matches upstream warning conditions for $name: $messages", async ({
  name,
  node,
  messages,
}) => {
  await render(node);
  expect(console.warn).not.toHaveBeenCalled();
  expect(console.error).toHaveBeenCalledTimes(messages.length);
  for (const message of messages) {
    expect(console.error).toHaveBeenCalledWith(
      `Warning: [antd-octane: ${name}] ${message}`,
    );
  }
});
function Modern() {
  return (
    <>
      <Tag>new</Tag>
      <Card variant="borderless" styles={{ header: {}, body: {} }} />
      <Collapse
        expandIconPosition="end"
        destroyOnHidden
        items={[{ key: "a", label: "disabled", collapsible: "disabled" }]}
      />
      <Descriptions
        column={2}
        styles={{ label: {}, content: {} }}
        items={[
          { span: 2, label: "exact", children: "value" },
          { span: "filled", label: "filled", children: "value" },
        ]}
      />
      <Image preview={{ destroyOnHidden: true }} />
      <Timeline items={[{ children: "new" }]} />
      <Statistic.Timer value={0} type="countdown" />
      <Progress size={[100, 8]} success={{ percent: 50 }} />
      <Progress steps={3} strokeWidth={4} />
      <Progress type="circle" size={100} strokeWidth={4} />
      <Spin tip="nested">content</Spin>
      <Spin tip="fullscreen" fullscreen spinning={false} />
      <Modal open={false} destroyOnHidden styles={{ body: {}, mask: {} }} />
      <Drawer
        open={false}
        afterOpenChange={() => {}}
        styles={{
          content: {},
          header: {},
          body: {},
          footer: {},
          mask: {},
          wrapper: {},
        }}
      />
      <Tooltip
        title="modern"
        arrow={{ pointAtCenter: true }}
        destroyOnHidden
        styles={{ root: {}, body: {} }}
        classNames={{ root: "modern" }}
      >
        <button type="button">Tooltip</button>
      </Tooltip>
      <Popover
        title="legacy styles are consumed by Popover"
        overlayStyle={{}}
        overlayClassName="legacy"
      >
        <button type="button">Popover</button>
      </Popover>
      <Popconfirm title="modern">
        <button type="button">Popconfirm</button>
      </Popconfirm>
      <Result icon="OK" />
    </>
  );
}
it("modern props and Popover's consumed legacy styles do not warn", async () => {
  await render(<Modern />);
  expect(console.warn).not.toHaveBeenCalled();
  expect(console.error).not.toHaveBeenCalled();
});
it("aggregates deprecations while keeping usage warnings separate", async () => {
  await render(
    <ConfigProvider warning={{ strict: false }}>
      {matrix.map(({ node, name, messages }) => (
        <div key={`${name}-${messages.join()}`}>{node}</div>
      ))}
    </ConfigProvider>,
  );
  expect(console.warn).toHaveBeenCalledOnce();
  expect(console.error).toHaveBeenCalledTimes(6);
  const aggregated = vi.mocked(console.warn).mock.calls[0][1] as Record<
    string,
    string[]
  >;
  expect(aggregated.Card).toEqual(matrix[1].messages);
  expect(aggregated.Tooltip).toContain(
    deprecation("destroyTooltipOnHide", "destroyOnHidden"),
  );
  expect(
    aggregated.Tooltip.filter(
      (message) =>
        message === deprecation("destroyTooltipOnHide", "destroyOnHidden"),
    ),
  ).toHaveLength(1);
});
it("production emits no component warnings", async () => {
  vi.stubEnv("NODE_ENV", "production");
  await render(
    <ConfigProvider>
      {matrix.map(({ node, name, messages }) => (
        <div key={`${name}-${messages.join()}`}>{node}</div>
      ))}
    </ConfigProvider>,
  );
  expect(console.warn).not.toHaveBeenCalled();
  expect(console.error).not.toHaveBeenCalled();
});
it("forcePopupAlign warns on invocation and still aligns", async () => {
  let ref: TooltipRef | null = null;
  await render(
    <Tooltip
      title="help"
      ref={(value) => {
        ref = value;
      }}
    >
      <button type="button">Tooltip</button>
    </Tooltip>,
  );
  expect(console.error).not.toHaveBeenCalled();
  await act(() => ref?.forceAlign());
  expect(console.error).not.toHaveBeenCalled();
  await act(() => ref?.forcePopupAlign());
  expect(console.error).toHaveBeenCalledWith(
    `Warning: [antd-octane: Tooltip] ${deprecation("forcePopupAlign", "forceAlign")}`,
  );
});
it("Result checks removed string icon names even for exception statuses", async () => {
  await render(<Result status="404" icon="legacy-icon" />);
  expect(console.error).toHaveBeenCalledWith(
    "Warning: [antd-octane: Result] `icon` accepts OctaneNode instead of a string icon name. Please check `legacy-icon` at https://ant.design/components/icon",
  );
});
it("Drawer supports visible aliases and upstream style precedence", async () => {
  const legacyChanged = vi.fn(),
    modernChanged = vi.fn();
  const config = {
    styles: {
      header: { color: "red", padding: 12 },
      body: { color: "red" },
      footer: { color: "red" },
      wrapper: { background: "red" },
      mask: { background: "red" },
      content: { color: "red" },
    },
  };
  await render(
    <ConfigProvider theme={{ token: { motion: false } }} drawer={config}>
      <Drawer
        visible
        getContainer={false}
        title="legacy"
        footer="footer"
        afterVisibleChange={legacyChanged}
        drawerStyle={{ color: "blue" }}
        headerStyle={{ color: "blue" }}
        bodyStyle={{ color: "blue" }}
        footerStyle={{ color: "blue" }}
        contentWrapperStyle={{ background: "blue" }}
        maskStyle={{ background: "blue" }}
        styles={{
          header: { color: "green" },
          body: { color: "green" },
          footer: { color: "green" },
          wrapper: { background: "green" },
          mask: { background: "green" },
          content: { color: "green" },
        }}
      >
        content
      </Drawer>
    </ConfigProvider>,
  );
  expect(container.querySelector(".ant-drawer-content")?.textContent).toContain(
    "content",
  );
  for (const part of ["header", "body", "footer"])
    expect(
      container.querySelector<HTMLElement>(`.ant-drawer-${part}`)?.style.color,
    ).toBe("green");
  expect(
    container.querySelector<HTMLElement>(".ant-drawer-header")?.style.padding,
  ).toBe("12px");
  expect(
    container.querySelector<HTMLElement>(".ant-drawer-content")?.style.color,
  ).toBe("red");
  expect(
    container.querySelector<HTMLElement>(".ant-drawer-mask")?.style.background,
  ).toBe("red");
  expect(
    container.querySelector<HTMLElement>(".ant-drawer-content-wrapper")?.style
      .background,
  ).toBe("red");
  expect(legacyChanged).toHaveBeenCalledWith(true);
  expect(document.activeElement).toBe(container.querySelector(".ant-drawer"));
  await render(
    <ConfigProvider theme={{ token: { motion: false } }} drawer={config}>
      <Drawer
        open={false}
        visible
        afterOpenChange={modernChanged}
        afterVisibleChange={legacyChanged}
        getContainer={false}
      />
    </ConfigProvider>,
  );
  expect(container.querySelector(".ant-drawer-open")).toBeNull();
  expect(modernChanged).toHaveBeenCalledWith(false);
});
