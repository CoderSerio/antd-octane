# Ant Design for Octane

面向 [Octane](https://github.com/octanejs/octane) 的 Ant Design 组件库，沿用熟悉的组件 API、交互与主题配置。

**当前为 `0.1.0-alpha.0` 开发原型，尚未发布 npm 包。** 独立社区项目，不代表 Ant Design 或 Octane 的官方立场。

## 本地运行

需要 Node.js **≥ 22.22.2**、pnpm **10.29.2**。

```bash
pnpm install
pnpm dev
```

打开终端显示的地址（默认 `http://127.0.0.1:4173`），查看中文文档、运行示例和主题实验室。

```bash
pnpm check       # Biome、类型检查、测试、组件包与文档站构建
pnpm pack:check  # 在独立临时项目中安装 tarball，验证类型与构建
pnpm preview     # 预览 site/dist
```

## 第一版包含什么

- Octane 原生组件：Button、基础 Input、Checkbox / Radio 选择组、Switch，及布局、信息展示组件；完整清单与未支持项见[兼容范围](docs/compatibility.md)。
- antd v5 默认、暗色、紧凑主题算法，支持组合、自定义算法、token 覆盖和嵌套主题。
- Button 常用类型、尺寸、禁用、加载、危险、幽灵、形状、链接和组件级主题。
- 中文文档站：接入指南、API 与语法约定、组件示例与 API、源码展示和实时主题预览。

固定基线：Octane **0.4.3**、Ant Design **5.29.3**。全局 token 通过原版 antd 对照测试；这不代表所有组件与样式能力已兼容。详见[支持范围](docs/compatibility.md)。

## 工作区结构

```text
packages/antd-octane/  组件包、主题算法与声明文件
site/                 Octane + Vite 文档站与共享示例
tests/                主题对照与原生交互测试
scripts/              独立打包消费验证
docs/                 RFC、兼容范围与设计说明
```

文档站构建产物为 `site/dist`，可部署到静态托管服务。当前不自动部署；CI 会生成站点产物供下载。

## 使用构建产物

```tsx
import { Button, ConfigProvider } from "antd-octane";
import "antd-octane/style.css";

export function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#722ed1" } }}>
      <Button type="primary">开始使用</Button>
    </ConfigProvider>
  );
}
```

## 设计与许可

- [RFC-0001](docs/RFC-0001-antd-for-octane.md)
- [兼容范围与已知差异](docs/compatibility.md)
- [上游来源与第三方许可](packages/antd-octane/THIRD_PARTY_NOTICES.md)

本项目采用 [MIT](LICENSE)。主题纯算法参考并移植自 Ant Design，保留原始许可。鸣谢 [Ant Design](https://github.com/ant-design/ant-design)、[Octane](https://github.com/octanejs/octane) 与 [Antdv Next](https://github.com/antdv-next/antdv-next)。

## 开发文档

- [API 与语法决策](docs/api-decisions.md)：受控值、事件、ref、主题与后续 API。
- [工程与文档实施约定](docs/project-blueprint.md)：工程结构、文档质量与扩展顺序。
- [Alpha 检查清单](docs/v0.1.0-alpha-checklist.md)：已完成与待验证项。

当前已提供 37 项基础实现（按 antd 5.x 文档目录计，包含 ConfigProvider），覆盖基础输入、布局、展示、反馈、分页与提示浮层。文档站组件总览列出完整 70 项目录和各项状态；基础实现不代表完整 API 兼容，具体边界见 [兼容清单](docs/compatibility.md)。

更多组件的实施顺序与进度见 [组件扩展清单](docs/component-roadmap.md)。
