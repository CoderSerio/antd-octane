// Adapted from rc-tree 5.13.1 util.calcDropPosition (MIT).
// Preserve the upstream flattened-node, horizontal outdent and allowDrop order.
import type { Key, TreeDataNode, TreeProps } from "../types";
import type { Entry } from "../utils";

export interface DropTarget {
  key: Key;
  dragOverKey: Key;
  position: -1 | 0 | 1;
  levelOffset: number;
  allowed: boolean;
}

export function calcDropPosition<T extends TreeDataNode>(
  event: DragEvent,
  drag: Entry<T>,
  target: Entry<T>,
  indent: number,
  startX: number,
  allowDrop: TreeProps<T>["allowDrop"],
  flattened: Entry<T>[],
  expandedKeys: Key[],
  direction: "ltr" | "rtl",
): DropTarget {
  const element = event.currentTarget as HTMLElement;
  // The row rectangle excludes descendant groups and matches rc-tree's flattened rows.
  const { top, height } = element.getBoundingClientRect();
  const rawLevel =
    ((direction === "rtl" ? -1 : 1) * (startX - event.clientX) - 12) /
    Math.max(indent, 1);
  const expanded = expandedKeys.filter(
    (key) => flattened.find((entry) => entry.key === key)?.children.length,
  );
  let drop = target;
  if (event.clientY < top + height / 2) {
    const index = flattened.findIndex((entry) => entry.key === target.key);
    drop = flattened[Math.max(0, index - 1)] ?? target;
  }
  const over = drop;
  let levelOffset = 0;
  if (!expanded.includes(drop.key)) {
    for (let level = 0; level < rawLevel; level++) {
      if (drop.parent && drop.index === drop.parent.children.length - 1) {
        drop = drop.parent;
        levelOffset++;
      } else break;
    }
  }
  const allowed = (position: -1 | 0 | 1) =>
    allowDrop?.({
      dragNode: drag.node,
      dropNode: drop.node,
      dropPosition: position,
    }) ?? true;
  let position: -1 | 0 | 1 = 0;
  let dropAllowed = true;
  if (
    drop.index === 0 &&
    drop.depth === 0 &&
    event.clientY < top + height / 2 &&
    allowed(-1) &&
    drop.key === target.key
  )
    position = -1;
  else if (over.children.length && expanded.includes(over.key)) {
    if (!allowed(0)) dropAllowed = false;
  } else if (levelOffset === 0 && rawLevel <= -1.5 && allowed(0)) position = 0;
  else if (allowed(1)) position = 1;
  else dropAllowed = false;
  if (drop.key === drag.key) dropAllowed = false;
  for (
    let parent: Entry<T> | undefined = drop;
    parent;
    parent = parent.parent
  ) {
    if (parent.key === drag.key) {
      dropAllowed = false;
      break;
    }
  }
  return {
    key: drop.key,
    dragOverKey: over.key,
    position,
    levelOffset,
    allowed: dropAllowed,
  };
}
