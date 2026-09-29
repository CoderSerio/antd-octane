<div align="center">

<img src="site/public/favicon.svg" width="88" height="88" alt="Ant Design for Octane 标识" />

<h1>Ant Design for Octane</h1>

<p>面向 Octane 的 Ant Design 风格组件库。组件由 Octane 原生实现，设计与 API 以 Ant Design 5 为参考。</p>

[![CI][ci-image]][ci-url] [![npm alpha][npm-image]][npm-url] [![MIT][license-image]](LICENSE)

[在线文档](https://coderserio.github.io/antd-octane/) · [快速开始](https://coderserio.github.io/antd-octane/#start) · [组件与兼容范围](https://coderserio.github.io/antd-octane/#components/coverage) · [贡献指南](CONTRIBUTE.md) · [更新日志](CHANGELOG.md)

</div>

> **Alpha 预览版。** 已提供的组件可能只覆盖上游 API 的一部分，API 也可能调整。
> 本项目由社区独立维护，不属于 Ant Design、Octane 官方项目。

## 项目定位

Ant Design for Octane 面向的是希望在 Octane 应用中沿用 Ant Design 设计语言的开发者。

设计和 API 对照以 [Ant Design 5 组件文档](https://5x.ant.design/components/overview/) 为基线
Octane 的语法与构建方式请以 [Octane 官方文档](https://octanejs.dev/docs) 为准。

## 快速开始

> 请按[完整快速开始](https://coderserio.github.io/antd-octane/#start)操作

```bash
pnpm add antd-octane@alpha
```

```tsx
import { Button, ConfigProvider } from "antd-octane";
import "antd-octane/style.css";

export function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
      <Button type="primary">开始使用</Button>
    </ConfigProvider>
  );
}
```

## 当前支持范围

| 项目 | 当前约定 |
| --- | --- |
| Octane | `0.4.3` |
| 设计与 API 对照 | Ant Design `5.29.3` |
| 运行环境 | ESM 浏览器应用；需显式导入 `antd-octane/style.css` |
| 已验证 | Vite 独立消费，以及部分 Chromium 交互、主题与窄屏场景 |

[组件总览](https://coderserio.github.io/antd-octane/#components/coverage)用于查找入口；
每个组件页和[兼容与迁移](https://coderserio.github.io/antd-octane/#compatibility)说明具体支持范围。
SSR、完整跨浏览器与辅助技术验证仍在推进，不能仅替换包名迁移整个应用。

## 开发与贡献


提交改动前运行 `pnpm check` 和 `pnpm pack:check`，涉及交互时需做[浏览器验证](tests/browser/README.md)。

更多细节请参考[贡献指南](CONTRIBUTE.md)。

## 致谢

衷心感谢：

- [Ant Design](https://ant.design/) 提供设计体系、组件规范和 API 对照基线。仓库中改编的主题算法与部分样式规则保留其来源及许可记录。
- [Octane](https://octanejs.dev/docs) 提供运行时、编译器与组件编程模型。
- [Antdv Next](https://antdv-next.com/components/overview-cn) 的组件案例与文档组织方式为本项目提供了参考。

具体代码来源和许可文本见[第三方声明](packages/antd-octane/THIRD_PARTY_NOTICES.md)。

## 许可

[MIT](LICENSE)

[ci-image]: https://github.com/CoderSerio/antd-octane/actions/workflows/ci.yml/badge.svg?branch=main
[ci-url]: https://github.com/CoderSerio/antd-octane/actions/workflows/ci.yml
[npm-image]: https://img.shields.io/npm/v/antd-octane/alpha.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/antd-octane
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
