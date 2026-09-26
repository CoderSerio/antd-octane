<div align="center">

<img src="site/public/favicon.svg" width="96" height="96" alt="Ant Design for Octane 标识" />

<h1>Ant Design for Octane</h1>

基于 Ant Design 设计体系的 Octane 原生组件库。

[![CI][ci-image]][ci-url]
[![npm alpha][npm-image]][npm-url]
[![License: MIT][license-image]](LICENSE)

[使用示例](#-使用) · [兼容说明页面源码](site/src/pages/compatibility.tsx) · [参与贡献](CONTRIBUTE.md) · [问题反馈](https://github.com/CoderSerio/antd-octane/issues)

</div>

![真实组件与主题展示](docs/images/component-showcase.png)

文档站中的 Octane 原生组件示例，支持品牌色、暗色与紧凑主题切换。

## ✨ 特性

- **原生 Octane**：沿用熟悉的 Ant Design 组件命名、交互和主题配置，运行时不依赖 React。
- **TypeScript**：提供组件属性与主题配置的类型声明。
- **主题定制**：支持默认、暗色、紧凑算法，以及 Token 覆盖、算法组合与嵌套主题。
- **中文文档**：提供组件示例、API、源码展示与可交互的主题预览。
- **Agent 接入**：提供文档站接入说明、兼容边界与 `llms.txt` 导航。

当前版本为 **`0.1.0-alpha.0`**，通过 npm 的 `alpha` 标签发布，API 仍可能调整。按 Ant Design 5.x 文档目录计，已提供 **55 项基础实现**（包含 ConfigProvider）；基础实现不代表完整 API 兼容，具体能力与限制见[文档站兼容说明](site/src/pages/compatibility.tsx)。

本项目由社区独立维护，与 Ant Design、Octane 官方无隶属关系。

## 🖥 兼容环境

| 项目 | 当前范围 |
| --- | --- |
| 运行时 | Octane `0.4.3` |
| 组件对照基线 | Ant Design `5.29.3` |
| 模块格式 | ESM，浏览器应用 |
| 样式 | 显式导入组件 CSS，支持 CSS Cascade Layers |
| 本库开发环境 | Node.js ≥ `22.22.2`、pnpm `10.29.2` |

当前已验证 Vite 消费项目与部分浏览器交互、样式和主题场景。完整跨浏览器、辅助技术及 SSR 验证尚未完成，不承诺仅替换包名即可迁移。

## 📦 安装

```bash
npm install antd-octane@alpha octane@0.4.3
```

```bash
yarn add antd-octane@alpha octane@0.4.3
```

```bash
pnpm add antd-octane@alpha octane@0.4.3
```

```bash
bun add antd-octane@alpha octane@0.4.3
```

需要固定版本时，将 `antd-octane@alpha` 替换为 `antd-octane@0.1.0-alpha.0`。

## 🔨 使用

在已配置 Octane 编译器的项目中：

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

完整的 Vite、TypeScript 与入口配置见[文档站快速开始页面](site/src/pages/start.tsx)。各组件的支持范围以当前版本的类型声明和[文档站兼容说明](site/src/pages/compatibility.tsx)为准。

## 🤝 参与贡献

欢迎提交问题、修复、组件实现与文档改进。开始前请阅读[贡献指南](CONTRIBUTE.md)，其中包含分支命名、PR 流程、代码约定和验证要求。

```bash
pnpm install
pnpm dev
```

文档站地址以终端输出为准。提交前执行：

```bash
pnpm check
pnpm pack:check
```

涉及界面或交互的修改，还需完成对应的[浏览器验证](tests/browser/README.md)。


## 鸣谢

感谢以下开源项目为本项目提供设计、实现参考与开发工具：

- [Ant Design](https://github.com/ant-design/ant-design)
- [Octane](https://github.com/octanejs/octane)
- [Antdv Next](https://github.com/antdv-next/antdv-next)
- [Vite](https://github.com/vitejs/vite)

移植的主题算法保留上游许可与来源记录，详见[第三方声明](packages/antd-octane/THIRD_PARTY_NOTICES.md)。

## 许可

[MIT](LICENSE)

[ci-image]: https://github.com/CoderSerio/antd-octane/actions/workflows/ci.yml/badge.svg?branch=main
[ci-url]: https://github.com/CoderSerio/antd-octane/actions/workflows/ci.yml
[npm-image]: https://img.shields.io/npm/v/antd-octane/alpha.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/antd-octane
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
