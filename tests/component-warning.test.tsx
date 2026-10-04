import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Card } from "../packages/antd-octane/src";
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
    name: "Card",
    node: <Card headStyle={undefined} bodyStyle={undefined} bordered={false} />,
    messages: [
      deprecation("headStyle", "styles.header"),
      deprecation("bodyStyle", "styles.body"),
      deprecation("bordered", "variant"),
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
