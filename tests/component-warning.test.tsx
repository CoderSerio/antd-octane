import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  Card,
  Collapse,
  Descriptions,
  Image,
  Statistic,
  Tag,
  Timeline,
  Tooltip,
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
