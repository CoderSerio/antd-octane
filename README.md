# Ant Design for Octane

面向 [Octane](https://github.com/octanejs/octane) 的 Ant Design 组件库提案，希望让熟悉 antd 的开发者在 Octane 中沿用熟悉的组件 API、交互和主题配置。

**当前处于 RFC 讨论阶段，尚未实现组件，也未发布 npm 包。** 项目为独立社区探索。

## 准备怎么做

- 使用 Octane 实现组件，尽量对齐 Ant Design 的常用 API、交互和视觉表现。
- 先验证主题、输入事件和浮层等关键能力，再逐步扩展组件。
- 按组件记录支持范围和差异，不承诺只改 import 就能迁移。

初步方案已确定以 Ant Design v5 为首版基线，业务 API 对齐 antd，框架行为遵循 Octane。采用单一主包，包名暂定为 `antd-octane`；具体适配方式通过原型验证。

## 参与讨论

请先看 [RFC-0001：在 Octane 中实现 Ant Design 组件库](docs/RFC-0001-antd-for-octane.md)。重点讨论兼容边界、底层能力复用和首版范围，欢迎通过 Issue 提出建议。

## 参考

- [Ant Design](https://github.com/ant-design/ant-design)
- [Octane](https://github.com/octanejs/octane)
- [Antdv Next](https://github.com/antdv-next/antdv-next)

本项目不代表上述项目的官方立场。许可证将在首次发布源码前明确；复用上游代码时保留相应许可证和版权声明。
