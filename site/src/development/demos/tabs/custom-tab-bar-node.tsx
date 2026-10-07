// Adapted from Ant Design 5.29.3 (MIT), components/tabs/demo/custom-tab-bar-node.tsx.
// Octane uses native pointer events in place of the reference's React DnD adapter.
import type { TabsProps } from "antd-octane";
import { Tabs } from "antd-octane";
import type { ElementDescriptor } from "octane";
import { cloneElement, useRef, useState } from "octane";

function DraggableTabNode({
  node,
  onMove,
}: {
  node: ElementDescriptor;
  onMove: (active: string, over: string) => void;
}) {
  const [offset, setOffset] = useState(0);
  const drag = useRef<{ start: number; active: boolean } | null>(null);
  const key = String(node.props["data-node-key"]);
  return cloneElement(node, {
    style: { cursor: "move", transform: `translateX(${offset}px)` },
    onPointerDown: (event: PointerEvent) => {
      if (event.button === 0)
        drag.current = { start: event.clientX, active: false };
    },
    onPointerMove: (event: PointerEvent) => {
      const session = drag.current;
      if (!session) return;
      const distance = event.clientX - session.start;
      if (!session.active && Math.abs(distance) < 10) return;
      const target = event.currentTarget as HTMLElement;
      if (!session.active) target.setPointerCapture(event.pointerId);
      session.active = true;
      event.preventDefault();
      setOffset(distance);
    },
    onPointerUp: (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      if (drag.current?.active) {
        event.preventDefault();
        const candidates = Array.from(
          target.parentElement?.querySelectorAll<HTMLElement>(
            "[data-node-key]",
          ) ?? [],
        );
        const nearest = candidates.reduce<HTMLElement | undefined>(
          (best, candidate) => {
            const rect = candidate.getBoundingClientRect();
            const center =
              (rect.left + rect.right) / 2 -
              (candidate === target ? offset : 0);
            if (!best) return candidate;
            const bestRect = best.getBoundingClientRect();
            const bestCenter =
              (bestRect.left + bestRect.right) / 2 -
              (best === target ? offset : 0);
            return Math.abs(center - event.clientX) <
              Math.abs(bestCenter - event.clientX)
              ? candidate
              : best;
          },
          undefined,
        );
        if (nearest?.dataset.nodeKey) onMove(key, nearest.dataset.nodeKey);
        target.releasePointerCapture(event.pointerId);
      }
      drag.current = null;
      setOffset(0);
    },
    onPointerCancel: () => {
      drag.current = null;
      setOffset(0);
    },
    onClickCapture: (event: MouseEvent) => {
      if (Math.abs(offset) >= 10) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  });
}

export default function App() {
  const [items, setItems] = useState<NonNullable<TabsProps["items"]>>([
    { key: "1", label: "Tab 1", children: "Content of Tab Pane 1" },
    { key: "2", label: "Tab 2", children: "Content of Tab Pane 2" },
    { key: "3", label: "Tab 3", children: "Content of Tab Pane 3" },
  ]);
  const onMove = (active: string, over: string) => {
    if (active === over) return;
    setItems((previous) => {
      const from = previous.findIndex((item) => item.key === active);
      const to = previous.findIndex((item) => item.key === over);
      if (from < 0 || to < 0) return previous;
      const result = [...previous];
      const [moved] = result.splice(from, 1);
      result.splice(to, 0, moved);
      return result;
    });
  };
  return (
    <Tabs
      items={items}
      renderTabBar={(props, DefaultTabBar) => (
        <DefaultTabBar {...props}>
          {(node) => (
            <DraggableTabNode key={node.key} node={node} onMove={onMove} />
          )}
        </DefaultTabBar>
      )}
    />
  );
}
