# Ant Design for Octane

面向 [Octane](https://github.com/octanejs/octane) 的原生组件库，沿用 Ant Design 熟悉的组件 API、交互与主题配置。独立社区项目，不代表 Ant Design 或 Octane 官方。

## Alpha 使用

发布标签为 `alpha`，需要 Octane **0.4.3**；使用 Octane 编译器构建 TSX 或 TSRX。`0.1.0-alpha.0` 尚未包含 TSRX 子节点修复；`0.1.0-alpha.1` 起，安装包提供原始源码，由应用的 Octane 编译器处理。安装前可用 `npm view antd-octane dist-tags.alpha` 确认当前发布版本。

本说明对应 **0.1.0-alpha.8**。安装前用上述命令确认 registry 版本；[公开文档站](https://coderserio.github.io/antd-octane/#start)使用的版本显示在页头。npm 默认 `latest` 仍为 `0.1.0-alpha.0`，请保留 `@alpha` 或固定所需的已发布版本。

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

Vite 需要启用 `octane/compiler/vite` 导出的 `octane()` 插件；TypeScript 配置 `jsx: "react-jsx"` 与 `jsxImportSource: "octane"`。TSX 和 TSRX 使用同一套组件 API。Signal 可在消费组件中通过 `.get()` 读取，再把结果传给受控属性；组件属性暂不直接接受 `SignalHandle`。运行时不依赖 React。

本版本提供 `antd-octane/icons` 命名图标入口，例如 `ClockCircleOutlined`、`MinusOutlined`、`PlusOutlined`、`UserOutlined` 和 `AntDesignOutlined`；这些入口从 `0.1.0-alpha.8` 起提供。它是 Octane 原生适配集合，不是 React `@ant-design/icons` 的完整替代包。

## Vite 集成（源码，尚未发布）

下一版本的源码新增 `antd-octane/vite`，集中维护日期依赖预构建配置。**alpha.8 尚无此入口**；使用已发布 alpha.8 时继续采用下一节配置。该集成验证于 Vite 8，不替代 Octane 编译器：

```ts
import { defineConfig } from "vite";
import { octane } from "octane/compiler/vite";
import { antdOctane } from "antd-octane/vite";

export default defineConfig({
  plugins: [octane(), antdOctane()],
});
```

`antdOctane()` 仅为开发服务器添加组件库嵌套 CommonJS 依赖的预构建入口，保留应用已有的 `optimizeDeps` 设置；不改变生产构建、组件 API 或 Day.js 导入路径。无需再手动维护下面的七项 `include`。更新配置后使用 `vite --force` 清理旧预构建结果。应用直接使用 Day.js 时仍应显式安装 `dayjs@1.11.23`，并按需导入 `dayjs/locale/fr` 等语言包，让应用值和组件共享相同的 Day.js 实例。

## Vite 配置（alpha.8）

alpha.8 的日期组件需要以下开发依赖预构建配置；从 alpha.7 升级时也请同步更新。验证环境为 Node.js ≥ 22.22.2、Octane 0.4.3、Vite 8.3.3 和 TypeScript 5.9.3。新项目在 `package.json` 中设置 `"type": "module"`，`vite.config.ts` 使用：

```ts
import { defineConfig } from "vite";
import { octane } from "octane/compiler/vite";

export default defineConfig({
  plugins: [octane()],
  optimizeDeps: {
    include: [
      "antd-octane > dayjs",
      "antd-octane > dayjs/plugin/advancedFormat",
      "antd-octane > dayjs/plugin/customParseFormat",
      "antd-octane > dayjs/plugin/localeData",
      "antd-octane > dayjs/plugin/weekday",
      "antd-octane > dayjs/plugin/weekOfYear",
      "antd-octane > dayjs/plugin/weekYear",
    ],
  },
});
```

日期组件引入 Day.js 的 CommonJS 核心和插件。Octane 插件将组件库原始源码排除在依赖预构建之外，以便自行编译；Vite 开发服务器需要将其嵌套 CommonJS 依赖转为浏览器可加载的 ESM。即使页面仅从总入口导入 Button，也需要上述配置。请逐项保留这些入口，已验证的配置不使用 `dayjs/plugin/*` 通配写法。原理见 Vite 官方的[依赖预构建](https://vite.dev/guide/dep-pre-bundling)与[嵌套 CommonJS 依赖配置](https://vite.dev/config/dep-optimization-options#optimizedeps-exclude)。

`optimizeDeps` 作用于开发模式；生产构建通过不代表首次开发页面能够加载。修改配置后执行 `pnpm exec vite --force`，确认页面和按钮交互正常，再运行 `pnpm exec tsc --noEmit` 与 `pnpm exec vite build`。省略预构建配置可能导致开发页面白屏，并报告 Day.js 模块没有 `default` 导出。

## 范围与文档

以 Ant Design **5.29.3** 为参考，提供组件基础实现及 ConfigProvider，以及默认、暗色、紧凑主题算法。Button 支持图标位置与延迟加载；Input / TextArea 支持基础字符计数。Select 提供单选、多选、搜索和键盘操作，尚不支持 tags、labelInValue 和虚拟列表。AutoComplete 支持自由文本输入与建议选项。Space.Compact / Addon 可组合紧凑控件。Alpha 不代表完整 API 兼容，API 可能调整；复杂组件、SSR 和无障碍验证仍有未完成项。

Form 支持平面字段、自定义属性/事件映射、同步与异步规则校验及提交/重置。alpha.8 增加嵌套 NamePath、直接声明的 `dependencies` 重新校验、`setFieldValue` 和按路径校验/重置；不提供 Form.List、useWatch、字段状态查询、scrollToField 或完整上游校验规则集。具体能力及边界见包内 [Form 支持范围](./src/form/README.md)。

Form 可组合现有输入组件：

```tsx
import { Button, Form, Input } from "antd-octane";

<Form onFinish={(values) => console.log(values)}>
  <Form.Item name="email" label="邮箱" rules={[{ required: true, message: "请输入邮箱" }]}>
    <Input required />
  </Form.Item>
  <Button htmlType="submit">提交</Button>
</Form>;
```

勾选类字段使用 `valuePropName="checked"`，控件作为 Form.Item 的直接子组件。支持 `required`、文本长度、正则和自定义 `validator`；异步校验返回 Promise。alpha.7 使用字符串字段名；alpha.8 还接受数字或字符串/数字数组路径，例如 `name={["user", "email"]}`，字符串 `"user.email"` 仍是字面键。依赖项只按直接声明的路径重新校验，不推导依赖链。值或规则改变时，旧校验结果不会覆盖当前错误。

- [快速开始页面源码](https://github.com/CoderSerio/antd-octane/blob/main/site/src/pages/start.tsx)
- [组件支持范围页面源码](https://github.com/CoderSerio/antd-octane/blob/main/site/src/pages/compatibility.tsx)
- [源码与文档站](https://github.com/CoderSerio/antd-octane/tree/main)

采用 MIT 许可。上游代码来源与许可见包内 `THIRD_PARTY_NOTICES.md` 和 `LICENSE`。
