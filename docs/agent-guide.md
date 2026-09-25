# Ant Design for Octane：Agent 接入指南

面向为应用编写代码的 AI Agent。本文描述当前实现，路线图和 Ant Design 上游文档不能作为已经支持某项 API 的证据。

## 先确认项目身份

- 包名 `antd-octane`，版本 `0.1.0-alpha.0`，已发布 npm，使用 `antd-octane@alpha` 安装；需可复现版本时固定 `antd-octane@0.1.0-alpha.0`。
- 运行时是 **Octane 0.4.3 原生组件**，不是 React 包装。Hooks、JSX、根节点创建和类型来自 `octane`；不要引入 `react`、`react-dom` 或 `@ant-design/icons` 来替代本库实现。
- Ant Design **5.29.3** 是开发对照基线，不代表 API、内部 DOM、样式或行为完全兼容。不承诺仅替换 import 即可迁移。
- 当前支持 ESM 浏览器消费；SSR、其他浏览器和辅助技术的完整验证尚未完成。没有已发布的专用 CLI 或 MCP 服务。

## 读取顺序

1. [快速开始](./#start)：安装和构建方式。
2. [兼容与迁移](./#compatibility)、[API 与语法约定](./#api-conventions)：共享约定与差异。
3. [组件总览](./#components)，再打开所需组件页面，阅读 API 表及「主题与支持范围」，例如 [Input](./#input)、[Modal](./#modal)、[App](./#app)。
4. 本地仓库中以 `packages/antd-octane/src/index.ts` 的导出、各组件 Props 和 `packages/antd-octane/src/theme/types.ts` 为最终核对依据；独立消费项目核对已安装包的 `dist/index.d.ts` 和相关声明文件。

本站 `#...` 链接是客户端页面，需要执行 JavaScript。纯文本读取使用 [agent-guide.md](agent-guide.md) 或 [compatibility.md](compatibility.md)。也可查阅 [GitHub 兼容清单](https://github.com/CoderSerio/antd-octane/blob/codex/first-alpha/docs/compatibility.md)。远端仓库与本地工作区可能有版本差异，以当前使用的构建产物为准。

## 安装

在消费项目内安装已发布版本：

```bash
pnpm add antd-octane@alpha octane@0.4.3
pnpm add -D vite@8 typescript@5.9
```

以下本地构建方式仅用于开发本库或验证尚未发布的修改：

仓库要求 Node.js ≥ 22.22.2、pnpm 10.29.2。在仓库内：

```bash
pnpm install
pnpm build:lib
pnpm --filter antd-octane pack --pack-destination /tmp
```

在消费项目内安装该 tarball，文件名随构建版本变化：

```bash
pnpm add /tmp/antd-octane-0.1.0-alpha.0.tgz octane@0.4.3
pnpm add -D vite@8 typescript@5.9
```

Vite 配置：

```ts
import { defineConfig } from "vite";
import { octane } from "octane/compiler/vite";

export default defineConfig({ plugins: [octane()] });
```

TypeScript 配置至少包含：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "jsxImportSource": "octane",
    "strict": true,
    "noEmit": true
  }
}
```

`react-jsx` 是 TypeScript 配置项名称，不表示依赖 React。入口文件需要显式导入 CSS；HTML 提供 `<div id="root"></div>` 并加载该 TSX 模块。

```tsx
import { createRoot, useState } from "octane";
import { App, Button, ConfigProvider, Input } from "antd-octane";
import "antd-octane/style.css";

function Editor() {
  const [name, setName] = useState("");
  const { message } = App.useApp();
  return (
    <>
      <Input
        aria-label="名称"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Button type="primary" onClick={() => message.success(`已保存：${name}`)}>
        保存
      </Button>
    </>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");
createRoot(root).render(
  <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
    <App><Editor /></App>
  </ConfigProvider>,
);
```

`App.useApp()` 必须在 `App` 的后代组件中调用，当前返回 `message` 和 `notification`，不返回 `modal`。也可使用 `message.useMessage()` / `notification.useNotification()`，但必须渲染返回的 `contextHolder`，并将其放在需要继承的 ConfigProvider 内。

## 主题和样式

- 支持 `ConfigProvider theme.token`、默认/暗色/紧凑算法及组合、`inherit`、已实现组件的 `theme.components` 配置。组件 token 和算法字段以当前类型与组件页为准。
- `theme.getDesignToken` 可读取派生 token；`theme.useToken()` 当前仅返回 `{ token }`。
- CSS 是静态样式，位于 `@layer antd`；组件通过局部 CSS 变量使用 token。优先通过主题配置修改设计值，通过 `className` / `style` 调整应用布局。
- 不支持 `cssVar`、`hashed`、`prefixCls`、`StyleProvider`、React CSS-in-JS 插件或 SSR 样式提取契约。主题配置可迁移不等于依赖 antd 内部 DOM 的 CSS 选择器可迁移。
- Tailwind CSS、StyleX 不是必需依赖。具体接入与已验证范围查本站样式文档；不能把 StyleX 原始样式对象直接当作 DOM `style`。不要推断所有样式工具组合已验证。

## Tailwind v4 接入要点

已验证 Tailwind CSS / @tailwindcss/vite 4.3.3、Octane 0.4.3、Vite 8.3.1 的独立打包消费与代表性 Button/布局/主题映射；不是全量组件保证。

这是应用侧接入方案，不是独立插件。尚无 `@antd-octane/tailwind`；不要安装 Vue 版 `@antdv-next/tailwind` 或臆造本库 CSS 变量。

在已有 Octane Vite 项目安装 `tailwindcss@4`、`@tailwindcss/vite@4`，保留 `octane()` 并增加 `tailwindcss()` 插件。把样式集中在一个 `app.css`：

```css
@layer theme, base, antd, components, utilities;
@import "tailwindcss";
@import "antd-octane/style.css";
```

应用入口只 `import "./app.css"`，不要在层顺序声明之前单独导入组件 CSS。Preflight 在 base，组件样式在 antd，普通 utilities 可覆盖组件类样式；内联 style、未分层规则和 !important 不适用这个简单优先级结论。

- 优先把 `flex`、`gap-4`、`p-6` 等布局类放在业务容器；组件 `className` 的挂载节点以该组件为准。
- 使用静态完整类名，不拼接无法被 Tailwind 扫描的字符串。
- 不自动提供 `bg-primary`、`--ant-*` 或全局 token 变量；内部 `--ao-*` 也不是稳定的公共契约。
- 若需要语义工具类，在 ConfigProvider 后代组件调用 `theme.useToken()`，将 `token.colorPrimary` 写入业务容器的 `--app-primary`，在 CSS 中写 `@theme inline { --color-app-primary: var(--app-primary); }`，然后使用 `text-app-primary`。变量命名属于应用，不属于组件库。
- 嵌套主题需在对应作用域重新映射；body portal 不会继承业务 DOM 祖先变量。Tailwind dark 变体也不会自动切换 ConfigProvider 算法。
- App 包裹组件不是启用 Tailwind 的必要条件。Tailwind v3、StyleX、SSR 和全量组件组合未完成验证。

详细配置与示例见 [Tailwind CSS](./#tailwindcss)，工具语法见 [Tailwind Vite](https://tailwindcss.com/docs/installation/using-vite) 和 [主题变量](https://tailwindcss.com/docs/theme)。

## 避免凭上游经验生成 API

- `Modal` 已有声明式 `open/onOk/onCancel` 用法；`Modal.confirm`、`Modal.useModal`、`App.useApp().modal` 尚未支持。关闭状态由调用方管理。
- `message.success()`、`notification.open()` 等全局静态调用尚未支持；使用 hook 返回的实例或 `App.useApp()` 实例。
- 不假设 Form、Table、DatePicker 或任何未导出的组件已经可用。先查导出和组件页，再决定是否采用原生元素、已实现组件组合或说明缺口。
- 不从 React 推断 `SyntheticEvent`、`persist()`、ref 结构或子组件克隆行为。Input 事件读取 `event.target.value`，Input ref 通过 `.current` 读取；其他组件按各自类型处理。
- 不假设支持任意上游子组件、`variant`、`styles/classNames`、静态方法或全部组件 token。未列出的能力应核实；无法确认时明确说明，而不是编造兼容实现。

## 交付前验证

在消费项目运行 TypeScript 检查和生产构建，实际打开浏览器检查交互、键盘、主题和窄屏布局。更改本仓库时运行 `pnpm check` 和 `pnpm pack:check`，避免源码 alias 掩盖打包问题。已有测试覆盖的范围不等于所有组件、状态和浏览器都已经验证。
