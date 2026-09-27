# Ant Design for Octane

面向 [Octane](https://github.com/octanejs/octane) 的原生组件库，沿用 Ant Design 熟悉的组件 API、交互与主题配置。独立社区项目，不代表 Ant Design 或 Octane 官方。

## Alpha 使用

发布标签为 `alpha`，需要 Octane **0.4.3**；使用 Octane 编译器构建 TSX 或 TSRX。`0.1.0-alpha.0` 尚未包含 TSRX 子节点修复；`0.1.0-alpha.1` 起，安装包提供原始源码，由应用的 Octane 编译器处理。安装前可用 `npm view antd-octane dist-tags.alpha` 确认当前发布版本。

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

## 范围与文档

以 Ant Design **5.29.3** 为参考，提供 57 项基础实现（包含 ConfigProvider），以及默认、暗色、紧凑主题算法。Button 支持图标位置与延迟加载；Input / TextArea 支持基础字符计数。Select 当前提供单选、搜索和键盘操作，尚不支持 multiple、tags、labelInValue 和虚拟列表。Form 支持平面字段、同步规则校验及提交/重置，尚不支持嵌套路径、动态列表、异步规则和字段依赖。Alpha 不代表完整 API 兼容，API 可能调整；复杂组件、SSR 和无障碍验证仍有未完成项。

Form 的第一版可组合现有输入组件：

```tsx
import { Button, Form, Input } from "antd-octane";

<Form onFinish={(values) => console.log(values)}>
  <Form.Item name="email" label="邮箱" rules={[{ required: true, message: "请输入邮箱" }]}>
    <Input required />
  </Form.Item>
  <Button htmlType="submit">提交</Button>
</Form>;
```

勾选类字段使用 `valuePropName="checked"`。当前仅支持字符串字段名、直接子组件，以及 `required`、文本长度和正则的同步校验规则。

- [快速开始页面源码](https://github.com/CoderSerio/antd-octane/blob/main/site/src/pages/start.tsx)
- [组件支持范围页面源码](https://github.com/CoderSerio/antd-octane/blob/main/site/src/pages/compatibility.tsx)
- [源码与文档站](https://github.com/CoderSerio/antd-octane/tree/main)

采用 MIT 许可。上游代码来源与许可见包内 `THIRD_PARTY_NOTICES.md` 和 `LICENSE`。
