import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// Ant Design 5.29.3 Markdown adaptations. See THIRD_PARTY_NOTICES.md.
export function adapt(text) {
  return text
    .trim()
    .replace(
      /React\.(?:ReactNode|ReactElement)|ReactNode|ReactElement/g,
      "OctaneNode",
    )
    .replace(/React\.CSSProperties/g, "CSSProperties")
    .replace(/React\.AriaAttributes/g, "AriaAttributes")
    .replace(/React\.MouseEvent<[^>]+>/g, "MouseEvent")
    .replace(/React\.Key/g, "string | number")
    .replace(/React 需要的 key/g, "Octane 需要的 key")
    .replace(/React\.FC\b/g, "Octane.FC")
    .replace(/React\.ComponentType|\bComponentType\b/g, "ElementType")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<InlinePopover\b[^>]*>(.*?)<\/InlinePopover>/g, "")
    .replace(/\\([[\]])/g, "$1")
    .replace(/<Badge\b[^>]*>(.*?)<\/Badge>/g, "$1");
}
export function readMarkdown(path) {
  return readFileSync(path, "utf8").replace(
    /<embed src="([^"]+)"[^>]*><\/embed>/g,
    (_, relative) => readMarkdown(resolve(dirname(path), relative)),
  );
}

// Upstream release history does not describe the first Octane release.
const descriptionsWithoutVersionHistory = {
  Alert: { closable: "可关闭配置，支持 `aria-*`" },
  Modal: {
    closeIcon: "自定义关闭图标。设置为 `null` 或 `false` 时隐藏关闭按钮",
  },
  Drawer: {
    closeIcon: "自定义关闭图标。设置为 `null` 或 `false` 时隐藏关闭按钮",
  },
  Popconfirm: { open: "用于手动控制浮层显隐" },
  Tabs: {
    closeIcon:
      '自定义关闭图标，在 `type="editable-card"` 时有效。设置为 `null` 或 `false` 时隐藏关闭按钮',
  },
  Dropdown: {
    open: "菜单是否显示（[为什么?](/docs/react/faq#弹层类组件为什么要统一至-open-属性)）",
    onOpenChange: "菜单显示状态改变时调用，点击菜单按钮导致的消失不会触发",
  },
  Avatar: { max: "设置最多显示相关配置" },
  Calendar: {
    dateFullCellRender:
      "自定义渲染日期单元格，返回内容覆盖单元格，建议使用 `fullCellRender`",
  },
  Popover: {
    open: "用于手动控制浮层显隐（[为什么?](/docs/react/faq#弹层类组件为什么要统一至-open-属性)）",
  },
  Table: {
    filterDropdownProps: "自定义下拉属性",
    title: "列头显示文字",
  },
  Tag: {
    closeIcon: "自定义关闭按钮。设置为 `null` 或 `false` 时隐藏关闭按钮",
  },
  Tooltip: {
    open: "用于手动控制浮层显隐（[为什么?](/docs/react/faq#弹层类组件为什么要统一至-open-属性)）",
  },
};

function splitRow(line) {
  // Split only unescaped pipes; unions in Markdown tables use \|.
  return line
    .trim()
    .slice(1, -1)
    .split(/(?<!\\)\|/)
    .map((cell) => adapt(cell.replace(/\\\|/g, "|")));
}

export function parseApi(text, component) {
  const start = text.indexOf("## API");
  const end = text.indexOf("## 主题变量", start);
  const lines = text.slice(start, end < 0 ? undefined : end).split("\n");
  const sections = [];
  let title = component;
  for (let i = 0; i < lines.length; i++) {
    const heading = lines[i].match(/^#{2,4}\s+(.+)/);
    if (heading && heading[1] !== "API")
      title = adapt(heading[1])
        .replace(/\s*\{#[^}]+\}/g, "")
        .replace(/\s+\d+\.\d+\.\d+\+?$/, "")
        .trim();
    if (!/^\|\s*(参数|属性|返回值)\s*\|/.test(lines[i])) continue;
    const defaultColumn = splitRow(lines[i]).indexOf("默认值");
    const rows = [];
    i += 2;
    while (lines[i]?.trim().startsWith("|")) {
      const cells = splitRow(lines[i]);
      if (cells.length < 3)
        throw new Error(`Invalid ${component} API row: ${lines[i]}`);
      // The first Octane release documents current APIs, without upstream legacy aliases.
      if (/~~[^~]+~~/.test(cells[0])) {
        i++;
        continue;
      }
      // Same-named props in other sections may have no release history.
      const description = /\d+\.\d+\.\d+|\bv\d+\b/.test(cells[1])
        ? (descriptionsWithoutVersionHistory[component]?.[cells[0]] ?? cells[1])
        : cells[1];
      rows.push([
        cells[0],
        description,
        component === "Tabs" && cells[0] === "renderTabBar"
          ? "(props: TabsTabBarProps, DefaultTabBar: ComponentType<TabsTabBarProps>) => OctaneNode"
          : cells[2],
        defaultColumn < 0 ? "-" : (cells[defaultColumn] ?? "-"),
      ]);
      i++;
    }
    if (rows.length)
      sections.push({
        title:
          sections.length > 0 && title === component ? "共同的 API" : title,
        rows,
      });
  }
  if (!sections.length) throw new Error(`No API tables for ${component}`);
  return sections;
}
