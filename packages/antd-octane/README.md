# Ant Design for Octane

面向 [Octane](https://github.com/octanejs/octane) 的原生组件库，沿用 Ant Design 熟悉的组件 API、交互与主题配置。独立社区项目，不代表 Ant Design 或 Octane 官方。

## Alpha 使用

发布版本：`0.1.0-alpha.0`，发布标签：`alpha`。需要 Octane **0.4.3**；使用 Octane 编译器构建 TSX。

```bash
npm install antd-octane@alpha octane@0.4.3
```

```tsx
import { createRoot } from "octane";
import { Button, ConfigProvider } from "antd-octane";
import "antd-octane/style.css";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider theme={{ token: { colorPrimary: "#722ed1" } }}>
    <Button type="primary">开始使用</Button>
  </ConfigProvider>,
);
```

Vite 需要启用 `octane/compiler/vite` 导出的 `octane()` 插件；TypeScript 配置 `jsx: "react-jsx"` 与 `jsxImportSource: "octane"`。运行时不依赖 React。

## 范围与文档

以 Ant Design **5.29.3** 为参考，提供 55 项基础实现（包含 ConfigProvider），以及默认、暗色、紧凑主题算法。Alpha 不代表完整 API 兼容，API 可能调整；复杂组件、SSR 和无障碍验证仍有未完成项。

- [快速开始页面源码](https://github.com/CoderSerio/antd-octane/blob/main/site/src/pages/start.tsx)
- [组件支持范围页面源码](https://github.com/CoderSerio/antd-octane/blob/main/site/src/pages/compatibility.tsx)
- [源码与文档站](https://github.com/CoderSerio/antd-octane/tree/main)

采用 MIT 许可。上游代码来源与许可见包内 `THIRD_PARTY_NOTICES.md` 和 `LICENSE`。
