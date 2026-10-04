/** @jsxImportSource octane */
import type { ElementDescriptor, Root } from "octane";
import { act, createRoot } from "octane";
import { afterEach, expect, it } from "vitest";
import { Tree } from "../packages/antd-octane/src/tree";

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
});

it("DirectoryTree icons read raw isLeaf while the switcher uses inferred leaf state", async () => {
  await render(
    <Tree.DirectoryTree
      treeData={[
        {
          key: "root",
          title: "Root",
          children: [
            { key: "inferred-leaf", title: "Workspace" },
            { key: "explicit-leaf", title: "Readme", isLeaf: true },
            { key: "explicit-parent", title: "Remote", isLeaf: false },
          ],
        },
      ]}
      defaultExpandedKeys={["root"]}
    />,
  );

  const rows = [
    ...container.querySelectorAll<HTMLElement>(
      '[role="treeitem"][aria-level="2"]',
    ),
  ];
  const iconPath = (row: HTMLElement) =>
    row.querySelector(".ant-tree-iconEle path")?.getAttribute("d");
  if (rows.length !== 3) throw Error("Missing DirectoryTree child rows");

  expect(iconPath(rows[0])).toMatch(/^M880 298\.4H521/);
  expect(iconPath(rows[1])).toMatch(/^M854\.6 288\.6L639\.4/);
  expect(iconPath(rows[2])).toMatch(/^M880 298\.4H521/);
  expect(rows[0].classList.contains("ant-tree-treenode-leaf")).toBe(true);
  expect(rows[0].querySelector(".ant-tree-switcher-noop")).not.toBeNull();
  expect(rows[2].classList.contains("ant-tree-treenode-leaf")).toBe(false);
  expect(rows[2].querySelector(".ant-tree-switcher-noop")).toBeNull();
});
